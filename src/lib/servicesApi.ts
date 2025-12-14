import { apiClientFetch } from "@/lib/apiClient";

/* ============================================================
   BASE URL NORMALIZATION
   - Removes trailing slashes
   - Works with env values like:
       http://localhost:8002
       http://localhost:8002/api/v1
   ============================================================ */

const RAW_BASE =
  process.env.NEXT_PUBLIC_SERVICES_API_BASE ||
  "https://services-management.azurewebsites.net/api/v1";

const BASE = RAW_BASE.replace(/\/+$/, ""); // remove trailing slash

/* ============================================================
   MAIN FETCH WRAPPER
   - Ensures path always begins with "/"
   - Calls apiClientFetch(BASE, path, options)
   ============================================================ */

export function servicesApiFetch(path: string, options: RequestInit = {}) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return apiClientFetch(BASE, cleanPath, options);
}
