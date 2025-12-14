/**
 * Services Service API Client
 * Handles all API calls to the Service Management Service (Port 8002).
 */

const API_BASE = process.env.NEXT_PUBLIC_SERVICE_API_BASE?.replace(/\/+$/, "") || "";

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface ServiceCreate {
  name: string;
  description?: string;
  category?: string;
  price: number;
  duration_minutes: number;
}

export interface ServiceUpdate {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  duration_minutes?: number;
  is_active?: boolean;
}

export interface ServiceResponse {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SuccessResponse {
  status: string;
  data: { service: ServiceResponse } | null;
  message: string;
}

// =====================================================
// HEADER HELPERS
// =====================================================

function getAdminHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getPublicHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
  };
}

// =====================================================
// RESPONSE HANDLER
// =====================================================

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || error.message || `HTTP error ${response.status}`);
  }
  return response.json();
}

// =====================================================
// PUBLIC ENDPOINT (NO TOKEN REQUIRED)
// =====================================================

/**
 * Public list of services (unauthenticated users)
 */
export async function getPublicServices(): Promise<ServiceResponse[]> {
  const res = await fetch(`${API_BASE}/api/v1/servicespub`, {
    method: "GET",
    headers: getPublicHeaders(),
  });

  return handleResponse<ServiceResponse[]>(res);
}

// =====================================================
// SERVICE CRUD (ADMIN)
// =====================================================

export async function getServices(
  activeOnly: boolean = false,
  category?: string
): Promise<ServiceResponse[]> {
  const params = new URLSearchParams({ active_only: activeOnly.toString() });

  if (category) params.append("category", category);

  const res = await fetch(`${API_BASE}/api/v1/services?${params}`, {
    method: "GET",
    headers: getAdminHeaders(),
  });

  return handleResponse(res);
}

export async function getServiceById(id: number): Promise<ServiceResponse> {
  const res = await fetch(`${API_BASE}/api/v1/services/${id}`, {
    method: "GET",
    headers: getAdminHeaders(),
  });

  return handleResponse(res);
}

export async function createService(data: ServiceCreate): Promise<SuccessResponse> {
  const res = await fetch(`${API_BASE}/api/v1/services`, {
    method: "POST",
    headers: getAdminHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function updateService(id: number, data: ServiceUpdate) {
  const res = await fetch(`${API_BASE}/api/v1/services/${id}`, {
    method: "PUT",
    headers: getAdminHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function deleteService(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/v1/services/${id}`, {
    method: "DELETE",
    headers: getAdminHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Delete failed" }));
    throw new Error(error.detail || "Failed to deactivate service");
  }
}

/**
 * Get all service categories
 *
 * @returns Array of category names
 */
export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/api/v1/categories`, {
    method: 'GET',
    headers: getAdminHeaders(),
  });

  return handleResponse<string[]>(response);
}


// =====================================================
// FILTERING & SEARCH
// =====================================================

export async function getServicesByCategory(category: string): Promise<ServiceResponse[]> {
  const res = await fetch(
    `${API_BASE}/api/v1/services/category/${encodeURIComponent(category)}`,
    {
      method: "GET",
      headers: getAdminHeaders(),
    }
  );

  return handleResponse(res);
}

export async function getServicesByPriceRange(min?: number, max?: number) {
  const params = new URLSearchParams();

  if (min !== undefined) params.append("min_price", String(min));
  if (max !== undefined) params.append("max_price", String(max));

  const res = await fetch(`${API_BASE}/api/v1/services/price-range?${params}`, {
    method: "GET",
    headers: getAdminHeaders(),
  });

  return handleResponse(res);
}

// =====================================================
// HEALTH CHECK
// =====================================================

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/api/v1/health`, { method: "GET" });
  return handleResponse(res);
}

