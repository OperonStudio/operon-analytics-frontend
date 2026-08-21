import type { PageHeaderAction, PageHeaderData } from "#/common/interfaces";
import { useHeaderActionHandler } from "#/contexts/header-actions";
import { Box, Button } from "@operonstudio/ui";
import { useMatches } from "@tanstack/react-router";
import * as classes from "./style";

function ActionButton({ action }: { action: PageHeaderAction }) {
  const handler = useHeaderActionHandler(action.id);
  const Icon = action.icon;

  return (
    <Button
      variant={action.variant}
      size="sm"
      onClick={handler}
      disabled={!handler}
      startIcon={Icon && <Icon size={16} />}
    >
      {action.label}
    </Button>
  );
}

export function PageHeader() {
  const matches = useMatches();
  const matchWithPageHeaderData = matches.find(
    (m) =>
      (m.context as any)?.pageHeaderData ||
      (m.loaderData as any)?.pageHeaderData ||
      m.staticData?.pageHeaderData,
  );

  if (!matchWithPageHeaderData) return null;

  const contextData =
    (matchWithPageHeaderData.context as any)?.pageHeaderData || {};
  const loaderData =
    (matchWithPageHeaderData.loaderData as any)?.pageHeaderData || {};
  const staticData =
    (matchWithPageHeaderData.staticData as any)?.pageHeaderData || {};

  const pageHeaderData = {
    ...staticData,
    ...loaderData,
    ...contextData,
  };

  const {
    title = "",
    subtitle = "",
    actions = [],
  } = pageHeaderData as PageHeaderData;

  return (
    <Box {...classes.pageHeaderContainerStyle}>
      <Box {...classes.titleGroupStyle}>
        <h1 {...classes.titleStyle}>{title}</h1>
        <p {...classes.descriptionStyle}>{subtitle}</p>
      </Box>

      {actions.length > 0 && (
        <Box display="flex" gap={12} align="center">
          {actions.map((action) => (
            <ActionButton key={action.id} action={action} />
          ))}
        </Box>
      )}
    </Box>
  );
}
