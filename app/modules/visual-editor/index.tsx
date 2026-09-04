import { Box } from "@operonstudio/ui";
import { EditorCanvas } from "./components/EditorCanvas";
import { EditorToolbar } from "./components/EditorToolbar";
import { ElementTree } from "./components/ElementTree";
import { EventInspector } from "./components/EventInspector";
import { useVisualEditor } from "./hooks";
import * as classes from "./style";

/**
 * The visual editor: load a page, pick an element, decide what firing on it
 * means.
 *
 * It used to be a single component inside the design system, which meant a
 * product-specific tool could not be changed without publishing a package. It
 * lives here now, split into the panes it actually has.
 */
export const VisualEditorModule = ({
  initialUrl = "",
}: {
  initialUrl?: string;
}) => {
  const editor = useVisualEditor(initialUrl);

  // Without a project and an environment there is nowhere for a binding to go,
  // and letting someone tag elements first would lose the work at save time.
  if (!editor.isScopeReady) {
    return (
      <Box {...classes.shellStyle}>
        <Box {...classes.scopeNoticeStyle}>
          Choose a project and environment in the sidebar. A tracker belongs to
          one of each, so bindings made here need both before they can be saved.
        </Box>
      </Box>
    );
  }

  return (
    <Box {...classes.shellStyle}>
      <EditorToolbar editor={editor} />
      <Box {...classes.bodyStyle}>
        <ElementTree editor={editor} />
        <EditorCanvas editor={editor} />
        <EventInspector editor={editor} />
      </Box>
    </Box>
  );
};
