# Troubleshooting

## "CodeLoop CLI not found" right after installing it

`pip install --user pycodeloop` can put the executable in a directory that isn't on `PATH` yet (`~/Library/Python/3.x/bin` on macOS, `~/.local/bin` on Linux, `%APPDATA%\Python\Scripts` on Windows) — especially on a GUI-launched VS Code, which doesn't source your shell profile. The extension's built-in installer resolves this automatically (it asks Python for its `sysconfig` scripts path and adds it to the spawned process's `PATH`); a manual `pip install` may still need a new terminal or a VS Code restart to pick up the change.

If it's still not found, set `pycodeloop.command` to the executable's full path directly.

## A provider stays "offline" / red dot

Hover the status dot for the provider/model and the last error. Common causes: missing or expired API key (re-run `/key` or the gallery), a retired model (`/model` to pick a current one — self-healing only kicks in on the *next* connect, not mid-turn), or the endpoint being unreachable (check `pycodeloop.url` for a `generic` provider).

## Nothing happens after sending a prompt

Check the extension's output/stderr — `pycodeloop serve` prints failures there. A hung connection can be reset with `/reload` (gear menu → Reload), which tears down and respawns the CLI process without losing the saved session (sessions are persisted by `pycodeloop serve`, not held only in the webview).

## A tool keeps asking for confirmation I don't want

That's `pycodeloop.autoApprove: false` (the default) working as intended for `write_file`/`edit_file`/`delete_file`/`bash`/`git_commit`/`http_request`/MCP tools. Turn it on (`/auto-approve` or the setting) only for a workspace you trust fully — it removes the last human checkpoint before those tools run.

## Filesystem tools reach outside my project

`pycodeloop.workspace` (on by default) jails `read_file`/`write_file`/`edit_file`/`delete_file`/`grep`/`glob` to the workspace root. It does **not** cover `bash`/`git`, which run arbitrary shell commands with no path parsing — their only guardrail is the confirm prompt (or `autoApprove`, which removes even that). See pycodeloop's [workspace jail docs](https://dotflow-io.github.io/pycodeloop/) for the full threat model.
