import { Search, Trash2, Zap } from "@operonstudio/icons";
import { Box, Button, Input, Toggle, toast } from "@operonstudio/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  deleteTrackerMutation,
  toggleTrackerMutation,
  trackersQuery,
} from "#/common/api/queries";
import { queryKeys } from "#/common/api/query-keys";
import { TRIGGERS } from "#/common/api/types";
import { useScope } from "#/common/scope";
import * as classes from "./styles";

/**
 * Every element bound to an event.
 *
 * These are created in the visual editor rather than here, so this page is a
 * register and not a form. It used to list fixtures unrelated to anything the
 * editor produced.
 */
export const TrackersModule = () => {
  const queryClient = useQueryClient();
  const { scope, isReady } = useScope();
  const { data: trackers = [], isLoading } = useQuery(trackersQuery(scope));
  const [search, setSearch] = useState("");

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.trackers(scope) });

  const toggle = useMutation({
    ...toggleTrackerMutation(scope),
    onSuccess: refresh,
    onError: () => toast.error("Could not change that tracker"),
  });
  const remove = useMutation({
    ...deleteTrackerMutation(scope),
    onSuccess: () => {
      refresh();
      toast.success("Tracker removed");
    },
    onError: () => toast.error("Could not remove that tracker"),
  });

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return trackers;
    return trackers.filter(
      (t) =>
        t.eventName.toLowerCase().includes(query) ||
        t.operonId.toLowerCase().includes(query),
    );
  }, [trackers, search]);

  if (!isReady) {
    return (
      <Box {...classes.emptyStyle}>
        Choose a project and environment to see its trackers.
      </Box>
    );
  }

  if (isLoading) {
    return <Box {...classes.emptyStyle}>Loading trackers…</Box>;
  }

  if (trackers.length === 0) {
    return (
      <Box {...classes.pageStyle}>
        <Box {...classes.emptyCardStyle}>
          <Box {...classes.emptyIconStyle}>
            <Zap size={20} />
          </Box>
          <Box {...classes.emptyTitleStyle}>No trackers yet</Box>
          <Box {...classes.emptyBodyStyle}>
            Trackers are created by binding an event to an element. Open the
            visual editor, load a page running the Operon SDK, and pick
            something to track.
          </Box>
          <Link to="/visual-editor" style={{ textDecoration: "none" }}>
            <Button size="sm">Open the visual editor</Button>
          </Link>
        </Box>
      </Box>
    );
  }

  return (
    <Box {...classes.pageStyle}>
      <Box {...classes.searchRowStyle}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by event or element"
          startIcon={<Search size={15} />}
          variant="filled"
          fullWidth
        />
        <Link to="/visual-editor" style={{ textDecoration: "none" }}>
          <Button variant="outline" size="sm" style={{ gap: 6 }}>
            <Zap size={14} /> Bind another
          </Button>
        </Link>
      </Box>

      <Box {...classes.tableStyle}>
        <Box {...classes.headRowStyle}>
          <Box>Event</Box>
          <Box>Element</Box>
          <Box>Fires on</Box>
          <Box {...classes.numericCellStyle}>Fired</Box>
          <Box />
        </Box>

        {visible.map((tracker) => (
          <Box key={tracker.id} {...classes.rowStyle}>
            <Box {...classes.eventCellStyle}>
              <Box {...classes.eventNameStyle}>{tracker.eventName}</Box>
              {tracker.sourceUrl && (
                <Box {...classes.sourceStyle}>{tracker.sourceUrl}</Box>
              )}
            </Box>

            <Box {...classes.monoCellStyle}>{tracker.operonId}</Box>

            <Box {...classes.triggerCellStyle}>
              {TRIGGERS.find((t) => t.value === tracker.trigger)?.label ??
                tracker.trigger}
            </Box>

            {/* Counted from the events this tracker actually produced. */}
            <Box {...classes.numericCellStyle}>
              {(tracker.firedCount ?? 0).toLocaleString()}
            </Box>

            <Box {...classes.actionsCellStyle}>
              <Toggle
                size="sm"
                checked={tracker.enabled}
                onChange={() =>
                  toggle.mutate({
                    id: tracker.id,
                    enabled: !tracker.enabled,
                  })
                }
              />
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Remove ${tracker.eventName}`}
                onClick={() => remove.mutate(tracker.id)}
                style={{ color: "var(--operon-color-danger)" }}
              >
                <Trash2 size={15} />
              </Button>
            </Box>
          </Box>
        ))}

        {visible.length === 0 && (
          <Box {...classes.emptyStyle}>Nothing matches that filter.</Box>
        )}
      </Box>
    </Box>
  );
};
