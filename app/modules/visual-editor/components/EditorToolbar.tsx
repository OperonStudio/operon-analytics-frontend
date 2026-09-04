import { ArrowLeft, Boxes, RefreshCw, Zap } from "@operonstudio/icons";
import { Box, Button, Input } from "@operonstudio/ui";
import { Link } from "@tanstack/react-router";
import type { VisualEditor } from "../hooks";
import * as classes from "../style";

export const EditorToolbar = ({ editor }: { editor: VisualEditor }) => (
  <Box {...classes.toolbarStyle}>
    {/* The editor is full screen, with none of the app's usual navigation, so
        without this there is no way out except the browser's back button. */}
    <Link to="/trackers" {...classes.backLinkStyle}>
      <ArrowLeft size={15} />
      <span>Trackers</span>
    </Link>

    <Box {...classes.urlBarStyle}>
      <Input
        value={editor.draftUrl}
        onChange={(e) => editor.setDraftUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") editor.load(editor.draftUrl);
        }}
        placeholder="Enter a URL, e.g. localhost:8085/test.html"
        fullWidth
        variant="filled"
        startIcon={<Boxes size={15} />}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.load(editor.draftUrl)}
        disabled={!editor.draftUrl.trim()}
      >
        {editor.url ? <RefreshCw size={15} /> : "Load"}
      </Button>
    </Box>

    <Box {...classes.toolbarActionsStyle}>
      <Box {...classes.boundCountStyle}>{editor.boundCount} bound</Box>
      {/*
        Inspect mode is the editor's one modal state, so it reads as pressed
        rather than as a button that might or might not have worked.
      */}
      <Button
        size="sm"
        variant={editor.isInspecting ? "primary" : "outline"}
        onClick={editor.toggleInspecting}
        aria-pressed={editor.isInspecting}
        disabled={editor.connection !== "connected"}
        style={{ gap: 6 }}
      >
        <Zap size={15} />
        {editor.isInspecting ? "Inspecting" : "Inspect"}
        <kbd {...classes.kbdStyle}>⌘I</kbd>
      </Button>
    </Box>
  </Box>
);
