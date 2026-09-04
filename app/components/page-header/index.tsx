import { Box, Button } from "@operonstudio/ui";
import { useMatches } from "@tanstack/react-router";
import type { PageHeaderAction, PageHeaderData } from "#/common/interfaces";
import { useHeaderActionHandler } from "#/contexts/header-actions";
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

/** A route match may carry page header data in any of three places. */
type WithPageHeader = { pageHeaderData?: Partial<PageHeaderData> };

function headerDataOf(source: unknown): Partial<PageHeaderData> {
  return (source as WithPageHeader | undefined)?.pageHeaderData ?? {};
}

export function PageHeader() {
  const matches = useMatches();
  const matchWithPageHeaderData = matches.find(
    (m) =>
      headerDataOf(m.context).title ||
      headerDataOf(m.loaderData).title ||
      m.staticData?.pageHeaderData,
  );

  if (!matchWithPageHeaderData) return null;

  // Later sources win: a loader can override what the route declared
  // statically, and context overrides both.
  const contextData = headerDataOf(matchWithPageHeaderData.context);
  const loaderData = headerDataOf(matchWithPageHeaderData.loaderData);
  const staticData = headerDataOf(matchWithPageHeaderData.staticData);

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
