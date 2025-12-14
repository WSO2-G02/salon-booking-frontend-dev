/**
 * CUSTOMER SERVICE API CLIENT
 * Uses real backend API endpoints
 *
 * BASE URL comes from:
 * NEXT_PUBLIC_USER_API_BASE
 */

const RAW_BASE = process.env.NEXT_PUBLIC_USER_API_BASE || "";
export const API_BASE = RAW_BASE.replace(/\/+$/, ""); // remove trailing slash

// =====================================================
// TYPES
// =====================================================

export type UserType = "user" | "admin";

export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  user_type?: UserType;
}

export interface UserListResponse {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  user_type: UserType;
  is_active: boolean;
  created_at: string;
}

export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  user_type: UserType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  status: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface SuccessResponse {
  status: string;
  data: { user: UserProfileResponse } | null;
  message: string;
}

// =====================================================
// HELPERS
// =====================================================

function getAdminHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getUserHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: "Request failed",
    }));
    throw new Error(error.detail || error.message);
  }
  return response.json();
}

// =====================================================
// API CLIENT — REAL IMPLEMENTATION
// =====================================================

/**
 * Get paginated list of customers (admin only)
 */
export async function getUsers(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<UserListResponse>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const res = await fetch(`${API_BASE}/api/v1/users?${params}`, {
    method: "GET",
    headers: getAdminHeaders(),
  });

  return handleResponse(res);
}

/**
 * Create a new customer (admin only)
 */
export async function createUser(
  data: UserCreateRequest
): Promise<SuccessResponse> {
  const res = await fetch(`${API_BASE}/api/v1/users`, {
    method: "POST",
    headers: getAdminHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

/**
 * Get logged-in user's profile
 */
export async function getUserProfile(): Promise<UserProfileResponse> {
  const res = await fetch(`${API_BASE}/api/v1/profile`, {
    method: "GET",
    headers: getUserHeaders(),
  });

  return handleResponse(res);
}

/**
 * Update logged-in user's profile
 */
export async function updateUserProfile(
  data: Partial<UserProfileResponse>
): Promise<UserProfileResponse> {
  const res = await fetch(`${API_BASE}/api/v1/profile`, {
    method: "PUT",
    headers: getUserHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

/**
 * Health check
 */
export async function checkHealth(): Promise<any> {
  const res = await fetch(`${API_BASE}/api/v1/health`, {
    method: "GET",
  });

  return handleResponse(res);
}
