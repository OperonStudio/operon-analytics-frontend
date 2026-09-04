import { Zap } from "@operonstudio/icons";
import { Box, Button } from "@operonstudio/ui";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { overviewQuery, trackersQuery } from "#/common/api/queries";
import { useScope } from "#/common/scope";
import * as classes from "./styles";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Workspace overview.
 *
 * Every figure here is measured. The previous version drew a hand-built SVG
 * sparkline over invented numbers and a table of fabricated endpoint latencies,
 * which looks like a working product and tells you nothing.
 */
export const DashboardModule = () => {
  const { scope, isReady } = useScope();
  const { data: overview, isLoading } = useQuery(overviewQuery(scope, 7));
  const { data: trackers = [] } = useQuery(trackersQuery(scope));

  const daily = overview?.daily ?? [];
  const peak = daily.reduce((max, point) => Math.max(max, point.count), 0);
  const weekTotal = daily.reduce((sum, point) => sum + point.count, 0);

  if (!isReady) {
    return (
      <Box {...classes.pageStyle}>
        <Box {...classes.guideStyle}>
          <Box {...classes.guideTextStyle}>
            Choose a project and environment in the sidebar. Trackers and events
            belong to one of each, so there is nothing to measure until both are
            picked.
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box {...classes.pageStyle}>
      <Box {...classes.metricsStyle}>
        <Metric
          label="Events"
          value={isLoading ? null : (overview?.totalEvents ?? 0)}
          note={
            weekTotal > 0
              ? `${weekTotal.toLocaleString()} in last 7 days`
              : "all time"
          }
        />
        <Metric
          label="Active trackers"
          value={isLoading ? null : (overview?.activeTrackers ?? 0)}
          note={
            trackers.length > 0
              ? `${trackers.length} bound in total`
              : undefined
          }
        />
        <Metric
          label="Unique visitors"
          value={isLoading ? null : (overview?.uniqueVisitors ?? 0)}
        />
      </Box>

      <Box {...classes.gridStyle}>
        <Box {...classes.panelStyle}>
          <Box {...classes.panelHeaderStyle}>
            <Box {...classes.panelTitleStyle}>
              {weekTotal > 0 ? "Events" : "No events yet"}
            </Box>
            {weekTotal > 0 && (
              <Box {...classes.panelMetaStyle}>
                last 7 days · peak {peak.toLocaleString()}/day
              </Box>
            )}
          </Box>

          <Box {...classes.panelBodyStyle}>
            {weekTotal > 0 ? (
              <Chart daily={daily} peak={peak} />
            ) : (
              <Box {...classes.guideStyle}>
                <Box {...classes.guideTextStyle}>
                  Bind an element to an event in the visual editor, then load
                  the page with the Operon SDK installed. Events show up here
                  within a few seconds of firing.
                </Box>
                <Link to="/visual-editor" style={{ textDecoration: "none" }}>
                  <Button size="sm" style={{ gap: 6 }}>
                    <Zap size={14} /> Open the visual editor
                  </Button>
                </Link>
              </Box>
            )}
          </Box>
        </Box>

        <Box {...classes.panelStyle}>
          <Box {...classes.panelHeaderStyle}>
            <Box {...classes.panelTitleStyle}>Top events</Box>
          </Box>
          <Box {...classes.listStyle}>
            {(overview?.topEvents ?? []).map((entry) => (
              <Box key={entry.eventName} {...classes.listRowStyle}>
                <Box {...classes.listLabelStyle}>{entry.eventName}</Box>
                <Box {...classes.listCountStyle}>
                  {entry.count.toLocaleString()}
                </Box>
              </Box>
            ))}
            {(overview?.topEvents ?? []).length === 0 && (
              <Box {...classes.listEmptyStyle}>Ranked once events arrive.</Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: number | null;
  note?: string;
}) {
  return (
    <Box {...classes.metricStyle}>
      <Box {...classes.metricLabelStyle}>{label}</Box>
      <Box {...classes.metricValueStyle}>
        {value === null ? "—" : value.toLocaleString()}
      </Box>
      {note && <Box {...classes.metricNoteStyle}>{note}</Box>}
    </Box>
  );
}

/**
 * Daily counts. Each day is a column; a day with no events is a flat rule on
 * the baseline rather than a short bar, so nothing reads as traffic that did
 * not happen.
 */
function Chart({
  daily,
  peak,
}: {
  daily: { date: string; count: number }[];
  peak: number;
}) {
  const scale = Math.max(1, peak);

  return (
    <Box {...classes.chartStyle}>
      <Box {...classes.axisStyle}>
        <span>{peak.toLocaleString()}</span>
        <span>0</span>
      </Box>

      <Box {...classes.chartMainStyle}>
        <Box {...classes.plotStyle}>
          {daily.map((point) => (
            <Box
              key={point.date}
              {...classes.columnStyle}
              title={`${point.date}: ${point.count.toLocaleString()} events`}
            >
              {point.count > 0 ? (
                <Box
                  {...classes.barStyle}
                  style={{
                    height: `${Math.max(2, (point.count / scale) * 100)}%`,
                  }}
                />
              ) : (
                <Box {...classes.barEmptyStyle} />
              )}
            </Box>
          ))}
        </Box>

        <Box {...classes.chartLabelsStyle}>
          {daily.map((point) => (
            <Box key={point.date} {...classes.chartLabelStyle}>
              {WEEKDAYS[new Date(`${point.date}T00:00:00Z`).getUTCDay()]}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
