import { createFileRoute } from "@tanstack/react-router";
import { SetupModule } from "#/modules/setup";

export const Route = createFileRoute("/setup/")({
  component: SetupModule,
  staticData: {
    pageHeaderData: {
      title: "Install",
      subtitle:
        "Get the SDK into your app, confirm events arrive, then promote to your next environment.",
    },
  },
});
