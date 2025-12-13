import { apiClientFetch } from "@/lib/apiClient";

// Normalize BASE so it NEVER ends with a trailing slash
const RAW_BASE =
  process.env.NEXT_PUBLIC_ANALYTICS_API_BASE ||
  "https://analytics-report-service-salon.azurewebsites.net/api/v1";

const BASE = RAW_BASE.replace(/\/+$/, ""); // remove trailing slashes

export function analyticsApiFetch(path: string, options: RequestInit = {}) {
  // Ensure path always starts with a single slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return apiClientFetch(BASE, cleanPath, options);
}
