# Development Guide

## Setup

```bash
npm install
npm run compile   # or `npm run watch`
```

Press **F5** in VS Code (with this folder open) to launch an Extension Development Host with the extension loaded.

## Project layout

```
src/
  extension.ts          entrypoint — command registration, sidebar wiring
  vscode/
    sidebar/             webview view provider, message routing
    webview/              panel HTML template, typed WebviewMessage union
  core-client/            RPC client, process spawn/args, wire protocol
  features/
    chat/                 ChatController — connection lifecycle, turns
    sessions/              SessionsController — session list/switch
    settings/              SettingsController — provider/model/MCP pickers
  services/                credentials, settings, storage, terminal, workspace
media/                    webview scripts — no bundler, plain <script> tags,
                           loaded in a fixed order, one shared global scope
```

## Scripts

| Command | What it does |
|---|---|
| `npm run compile` | `tsc -p ./` — one-shot build to `out/` |
| `npm run watch` | `tsc -w -p ./` — incremental rebuild on save |
| `npm run lint` | ESLint (flat config) over `src` and `test` |
| `npm test` | Compiles, then runs `node --test out/test/*.test.js` |

## Testing

Tests are plain `node:test` files under `test/`, compiled alongside the extension — no separate test runner or mocking framework. Favor pure functions in `services/`/`core-client/` (e.g. `buildServeArgs`, `parseServerLabel`) that don't touch the `vscode` API, since those are the ones `node:test` can exercise directly.

## Packaging

```bash
npx vsce package
```

Produces a `.vsix` you can install locally (`code --install-extension pycodeloop-X.Y.Z.vsix`) to verify a change end-to-end before publishing.

## Docs site

This site is built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/), independent of the npm toolchain:

```bash
pip install -r docs-requirements.txt
mkdocs serve   # http://127.0.0.1:8000
```
