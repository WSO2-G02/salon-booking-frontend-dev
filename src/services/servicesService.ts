/**
 * SERVICES MANAGEMENT API CLIENT (FIXED)
 */

import { Token } from "@/lib/auth";

const RAW_BASE =
  process.env.NEXT_PUBLIC_SERVICE_API_BASE ||
  "https://services-management.azurewebsites.net";

const API_BASE = RAW_BASE.replace(/\/+$/, ""); // trim trailing slash

// ---------------------- AUTH HEADERS ----------------------
function getAuthHeaders(): HeadersInit {
  const access = Token.getAccess();

  return {
    "Content-Type": "application/json",
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
  };
}

// ---------------------- RESPONSE HANDLER ----------------------
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || `HTTP ${response.status}`);
  }
  return response.json();
}

// ---------------------- API CALLS ----------------------
export async function getServices() {
  const res = await fetch(`${API_BASE}/api/v1/services`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getServiceById(id: number) {
  const res = await fetch(`${API_BASE}/api/v1/services/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/api/v1/categories`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function createService(data: any) {
  const res = await fetch(`${API_BASE}/api/v1/services`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateService(id: number, data: any) {
  const res = await fetch(`${API_BASE}/api/v1/services/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteService(id: number) {
  const res = await fetch(`${API_BASE}/api/v1/services/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}


// =====================================================
// CATEGORY FILTER ENDPOINT
// =====================================================

export async function getServicesByCategory(category: string): Promise<ServiceResponse[]> {
  const res = await fetch(
    `${API_BASE}/api/v1/services/category/${encodeURIComponent(category)}`,
    {
      method: "GET",
      headers: getUserHeaders(),
    }
  );
  return handleResponse<ServiceResponse[]>(res);
}

// =====================================================
// PRICE RANGE FILTER ENDPOINT
// =====================================================

export async function getServicesByPriceRange(min?: number, max?: number): Promise<ServiceResponse[]> {
  const params = new URLSearchParams();

  if (min !== undefined) params.append("min_price", String(min));
  if (max !== undefined) params.append("max_price", String(max));

  const res = await fetch(
    `${API_BASE}/api/v1/services/price-range?${params.toString()}`,
    {
      method: "GET",
      headers: getUserHeaders(),
    }
  );

  return handleResponse<ServiceResponse[]>(res);
}
