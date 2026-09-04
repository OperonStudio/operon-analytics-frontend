import { createFileRoute } from "@tanstack/react-router";
import { ContextModule } from "#/modules/context";

export const Route = createFileRoute("/context/")({
  component: ContextModule,
  staticData: {
    pageHeaderData: {
      title: "Context",
      subtitle:
        "Values your app registers once, referenced by name in any event.",
    },
  },
});
