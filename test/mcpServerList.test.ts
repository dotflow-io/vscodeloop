import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ADD_MCP_SERVER_LABEL,
  addServer,
  parseServerLabel,
  removeServer,
  toQuickPickLabels,
} from "../src/features/settings/mcpServerList";

test("toQuickPickLabels pins the Add entry first", () => {
  assert.deepEqual(toQuickPickLabels([]), [ADD_MCP_SERVER_LABEL]);
  assert.deepEqual(toQuickPickLabels(["cmd-a"]), [ADD_MCP_SERVER_LABEL, "$(server) cmd-a"]);
});

test("parseServerLabel recovers the raw command from a formatted label", () => {
  assert.equal(parseServerLabel("$(server) npx -y foo"), "npx -y foo");
});

test("parseServerLabel returns null for the Add entry", () => {
  assert.equal(parseServerLabel(ADD_MCP_SERVER_LABEL), null);
});

test("addServer appends without mutating the input", () => {
  const original = ["a"];
  const next = addServer(original, "b");
  assert.deepEqual(next, ["a", "b"]);
  assert.deepEqual(original, ["a"]);
});

test("addServer is a no-op when the trimmed command already exists", () => {
  assert.deepEqual(addServer(["npx -y foo"], "npx -y foo"), ["npx -y foo"]);
  assert.deepEqual(addServer(["npx -y foo"], "  npx -y foo  "), ["npx -y foo"]);
});

test("addServer trims whitespace before appending a new command", () => {
  assert.deepEqual(addServer(["a"], "  b  "), ["a", "b"]);
});

test("addServer rejects a blank or whitespace-only command", () => {
  assert.deepEqual(addServer(["a"], ""), ["a"]);
  assert.deepEqual(addServer(["a"], "   "), ["a"]);
});

test("removeServer drops a matching entry without mutating the input", () => {
  const original = ["a", "b", "c"];
  const next = removeServer(original, "b");
  assert.deepEqual(next, ["a", "c"]);
  assert.deepEqual(original, ["a", "b", "c"]);
});

test("removeServer is a no-op when the command isn't found", () => {
  assert.deepEqual(removeServer(["a"], "missing"), ["a"]);
});
