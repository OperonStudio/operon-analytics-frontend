import { Search } from "@operonstudio/icons";
import { Box, Input } from "@operonstudio/ui";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { eventsQuery } from "#/common/api/queries";
import { TRIGGERS } from "#/common/api/types";
import { useScope } from "#/common/scope";
import * as classes from "./styles";

/**
 * Events as they arrive from the SDK.
 *
 * Newest first, scoped to the selected project and environment, and refreshed
 * on a timer: the question this page answers is "did the thing I just clicked
 * arrive?", which a static list cannot answer.
 */
export const TelemetryLogsView = () => {
  const { scope, isReady } = useScope();
  const { data: events = [], isLoading } = useQuery(eventsQuery(scope));
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return events;
    return events.filter(
      (e) =>
        e.eventName.toLowerCase().includes(query) ||
        e.operonId.toLowerCase().includes(query) ||
        e.url.toLowerCase().includes(query),
    );
  }, [events, search]);

  if (!isReady) {
    return (
      <Box {...classes.pageStyle}>
        <Box {...classes.emptyStyle}>
          Choose a project and environment to see the events it received.
        </Box>
      </Box>
    );
  }

  return (
    <Box {...classes.pageStyle}>
      <Box {...classes.toolbarStyle}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by event, element or page"
          startIcon={<Search size={15} />}
          variant="filled"
          fullWidth
        />
        <Box {...classes.countStyle}>
          {events.length.toLocaleString()} received
        </Box>
      </Box>

      <Box {...classes.streamStyle}>
        {isLoading && <Box {...classes.emptyStyle}>Loading…</Box>}

        {!isLoading && events.length === 0 && (
          <Box {...classes.emptyStyle}>
            No events yet. Once a page running the SDK fires one of your bound
            trackers, it appears here within a few seconds.
          </Box>
        )}

        {!isLoading && events.length > 0 && visible.length === 0 && (
          <Box {...classes.emptyStyle}>Nothing matches that filter.</Box>
        )}

        {visible.map((event) => (
          <Box key={event.id} {...classes.rowStyle}>
            <Box {...classes.timeStyle}>
              {new Date(event.receivedAt).toLocaleTimeString()}
            </Box>
            <Box {...classes.eventStyle}>{event.eventName}</Box>
            <Box {...classes.triggerStyle}>
              {TRIGGERS.find((t) => t.value === event.trigger)?.label ??
                event.trigger}
            </Box>
            <Box {...classes.elementStyle}>{event.operonId}</Box>
            <Box {...classes.urlStyle}>{event.url}</Box>
            {event.properties && Object.keys(event.properties).length > 0 && (
              <Box {...classes.propertiesStyle}>
                {JSON.stringify(event.properties)}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
