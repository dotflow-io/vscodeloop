# Concepts

CodeLoop for VS Code has three moving pieces:

```
Webview (chat UI) ↔ ChatController ↔ RpcClient ↔ pycodeloop serve (JSON-RPC/stdio)
```

- **[Architecture](concept-architecture.md)** — how the webview, the extension host, and the `pycodeloop serve` subprocess talk to each other.
- **[Settings](concept-settings.md)** — the `pycodeloop.*` configuration surface that controls the provider, tool gates, and the spawned CLI.
