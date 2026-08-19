import { useEffect, useState } from "react";

const INITIAL_LOGS = [
  {
    id: "log-1",
    method: "POST",
    endpoint: "/api/workspaces/6a7f3c8b/invitations",
    status: 200,
    latency: "34ms",
    timestamp: "13:09:57",
    clientIp: "10.42.8.32",
    event: "workspace.invitation_sent",
  },
  {
    id: "log-2",
    method: "GET",
    endpoint: "/api/content/operon-compose/app-config",
    status: 200,
    latency: "12ms",
    timestamp: "13:09:54",
    clientIp: "::1",
    event: "content.fetched",
  },
  {
    id: "log-3",
    method: "POST",
    endpoint: "/api/rule-engine/evaluate",
    status: 200,
    latency: "42ms",
    timestamp: "13:09:48",
    clientIp: "10.42.8.32",
    event: "rule.evaluated",
  },
  {
    id: "log-4",
    method: "GET",
    endpoint: "/api/workspaces/environments",
    status: 200,
    latency: "8ms",
    timestamp: "13:09:30",
    clientIp: "::1",
    event: "environments.list",
  },
  {
    id: "log-5",
    method: "POST",
    endpoint: "/api/auth/refresh",
    status: 200,
    latency: "18ms",
    timestamp: "13:09:12",
    clientIp: "::1",
    event: "auth.refreshed",
  },
];

export function useTelemetry() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const endpoints = [
        { method: "GET", path: "/api/workspaces/environments", latency: "14ms", event: "workspace.sync" },
        { method: "POST", path: "/api/rule-engine/evaluate", latency: "38ms", event: "rule.execution" },
        { method: "GET", path: "/api/content/operon-compose/settings", latency: "9ms", event: "content.load" },
      ];
      const selected = endpoints[Math.floor(Math.random() * endpoints.length)];
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

      const item = {
        id: `log-${Date.now()}`,
        method: selected.method,
        endpoint: selected.path,
        status: 200,
        latency: selected.latency,
        timestamp: timeStr,
        clientIp: "::1",
        event: selected.event,
      };

      setLogs((prev) => [item, ...prev.slice(0, 14)]);
    }, 3500);

    return () => clearInterval(interval);
  }, [isLive]);

  const filteredLogs = logs.filter(
    (l) =>
      l.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    logs: filteredLogs,
    searchQuery,
    setSearchQuery,
    isLive,
    setIsLive,
  };
}
