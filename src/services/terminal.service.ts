export function buildInstallCommand(platform: NodeJS.Platform): string {
  const pythonCmd = platform === "win32" ? "python" : "python3";
  return `${pythonCmd} -m pip install --user pycodeloop`;
}

export function buildUpdateCommand(platform: NodeJS.Platform): string {
  const pythonCmd = platform === "win32" ? "python" : "python3";
  return `${pythonCmd} -m pip install --user --upgrade pycodeloop`;
}

export function buildUserScriptsDirCommand(platform: NodeJS.Platform): string {
  const pythonCmd = platform === "win32" ? "python" : "python3";
  const scheme = platform === "win32" ? "nt_user" : "posix_user";
  return `${pythonCmd} -c "import sysconfig; print(sysconfig.get_path('scripts', '${scheme}'))"`;
}
