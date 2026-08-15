# Install

## 1. Install the extension

From the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=fernandocelmer.pycodeloop), or:

```bash
code --install-extension fernandocelmer.pycodeloop
```

## 2. Install `pycodeloop`

The extension drives [pycodeloop](https://github.com/dotflow-io/pycodeloop) — it needs the CLI on `PATH` (or pointed at via `pycodeloop.command`).

```bash
pip install --user pycodeloop
```

Open the CodeLoop panel (activity bar icon) — if the CLI isn't found, a **CodeLoop CLI not found** card offers a one-click installer that runs the same command for you.

!!! note
    A fresh `pip install --user` can put the binary somewhere not yet on `PATH` (e.g. `~/Library/Python/3.x/bin` on macOS, `~/.local/bin` on Linux). The one-click installer resolves and adds that directory automatically; a manual install may need a new terminal/VS Code restart to pick it up. See [Troubleshooting](troubleshooting.md).

## 3. Configure a provider

Open the CodeLoop panel and use the provider gallery (⚙ → Select Provider…) — see [Provider gallery](provider-gallery.md). Paste the API key once; it's stored in VS Code's secret storage.

## Requirements

- `pycodeloop` installed and on `PATH` (or `pycodeloop.command` pointed at its full path)
- A provider configured — either via the gallery, or manually via `pycodeloop.provider`/`pycodeloop.model`/`pycodeloop.url`
- The API key the provider's config names in `api_key_env` (for Anthropic that's `ANTHROPIC_API_KEY`)
