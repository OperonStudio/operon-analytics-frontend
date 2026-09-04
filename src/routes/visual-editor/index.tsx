import { createFileRoute } from "@tanstack/react-router";
import { VisualEditorModule } from "#/modules/visual-editor";

export const Route = createFileRoute("/visual-editor/")({
  // No page is loaded until one is typed in. Auto-loading a URL framed a site
  // nobody asked for and made the editor look like it had already connected to
  // something.
  component: VisualEditorModule,
  staticData: {
    pageHeaderData: {
      title: "Visual Editor",
      subtitle: "Visually tag elements on your website using the Operon SDK.",
    },
  },
});
