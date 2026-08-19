import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getUsageOptions } from "#/modules/usage/api";

export function useDashboard() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">("24h");
  const [environment, setEnvironment] = useState<"production" | "staging" | "dev">("production");

  const activeWorkspaceId =
    typeof window !== "undefined"
      ? localStorage.getItem("operon_active_workspace_id")
      : null;

  const { data: usage, isLoading } = useQuery({
    ...getUsageOptions(activeWorkspaceId || ""),
    enabled: !!activeWorkspaceId,
  });

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const apiRequests = usage?.apiRequests || 1284920;
  const storageBytes = usage?.storageBytes || 1420000000;
  const bandwidthBytes = usage?.bandwidthBytes || 3840000000;
  const activeUsers = usage?.activeUsers || 3420;

  const topEndpoints = [
    { path: "POST /api/workspaces/:id/invitations", count: "412,900", latency: "34ms", error: "0.00%", status: "Healthy" },
    { path: "POST /api/rule-engine/evaluate", count: "389,450", latency: "42ms", error: "0.01%", status: "Healthy" },
    { path: "GET /api/content/operon-compose/settings", count: "215,100", latency: "12ms", error: "0.00%", status: "Healthy" },
    { path: "GET /api/workspaces/environments", count: "142,300", latency: "9ms", error: "0.00%", status: "Healthy" },
    { path: "POST /api/auth/refresh", count: "125,170", latency: "18ms", error: "0.02%", status: "Healthy" },
  ];

  return {
    activeWorkspaceId,
    timeRange,
    setTimeRange,
    environment,
    setEnvironment,
    apiRequests,
    storageBytes,
    bandwidthBytes,
    activeUsers,
    topEndpoints,
    formatBytes,
    isLoading,
  };
}
