# Release Notes

## v0.3.5

- [📦 Marketplace - Build 0.3.5](https://marketplace.visualstudio.com/items?itemName=fernandocelmer.pycodeloop)
- [🪲 Bug: Fix stale process exit handler breaking provider/model switches (#19)](https://github.com/dotflow-io/vscodeloop/pull/20)

## v0.3.4

- [🪲 Bug: Fix messages blending together across tool calls (#18)](https://github.com/dotflow-io/vscodeloop/pull/18)

## v0.3.3

- [🪲 Bug: Fix RpcClient pending requests leak (#1)](https://github.com/dotflow-io/vscodeloop/pull/13)
- [🪲 Bug: Fix settings not persisting in single-file mode (#2)](https://github.com/dotflow-io/vscodeloop/pull/14)
- [🪲 Bug: Fix image attachments always sent as image/png (#3)](https://github.com/dotflow-io/vscodeloop/pull/15)
- [⚠️ Security: Fix shell injection risk and missing timeout in hasCli()/checkCliVersion() (#6)](https://github.com/dotflow-io/vscodeloop/pull/16)
- [🪲 Bug: Kill child process on extension deactivate (#8)](https://github.com/dotflow-io/vscodeloop/pull/17)

## v0.3.2

- 📘 MkDocs Material documentation site added (`docs/`, `mkdocs.yml`) — Concepts (architecture, settings), How-to guides (install, quick start, provider gallery, sessions, delegation, MCP servers, troubleshooting), Development Guide, and reference tables for settings/commands/RPC protocol
- ⬆️ CI/CD — `code-quality.yml` (ESLint + `tsc --noEmit`) and `test.yml` (`npm test`) run on every PR; `marketplace-publish.yml` bumps `package.json`/`package-lock.json` from the release tag, runs tests + quality, packages the `.vsix`, and publishes to the VS Code Marketplace via `vsce publish` (`--pre-release` for prereleases) on `release: published`
- 🪲 `.vscodeignore` wasn't excluding `test/`, `docs/`, `.github/`, or a stray local `.venv/` — the packaged `.vsix` was 17,751 files / 37MB; now 61 files / 324KB

## v0.3.1

- ⚙️ New-session icon and a dedicated Sessions page (toolbar button, replacing the native quickpick) — cards show message count, working directory, last-updated time, and an Active badge
- ⚙️ Claude Code-style status line ("● Thinking… · 12s") with a live elapsed-time counter, switching to "N sub-agents working…" while parallel `delegate` calls are in flight
- ⚙️ Memory wired into the extension (`pycodeloop.memory` setting, `/memory` slash command); completed `write_file`/`edit_file`/`delete_file` tool cards now render the diff computed for the confirmation prompt instead of a bare "Edited path" string
- ⚙️ Outdated `pycodeloop` CLI detection — on connect, the installed version is compared against the latest release and, if behind, a card offers an "Update CodeLoop CLI" button
- ⚙️ `pycodeloop.workspace` setting — toggles the filesystem-tool jail (`read_file`/`write_file`/`edit_file`/`delete_file`/`grep`/`glob`) that's on by default; `bash`/`git` were never covered by it, only by the confirm gate
- 🪲 Fixed the CLI not being found immediately after the built-in installer ran `pip install --user pycodeloop` — the fresh binary's directory wasn't yet on the spawned process's `PATH`; the installer now resolves it via Python's `sysconfig` and adds it before reconnecting
- 🪲 Markdown renderer no longer leaves redundant blank lines around headings/tables/lists, and now renders horizontal rules and tables instead of raw text
- 🪲 Per-provider **Set/Update Key** button added to the provider gallery
- 🎨 Panel toolbar now shows New Session / Switch Session / Select Provider / Select Config icons directly (`menus.view/title`), not just via the Command Palette
- 🎨 "Model" and "API Key" removed from the gear menu — redundant with the provider gallery, which already owns the connect/key/model flow per provider
- 🎨 Real CodeLoop logo everywhere: README header, activity bar icon (traced from the artwork), Marketplace icon
- 🎨 `src/` restructured into `features/` (chat, sessions, settings), `vscode/` (webview shell, sidebar), `core-client/` (RPC client, process management, wire protocol), `services/` (credentials, settings, storage, terminal, workspace)
- 📘 `AGENTS.md` added capturing standing rules (provider JSONs synced with pycodeloop's templates, verify model IDs against current vendor docs, rebuild+reinstall the `.vsix` after every change)
- 📘 SEO pass — `package.json` keywords/categories, README badges, GitHub topics, `description` synced with the provider list actually supported

## v0.3.0

- ⚙️ Provider gallery (⚙ → Select Provider…, or `/provider`) replaces the flat quickpick — card picker for Anthropic/OpenAI/Gemini/Grok/Groq/Ollama/LM Studio with a connected/local/needs-key status per card, plus a custom-JSON/generic-URL fallback. API keys are remembered per provider, so switching back doesn't re-prompt
- 🎨 Panel visual style reworked — thin borders, sharp corners, monospace labels — while staying on VS Code's own theme tokens

## Earlier

The extension's pre-0.3.0 history (sidebar chat panel, `pycodeloop serve` JSON-RPC wiring, session switching, image attachments, slash commands, MCP server management) lived in [dotflow-io/pycodeloop](https://github.com/dotflow-io/pycodeloop)'s own release notes before the extension moved into this dedicated repo — see [pycodeloop's release notes](https://dotflow-io.github.io/pycodeloop/nav/development/release-notes/) (v0.2.0–v0.4.0) for that history, preserved with full commit history in this repo's git log.
