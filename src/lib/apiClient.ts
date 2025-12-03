// src/lib/apiClient.ts

import { getValidAccessToken } from "@/services/userService";
import { Token } from "@/lib/auth";

/**
 * Generic authenticated fetch wrapper.
 * 
 * - Automatically attaches access token
 * - Auto refreshes on 401
 * - Retries once after refresh
 */
export async function apiClientFetch(
  baseUrl: string,
  path: string,
  options: RequestInit = {}
) {
  let token = await getValidAccessToken();

  const headers: HeadersInit = {
    ...(options.headers || {}),
    accept: "application/json",
  };

  if (token) headers["authorization"] = `Bearer ${token}`;

  if (options.method && options.method !== "GET")
    headers["Content-Type"] = "application/json";

  // First request
  let res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  if (res.status !== 401) return res;

  // If refresh token expired → logout
  if (!Token.getRefresh() || Token.isRefreshExpired()) {
    Token.clear();
    return res;
  }

  // Try refresh
  try {
    token = await getValidAccessToken();
  } catch {
    Token.clear();
    return res;
  }

  if (!token) return res;

  const retryHeaders: HeadersInit = {
    ...(options.headers || {}),
    accept: "application/json",
    authorization: `Bearer ${token}`,
  };

  if (options.method && options.method !== "GET")
    retryHeaders["Content-Type"] =
      retryHeaders["Content-Type"] || "application/json";

  // Retry once
  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers: retryHeaders,
  });
}
