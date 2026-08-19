import { TelemetryLogsView } from "#/modules/telemetry";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/telemetry/")({
  component: TelemetryLogsView,
  staticData: {
    pageHeaderData: {
      title: "Telemetry Stream",
      subtitle: "Live event logging, status codes, and request latency traces.",
    },
  },
});
