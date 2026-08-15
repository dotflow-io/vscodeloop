# Sessions

CodeLoop keeps every conversation as a separate session, persisted by `pycodeloop serve` itself (not the extension) — so history survives an extension reload or a VS Code restart.

## Switching sessions

The **Sessions** panel (toolbar button, or `/sessions`) lists every saved session as a card: message count, working directory, last-updated time, and an **Active** badge on the current one. Click **Switch** on any card to resume it.

## Starting a new session

Use **+ New Session** in the panel toolbar (or `/new`) — the current conversation isn't deleted, it just stops being the active one; find it again later in the Sessions panel.

## Asking without committing to the conversation

`ChatController.ask()`/`SessionsController` expose a read-only, one-shot Q&A path against a snapshot of the current session — it doesn't touch history, run tools, or persist, so it's safe to fire while a real turn is still mid-flight on another request.
