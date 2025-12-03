import { apiClientFetch } from "@/lib/apiClient";

const BASE =
  process.env.NEXT_PUBLIC_USER_API_BASE ||
  "https://user-service-salon.azurewebsites.net/api/v1";

export function userApiFetch(path: string, options: RequestInit = {}) {
  return apiClientFetch(BASE, path, options);
}
