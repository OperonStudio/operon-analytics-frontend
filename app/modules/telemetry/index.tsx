import { Box, Button } from "@operonstudio/ui";
import { useTelemetry } from "./hooks";
import * as classes from "./styles";

export const TelemetryLogsView = () => {
  const { logs, searchQuery, setSearchQuery, isLive, setIsLive } =
    useTelemetry();

  return (
    <Box {...classes.pageContainerStyle}>
      <Box {...classes.headerRowStyle}>
        <Box>
          <Box {...classes.titleStyle}>Telemetry Stream</Box>
          <Box {...classes.subtitleStyle}>
            Live API request log, status codes, and latency traces
          </Box>
        </Box>

        <Box display="flex" align="center" gap={12}>
          <Button
            variant={isLive ? "primary" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? "Live" : "Paused"}
          </Button>

          <input
            type="text"
            placeholder="Filter events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            {...classes.searchInputStyle}
          />
        </Box>
      </Box>

      <Box {...classes.tableWrapperStyle}>
        <Box style={{ overflowX: "auto" }}>
          <table {...classes.tableStyle}>
            <thead>
              <tr {...classes.tableHeadRowStyle}>
                <th {...classes.thStyle}>Timestamp</th>
                <th {...classes.thStyle}>Method</th>
                <th {...classes.thStyle}>Endpoint</th>
                <th {...classes.thStyle}>Event</th>
                <th {...classes.thStyle}>Latency</th>
                <th {...classes.thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((logItem) => (
                <tr key={logItem.id}>
                  <td {...classes.tdStyle}>
                    <span {...classes.timestampStyle}>
                      {logItem.timestamp}
                    </span>
                  </td>
                  <td {...classes.tdStyle}>
                    <span
                      {...(logItem.method === "POST"
                        ? classes.methodPostStyle
                        : classes.methodGetStyle)}
                    >
                      {logItem.method}
                    </span>
                  </td>
                  <td {...classes.tdStyle}>
                    <code>{logItem.endpoint}</code>
                  </td>
                  <td {...classes.tdStyle}>
                    <span {...classes.eventTagStyle}>{logItem.event}</span>
                  </td>
                  <td {...classes.tdStyle}>{logItem.latency}</td>
                  <td {...classes.tdStyle}>
                    <span {...classes.statusBadgeStyle}>
                      {logItem.status} OK
                    </span>
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
