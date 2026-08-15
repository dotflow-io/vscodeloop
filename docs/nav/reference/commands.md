# Commands Reference

## Command Palette

| Command | Description |
|---|---|
| `CodeLoop: Open Chat` | Focuses the CodeLoop sidebar panel. |
| `CodeLoop: New Session` | Starts a new conversation without deleting the current one. |
| `CodeLoop: Select Provider…` | Opens the [provider gallery](../how-to/provider-gallery.md). |
| `CodeLoop: Select Provider Config File…` | Point `pycodeloop.provider` at a custom JSON config file. |
| `CodeLoop: Switch Session…` | Opens the [Sessions](../how-to/sessions.md) list. |

The same four actions (minus Open Chat) also appear as toolbar icons in the CodeLoop panel's title bar.

## Slash commands

Typed directly into the prompt box, with autocomplete:

| Command | Description |
|---|---|
| `/new` | Start a new session |
| `/sessions` | Switch to a saved session |
| `/provider` | Open the provider gallery |
| `/key` | Set or update the current provider's API key |
| `/model` | Set a model override for the current provider |
| `/auto-approve` | Toggle `pycodeloop.autoApprove` |
| `/skills` | Toggle `pycodeloop.skills` |
| `/delegate` | Toggle `pycodeloop.delegation` |
| `/memory` | Toggle `pycodeloop.memory` |
| `/mcp` | Add or remove [MCP servers](../how-to/mcp-servers.md) |
| `/reload` | Reload the `pycodeloop serve` connection |
| `/settings` | Open CodeLoop settings |
| `/help` | List every slash command |
