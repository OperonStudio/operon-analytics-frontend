import { Search } from "@operonstudio/icons";
import { Box, Breadcrumb, Input } from "@operonstudio/ui";
import { useLocation, useMatches, useNavigate } from "@tanstack/react-router";
import { HeaderItems } from "./header-items";
import * as classes from "./style";
import { cx } from "@morph-css/kit";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbItems = [
    {
      label: "Operon",
      href: "/",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        navigate({ to: "/" });
      },
    },
    ...pathnames.map((path, index) => {
      const href = `/${pathnames.slice(0, index + 1).join("/")}`;
      const label = path.charAt(0).toUpperCase() + path.slice(1);
      return {
        label,
        href,
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          navigate({ to: href });
        },
      };
    }),
  ];

  const matches = useMatches();
  const matchWithSearch = matches.find((m) => m.staticData?.search);
  const { isSearchable = false, searchBarPlaceholder = "" } =
    matchWithSearch?.staticData?.search || {};

  return (
    <Box {...classes.topbarStyle}>
      <Box display="flex">
        <Breadcrumb items={breadcrumbItems} />
      </Box>

      {isSearchable && (
        <Box 
          className={cx(classes.searchContainerStyle.className, classes.hideOnMobileStyle.className)}
          style={{ ...classes.searchContainerStyle.style, ...classes.hideOnMobileStyle.style }}
        >
          <Input
            startIcon={<Search size={16} />}
            placeholder={searchBarPlaceholder}
            fullWidth
            variant="filled"
          />
        </Box>
      )}

      <Box className={classes.hideOnMobileStyle.className} style={classes.hideOnMobileStyle.style}>
        <HeaderItems />
      </Box>
    </Box>
  );
}
