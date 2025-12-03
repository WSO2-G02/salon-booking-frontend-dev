import { apiClientFetch } from "@/lib/apiClient";

const BASE =
  process.env.NEXT_PUBLIC_SERVICES_API_BASE ||
  "https://services-management.azurewebsites.net/api/v1";

export function servicesApiFetch(path: string, options: RequestInit = {}) {
  return apiClientFetch(BASE, path, options);
}
