import assert from "node:assert/strict";
import { test } from "node:test";
import { splitCommand } from "../src/services/mcpRegistry.service";

test("splitCommand splits a bare command with no args", () => {
  assert.deepEqual(splitCommand("npx"), { command: "npx", args: [] });
});

test("splitCommand splits command and positional args", () => {
  assert.deepEqual(splitCommand("npx -y @modelcontextprotocol/server-filesystem ."), {
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem", "."],
  });
});

test("splitCommand keeps a double-quoted argument as one token", () => {
  assert.deepEqual(splitCommand('node server.js "a path/with spaces"'), {
    command: "node",
    args: ["server.js", "a path/with spaces"],
  });
});

test("splitCommand keeps a single-quoted argument as one token", () => {
  assert.deepEqual(splitCommand("node server.js 'a path/with spaces'"), {
    command: "node",
    args: ["server.js", "a path/with spaces"],
  });
});

test("splitCommand collapses extra whitespace between tokens", () => {
  assert.deepEqual(splitCommand("npx   -y   server"), {
    command: "npx",
    args: ["-y", "server"],
  });
});
