# Settings Reference

All settings live under the `pycodeloop.*` namespace (`Ctrl+,` → search "codeloop" or "pycodeloop").

| Setting | Type | Default | Description |
|---|---|---|---|
| `pycodeloop.command` | string | `pycodeloop` | Path to the `pycodeloop` executable used to spawn `pycodeloop serve`. |
| `pycodeloop.provider` | string | `""` | JSON config path, `generic` (with `pycodeloop.url`), or a dotted `module:Class`. Empty uses pycodeloop's own default. |
| `pycodeloop.model` | string | `""` | Model override. Empty uses the provider's configured default. |
| `pycodeloop.url` | string | `""` | Endpoint URL, required when `pycodeloop.provider` is `generic`. |
| `pycodeloop.skills` | boolean | `true` | Discover Claude/Cursor/AGENTS.md skills and expose a `read_skill` tool. |
| `pycodeloop.delegation` | boolean | `false` | Expose a `delegate` tool for read-only sub-agents on independent subtasks; several `delegate` calls in one turn run in parallel. |
| `pycodeloop.memory` | boolean | `true` | Load `.pycodeloop/memory.md` into the system prompt and expose a `remember` tool. |
| `pycodeloop.workspace` | boolean | `true` | Jail `read_file`/`write_file`/`edit_file`/`delete_file`/`grep`/`glob` to the workspace root. Does **not** cover `bash`/`git`. |
| `pycodeloop.autoApprove` | boolean | `false` | Auto-approve dangerous tool calls (write/edit/delete/bash) instead of prompting. Same as the CLI's `--yes`. |
| `pycodeloop.mcpServers` | array of string | `[]` | MCP server launch commands, one per `--mcp` flag. |

`${workspaceFolder}` in `pycodeloop.provider`/`pycodeloop.url` is resolved against the current workspace before spawning.
