import { createClient } from "@operonstudio/request";
import { withLogger } from "@operonstudio/request/middleware";

export const operonApiClient = createClient({
  baseURL: import.meta.env.VITE_OPERON_COMPOSE_BACKEND_URL,
});

operonApiClient.use(async (ctx, next) => {
  if (typeof window !== "undefined") {
    const workspaceId = localStorage.getItem("operon_active_workspace_id");
    if (workspaceId) {
      ctx.request.headers.set("x-workspace-id", workspaceId);
    }
    const environmentId = localStorage.getItem("operon_active_environment_id");
    if (environmentId) {
      ctx.request.headers.set("x-environment-id", environmentId);
    }
    let token = localStorage.getItem("operon_auth_token");
    if (!token) {
      const tokenMatch = document.cookie.match(/(?:^|;\s*)operon_auth_token=([^;]*)/);
      if (tokenMatch) token = tokenMatch[1];
    }
    if (token) {
      ctx.request.headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return await next(ctx);
});

if (import.meta.env.DEV) {
  operonApiClient.use(withLogger());
}
