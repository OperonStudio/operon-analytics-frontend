import { createFileRoute } from "@tanstack/react-router";
import { DashboardModule } from "#/modules/dashboard";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardModule,
  staticData: {
    pageHeaderData: {
      title: "Analytics Dashboard",
      subtitle: "Workspace metrics, latency SLA, and active usage statistics.",
    },
  },
});
