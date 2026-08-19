import { Command, Plug, User, Zap } from "@operon/icons";
import { Box } from "@operon/ui";
import { useDashboard } from "./hooks";
import * as classes from "./styles";

export const DashboardOverview = () => {
  const {
    timeRange,
    setTimeRange,
    apiRequests,
    storageBytes,
    bandwidthBytes,
    activeUsers,
    topEndpoints,
    formatBytes,
  } = useDashboard();

  return (
    <Box {...classes.pageContainerStyle}>
      {/* Toolbar */}
      <Box {...classes.toolbarStyle}>
        <Box {...classes.timePillsStyle}>
          {(["24h", "7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              {...(timeRange === range
                ? classes.pillButtonActiveStyle
                : classes.pillButtonStyle)}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </Box>
      </Box>

      {/* KPI Cards */}
      <Box {...classes.kpiGridStyle}>
        <Box {...classes.kpiCardStyle}>
          <Box display="flex" justify="space-between" align="center">
            <Box {...classes.kpiLabelStyle}>API Requests</Box>
            <Plug size={16} color="var(--operon-color-primary, #6366f1)" />
          </Box>
          <Box {...classes.kpiValueStyle}>{apiRequests.toLocaleString()}</Box>
          <Box {...classes.kpiSubtextStyle}>
            Avg 42.8 req/s
          </Box>
        </Box>

        <Box {...classes.kpiCardStyle}>
          <Box display="flex" justify="space-between" align="center">
            <Box {...classes.kpiLabelStyle}>Response Latency (p95)</Box>
            <Zap size={16} color="var(--operon-color-success, #10b981)" />
          </Box>
          <Box {...classes.kpiValueStyle}>36.4 ms</Box>
          <Box {...classes.kpiSubtextStyle}>
            p50: 18ms · p99: 84ms
          </Box>
        </Box>

        <Box {...classes.kpiCardStyle}>
          <Box display="flex" justify="space-between" align="center">
            <Box {...classes.kpiLabelStyle}>Data Throughput</Box>
            <Command size={16} color="var(--operon-color-warning, #f59e0b)" />
          </Box>
          <Box {...classes.kpiValueStyle}>{formatBytes(bandwidthBytes)}</Box>
          <Box {...classes.kpiSubtextStyle}>
            Storage: {formatBytes(storageBytes)}
          </Box>
        </Box>

        <Box {...classes.kpiCardStyle}>
          <Box display="flex" justify="space-between" align="center">
            <Box {...classes.kpiLabelStyle}>Active Users</Box>
            <User size={16} color="var(--operon-color-text-muted, #666)" />
          </Box>
          <Box {...classes.kpiValueStyle}>{activeUsers.toLocaleString()}</Box>
          <Box {...classes.kpiSubtextStyle}>
            14 projects · 8 API keys
          </Box>
        </Box>
      </Box>

      {/* Traffic Chart */}
      <Box {...classes.chartContainerStyle}>
        <Box {...classes.chartTitleStyle}>
          Request Volume
        </Box>
        <Box {...classes.chartSubtitleStyle}>
          Hourly traffic over past {timeRange.toUpperCase()}
        </Box>

        <Box style={{ width: "100%", height: "180px" }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 180"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--operon-color-primary, #6366f1)"
                  stopOpacity="0.15"
                />
                <stop
                  offset="100%"
                  stopColor="var(--operon-color-primary, #6366f1)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <line
              x1="0" y1="45" x2="800" y2="45"
              stroke="var(--operon-color-border, #eaeaea)"
              strokeDasharray="4"
            />
            <line
              x1="0" y1="90" x2="800" y2="90"
              stroke="var(--operon-color-border, #eaeaea)"
              strokeDasharray="4"
            />
            <line
              x1="0" y1="135" x2="800" y2="135"
              stroke="var(--operon-color-border, #eaeaea)"
              strokeDasharray="4"
            />
            <path
              d="M 0,140 Q 100,50 200,100 T 400,60 T 600,90 T 800,30 L 800,180 L 0,180 Z"
              fill="url(#areaGrad)"
            />
            <path
              d="M 0,140 Q 100,50 200,100 T 400,60 T 600,90 T 800,30"
              fill="none"
              stroke="var(--operon-color-primary, #6366f1)"
              strokeWidth="2"
            />
          </svg>
        </Box>
      </Box>

      {/* Top Endpoints Table */}
      <Box {...classes.tableContainerStyle}>
        <Box {...classes.tableTitleStyle}>Top Endpoints</Box>
        <Box style={{ overflowX: "auto" }}>
          <table {...classes.tableStyle}>
            <thead>
              <tr {...classes.tableHeadStyle}>
                <th {...classes.thStyle}>Endpoint</th>
                <th {...classes.thStyle}>Invocations</th>
                <th {...classes.thStyle}>p95 Latency</th>
                <th {...classes.thStyle}>Error Rate</th>
                <th {...classes.thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {topEndpoints.map((row, idx) => (
                <tr key={idx}>
                  <td {...classes.tdStyle}>
                    <span {...classes.codeBadgeStyle}>{row.path}</span>
                  </td>
                  <td {...classes.tdStyle}>{row.count}</td>
                  <td {...classes.tdStyle}>{row.latency}</td>
                  <td {...classes.tdStyle}>{row.error}</td>
                  <td {...classes.tdStyle}>
                    <span {...classes.statusBadgeStyle}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Box>
  );
};
