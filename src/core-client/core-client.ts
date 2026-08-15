import { EventEmitter } from "events";
import { CoreProcess } from "./process-manager";
import { RpcMessage, decodeRpcMessage, encodeRpcMessage } from "./protocol";

export { RpcMessage } from "./protocol";

export class RpcClient extends EventEmitter {
  private process: CoreProcess;
  private nextId = 1;
  private pending = new Map<string, (message: RpcMessage) => void>();

  constructor(command: string, args: string[], cwd: string, env?: Record<string, string>) {
    super();
    this.process = new CoreProcess(command, args, cwd, env);

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
    for (const [id, resolve] of this.pending) {
      resolve({ jsonrpc: "2.0", id, error: { code: -32000, message } });
    }
    this.pending.clear();
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
