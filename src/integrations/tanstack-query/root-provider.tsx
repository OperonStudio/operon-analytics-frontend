import { QueryClient } from "@tanstack/react-query";

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Enterprise defaults: keep data fresh for 30s and cached for 5 minutes
        // so screen-to-screen navigation feels instant, but a single tab
        // return still gets fresh values. Per-query overrides (e.g. content
        // API) can bump these when appropriate.
        retry: 1,
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return {
    queryClient,
  };
}
export default function TanstackQueryProvider() {}
