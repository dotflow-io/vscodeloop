import assert from "node:assert/strict";
import { test } from "node:test";
import { RpcClient } from "../src/core-client/core-client";

test("pending requests reject instead of hanging forever when the process exits", async () => {
  const client = new RpcClient(process.execPath, ["-e", "process.exit(1)"], process.cwd());

  const response = await client.request("chat/send", { prompt: "hi" });

  assert.equal(response.error?.code, -32000);
});

test("pending requests reject when the process fails to spawn", async () => {
  const client = new RpcClient("this-binary-does-not-exist", [], process.cwd());

  const response = await client.request("chat/send", { prompt: "hi" });

  assert.equal(response.error?.code, -32000);
});

test("dispose rejects any still-pending request instead of leaving it hanging", async () => {
  const client = new RpcClient(process.execPath, ["-e", "setTimeout(() => {}, 60000)"], process.cwd());

  const pending = client.request("chat/send", { prompt: "hi" });
  client.dispose();

  const response = await pending;
  assert.equal(response.error?.code, -32000);
});
