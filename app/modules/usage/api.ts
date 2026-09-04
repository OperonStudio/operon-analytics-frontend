import { queryOptions } from "@tanstack/react-query";
import { ENDPOINTS } from "#/common/endpoints";
import { operonApiClient } from "#/libs/apiClient";
import type { Usage } from "./types";

export const getUsageOptions = (workspaceId: string) =>
  queryOptions({
    queryKey: ["usage", workspaceId],
    queryFn: async () => {
      return await operonApiClient.get<Usage>(ENDPOINTS.USAGE(workspaceId));
    },
    enabled: !!workspaceId,
  });
