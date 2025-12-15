import { apiClientFetch } from "@/lib/apiClient";

/* ============================================================
   BASE URL NORMALIZATION
   - Removes trailing slashes in the env value
   - Allows values like:
        http://localhost:8005
        http://localhost:8005/api/v1
   ============================================================ */

const RAW_BASE =
  process.env.NEXT_PUBLIC_NOTIFICATION_API_BASE ||
  "https://aurora-glam.com/api/notifications";

const BASE = RAW_BASE.replace(/\/+$/, ""); // remove trailing slash

/* ============================================================
   MAIN WRAPPER
   - Ensures path always begins with "/"
   - Sends request via apiClientFetch
   ============================================================ */

export function notificationApiFetch(path: string, options: RequestInit = {}) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return apiClientFetch(BASE, cleanPath, options);
}
