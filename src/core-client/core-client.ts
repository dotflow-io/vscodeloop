import { EventEmitter } from "events";
import { CoreProcess } from "./process-manager";
import { RpcMessage, decodeRpcMessage, encodeRpcMessage } from "./protocol";

export { RpcMessage } from "./protocol";

/** What RpcClient needs from a child process — satisfied by CoreProcess,
 * and by a lightweight fake in tests so they don't have to spawn a real
 * process (which keeps the test runner alive until it fully exits). */
export interface ProcessHandle extends EventEmitter {
  write(data: string): void;
  kill(): void;
}

export class RpcClient extends EventEmitter {
  private process: ProcessHandle;
  private nextId = 1;
  private pending = new Map<string, (message: RpcMessage) => void>();
  private dead = false;

  constructor(
    command: string,
    args: string[],
    cwd: string,
    env?: Record<string, string>,
    process: ProcessHandle = new CoreProcess(command, args, cwd, env)
  ) {
    super();
    this.process = process;

    this.process.on("line", (line: string) => {
      const message = decodeRpcMessage(line);
      if (message) {
        this.dispatch(message);
      }
    });
    this.process.on("stderr", (text: string) => this.emit("stderr", text));
    this.process.on("exit", (info: { code: number | null; signal: string | null }) => {
      this.rejectPending("pycodeloop serve exited");
      this.emit("exit", info);
    });
    this.process.on("spawnError", (error: NodeJS.ErrnoException) => {
      this.rejectPending(error.message);
      this.emit("spawnError", error);
    });
  }

  private rejectPending(message: string): void {
    this.dead = true;
    const snapshot = new Map(this.pending);
    this.pending.clear();
    for (const [id, resolve] of snapshot) {
      resolve({ jsonrpc: "2.0", id, error: { code: -32000, message } });
    }
  }

  private dispatch(message: RpcMessage): void {
    if (message.id !== undefined && (message.result !== undefined || message.error)) {
      const resolver = this.pending.get(String(message.id));
      if (resolver) {
        this.pending.delete(String(message.id));
        resolver(message);
      }
      return;
    }
    if (message.method) {
      this.emit(message.method, message.params ?? {});
    }
  }

  notify(method: string, params: Record<string, unknown> = {}): void {
    this.process.write(encodeRpcMessage({ jsonrpc: "2.0", method, params }));
  }

  request(method: string, params: Record<string, unknown> = {}): Promise<RpcMessage> {
    const id = String(this.nextId++);
    if (this.dead) {
      return Promise.resolve({
        jsonrpc: "2.0",
        id,
        error: { code: -32000, message: "RpcClient is disposed" },
      });
    }
    return new Promise((resolve) => {
      this.pending.set(id, resolve);
      this.process.write(encodeRpcMessage({ jsonrpc: "2.0", id, method, params }));
    });
  }

  dispose(): void {
    this.rejectPending("Disposed");
    this.process.kill();
  }
}
