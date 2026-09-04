/**
 * The workspace, project and environment the console is currently looking at.
 *
 * These persist across reloads and are read by the query layer, so one module
 * owns the keys and the change notification. Components do not read this
 * directly; they use `useScope`, which resolves the stored ids against what
 * actually exists.
 */
const KEYS = {
  workspace: "operon_active_workspace_id",
  project: "operon_active_project_id",
  environment: "operon_active_environment_id",
} as const;

type Level = keyof typeof KEYS;

const listeners = new Set<() => void>();

function read(level: Level): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(KEYS[level]) ?? "";
  } catch {
    // Private mode denies storage entirely. The session still works; only the
    // choice fails to survive a reload.
    return "";
  }
}

function write(level: Level, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEYS[level], value);
  } catch {
    // As above: losing persistence must not break the switch itself.
  }
  for (const listener of listeners) listener();
}

/** Subscribes to scope changes. The return value unsubscribes. */
export function subscribeToScope(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getActiveWorkspaceId = () => read("workspace");
export const getActiveProjectId = () => read("project");
export const getActiveEnvironmentId = () => read("environment");

export const setActiveWorkspaceId = (id: string) => write("workspace", id);
export const setActiveProjectId = (id: string) => write("project", id);
export const setActiveEnvironmentId = (id: string) => write("environment", id);
