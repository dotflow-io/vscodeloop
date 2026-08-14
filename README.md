<p align="center">
  <img src="https://raw.githubusercontent.com/dotflow-io/vscodeloop/master/media/icon.png" alt="CodeLoop" width="120">
</p>
<p align="center">
  <strong>CodeLoop for VS Code</strong>
</p>
<p align="center">
    <em>Agentic AI coding assistant in your VS Code sidebar — bring your own model.</em>
</p>
<p align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=fernandocelmer.pycodeloop" target="_blank">
    <img src="https://img.shields.io/visual-studio-marketplace/v/fernandocelmer.pycodeloop?label=VS%20Marketplace" alt="VS Marketplace">
</a>
<a href="LICENSE.md" target="_blank">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT">
</a>
<a href="https://code.visualstudio.com/" target="_blank">
    <img src="https://img.shields.io/badge/VS%20Code-%5E1.85.0-007ACC" alt="VS Code">
</a>
</p>

CodeLoop is an agentic AI coding assistant for VS Code — chat with
[pycodeloop](https://github.com/dotflow-io/pycodeloop) from a sidebar
view instead of the terminal to read, edit, and run code in your
workspace. Bring your own model: Anthropic Claude, OpenAI, Google
Gemini, xAI Grok, Groq, AWS Bedrock, Moonshot Kimi, DeepSeek, Together
AI Llama, Alibaba Qwen, NVIDIA NIM, or a local Ollama/LM Studio model.

## Features

- **Sidebar chat** — CodeLoop lives in the activity bar, no terminal split needed.
- **Streamed replies** rendered as markdown: headings, lists, links, inline/fenced code, bold/italic.
- **Tool call cards** — every `read_file`/`edit_file`/`bash`/etc. call shows up as a collapsible card (icon, name, args preview, status); click to expand args and result.
- **Approve or decline dangerous tools** — `write_file`, `edit_file`, `delete_file`, `bash`, `git_commit`, `http_request`, and MCP tools each pause for confirmation with a diff/command preview, unless auto-approve is on.
- **Multiple sessions** — start a new one (`CodeLoop: New Session`) or switch between existing ones (`CodeLoop: Switch Session…`), each keeping its own history.
- **Image attachments** — paste a screenshot straight into the prompt box, or attach one from disk, to give the agent visual context.
- **Live token usage and context %** — see input/output tokens per turn and how full the context window is, with compaction events surfaced inline.
- **Sub-agent delegation** (⚙ → Sub-agent delegation, or `/delegate` — off by default) — lets the agent spawn read-only sub-agents for independent subtasks. Several `delegate` calls in the same turn run in parallel.
- **Provider gallery** — ⚙ → Select Provider… (or `/provider`) opens a card picker with ready-made configs for Anthropic, OpenAI, Gemini, Grok (xAI), Groq, AWS Bedrock, Kimi (Moonshot AI), DeepSeek, Llama (Together AI), Qwen (Alibaba), NVIDIA NIM, Ollama, and LM Studio, plus a custom JSON file or a bare OpenAI-compatible URL. Pick a model per provider, paste the key once — switching back to a provider you've already connected doesn't ask again.
- **API key** — stored per provider via VS Code's secret storage and set as that provider's env var (e.g. `ANTHROPIC_API_KEY`) for `pycodeloop serve`. You don't export it in a terminal.

## How it works

The extension spawns `pycodeloop serve`, which speaks a small
JSON-RPC-2.0 protocol over its stdin/stdout (one JSON object per
line): text deltas, tool calls/results, usage, context %, retries,
compaction events, and a confirm request/response round-trip for
dangerous tools.

## Requirements

- `pycodeloop` installed and on `PATH` (or set `pycodeloop.command` to
  its full path).
- A provider configured the same way as the CLI — see the main
  project's README for `templates/*.json` and the `pycodeloop.provider`
  / `pycodeloop.model` / `pycodeloop.url` settings below.
- The API key that JSON names in `api_key_env` (for Anthropic that's
  `ANTHROPIC_API_KEY`, sent as `x-api-key`). Paste it in the CodeLoop
  sidebar; the extension injects it into `pycodeloop serve`.

## Settings

| Setting | Description |
|---|---|
| `pycodeloop.command` | Path to the `pycodeloop` executable. Default `pycodeloop`. |
| `pycodeloop.provider` | JSON config path, `generic`, or `module:Class`. Empty uses pycodeloop's default. |
| `pycodeloop.model` | Model override. |
| `pycodeloop.url` | Endpoint URL, required when `pycodeloop.provider` is `generic`. |
| `pycodeloop.skills` | Discover Claude/Cursor/AGENTS.md skills. Default `true`. |
| `pycodeloop.delegation` | Expose a `delegate` tool for read-only sub-agents on independent subtasks. Default `false`. |
| `pycodeloop.memory` | Load `.pycodeloop/memory.md` into the system prompt and expose a `remember` tool. Default `true`. |
| `pycodeloop.workspace` | Jail file tools (`read_file`/`write_file`/`edit_file`/`delete_file`/`grep`/`glob`) to the workspace root — does not cover `bash`/`git`. Default `true`. |
| `pycodeloop.autoApprove` | Auto-approve dangerous tool calls instead of prompting. Default `false`. |
| `pycodeloop.mcpServers` | MCP server launch commands, one per `--mcp` flag. |

## Development

```bash
npm install
npm run compile   # or `npm run watch`
```

Press F5 in VS Code (with this folder open) to launch an Extension
Development Host.

## Related

- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=fernandocelmer.pycodeloop) — install CodeLoop.
- [pycodeloop](https://github.com/dotflow-io/pycodeloop) — the agent
  library and CLI this extension drives.

## License

[MIT](LICENSE.md)
