import { AlertTriangle, Globe } from "@operonstudio/icons";
import { Box } from "@operonstudio/ui";
import type { VisualEditor } from "../hooks";
import * as classes from "../style";

/**
 * The customer's page, framed.
 *
 * The overlay states matter more than they look: a blank frame is the single
 * most confusing thing this screen can show, and there are three quite
 * different reasons for it.
 */
export const EditorCanvas = ({ editor }: { editor: VisualEditor }) => (
  <Box {...classes.canvasStyle}>
    {editor.url ? (
      <>
        <iframe
          ref={editor.frameRef}
          src={editor.url}
          title="Page being edited"
          {...classes.frameStyle}
          onLoad={() =>
            editor.setConnection((state) =>
              state === "connected" ? state : "loading",
            )
          }
        />

        {editor.connection === "no-sdk" && (
          <Box {...classes.overlayStyle}>
            <Box {...classes.overlayCardStyle}>
              <Box {...classes.overlayIconStyle}>
                <AlertTriangle size={20} />
              </Box>
              <Box {...classes.overlayTitleStyle}>
                The page loaded, but the SDK did not answer
              </Box>
              <Box {...classes.overlayBodyStyle}>
                Either the Operon SDK is not installed on this page, or the site
                refuses to be framed. Check that <code>operon.init()</code> runs
                here, and that the response has no <code>X-Frame-Options</code>{" "}
                or restrictive <code>frame-ancestors</code>.
              </Box>
            </Box>
          </Box>
        )}
      </>
    ) : (
      <Box {...classes.overlayStyle}>
        <Box {...classes.overlayCardStyle}>
          <Box {...classes.overlayIconStyle}>
            <Globe size={20} />
          </Box>
          <Box {...classes.overlayTitleStyle}>Load a page to start</Box>
          <Box {...classes.overlayBodyStyle}>
            Enter the URL of a site running the Operon SDK. Every element
            carrying your tracking attribute shows up on the left, ready to bind
            an event to.
          </Box>
        </Box>
      </Box>
    )}
  </Box>
);
