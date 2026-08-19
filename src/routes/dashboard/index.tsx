import { DashboardOverview } from "#/modules/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
  staticData: {
    pageHeaderData: {
      title: "Analytics Dashboard",
      subtitle: "Workspace metrics, latency SLA, and active usage statistics.",
    },
  },
});
