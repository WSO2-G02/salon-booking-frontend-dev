// src/lib/auth.ts

// Keys in localStorage
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_EXPIRES_AT_KEY = "access_expires_at"; // ms since epoch
const REFRESH_EXPIRES_AT_KEY = "refresh_expires_at"; // ms since epoch

// Defaults (backup if backend doesn't send expires_in)
const DEFAULT_ACCESS_TTL_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_REFRESH_TTL_MS = 24 * 60 * 60 * 1000; // 1 day

function isBrowser() {
  return typeof window !== "undefined";
}

function getNumber(key: string): number | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export const Token = {
  // ---------- Raw token getters ----------
  getAccess(): string | null {
    if (!isBrowser()) return null;

    const refreshExpired = this.isRefreshExpired();
    if (refreshExpired) {
      this.clear();
      return null;
    }

    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefresh(): string | null {
    if (!isBrowser()) return null;

    const refreshExpired = this.isRefreshExpired();
    if (refreshExpired) {
      this.clear();
      return null;
    }

    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // ---------- Expiry getters ----------
  getAccessExpiresAt(): number | null {
    return getNumber(ACCESS_EXPIRES_AT_KEY);
  },

  getRefreshExpiresAt(): number | null {
    return getNumber(REFRESH_EXPIRES_AT_KEY);
  },

  // ---------- Expiry checks ----------
  isAccessExpired(): boolean {
    if (!isBrowser()) return true;
    const exp = this.getAccessExpiresAt();
    if (!exp) return true;
    return Date.now() >= exp;
  },

  /**
   * Returns true if the access token will expire within thresholdMs.
   * Default: 2 minutes.
   */
  isAccessNearExpiry(thresholdMs = 2 * 60 * 1000): boolean {
    if (!isBrowser()) return true;
    const exp = this.getAccessExpiresAt();
    if (!exp) return true;
    return exp - Date.now() <= thresholdMs;
  },

  isRefreshExpired(): boolean {
    if (!isBrowser()) return true;
    const exp = this.getRefreshExpiresAt();
    if (!exp) return true;
    return Date.now() >= exp;
  },

  // ---------- Setters ----------
  /**
   * Call this on LOGIN.
   * - Stores access + refresh tokens
   * - Sets access expiry using backend's expires_in
   * - Sets refresh expiry to "now + 1 day"
   */
  setLoginTokens(access: string, refresh: string, expiresInSeconds?: number) {
    if (!isBrowser()) return;

    const now = Date.now();
    const accessTtlMs =
      typeof expiresInSeconds === "number"
        ? expiresInSeconds * 1000
        : DEFAULT_ACCESS_TTL_MS;

    const accessExp = now + accessTtlMs;
    const refreshExp = now + DEFAULT_REFRESH_TTL_MS;

    window.localStorage.setItem(ACCESS_TOKEN_KEY, access);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    window.localStorage.setItem(ACCESS_EXPIRES_AT_KEY, accessExp.toString());
    window.localStorage.setItem(REFRESH_EXPIRES_AT_KEY, refreshExp.toString());
  },

  /**
   * Call this on REFRESH.
   * - Updates only access token + access expiry
   * - Keeps existing refresh token + expiry (1 day from original login)
   */
  updateAccessToken(access: string, expiresInSeconds?: number) {
    if (!isBrowser()) return;

    const now = Date.now();
    const accessTtlMs =
      typeof expiresInSeconds === "number"
        ? expiresInSeconds * 1000
        : DEFAULT_ACCESS_TTL_MS;

    const accessExp = now + accessTtlMs;

    window.localStorage.setItem(ACCESS_TOKEN_KEY, access);
    window.localStorage.setItem(ACCESS_EXPIRES_AT_KEY, accessExp.toString());
  },

  // ---------- Clear ----------
  clear() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(ACCESS_EXPIRES_AT_KEY);
    window.localStorage.removeItem(REFRESH_EXPIRES_AT_KEY);
  },
};
