# Welcome to CodeLoop for VS Code

<div align="center">
  <a aria-label="Repository" href="https://github.com/dotflow-io/vscodeloop">Repository</a>
  &nbsp;•&nbsp;
  <a aria-label="VS Code Marketplace" href="https://marketplace.visualstudio.com/items?itemName=fernandocelmer.pycodeloop">Marketplace</a>
  &nbsp;•&nbsp;
  <a aria-label="CodeLoop Documentation" href="https://dotflow-io.github.io/vscodeloop/">Documentation</a>
</div>

![VS Marketplace](https://img.shields.io/visual-studio-marketplace/v/fernandocelmer.pycodeloop?label=VS%20Marketplace&style=flat-square)
![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)
![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.85.0-007ACC?style=flat-square)

CodeLoop is an agentic AI coding assistant for VS Code — chat with [pycodeloop](https://github.com/dotflow-io/pycodeloop) from a sidebar view instead of the terminal to read, edit, and run code in your workspace. Bring your own model: Anthropic Claude, OpenAI, Google Gemini, xAI Grok, Groq, AWS Bedrock, Moonshot Kimi, DeepSeek, Together AI Llama, Alibaba Qwen, NVIDIA NIM, or a local Ollama/LM Studio model.

The extension spawns `pycodeloop serve`, which speaks a small JSON-RPC-2.0 protocol over its stdin/stdout — text deltas, tool calls/results, usage, context %, retries, compaction events, and a confirm request/response round-trip for dangerous tools.

Start with the basics [here](nav/how-to/install.md).

## Getting Help

We use GitHub issues for tracking bugs and feature requests.

- 🐛 [Bug Report](https://github.com/dotflow-io/vscodeloop/issues/new/choose)
- 🚀 [Feature Request](https://github.com/dotflow-io/vscodeloop/issues/new/choose)
- ⚠️ [Security Issue](https://github.com/dotflow-io/vscodeloop/issues/new/choose)

## Commit Style

| Icon | Type      | Description                                |
|------|-----------|--------------------------------------------|
| ⚙️   | FEATURE   | New feature                                |
| 📝   | LINT      | ESLint/Prettier formatting fixes           |
| 📌   | ISSUE     | Reference to issue                         |
| 🪲   | BUG       | Bug fix                                    |
| 📘   | DOCS      | Documentation changes                      |
| 📦   | NPM       | npm/marketplace releases                   |
| ❤️️   | TEST      | Automated tests                            |
| ⬆️   | CI/CD     | Changes in continuous integration/delivery |
| ⚠️   | SECURITY  | Security improvements                      |

## License

![GitHub License](https://img.shields.io/github/license/dotflow-io/vscodeloop)

This project is licensed under the terms of the MIT License.
