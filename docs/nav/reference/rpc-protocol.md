# RPC Protocol Reference

The extension speaks the same JSON-RPC-2.0-over-stdio protocol `pycodeloop serve` exposes to any editor integration — one JSON object per line on stdin (requests) and stdout (notifications/responses).

## Requests the extension sends

| Method | Params | Purpose |
|---|---|---|
| `chat/send` | `{ prompt, sessionKey, images }` | Run a prompt to completion in the given session. |
| `chat/ask` | `{ prompt }` | One-shot Q&A against a snapshot of the session, without touching history or running tools. |
| `chat/cancel` | — (notification) | Cancel the in-flight turn. |
| `chat/confirmResponse` | `{ id, answer }` | Answer a pending `chat/confirmRequest`. |
| `session/list` | — | List saved sessions. |
| `session/load` | `{ key }` | Load a specific session's history. |

## Notifications the extension listens for

Forwarded straight to the webview as typed `WebviewMessage`s (`FORWARDED_NOTIFICATIONS` in `src/features/chat/chat.types.ts`):

- `ready`
- `chat/textDelta`
- `chat/toolCall`
- `chat/toolResult`
- `chat/usage`
- `chat/context`
- `chat/retry`
- `chat/compactStart` / `chat/compactEnd`
- `chat/confirmRequest`
- `chat/autoApproved`

Two more are handled directly by `ChatController` rather than forwarded verbatim: `stderr` (surfaced as a `{type: "stderr"}` post) and `spawnError`/process `exit` (turned into `cliMissing` or `connectionError` events, and `processExit`).

## Full method/event list

See [pycodeloop's own protocol reference](https://dotflow-io.github.io/pycodeloop/nav/reference/codeloop/) for the authoritative list, since `pycodeloop serve` — not this extension — defines the protocol surface.
