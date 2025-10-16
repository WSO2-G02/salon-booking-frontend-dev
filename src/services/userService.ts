export const API_BASE = process.env.NEXT_PUBLIC_USER_API_BASE || 'http://localhost:8001'

/** ------------------ REGISTER ------------------ **/
export async function registerUser(data: {
  email: string
  username: string
  password: string
  full_name: string
  phone: string
}) {
  const res = await fetch(`${API_BASE}/api/v1/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error((await res.json()).detail || 'Registration failed')
  return await res.json()
}

/** ------------------ LOGIN ------------------ **/
export async function loginUser(data: { username: string; password: string }) {
  const res = await fetch(`${API_BASE}/api/v1/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error((await res.json()).detail || 'Invalid username or password')
  const result = await res.json()

  // ✅ Save token locally for protected endpoints
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', result.access_token)
  }

  return result
}

/** ------------------ GET USER PROFILE ------------------ **/
export async function getUserProfile() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  if (!token) throw new Error('User not logged in')

  const res = await fetch(`${API_BASE}/api/v1/profile`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error((await res.json()).detail || 'Failed to fetch profile')
  return await res.json()
}

/** ------------------ LOGOUT ------------------ **/
export function logoutUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
  }
}
