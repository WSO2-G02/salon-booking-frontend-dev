import { apiClientFetch } from "@/lib/apiClient";

/* ============================================================
   BASE URL NORMALIZATION
   ============================================================ */

const RAW_BASE =
  process.env.NEXT_PUBLIC_USER_API_BASE ||
  "https://aurora-glam.com/api/users";

const BASE = RAW_BASE.replace(/\/+$/, ""); // remove trailing slash

/* ============================================================
   API FETCH WRAPPER
   - Ensures path always begins with "/"
   - Passes everything to apiClientFetch
   ============================================================ */

export function userApiFetch(path: string, options: RequestInit = {}) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return apiClientFetch(BASE, cleanPath, options);
}
