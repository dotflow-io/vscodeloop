# Provider Gallery

⚙ → **Select Provider…** (or `/provider`) opens a card picker for every ready-made provider: Anthropic, OpenAI, Gemini, Grok (xAI), Groq, AWS Bedrock, Kimi (Moonshot AI), DeepSeek, Llama (Together AI), Qwen (Alibaba), NVIDIA NIM, Ollama, and LM Studio — plus a custom JSON config file or a bare OpenAI-compatible URL fallback.

Each card shows a status: **connected** (key already stored), **local** (Ollama/LM Studio, no key needed), or **needs key**. Picking a card that needs a key prompts once; the key is stored in VS Code's secret storage (`credentials.service.ts`) and injected into the spawned `pycodeloop serve` process's environment — never written to a setting or sent over the JSON-RPC wire.

Switching back to a provider you've already connected doesn't re-prompt for the key.

## Per-provider model

After picking a provider, use `/model` (or the model picker in the gallery) to choose a specific model for that provider. The choice is remembered per provider.

## Self-healing retired models

If a stored model choice is retired by the vendor (e.g. an old Gemini snapshot no longer served to new API keys), the extension detects the resulting 404 and resets that provider back to its current default the next time you connect — instead of failing every session until you notice and change it manually.

## Custom / local endpoints

- **Custom JSON config** — point at any `templates/*.json`-shaped file (see the [pycodeloop provider docs](https://dotflow-io.github.io/pycodeloop/nav/development/json-provider/)) for a vendor not in the gallery.
- **Generic URL** — set `pycodeloop.provider` to `generic` and `pycodeloop.url` to any OpenAI-compatible chat-completions endpoint.
