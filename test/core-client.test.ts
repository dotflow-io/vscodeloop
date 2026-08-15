import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { test } from "node:test";
import { ProcessHandle, RpcClient } from "../src/core-client/core-client";

class FakeProcess extends EventEmitter implements ProcessHandle {
  killed = false;

  write(_data: string): void {}

  kill(): void {
    this.killed = true;
  }
}

test("pending requests reject when the process exits mid-flight", async () => {
  const fake = new FakeProcess();
  const client = new RpcClient("fake", [], process.cwd(), undefined, fake);

  const pending = client.request("chat/send", { prompt: "hi" });
  fake.emit("exit", { code: 1, signal: null });

  const response = await pending;
  assert.equal(response.error?.code, -32000);
});

test("pending requests reject when the process fails to spawn", async () => {
  const fake = new FakeProcess();
  const client = new RpcClient("fake", [], process.cwd(), undefined, fake);

  const pending = client.request("chat/send", { prompt: "hi" });
  fake.emit("spawnError", new Error("ENOENT"));

  const response = await pending;
  assert.equal(response.error?.code, -32000);
  assert.equal(response.error?.message, "ENOENT");
});

test("dispose rejects any still-pending request and kills the process", async () => {
  const fake = new FakeProcess();
  const client = new RpcClient("fake", [], process.cwd(), undefined, fake);

  const pending = client.request("chat/send", { prompt: "hi" });
  client.dispose();

  const response = await pending;
  assert.equal(response.error?.code, -32000);
  assert.equal(fake.killed, true);
});

test("a real RPC response still resolves normally, not through rejectPending", async () => {
  const fake = new FakeProcess();
  const client = new RpcClient("fake", [], process.cwd(), undefined, fake);

  const pending = client.request("chat/send", { prompt: "hi" });
  fake.emit("line", JSON.stringify({ jsonrpc: "2.0", id: "1", result: { text: "ok" } }));

  const response = await pending;
  assert.deepEqual(response.result, { text: "ok" });
});

test("a re-entrant request made from inside a rejected .then() is not silently dropped", async () => {
  const fake = new FakeProcess();
  const client = new RpcClient("fake", [], process.cwd(), undefined, fake);

  const retryResponse = client.request("chat/send", { prompt: "first" }).then((first) => {
    assert.equal(first.error?.code, -32000);
    return client.request("chat/send", { prompt: "retry" });
  });
  fake.emit("exit", { code: 1, signal: null });

  const response = await retryResponse;
  assert.equal(response.error?.code, -32000);
  assert.equal(response.error?.message, "RpcClient is disposed");
});

test("requests made after the process has already exited reject immediately instead of hanging", async () => {
  const fake = new FakeProcess();
  const client = new RpcClient("fake", [], process.cwd(), undefined, fake);

  fake.emit("exit", { code: 1, signal: null });
  const response = await client.request("diagnostics/status");

  assert.equal(response.error?.code, -32000);
  assert.equal(response.error?.message, "RpcClient is disposed");
});
