// src/services/appointmentService.ts

import { appointmentsApiFetch } from "@/lib/appointmentApi";

/**
 * Fetch available time slots for a given date, service and staff.
 * Example backend URL:
 * GET /appointments/available-slots?date=2025-01-01&service_id=3&staff_id=7
 */
export async function getAvailableSlots(
  date: string,
  serviceId: string,
  staffId: string
) {
  const query = new URLSearchParams({
    date,
    service_id: serviceId,
    staff_id: staffId,
  });

  const res = await appointmentsApiFetch(
    `/appointments/available-slots?${query.toString()}`,
    {
      method: "GET",
    }
  );

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.detail || "Failed to fetch available slots");
  }

  return res.json();
}

/**
 * Book a new appointment
 * Backend endpoint: POST /api/v1/appointments
 */
export async function bookAppointment(payload: any) {
  const res = await appointmentsApiFetch("/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.detail || "Booking failed");
  }

  return json;
}
