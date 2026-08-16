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

export class McpServerNameTakenError extends Error {
  constructor(readonly name: string) {
    super(`A server named "${name}" already exists in the registry.`);
  }
}

async function readConfig(): Promise<Record<string, unknown>> {
  try {
    return JSON.parse(await fs.promises.readFile(CONFIG_PATH, "utf8"));
  } catch {
    return {};
  }
}

async function writeConfig(data: Record<string, unknown>): Promise<void> {
  await fs.promises.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
  await fs.promises.writeFile(CONFIG_PATH, JSON.stringify(data, null, 2));
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

export async function listSavedMcpServers(): Promise<Record<string, SavedMcpServer>> {
  const data = await readConfig();
  return (data[SECTION] as Record<string, SavedMcpServer>) ?? {};
}

export async function saveMcpServer(
  name: string,
  server: SavedMcpServer,
  { overwrite = false }: { overwrite?: boolean } = {}
): Promise<void> {
  const data = await readConfig();
  const servers = (data[SECTION] as Record<string, SavedMcpServer>) ?? {};
  if (servers[name] && !overwrite) {
    throw new McpServerNameTakenError(name);
  }
  servers[name] = server;
  data[SECTION] = servers;
  await writeConfig(data);
}

export async function deleteSavedMcpServer(name: string): Promise<void> {
  const data = await readConfig();
  const servers = (data[SECTION] as Record<string, SavedMcpServer>) ?? {};
  delete servers[name];
  data[SECTION] = servers;
  await writeConfig(data);
}
