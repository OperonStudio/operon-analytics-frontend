import { FileQuestion } from "@operonstudio/icons";
import { Box, Button, Card } from "@operonstudio/ui";
import { Link } from "@tanstack/react-router";
import * as classes from "./style";

export const NotFoundPage = () => {
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
          <FileQuestion size={48} {...classes.iconStyle} />
          <h1 {...classes.headingStyle}>404 Not Found</h1>
          <p {...classes.textStyle}>
            We couldn't find the page you're looking for. It might have been
            removed or doesn't exist.
          </p>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button {...classes.buttonStyle}>Return Home</Button>
          </Link>
        </Box>
      </Card>
    </Box>
  );
};
