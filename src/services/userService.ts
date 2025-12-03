export const API_BASE = process.env.NEXT_PUBLIC_USER_API_BASE

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

  // Save token locally for protected endpoints
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
    localStorage.removeItem('refresh_token')
  }
}

/** ------------------ UPDATE PROFILE ------------------ **/
export async function updateUserProfile(data: {
  full_name?: string
  phone?: string
  email?: string
}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  if (!token) throw new Error('User not logged in')

  const res = await fetch(`${API_BASE}/api/v1/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error((await res.json()).detail || 'Failed to update profile')
  return await res.json()
}

/** ------------------ CHANGE PASSWORD ------------------ **/
export async function changePassword(data: {
  current_password: string
  new_password: string
}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  if (!token) throw new Error('User not logged in')

  const res = await fetch(`${API_BASE}/api/v1/profile/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error((await res.json()).detail || 'Failed to change password')
  return await res.json()
}

/** ------------------ REFRESH TOKEN ------------------ **/
export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(`${API_BASE}/api/v1/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  if (!res.ok) throw new Error((await res.json()).detail || 'Token refresh failed')
  const result = await res.json()

  // Update stored token
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', result.access_token)
  }

  return result
}
