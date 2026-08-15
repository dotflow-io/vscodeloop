# Quick Start

1. Open the **CodeLoop** icon in the activity bar.
2. If no provider is configured yet, the panel prompts you straight to the [provider gallery](provider-gallery.md).
3. Type a prompt and send it. Streamed replies render as markdown; any tool call (`read_file`, `edit_file`, `bash`, ...) shows up as a collapsible card.
4. A dangerous tool (`write_file`, `edit_file`, `delete_file`, `bash`, `git_commit`, `http_request`, MCP tools) pauses for your confirmation with a diff/command preview — unless `pycodeloop.autoApprove` is on.
5. Start a new conversation with **+ New Session** in the panel toolbar, or switch between existing ones with the history icon.

## Attaching an image

Paste a screenshot directly into the prompt box, or use the attach action, to give the agent visual context (a mock-up, an error dialog, a diagram).

## Watching token usage

The panel shows live input/output tokens per turn and how full the model's context window is — compaction events (older history summarized to make room) surface inline when they happen.

## Next steps

- [Provider gallery](provider-gallery.md) — connect a different model or switch providers
- [Sessions](sessions.md) — manage multiple conversations
- [Sub-agent delegation](delegation.md) — parallel read-only sub-agents for independent subtasks
- [MCP servers](mcp-servers.md) — add tools from any Model Context Protocol server
