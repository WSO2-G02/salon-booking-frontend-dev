// src/lib/api.ts

import { Token } from "./auth";
import { getValidAccessToken, refreshTokens } from "@/services/userService";

// BASE URL for the SERVICES MANAGEMENT service
const SERVICES_BASE =
  process.env.NEXT_PUBLIC_SERVICES_API_BASE ||
  "https://services-management.azurewebsites.net/api/v1";

/**
 * Authenticated fetch against the SERVICES backend.
 *
 * - Adds `authorization: Bearer <access>` header if available
 * - If access token is missing or near expiry => refresh first
 * - If response is 401 => try refresh once, then retry request
 * - If refresh fails / expired => tokens cleared, 401 returned
 */
export async function servicesApiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${SERVICES_BASE}${path}`;

  // 1) Get a valid (refreshed if needed) access token
  const access = await getValidAccessToken();

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (access) {
    headers["authorization"] = `Bearer ${access}`;
  }

  if (options.method && options.method !== "GET") {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  // 2) First attempt
  const res = await fetch(url, { ...options, headers });

  if (res.status !== 401) {
    return res;
  }

  // 3) If 401 → try refresh ONCE (if refresh token still valid)
  const refresh = Token.getRefresh();
  if (!refresh || Token.isRefreshExpired()) {
    Token.clear();
    return res;
  }

  let newAccess: string | undefined;
  try {
    const refreshed = await refreshTokens();
    newAccess = refreshed.access_token as string | undefined;
  } catch {
    // refreshTokens already cleared on failure
    return res;
  }

  if (!newAccess) {
    return res;
  }

  const retryHeaders: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
    authorization: `Bearer ${newAccess}`,
  };

  if (options.method && options.method !== "GET") {
    retryHeaders["Content-Type"] =
      retryHeaders["Content-Type"] || "application/json";
  }

  // 4) Retry once with new token
  return fetch(url, { ...options, headers: retryHeaders });
}
