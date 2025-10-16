export const API_BASE = process.env.NEXT_PUBLIC_APPOINTMENT_API_BASE || 'http://localhost:8004'

export async function bookAppointment(data: any) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  const res = await fetch(`${API_BASE}/api/v1/appointments/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json()).detail || 'Booking failed')
  return await res.json()
}

export async function getAvailableSlots(staffId: number, serviceId: number, date: string) {
  // 🕐 simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800))

  // 🎯 Mock slots — pretend backend checked availability
  const mockSlots = {
    "2025-10-12": ["09:00", "10:30", "13:00", "15:00", "17:30"],
    "2025-10-13": ["09:30", "11:00", "14:00", "16:30"],
    "2025-10-14": ["10:00", "11:30", "13:30", "15:30", "17:00"],
  }

  // ✨ return slots if date exists, else random ones
  const slots = mockSlots[date] || ["09:00", "10:30", "13:00", "15:30"]

  // 🔹 Return mock response like real API would
  return {
    date,
    available_slots: slots,
  }
}
