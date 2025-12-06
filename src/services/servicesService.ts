/**
 * Services Service API Client
 * 
 * Handles all API calls to the Service Management Service (Port 8002).
 * Provides CRUD operations for salon services.
 * 
 * API Endpoints Used:
 * - GET /api/v1/services - List all services
 * - POST /api/v1/services - Create service (Admin)
 * - GET /api/v1/services/{id} - Get service details
 * - PUT /api/v1/services/{id} - Update service (Admin)
 * - DELETE /api/v1/services/{id} - Deactivate service (Admin)
 * - GET /api/v1/services/category/{category} - Filter by category
 * - GET /api/v1/services/price-range - Filter by price range
 * - GET /api/v1/categories - Get all categories
 * 
 * @module servicesService
 */

const API_BASE = process.env.NEXT_PUBLIC_SERVICES_API_BASE || "https://services-management.azurewebsites.net";

// =====================================================
// TYPE DEFINITIONS - Matching Backend Pydantic Schemas
// =====================================================

/**
 * Request model for creating a new service
 */
export interface ServiceCreate {
  name: string
  description?: string
  category?: string
  price: number
  duration_minutes: number
}

/**
 * Request model for updating a service
 */
export interface ServiceUpdate {
  name?: string
  description?: string
  category?: string
  price?: number
  duration_minutes?: number
  is_active?: boolean
}

/**
 * Response model for service
 */
export interface ServiceResponse {
  id: number
  name: string
  description: string | null
  category: string | null
  price: number
  duration_minutes: number
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Standard success response from API
 */
export interface SuccessResponse {
  status: string
  data: {
    service: ServiceResponse
  } | null
  message: string
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get admin auth headers
 */
function getAdminHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

/**
 * Handle API response errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(error.detail || error.message || `HTTP error ${response.status}`)
  }
  return response.json()
}

// =====================================================
// SERVICE CRUD OPERATIONS
// =====================================================

/**
 * Get list of all services
 * 
 * @param activeOnly - Filter active services only (default: false)
 * @param category - Filter by category (optional)
 * @returns Array of services
 */
export async function getServices(
  activeOnly: boolean = false,
  category?: string
): Promise<ServiceResponse[]> {
  const params = new URLSearchParams({
    active_only: activeOnly.toString(),
  })
  
  if (category) {
    params.append('category', category)
  }
  
  const response = await fetch(`${API_BASE}/api/v1/services?${params}`, {
    method: 'GET',
    headers: getAdminHeaders(),
  })
  
  return handleResponse<ServiceResponse[]>(response)
}

/**
 * Get a specific service by ID
 * 
 * @param serviceId - Service ID
 * @returns Service details
 */
export async function getServiceById(serviceId: number): Promise<ServiceResponse> {
  const response = await fetch(`${API_BASE}/api/v1/services/${serviceId}`, {
    method: 'GET',
    headers: getAdminHeaders(),
  })
  
  return handleResponse<ServiceResponse>(response)
}

/**
 * Create a new service (Admin only)
 * 
 * @param serviceData - Service creation data
 * @returns Created service
 */
export async function createService(serviceData: ServiceCreate): Promise<SuccessResponse> {
  const response = await fetch(`${API_BASE}/api/v1/services`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(serviceData),
  })
  
