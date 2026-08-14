import assert from "node:assert/strict";
import { test } from "node:test";
import {
  fetchLatestVersion,
  isOutdated,
  parseVersionOutput,
} from "../src/services/cliVersion.service";

test("parseVersionOutput extracts a semver from CLI output", () => {
  assert.equal(parseVersionOutput("pycodeloop 0.4.0"), "0.4.0");
  assert.equal(parseVersionOutput("0.4.0\n"), "0.4.0");
});

test("parseVersionOutput returns null when nothing looks like a version", () => {
  assert.equal(parseVersionOutput("command not found"), null);
});

test("isOutdated compares semver-shaped strings", () => {
  assert.equal(isOutdated("0.3.0", "0.4.0"), true);
  assert.equal(isOutdated("0.4.0", "0.4.0"), false);
  assert.equal(isOutdated("0.4.1", "0.4.0"), false);
  assert.equal(isOutdated("0.3.9", "0.4.0"), true);
});

test("fetchLatestVersion reads info.version from the PyPI JSON API", async () => {
  const fake = async (url: string) => {
    assert.equal(url, "https://pypi.org/pypi/pycodeloop/json");
    return { ok: true, json: async () => ({ info: { version: "0.4.0" } }) };
  };

  assert.equal(await fetchLatestVersion(fake), "0.4.0");
});

test("fetchLatestVersion returns null on a non-ok response", async () => {
  const fake = async () => ({ ok: false, json: async () => ({}) });

  assert.equal(await fetchLatestVersion(fake), null);
});

test("fetchLatestVersion returns null if the fetch throws", async () => {
  const fake = async () => {
    throw new Error("network down");
  };

  assert.equal(await fetchLatestVersion(fake), null);
});
