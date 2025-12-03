import { apiClientFetch } from "@/lib/apiClient";

const BASE =
  process.env.NEXT_PUBLIC_APPOINTMENT_API_BASE ||
  "https://appointment-service-salon.azurewebsites.net/api/v1";

export function appointmentsApiFetch(path: string, options: RequestInit = {}) {
  return apiClientFetch(BASE, path, options);
}
