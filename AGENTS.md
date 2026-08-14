# Agent Instructions — vscodeloop

Standing rules for any agent (CodeLoop, Claude Code, or otherwise) working
in this repo. Read this before making changes — it captures corrections
already given more than once; don't make the user repeat them.

## Providers (`providers/`)

- Mirrors `templates/` and `pycodeloop/providers/templates/` in the
  [dotflow-io/pycodeloop](https://github.com/dotflow-io/pycodeloop) repo —
  a new or changed provider JSON needs to land in all three, or the CLI,
  docs, and extension disagree about what's available.
- Before naming a model ID or endpoint, verify it against current vendor
  docs (WebFetch/WebSearch) — don't guess or reuse a remembered ID. Model
  catalogs (OpenAI, Gemini, Grok, Groq, ...) churn fast; a name that was
  right last month can 404 today.
- The multi-choice model list per provider lives in
  `src/features/settings/providerCatalog.ts` — keep it in sync with
  whatever `providers/*.json`'s own single default `model` says.

## UI

- Thin 1px borders, sharp corners (`border-radius: 0` except circular
  status dots), monospace + uppercase for chrome/buttons, all colors via
  `var(--vscode-*)` tokens (never hardcode hex — the panel must follow the
  user's editor theme, light or dark).
- No emoji as icons. Buttons are plain uppercase text unless there's
  genuinely no room for a label (e.g. the Settings gear) — then a thin
  inline stroke SVG (`stroke="currentColor"`, no fill), never a Unicode
  symbol.
- `media/*.js` are plain `<script>` tags loaded in a fixed order (see
  `ChatViewProvider.SCRIPT_FILES` / `html.ts`) — no bundler, no modules.
  They share one global scope by design; a name any of them declares that
  another consumes must be added to `eslint.config.mjs`'s globals list for
  `media/**/*.js`, or lint's `no-undef` fires on the consuming file.

## After any change

1. `npm run lint && npm run test` (both must pass)
2. `rm -f pycodeloop-*.vsix && npx --no-install vsce package`
3. `code --uninstall-extension fernandocelmer.pycodeloop && code --install-extension pycodeloop-<version>.vsix`

A stale installed `.vsix` is the single most common source of "the fix
didn't work" confusion — always reinstall, don't assume the last build is
what's running.

## Commits

- Only commit when explicitly asked.
- Follow the icon+TYPE convention (`⚙️ FEATURE`, `🪲 BUG`, `📘 DOCS`,
  `📦 Release`, `🎨 STYLE`, `❤️ TEST`, ...) — look at recent `git log`
  output for the exact tone/format.
- One logical change per commit — don't bundle an unrelated fix into a
  feature commit just because they happened in the same session.
- Never `git add -A`/`-u`; stage files by name. Flag any untracked files
  that look unrelated to the current task instead of committing them
  blindly.
