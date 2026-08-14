export function parseVersionOutput(stdout: string): string | null {
  const match = /(\d+\.\d+\.\d+)/.exec(stdout);
  return match ? match[1] : null;
}

export function isOutdated(current: string, latest: string): boolean {
  const a = current.split(".").map(Number);
  const b = latest.split(".").map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    if (x !== y) {
      return x < y;
    }
  }
  return false;
}

export type Fetch = (url: string) => Promise<{ ok: boolean; json: () => Promise<unknown> }>;

export async function fetchLatestVersion(
  fetchImpl: Fetch = fetch as unknown as Fetch
): Promise<string | null> {
  try {
    const response = await fetchImpl("https://pypi.org/pypi/pycodeloop/json");
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as { info?: { version?: string } };
    return data.info?.version ?? null;
  } catch {
    return null;
  }
}
