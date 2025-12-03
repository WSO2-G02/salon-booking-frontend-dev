/**
 * Customers Service API Client
 * 
 * Handles all API calls to the User Service (Port 8001) for customer management.
 * Provides operations for viewing and managing customer/user accounts.
 * 
 * API Endpoints Used:
 * - GET /api/v1/users - List all users (Admin, paginated)
 * - POST /api/v1/users - Create user (Admin)
 * - GET /api/v1/profile - Get current user profile
 * - PUT /api/v1/profile - Update profile
 * 
 * @module customersService
 */

const API_BASE = process.env.NEXT_PUBLIC_USER_API_BASE

// =====================================================
// TYPE DEFINITIONS - Matching Backend Pydantic Schemas
// =====================================================

/**
 * User type - either regular user or admin
 */
export type UserType = 'user' | 'admin'

/**
 * Request model for admin to create a new user
 */
export interface UserCreateRequest {
  username: string
  email: string
  password: string
  full_name?: string
  phone?: string
  user_type?: UserType
}

/**
 * Response model for user in list
 */
export interface UserListResponse {
  id: number
  username: string
  email: string
  full_name: string | null
  user_type: UserType
  is_active: boolean
  created_at: string
}

/**
 * Full user profile response
 */
export interface UserProfileResponse {
  id: number
  username: string
  email: string
  full_name: string | null
  phone: string | null
  user_type: UserType
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Paginated response from API
 */
export interface PaginatedResponse<T> {
  status: string
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}

/**
 * Standard success response
 */
export interface SuccessResponse {
  status: string
  data: {
    user: UserProfileResponse
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
// CUSTOMER/USER OPERATIONS
// =====================================================

/**
 * Get paginated list of all users (Admin only)
 * 
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @returns Paginated user list
 */
export async function getUsers(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<UserListResponse>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })
  
  const response = await fetch(`${API_BASE}/api/v1/users?${params}`, {
    method: 'GET',
    headers: getAdminHeaders(),
  })
  
  return handleResponse<PaginatedResponse<UserListResponse>>(response)
}

/**
 * Create a new user (Admin only)
 * 
 * @param userData - User creation data
 * @returns Created user
 */
export async function createUser(userData: UserCreateRequest): Promise<SuccessResponse> {
  const response = await fetch(`${API_BASE}/api/v1/users`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(userData),
  })
  
  return handleResponse<SuccessResponse>(response)
}

// =====================================================
// HEALTH CHECK
// =====================================================

/**
 * Check user service health
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
 * Generate mock customer data for development
 */
export function getMockCustomersData(): UserListResponse[] {
  return [
    {
      id: 1,
      username: 'john_doe',
      email: 'john.doe@example.com',
      full_name: 'John Doe',
      user_type: 'user',
      is_active: true,
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      username: 'jane_smith',
      email: 'jane.smith@example.com',
      full_name: 'Jane Smith',
      user_type: 'user',
      is_active: true,
      created_at: '2024-01-20T14:45:00Z',
    },
    {
      id: 3,
      username: 'admin_user',
      email: 'admin@aurorasalon.com',
      full_name: 'Admin User',
      user_type: 'admin',
      is_active: true,
      created_at: '2024-01-01T09:00:00Z',
    },
    {
      id: 4,
      username: 'sarah_wilson',
      email: 'sarah.wilson@example.com',
      full_name: 'Sarah Wilson',
      user_type: 'user',
      is_active: true,
      created_at: '2024-02-01T11:20:00Z',
    },
    {
      id: 5,
      username: 'mike_brown',
      email: 'mike.brown@example.com',
      full_name: 'Mike Brown',
      user_type: 'user',
      is_active: false,
      created_at: '2024-01-25T16:00:00Z',
    },
    {
      id: 6,
      username: 'emily_davis',
      email: 'emily.davis@example.com',
      full_name: 'Emily Davis',
      user_type: 'user',
      is_active: true,
      created_at: '2024-02-10T09:30:00Z',
    },
    {
      id: 7,
      username: 'alex_johnson',
      email: 'alex.johnson@example.com',
      full_name: 'Alex Johnson',
      user_type: 'user',
      is_active: true,
      created_at: '2024-02-15T13:15:00Z',
    },
    {
      id: 8,
      username: 'lisa_taylor',
      email: 'lisa.taylor@example.com',
      full_name: null,
      user_type: 'user',
      is_active: true,
      created_at: '2024-02-20T10:45:00Z',
    },
  ]
}

/**
 * Get mock pagination info
 */
export function getMockPagination() {
  return {
    total: 8,
    page: 1,
    limit: 10,
    total_pages: 1,
  }
}
