import { createFileRoute } from "@tanstack/react-router";
import { TrackersModule } from "#/modules/trackers";

export const Route = createFileRoute("/trackers/")({
  component: TrackersModule,
  staticData: {
    pageHeaderData: {
      title: "Visual Trackers",
      subtitle: "DOM elements and event triggers attached via Visual Editor.",
    },
  },
});
