import assert from "node:assert/strict";
import { test } from "node:test";
import { buildInstallCommand, buildUpdateCommand } from "../src/services/terminal.service";

test("uses python3 on non-Windows platforms", () => {
  assert.equal(buildInstallCommand("darwin"), "python3 -m pip install --user pycodeloop");
  assert.equal(buildInstallCommand("linux"), "python3 -m pip install --user pycodeloop");
});

test("uses python (no '3') on win32", () => {
  assert.equal(buildInstallCommand("win32"), "python -m pip install --user pycodeloop");
});

test("never installs vendor extras — GenericProvider has no SDK dependency", () => {
  assert.ok(!buildInstallCommand("darwin").includes("["));
});

test("buildUpdateCommand upgrades in place", () => {
  assert.equal(
    buildUpdateCommand("darwin"),
    "python3 -m pip install --user --upgrade pycodeloop"
  );
  assert.equal(buildUpdateCommand("win32"), "python -m pip install --user --upgrade pycodeloop");
});
