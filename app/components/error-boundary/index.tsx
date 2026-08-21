import { AlertTriangle } from "@operonstudio/icons";
import { Box, Button, Card } from "@operonstudio/ui";
import * as classes from "./style";

export const ErrorBoundary = () => {
  return (
    <Box
      display="flex"
      direction="column"
      align="center"
      justify="center"
      {...classes.containerStyle}
    >
      <Card {...classes.cardStyle}>
        <Box display="flex" direction="column" align="center" gap="16px">
          <AlertTriangle size={48} {...classes.iconStyle} />
          <h1 {...classes.headingStyle}>Something went wrong</h1>
          <p {...classes.textStyle}>
            An unexpected error occurred while loading this page. Please try
            again or contact support if the issue persists.
          </p>
          <Box
            display="flex"
            justify="center"
            gap="12px"
            {...classes.buttonGroupStyle}
          >
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
