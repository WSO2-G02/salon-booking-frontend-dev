import { apiClientFetch } from "@/lib/apiClient";

const BASE =
  process.env.NEXT_PUBLIC_NOTIFICATION_API_BASE ||
  "https://notification-service-salon.azurewebsites.net/api/v1";

export function notificationApiFetch(path: string, options: RequestInit = {}) {
  return apiClientFetch(BASE, path, options);
}
