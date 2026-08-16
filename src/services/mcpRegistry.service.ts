import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const CONFIG_PATH = path.join(os.homedir(), ".pycodeloop", "config.json");
const SECTION = "mcp_servers";

export interface SavedMcpServer {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

function readConfig(): Record<string, unknown> {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  } catch {
    return {};
  }
}

function writeConfig(data: Record<string, unknown>): void {
  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
}

// Mirrors shlex.split() on the pycodeloop side (cli/flow.py's _load_mcp_tools).
export function splitCommand(command: string): { command: string; args: string[] } {
  const tokens = command.match(/"[^"]*"|'[^']*'|\S+/g) ?? [];
  const unquoted = tokens.map((t) =>
    (t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))
      ? t.slice(1, -1)
      : t
  );
  const [head, ...rest] = unquoted;
  return { command: head ?? "", args: rest };
}

export function listSavedMcpServers(): Record<string, SavedMcpServer> {
  const data = readConfig();
  return (data[SECTION] as Record<string, SavedMcpServer>) ?? {};
}

export function saveMcpServer(name: string, server: SavedMcpServer): void {
  const data = readConfig();
  const servers = (data[SECTION] as Record<string, SavedMcpServer>) ?? {};
  servers[name] = server;
  data[SECTION] = servers;
  writeConfig(data);
}

export function deleteSavedMcpServer(name: string): void {
  const data = readConfig();
  const servers = (data[SECTION] as Record<string, SavedMcpServer>) ?? {};
  delete servers[name];
  data[SECTION] = servers;
  writeConfig(data);
}
