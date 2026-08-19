export const DashboardEndpoints = {
  WORKSPACES: "/api/workspaces",
};

export const getEndpoint = (endpoint: string) => endpoint;

export const ENDPOINTS = {
  USAGE: (workspaceId: string) => `/api/workspaces/${workspaceId}/usage`,
  WORKSPACES: "/api/workspaces",
  AUTH_REFRESH: "/api/auth/refresh",
};
