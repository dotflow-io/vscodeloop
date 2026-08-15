# Sub-agent Delegation

Off by default — turn on with the `pycodeloop.delegation` setting, the gear-menu toggle, or `/delegate`.

When enabled, the agent gets a `delegate` tool that spawns a fresh sub-agent (same provider, read-only tools only — `read_file`/`list_dir`/`glob`/`grep`/`git status`/`diff`/`log`/`web_fetch`/`sql_schema`/`sql_query`, no write/edit/delete/bash) to investigate an independent subtask. Several `delegate` calls issued in the same turn run **in parallel**.

While sub-agents are working, the status line switches from the usual "● Thinking… · Ns" to "N sub-agents working…" so it's clear multiple things are happening at once.

Delegation is a read-only fan-out for research/investigation subtasks (find all callers of X, summarize what Y does) — it can't write files or run shell commands, by design.
