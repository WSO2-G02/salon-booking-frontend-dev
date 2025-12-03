import { apiClientFetch } from "@/lib/apiClient";

const BASE =
  process.env.NEXT_PUBLIC_ANALYTICS_API_BASE ||
  "https://analytics-report-service-salon.azurewebsites.net/api/v1";

export function analyticsApiFetch(path: string, options: RequestInit = {}) {
  return apiClientFetch(BASE, path, options);
}
