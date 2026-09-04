import { Search } from "@operonstudio/icons";
import { Box, Input } from "@operonstudio/ui";
import type { VisualEditor } from "../hooks";
import * as classes from "../style";

/**
 * Everything the SDK found on the page, and whether it is bound yet.
 *
 * The list is the editor's index: it answers "what can I track here" without
 * hunting around the preview, which is the question someone opens this screen
 * with.
 */
export const ElementTree = ({ editor }: { editor: VisualEditor }) => (
  <Box {...classes.panelStyle}>
    <Box {...classes.panelHeaderStyle}>
      <span>Elements</span>
      <span {...classes.panelCountStyle}>{editor.elements.length}</span>
    </Box>

    <Box {...classes.searchStyle}>
      <Input
        value={editor.search}
        onChange={(e) => editor.setSearch(e.target.value)}
        placeholder="Filter"
        fullWidth
        variant="filled"
        startIcon={<Search size={14} />}
      />
    </Box>

    <Box {...classes.treeStyle}>
      {editor.visibleElements.map((element) => {
        const isSelected = element.operonId === editor.selectedId;
        const binding = editor.bindings[element.operonId];

        return (
          <button
            key={element.operonId}
            type="button"
            onClick={() => editor.select(element.operonId)}
            {...classes.treeItemStyle}
            style={{
              backgroundColor: isSelected
                ? "var(--operon-color-primary-ghost)"
                : undefined,
              color: isSelected ? "var(--operon-color-primary)" : undefined,
            }}
          >
            <Box
              {...classes.treeDotStyle}
              style={{
                backgroundColor: binding
                  ? "var(--operon-color-success)"
                  : "var(--operon-color-border-strong)",
              }}
            />
            <Box {...classes.treeIdStyle}>{element.operonId}</Box>
            {/* One row per id, so say when several nodes share it. Binding it
                once covers every one of them. */}
            {(element.count ?? 1) > 1 && (
              <Box
                {...classes.treeCountStyle}
                title={`${element.count} elements on this page share this id`}
              >
                ×{element.count}
              </Box>
            )}
            {binding && (
              <Box {...classes.treeEventStyle}>{binding.eventName}</Box>
            )}
          </button>
        );
      })}

      {editor.elements.length > 0 && editor.visibleElements.length === 0 && (
        <Box {...classes.treeEmptyStyle}>Nothing matches that filter.</Box>
      )}

      {editor.elements.length === 0 && (
        <Box {...classes.treeEmptyStyle}>
          Elements appear here once the page loads and the SDK reports them.
        </Box>
      )}
    </Box>
  </Box>
);
