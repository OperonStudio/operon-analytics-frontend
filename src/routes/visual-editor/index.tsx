import { VisualEditorModule } from "#/modules/visual-editor";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/visual-editor/")({
  component: VisualEditorModule,
  staticData: {
    pageHeaderData: {
      title: "Visual Editor",
      subtitle: "Visually tag elements on your website using the Operon SDK.",
    },
  },
});
