function closeMenu() {
  menu.hidden = true;
}

menuToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  menu.hidden = !menu.hidden;
});
document.addEventListener("click", (event) => {
  if (!menu.hidden && !menu.contains(event.target) && event.target !== menuToggle) {
    closeMenu();
  }
});
function onMenuClick(button, action) {
  button.addEventListener("click", () => {
    closeMenu();
    action();
  });
}

onMenuClick(menuSessions, () => vscode.postMessage({ type: "showSessions" }));
onMenuClick(menuProvider, () => vscode.postMessage({ type: "showProviders" }));
onMenuClick(menuAutoApprove, () => vscode.postMessage({ type: "toggleAutoApprove", next: !autoApprove }));
onMenuClick(menuSkills, () => vscode.postMessage({ type: "toggleSkills", next: !skillsEnabled }));
onMenuClick(menuDelegation, () => vscode.postMessage({ type: "toggleDelegation", next: !delegationEnabled }));
onMenuClick(menuMemory, () => vscode.postMessage({ type: "toggleMemory", next: !memoryEnabled }));
onMenuClick(menuWorkspace, () => vscode.postMessage({ type: "toggleWorkspace", next: !workspaceEnabled }));
onMenuClick(menuMcp, () => vscode.postMessage({ type: "manageMcpServers" }));
onMenuClick(menuReloadSkills, () => vscode.postMessage({ type: "reloadSkills" }));
onMenuClick(menuReload, () => vscode.postMessage({ type: "reload" }));
onMenuClick(menuSettings, () => vscode.postMessage({ type: "openSettings" }));

function applySettings(message) {
  currentModel = message.model || "";
  autoApprove = !!message.autoApprove;
  skillsEnabled = message.skills !== false;
  delegationEnabled = !!message.delegation;
  memoryEnabled = message.memory !== false;
  workspaceEnabled = message.workspace !== false;
  hasApiKey = !!message.hasApiKey;
  apiKeyEnv = message.apiKeyEnv || "";
  authHeader = message.authHeader || "";
  providerFile = message.providerFile || "";
  menuAutoApproveCheck.classList.toggle("checked", autoApprove);
  menuSkillsCheck.classList.toggle("checked", skillsEnabled);
  menuDelegationCheck.classList.toggle("checked", delegationEnabled);
  menuMemoryCheck.classList.toggle("checked", memoryEnabled);
  menuWorkspaceCheck.classList.toggle("checked", workspaceEnabled);
  if (!hasApiKey && apiKeyEnv && !apiKeyCard && !apiKeyPromptHidden) {
    renderApiKeyCard();
  }
}
