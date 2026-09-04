import { Bell } from "@operonstudio/icons";
import { Box, Button } from "@operonstudio/ui";
import * as classes from "./style";

export const HeaderItems = () => {
  return (
    <Box {...classes.rightActionsStyle}>
      <Button variant="ghost" size="sm" rounded {...classes.iconButtonStyle}>
        <Bell size={16} color="var(--operon-color-text-muted)" />
      </Button>
    </Box>
  );
};