  return handleResponse<SuccessResponse>(response)
}

/**
 * Update a service (Admin only)
 * 
 * @param serviceId - Service ID
 * @param updateData - Update data
 * @returns Updated service
 */
export async function updateService(
  serviceId: number,
  updateData: ServiceUpdate
): Promise<ServiceResponse> {
  const response = await fetch(`${API_BASE}/api/v1/services/${serviceId}`, {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify(updateData),
  })
  
  return handleResponse<ServiceResponse>(response)
}

/**
 * Deactivate a service (soft delete) (Admin only)
 * 
 * @param serviceId - Service ID
 */
export async function deleteService(serviceId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/v1/services/${serviceId}`, {
    method: 'DELETE',
    headers: getAdminHeaders(),
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Delete failed' }))
    throw new Error(error.detail || 'Failed to deactivate service')
  }
}

// =====================================================
// FILTER/SEARCH OPERATIONS
// =====================================================

/**
 * Get services by category
 * 
 * @param category - Category name
 * @returns Array of services in category
 */
export async function getServicesByCategory(category: string): Promise<ServiceResponse[]> {
  const response = await fetch(
    `${API_BASE}/api/v1/services/category/${encodeURIComponent(category)}`,
    {
      method: 'GET',
      headers: getAdminHeaders(),
    }
  )
  
  return handleResponse<ServiceResponse[]>(response)
}

/**
 * Get services by price range
 * 
 * @param minPrice - Minimum price (optional)
 * @param maxPrice - Maximum price (optional)
 * @returns Array of services in price range
 */
export async function getServicesByPriceRange(
  minPrice?: number,
  maxPrice?: number
): Promise<ServiceResponse[]> {
  const params = new URLSearchParams()
  
  if (minPrice !== undefined) {
    params.append('min_price', minPrice.toString())
  }
  if (maxPrice !== undefined) {
    params.append('max_price', maxPrice.toString())
  }
  
  const response = await fetch(`${API_BASE}/api/v1/services/price-range?${params}`, {
    method: 'GET',
    headers: getAdminHeaders(),
  })
  
  return handleResponse<ServiceResponse[]>(response)
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
  })
  
  return handleResponse<string[]>(response)
}

// =====================================================
// HEALTH CHECK
// =====================================================

/**
 * Check service health
 * 
 * @returns Health status
 */
export async function checkHealth(): Promise<{
  status: string
  service: string
  database: string
}> {
  const response = await fetch(`${API_BASE}/api/v1/health`, {
    method: 'GET',
  })
  
  return handleResponse(response)
}

// =====================================================
// MOCK DATA FOR DEVELOPMENT
// =====================================================

/**
 * Generate mock service data for development
 */
export function getMockServicesData(): ServiceResponse[] {
  return [
    {
      id: 1,
      name: 'Haircut - Men',
      description: 'Professional haircut for men including wash and styling',
      category: 'Hair',
      price: 1500,
      duration_minutes: 30,
      is_active: true,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-15T14:30:00Z',
    },
    {
      id: 2,
      name: 'Haircut - Women',
      description: 'Professional haircut for women including wash and blow dry',
      category: 'Hair',
      price: 2500,
      duration_minutes: 60,
      is_active: true,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-15T14:30:00Z',
    },
    {
      id: 3,
      name: 'Hair Coloring',
      description: 'Full hair coloring with premium products',
      category: 'Hair',
      price: 5000,
      duration_minutes: 120,
      is_active: true,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-15T14:30:00Z',
    },
    {
      id: 4,
      name: 'Manicure',
      description: 'Classic manicure with nail shaping and polish',
      category: 'Nails',
      price: 1200,
      duration_minutes: 45,
      is_active: true,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-15T14:30:00Z',
    },
    {
      id: 5,
      name: 'Pedicure',
      description: 'Relaxing pedicure with foot massage',
      category: 'Nails',
      price: 1800,
      duration_minutes: 60,
      is_active: true,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-15T14:30:00Z',
    },
    {
      id: 6,
      name: 'Swedish Massage',
      description: 'Full body relaxation massage',
      category: 'Spa',
      price: 4500,
      duration_minutes: 60,
      is_active: true,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-15T14:30:00Z',
    },
    {
      id: 7,
      name: 'Facial Treatment',
      description: 'Deep cleansing facial with hydration',
      category: 'Skin Care',
      price: 3500,
      duration_minutes: 75,
      is_active: true,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-15T14:30:00Z',
    },
    {
      id: 8,
      name: 'Bridal Makeup',
      description: 'Complete bridal makeup with trial',
      category: 'Makeup',
      price: 15000,
      duration_minutes: 180,
      is_active: false,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-15T14:30:00Z',
    },
  ]
}

/**
 * Get mock categories
 */
export function getMockCategories(): string[] {
  return ['Hair', 'Nails', 'Spa', 'Skin Care', 'Makeup']
}
