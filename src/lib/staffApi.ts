import { apiClientFetch } from "@/lib/apiClient";

/* ============================================================
   BASE URL NORMALIZATION
   ============================================================ */

const RAW_BASE =
  process.env.NEXT_PUBLIC_STAFF_API_BASE ||
  "https://aurora-glam.com/api/staff";

const BASE = RAW_BASE.replace(/\/+$/, ""); // remove trailing slash

/* ============================================================
   API FETCH WRAPPER
   - Ensures path always starts with "/"
   - Delegates request to apiClientFetch
   ============================================================ */

export function staffApiFetch(path: string, options: RequestInit = {}) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return apiClientFetch(BASE, cleanPath, options);
}
