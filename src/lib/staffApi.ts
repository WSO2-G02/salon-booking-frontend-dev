import { apiClientFetch } from "@/lib/apiClient";

const BASE =
  process.env.NEXT_PUBLIC_STAFF_API_BASE ||
  "https://staff-service.azurewebsites.net/api/v1";

export function staffApiFetch(path: string, options: RequestInit = {}) {
  return apiClientFetch(BASE, path, options);
}
