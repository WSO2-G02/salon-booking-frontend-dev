import { apiClientFetch } from "@/lib/apiClient";

/* ============================================================
   BASE URL NORMALIZATION
   - Removes trailing slashes
   - Supports both:
        http://localhost:8004
        http://localhost:8004/api/v1
   ============================================================ */

const RAW_BASE =
  process.env.NEXT_PUBLIC_APPOINTMENT_API_BASE ||
  "https://appointment-service-salon.azurewebsites.net/api/v1";

const BASE = RAW_BASE.replace(/\/+$/, ""); // remove trailing slash

/* ============================================================
   MAIN WRAPPER
   - Ensures cleanPath ALWAYS begins with "/"
   - Delegates request to apiClientFetch
   ============================================================ */

export function appointmentsApiFetch(path: string, options: RequestInit = {}) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return apiClientFetch(BASE, cleanPath, options);
}
