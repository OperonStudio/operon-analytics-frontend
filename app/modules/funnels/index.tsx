import { Box } from "@operon/ui";
import { useFunnels } from "./hooks";
import * as classes from "./styles";

export const UserFunnelsView = () => {
  const { steps } = useFunnels();

  return (
    <Box {...classes.pageContainerStyle}>
      <Box>
        <Box {...classes.titleStyle}>User Journey Funnels</Box>
        <Box {...classes.subtitleStyle}>
          Conversion rates from workspace creation to API rule evaluations
        </Box>
      </Box>

      <Box {...classes.funnelCardStyle}>
        {steps.map((funnel, i) => (
          <Box key={i} {...classes.funnelRowStyle}>
            <Box {...classes.funnelLabelStyle}>
              <span>{funnel.step}</span>
              <span {...classes.funnelCountStyle}>
                {funnel.count.toLocaleString()} users ({funnel.percent}%)
              </span>
            </Box>
            <Box {...classes.trackBarStyle}>
              <Box
                style={{
                  width: `${funnel.percent}%`,
                  height: "100%",
                  backgroundColor: funnel.color,
                  borderRadius: "var(--operon-radius-sm, 6px)",
                  transition: "width 0.5s ease",
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
