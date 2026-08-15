# MCP Servers

CodeLoop can expose tools from any [Model Context Protocol](https://modelcontextprotocol.io/) server alongside its built-in ones, via the `pycodeloop.mcpServers` setting — one launch command per server, forwarded as `--mcp` flags to `pycodeloop serve`.

## Adding a server

Use `/mcp` (or the gear menu → MCP Servers) to open the manager — **$(add) Add MCP server…** prompts for a launch command, e.g.:

```
npx -y @modelcontextprotocol/server-filesystem .
```

The manager lists configured servers as `$(server) <command>` entries; select one to remove it.

## What the agent sees

Every tool the server exposes is added to the agent's tool list alongside the built-ins (`read_file`, `bash`, ...) — discovered tools **always require confirmation** before running, regardless of `pycodeloop.autoApprove`.

## Reconnecting

Adding, removing, or restarting a server takes effect on the next `pycodeloop serve` spawn — reload the connection (gear menu → Reload, or `/reload`) after changing the list.
