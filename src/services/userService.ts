// src/services/userService.ts

import { Token } from "@/lib/auth";

export const USER_API_BASE =
  process.env.NEXT_PUBLIC_USER_API_BASE ||
  "https://user-service-salon.azurewebsites.net";

/* ----------------------------------------
   REGISTER USER
---------------------------------------- */
export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
}) {
  const res = await fetch(`${USER_API_BASE}/api/v1/register`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.detail || "Registration failed");
  }

  return json;
}

/* ----------------------------------------
   LOGIN USER  (gets access + refresh)
---------------------------------------- */
export async function loginUser(data: {
  username: string;
  password: string;
}) {
  const res = await fetch(`${USER_API_BASE}/api/v1/login`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.detail || "Invalid username or password");
  }

  // Backend returns: access_token, refresh_token, expires_in, token_type
  const access = json.access_token as string | undefined;
  const refresh = json.refresh_token as string | undefined;
  const expiresIn = json.expires_in as number | undefined;

  if (!access || !refresh) {
    throw new Error("Login response missing tokens");
  }

  // Store in localStorage (with expiry tracking)
  Token.setLoginTokens(access, refresh, expiresIn);

  return json;
}

/* ----------------------------------------
   REFRESH TOKENS (called automatically)
---------------------------------------- */
export async function refreshTokens() {
  const refresh = Token.getRefresh();
  if (!refresh) {
    Token.clear();
    throw new Error("No refresh token available");
  }

  // If refresh is expired, clear & fail
  if (Token.isRefreshExpired()) {
    Token.clear();
    throw new Error("Refresh token expired");
  }

  const res = await fetch(`${USER_API_BASE}/api/v1/refresh`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refresh }),
  });

  const json = await res.json();

  if (!res.ok) {
    Token.clear();
    throw new Error(json.detail || "Failed to refresh token");
  }

  const access = json.access_token as string | undefined;
  const expiresIn = json.expires_in as number | undefined;

  if (!access) {
    Token.clear();
    throw new Error("Refresh response missing access_token");
  }

  // Update access token + expiry (keep refresh as is)
  Token.updateAccessToken(access, expiresIn);

  return json;
}

/* ----------------------------------------
   Get a valid access token
   - Returns null if not logged in or refresh failed
   - Refreshes automatically if:
     - access is missing, or
     - access is expired / near expiry (2min)
---------------------------------------- */
export async function getValidAccessToken(): Promise<string | null> {
  // If refresh already expired → log out
  if (Token.isRefreshExpired()) {
    Token.clear();
    return null;
  }

  const current = Token.getAccess();

  // Access exists and not near expiry -> use current
  if (current && !Token.isAccessNearExpiry()) {
    return current;
  }

  // Otherwise try refresh
  try {
    const data = await refreshTokens();
    return data.access_token as string;
  } catch {
    // refreshTokens already clears on failure
    return null;
  }
}

/* ----------------------------------------
   GET PROFILE (example usage)
---------------------------------------- */
export async function getUserProfile() {
  const access = await getValidAccessToken();

  if (!access) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${USER_API_BASE}/api/v1/profile`, {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      authorization: `Bearer ${access}`,
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.detail || "Failed to fetch profile");
  }

  return json;
}

/* ----------------------------------------
   LOGOUT
---------------------------------------- */
export function logoutUser() {
  Token.clear();
}
