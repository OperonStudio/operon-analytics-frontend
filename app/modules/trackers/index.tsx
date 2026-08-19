import { Plus } from "@operon/icons";
import { Box, Button } from "@operon/ui";
import { useTrackers } from "./hooks";
import * as classes from "./styles";

export const TrackersView = () => {
  const {
    trackers,
    isAddOpen,
    setIsAddOpen,
    name,
    setName,
    selector,
    setSelector,
    eventType,
    setEventType,
    handleCreate,
  } = useTrackers();

  return (
    <Box {...classes.pageContainerStyle}>
      <Box {...classes.headerRowStyle}>
        <Box>
          <Box {...classes.titleStyle}>Visual Event Trackers</Box>
          <Box {...classes.subtitleStyle}>
            Track DOM clicks, form submissions, and rule executions via Visual
            Editor
          </Box>
        </Box>
        <Button
          variant="primary"
          size="sm"
          startIcon={<Plus size={14} />}
          onClick={() => setIsAddOpen(true)}
        >
          Attach Tracker
        </Button>
      </Box>

      {isAddOpen && (
        <Box {...classes.formContainerStyle}>
          <Box style={{ fontSize: "14px", fontWeight: 600 }}>
            New Event Tracker
          </Box>
          <input
            type="text"
            placeholder="Tracker Name (e.g. Add Collection Button)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            {...classes.inputStyle}
          />
          <input
            type="text"
            placeholder="DOM Selector (e.g. button#add-collection)"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            {...classes.inputStyle}
          />
          <Box display="flex" gap={12}>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              {...classes.inputStyle}
            >
              <option value="click">Click</option>
              <option value="submit">Submit</option>
              <option value="change">Change</option>
            </select>
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={!name || !selector}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddOpen(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      <Box {...classes.gridStyle}>
        {trackers.map((tr) => (
          <Box key={tr.id} {...classes.trackerCardStyle}>
            <Box display="flex" justify="space-between" align="center">
              <Box {...classes.trackerNameStyle}>{tr.name}</Box>
              <span {...classes.statusDotStyle}>{tr.status}</span>
            </Box>
            <Box {...classes.selectorTextStyle}>
              Selector:{" "}
              <code {...classes.codeTagStyle}>{tr.selector}</code>
            </Box>
            <Box {...classes.trackerFooterStyle}>
              <span>
                Fired: <strong>{tr.triggersCount.toLocaleString()}</strong> times
              </span>
              <span>{tr.lastFired}</span>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
