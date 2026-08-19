import { UserFunnelsView } from "#/modules/funnels";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/funnels/")({
  component: UserFunnelsView,
  staticData: {
    pageHeaderData: {
      title: "User Journeys",
      subtitle: "Workspace onboarding and decision rule execution funnels.",
    },
  },
});
