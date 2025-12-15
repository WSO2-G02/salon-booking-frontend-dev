// src/lib/api.ts

import { Token } from "./auth";
import { getValidAccessToken, refreshTokens } from "@/services/userService";

/* ============================================================
   BASE URL NORMALIZATION
   - Removes trailing slashes
   - Automatically supports both:
        http://localhost:8002
        http://localhost:8002/api/v1
   ============================================================ */

const RAW_BASE =
  process.env.NEXT_PUBLIC_SERVICE_API_BASE ||
  "https://aurora-glam.com/api/services";

const SERVICES_BASE = RAW_BASE.replace(/\/+$/, ""); // remove trailing slash

/* ============================================================
   MAIN AUTHENTICATED FETCH WRAPPER
   ============================================================ */
export async function servicesApiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  // Ensure path begins with exactly ONE leading slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  // Final request URL
  const url = `${SERVICES_BASE}${cleanPath}`;

  /* ---------------------------------------------
     1) Get a valid token (refresh if needed)
     --------------------------------------------- */
  const access = await getValidAccessToken();

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (access) {
    headers["authorization"] = `Bearer ${access}`;
  }

  if (options.method && options.method !== "GET") {
    headers["Content-Type"] =
      headers["Content-Type"] || "application/json";
  }

  /* ---------------------------------------------
     2) First attempt
     --------------------------------------------- */
  let res = await fetch(url, { ...options, headers });

  if (res.status !== 401) {
    return res;
  }

  /* ---------------------------------------------
     3) Access token expired → try refresh once
     --------------------------------------------- */
  const refresh = Token.getRefresh();
  if (!refresh || Token.isRefreshExpired()) {
    Token.clear();
    return res; // return original 401
  }

  let newAccess: string | undefined;
  try {
    const refreshed = await refreshTokens();
    newAccess = refreshed.access_token;
  } catch {
    return res; // refresh failed
  }

  if (!newAccess) return res;

  /* ---------------------------------------------
     4) Retry request with new access token
     --------------------------------------------- */
  const retryHeaders: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
    authorization: `Bearer ${newAccess}`,
  };

  if (options.method && options.method !== "GET") {
    retryHeaders["Content-Type"] =
      retryHeaders["Content-Type"] || "application/json";
  }

  return fetch(url, { ...options, headers: retryHeaders });
}
