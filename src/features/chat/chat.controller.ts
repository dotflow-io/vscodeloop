import * as vscode from "vscode";
import * as cp from "child_process";
import { RpcClient } from "../../core-client/core-client";
import { buildServeArgs } from "../../core-client/process-args";
import { currentWorkspaceFolder, readSettings } from "../../services/settings.service";
import { buildInstallCommand, buildUpdateCommand, buildUserScriptsDirCommand } from "../../services/terminal.service";
import { fetchLatestVersion, isOutdated, parseVersionOutput } from "../../services/cliVersion.service";
import {
  API_KEY_SECRET,
  providerApiKeyEnvNames,
  readResolvedProviderAuth,
  spawnEnvForApiKey,
} from "../../services/credentials.service";
import { forwardedEventType, mapAskResponse, mapSendResponse } from "./chat.service";
import { FORWARDED_NOTIFICATIONS, PostMessage, ResolveSetting } from "./chat.types";

export class ChatController {
  private client: RpcClient | undefined;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly post: PostMessage,
    private readonly resolveSetting: ResolveSetting,
    private readonly onReady: () => void
  ) {}

  getClient(): RpcClient | undefined {
    return this.client;
  }

  async startConnection(): Promise<void> {
    if (!readSettings().provider) {
      this.post({ type: "needsSetup" });
      return;
    }
    if (!(await this.hasCli())) {
      this.post({ type: "cliMissing", command: this.resolveSetting(readSettings().command) });
      return;
    }
    this.post({ type: "connecting" });
    await this.ensureClient();
    void this.checkCliVersion();
  }

  async hasCli(): Promise<boolean> {
    const command = this.resolveSetting(readSettings().command);
    return new Promise((resolve) => {
      cp.exec(`"${command}" --help`, (error) => resolve(!error));
    });
  }

  async checkCliVersion(): Promise<void> {
    const command = this.resolveSetting(readSettings().command);
    const current = await new Promise<string | null>((resolve) => {
      cp.exec(`"${command}" --version`, (error, stdout) => {
        resolve(error ? null : parseVersionOutput(stdout));
      });
    });
    if (!current) {
      return;
    }

    const latest = await fetchLatestVersion();
    if (latest && isOutdated(current, latest)) {
      this.post({ type: "cliOutdated", current, latest });
    }
  }

  async updateCli(): Promise<void> {
    const updateCmd = buildUpdateCommand(process.platform);
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: "Updating CodeLoop CLI…" },
      () =>
        new Promise<void>((resolve) => {
          cp.exec(updateCmd, { timeout: 180000 }, (error, _stdout, stderr) => {
            if (error) {
              vscode.window
                .showErrorMessage(
                  `Couldn't update pycodeloop automatically: ${stderr || error.message}. ` +
                    `Run this yourself: ${updateCmd}`,
                  "Copy command"
                )
                .then((choice) => {
                  if (choice === "Copy command") {
                    vscode.env.clipboard.writeText(updateCmd);
                  }
                });
            } else {
              vscode.window.showInformationMessage("CodeLoop CLI updated.");
              this.reload();
            }
            resolve();
          });
        })
    );
  }

  async installCli(): Promise<void> {
    const installCmd = buildInstallCommand(process.platform);
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: "Installing CodeLoop CLI…" },
      () =>
        new Promise<void>((resolve) => {
          cp.exec(installCmd, { timeout: 180000 }, (error, _stdout, stderr) => {
            if (error) {
              vscode.window
                .showErrorMessage(
                  `Couldn't install pycodeloop automatically: ${stderr || error.message}. ` +
                    `Run this yourself: ${installCmd}`,
                  "Copy command"
                )
                .then((choice) => {
                  if (choice === "Copy command") {
                    vscode.env.clipboard.writeText(installCmd);
                  }
                });
            } else {
              vscode.window.showInformationMessage("CodeLoop CLI installed.");
              this.addUserScriptsDirToPath().finally(() => this.reload());
            }
            resolve();
          });
        })
    );
  }

  private addUserScriptsDirToPath(): Promise<void> {
    return new Promise((resolve) => {
      cp.exec(buildUserScriptsDirCommand(process.platform), (error, stdout) => {
        const dir = stdout.trim();
        if (!error && dir && !(process.env.PATH ?? "").includes(dir)) {
          const sep = process.platform === "win32" ? ";" : ":";
          process.env.PATH = `${dir}${sep}${process.env.PATH ?? ""}`;
        }
        resolve();
      });
    });
  }

  readAuthFor(provider: string) {
    return readResolvedProviderAuth(this.resolveSetting(provider));
  }

  async ensureClient(): Promise<void> {
    if (this.client) {
      return;
    }

    const settings = readSettings();
    const command = this.resolveSetting(settings.command);
    const args = buildServeArgs({
      provider: settings.provider,
      model: settings.model,
      url: settings.url,
      skills: settings.skills,
      delegation: settings.delegation,
      memory: settings.memory,
      autoApprove: settings.autoApprove,
      mcpServers: settings.mcpServers,
      resolveSetting: (value) => this.resolveSetting(value),
    });
    const apiKey = await this.context.secrets.get(API_KEY_SECRET);
    const auth = this.readAuthFor(settings.provider);
    const env = spawnEnvForApiKey(apiKey, providerApiKeyEnvNames(auth));

    const client = new RpcClient(command, args, currentWorkspaceFolder(), env);
    for (const method of FORWARDED_NOTIFICATIONS) {
      client.on(method, (params) => {
        this.post({ type: forwardedEventType(method), ...params });
      });
    }
    client.on("ready", () => this.onReady());
    client.on("stderr", (text: string) => {
      this.post({ type: "stderr", text });
    });
    client.on("exit", ({ code }: { code: number | null }) => {
      this.post({ type: "processExit", code });
      this.client = undefined;
    });
    client.on("spawnError", (error: NodeJS.ErrnoException) => {
      if (error.code === "ENOENT") {
        this.post({ type: "cliMissing", command });
      } else {
        this.post({ type: "connectionError", message: `Couldn't start "${command}" (${error.message}).` });
      }
      this.client = undefined;
    });

    this.client = client;
  }

  sendPrompt(prompt: string, sessionKey: string, images?: string[]): void {
    void this.ensureClient().then(() => {
      this.client
        ?.request("chat/send", { prompt, sessionKey, images })
        .then((response) => this.post(mapSendResponse(response)));
    });
  }

  askAside(id: string, prompt: string): void {
    void this.ensureClient().then(() => {
      this.client?.request("chat/ask", { prompt }).then((response) => this.post(mapAskResponse(id, response)));
    });
  }

  cancel(): void {
    this.client?.notify("chat/cancel");
  }

  confirmResponse(id: string, answer: boolean | string): void {
    this.client?.notify("chat/confirmResponse", { id, answer });
  }

  dispose(): void {
    this.client?.dispose();
    this.client = undefined;
  }

  reload(): void {
    this.dispose();
    void this.startConnection();
  }
}
