import { TrackersView } from "#/modules/trackers";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trackers/")({
  component: TrackersView,
  staticData: {
    pageHeaderData: {
      title: "Visual Trackers",
      subtitle: "DOM elements and event triggers attached via Visual Editor.",
    },
  },
});
