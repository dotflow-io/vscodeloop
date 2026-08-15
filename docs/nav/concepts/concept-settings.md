# Settings

Every `pycodeloop.*` setting is read once per connection by `readSettings()` (`src/services/settings.service.ts`) and translated into either a spawn argument (via `buildServeArgs`, `src/core-client/process-args.ts`) or a piece of the process environment (provider credentials).

Two categories:

- **Connection settings** — `command`, `provider`, `model`, `url`. These decide *how* `pycodeloop serve` is invoked and which provider it talks to. `${workspaceFolder}` in `provider`/`url` is resolved against the current workspace before spawning.
- **Tool-gate settings** — `skills`, `delegation`, `memory`, `workspace`, `autoApprove`, `mcpServers`. These map 1:1 to `pycodeloop serve` CLI flags (`--no-skills`, `--delegate`, `--no-memory`, `--no-workspace`, `--yes`, `--mcp`) and mirror the same toggles the CLI itself exposes — the extension doesn't invent its own policy layer, it just forwards yours.

Changing a setting doesn't affect an already-running `pycodeloop serve` process — reload the connection (`CodeLoop: Open Chat` → gear menu → Reload, or `/reload`) to respawn with the new flags.

See the full table in [Settings reference](../reference/settings.md).
