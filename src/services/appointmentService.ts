export const API_BASE = process.env.NEXT_PUBLIC_APPOINTMENT_API_BASE

interface BookAppointmentData {
  staff_id?: number
  user_id?: number
  appointment_date: string
  service_id: number
  appointment_datetime: string
  customer_notes: string
}

export async function bookAppointment(data: BookAppointmentData) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  console.log(data)
  const res = await fetch(`${API_BASE}/api/v1/appointments`, {
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
  // simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock slots — pretend backend checked availability
  const mockSlots: { [key: string]: string[] } = {
    "2025-10-12": ["09:00", "10:30", "13:00", "15:00", "17:30"],
    "2025-10-13": ["09:30", "11:00", "14:00", "16:30"],
    "2025-10-14": ["10:00", "11:30", "13:30", "15:30", "17:00"],
  }

  // return slots if date exists, else random ones
  const slots = mockSlots[date] || ["09:00", "10:30", "13:00", "15:30"]

  // Return mock response like real API would
  return {
    date,
    available_slots: slots,
  }
}

export async function getUserAppointments(userId: number) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  const res = await fetch(`${API_BASE}/api/v1/users/${userId}/appointments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  })
  if (!res.ok) throw new Error((await res.json()).detail || 'Failed to fetch appointments')
  return await res.json()
}

export async function getAllAppointments() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  const res = await fetch(`${API_BASE}/api/v1/appointments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  })
  if (!res.ok) throw new Error((await res.json()).detail || 'Failed to fetch appointments')
  return await res.json()
}


export async function updateAppointment(appointmentId: number, data: Partial<BookAppointmentData>) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  const res = await fetch(`${API_BASE}/api/v1/appointments/${appointmentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json()).detail || 'Failed to update appointment')
  return await res.json()
}

// delete appointment
export async function deleteAppointment(appointmentId: number) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  const res = await fetch(`${API_BASE}/api/v1/appointments/${appointmentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  })
  if (!res.ok) throw new Error((await res.json()).detail || 'Failed to delete appointment')
  return true
}
