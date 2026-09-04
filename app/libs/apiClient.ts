import { createClient } from "@operonstudio/request";
import { withAuth, withLogger } from "@operonstudio/request/middleware";

/**
 * Requests go to the same origin and are authenticated by the httpOnly session
 * cookie, which the dev server proxies through to the backends.
 *
 * This used to read a JWT out of localStorage and send it as a bearer token,
 * with a readable cookie as a fallback. A token any script on the page can read
 * is a token an XSS can steal, and the session survives in storage long after
 * the tab closes. The cookie is set httpOnly and scoped to the domain, so it
 * reaches every product without the token ever being visible to JavaScript.
 *
 * It also sent `x-workspace-id` and `x-environment-id` on every request. No
 * handler reads them; they only forced a CORS preflight.
 */
export const operonApiClient = createClient({
  baseURL: "",
});

operonApiClient.use(
  withAuth({
    refreshUrl: "/api/auth/refresh",
  }),
);

if (import.meta.env.DEV) {
  operonApiClient.use(withLogger());
}
