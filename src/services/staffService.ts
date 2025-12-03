/**
 * Staff Service API Client
 * 
 * Handles all API calls to the Staff Management Service.
 * Provides CRUD operations for staff members and availability management.
 * 
 * API Endpoints Used:
 * - GET /api/v1/staff - List all staff (paginated)
 * - POST /api/v1/staff - Create staff member (Admin)
 * - GET /api/v1/staff/{id} - Get staff details
 * - PUT /api/v1/staff/{id} - Update staff member (Admin)
 * - DELETE /api/v1/staff/{id} - Deactivate staff (Admin)
 * - GET /api/v1/staff/{id}/availability - Get availability slots
 * - POST /api/v1/staff/{id}/availability - Create availability (Admin)
 * - GET /api/v1/staff/specialty/{specialty} - Filter by specialty
 * 
 * @module staffService
 */

const API_BASE = process.env.NEXT_PUBLIC_STAFF_API_BASE

// =====================================================
// TYPE DEFINITIONS - Matching Backend Pydantic Schemas
// =====================================================

/**
 * Request model for creating a new staff member
 */
export interface StaffCreate {
  user_id: number
  employee_id: string
  position: string
  specialties?: string
  experience_years?: number
  hire_date?: string
}

/**
 * Request model for updating a staff member
 */
export interface StaffUpdate {
  position?: string
  specialties?: string
  experience_years?: number
  hire_date?: string
  is_active?: boolean
}

/**
 * Response model for staff member
 */
export interface StaffResponse {
  id: number
  user_id: number
  employee_id: string
  position: string
  specialties: string | null
  experience_years: number | null
  hire_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Request model for creating availability slot
 */
export interface AvailabilityCreate {
  staff_id: number
  slot_date: string
  start_time: string
  end_time: string
  availability_type: 'work' | 'break' | 'unavailable'
}

/**
 * Response model for availability slot
 */
export interface AvailabilityResponse {
  id: number
  staff_id: number
  slot_date: string
  start_time: string
  end_time: string
  availability_type: string
}

/**
 * Time slot for available booking times
 */
export interface TimeSlot {
  start_time: string
  end_time: string
  duration_minutes: number
}

/**
 * Response with calculated available time slots
 */
export interface StaffAvailabilityResponse {
  staff_id: number
  slot_date: string
  available_slots: TimeSlot[]
  total_available_minutes: number
}

/**
 * Standard success response from API
 */
export interface SuccessResponse {
  status: string
  data: {
    staff: StaffResponse
  } | null
  message: string
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  total_pages: number
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
// STAFF CRUD OPERATIONS
// =====================================================

/**
 * Get list of all staff members (paginated)
 * 
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param activeOnly - Filter active staff only (default: true)
 * @param position - Filter by position (optional)
 * @returns Array of staff members
 */
export async function getStaffMembers(
  page: number = 1,
  limit: number = 10,
  activeOnly: boolean = true,
  position?: string
): Promise<StaffResponse[]> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    active_only: activeOnly.toString(),
  })
  
  if (position) {
    params.append('position', position)
  }
  
  const response = await fetch(`${API_BASE}/api/v1/staff?${params}`, {
    method: 'GET',
    headers: getAdminHeaders(),
  })
  
  return handleResponse<StaffResponse[]>(response)
}

/**
 * Get a specific staff member by ID
 * 
 * @param staffId - Staff member ID
 * @returns Staff member details
 */
export async function getStaffById(staffId: number): Promise<StaffResponse> {
  const response = await fetch(`${API_BASE}/api/v1/staff/${staffId}`, {
    method: 'GET',
    headers: getAdminHeaders(),
  })
  
  return handleResponse<StaffResponse>(response)
}

/**
 * Create a new staff member (Admin only)
 * 
 * @param staffData - Staff creation data
 * @returns Created staff member
 */
export async function createStaff(staffData: StaffCreate): Promise<SuccessResponse> {
  const response = await fetch(`${API_BASE}/api/v1/staff`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(staffData),
  })
  
  return handleResponse<SuccessResponse>(response)
}

/**
 * Update a staff member (Admin only)
 * 
 * @param staffId - Staff member ID
 * @param updateData - Update data
 * @returns Updated staff member
 */
export async function updateStaff(
  staffId: number,
  updateData: StaffUpdate
): Promise<StaffResponse> {
  const response = await fetch(`${API_BASE}/api/v1/staff/${staffId}`, {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify(updateData),
  })
  
  return handleResponse<StaffResponse>(response)
}

/**
 * Deactivate a staff member (soft delete) (Admin only)
 * 
 * @param staffId - Staff member ID
 */
export async function deleteStaff(staffId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/v1/staff/${staffId}`, {
    method: 'DELETE',
    headers: getAdminHeaders(),
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Delete failed' }))
    throw new Error(error.detail || 'Failed to deactivate staff member')
  }
}

// =====================================================
// AVAILABILITY OPERATIONS
// =====================================================

/**
 * Get available time slots for a staff member on a specific date
 * 
 * @param staffId - Staff member ID
 * @param slotDate - Date in YYYY-MM-DD format
 * @param serviceDuration - Service duration in minutes (default: 60)
 * @returns Available time slots
 */
export async function getStaffAvailability(
  staffId: number,
  slotDate: string,
  serviceDuration: number = 60
): Promise<StaffAvailabilityResponse> {
  const params = new URLSearchParams({
    slot_date: slotDate,
    service_duration: serviceDuration.toString(),
  })
  
  const response = await fetch(
    `${API_BASE}/api/v1/staff/${staffId}/availability?${params}`,
    {
      method: 'GET',
      headers: getAdminHeaders(),
    }
  )
  
  return handleResponse<StaffAvailabilityResponse>(response)
}

/**
 * Create an availability slot for a staff member (Admin only)
 * 
 * @param staffId - Staff member ID
 * @param availability - Availability data
 * @returns Created availability slot
 */
export async function createAvailability(
  staffId: number,
  availability: Omit<AvailabilityCreate, 'staff_id'>
): Promise<AvailabilityResponse> {
  const response = await fetch(`${API_BASE}/api/v1/staff/${staffId}/availability`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify({ ...availability, staff_id: staffId }),
  })
  
  return handleResponse<AvailabilityResponse>(response)
}

// =====================================================
// SEARCH/FILTER OPERATIONS
// =====================================================

/**
 * Get staff members by specialty
 * 
 * @param specialty - Specialty to search for
 * @returns Array of staff members with matching specialty
 */
export async function getStaffBySpecialty(specialty: string): Promise<StaffResponse[]> {
  const response = await fetch(
    `${API_BASE}/api/v1/staff/specialty/${encodeURIComponent(specialty)}`,
    {
      method: 'GET',
      headers: getAdminHeaders(),
    }
  )
  
  return handleResponse<StaffResponse[]>(response)
}

// =====================================================
// HEALTH CHECK
// =====================================================

/**
 * Check staff service health
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
 * Generate mock staff data for development
 */
export function getMockStaffData(): StaffResponse[] {
  return [
    {
      id: 1,
      user_id: 10,
      employee_id: 'EMP001',
      position: 'Senior Stylist',
      specialties: 'Hair Coloring, Cutting, Styling',
      experience_years: 8,
      hire_date: '2016-03-15',
      is_active: true,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-15T14:30:00Z',
    },
    {
      id: 2,
      user_id: 11,
      employee_id: 'EMP002',
      position: 'Nail Technician',
      specialties: 'Manicure, Pedicure, Nail Art',
      experience_years: 5,
      hire_date: '2019-06-01',
      is_active: true,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-15T14:30:00Z',
    },
    {
      id: 3,
      user_id: 12,
      employee_id: 'EMP003',
      position: 'Massage Therapist',
      specialties: 'Swedish, Deep Tissue, Hot Stone',
      experience_years: 10,
      hire_date: '2014-09-20',
      is_active: true,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-15T14:30:00Z',
    },
    {
      id: 4,
      user_id: 13,
      employee_id: 'EMP004',
      position: 'Junior Stylist',
      specialties: 'Cutting, Blow Dry',
      experience_years: 2,
      hire_date: '2022-01-10',
      is_active: true,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-15T14:30:00Z',
    },
    {
      id: 5,
      user_id: 14,
      employee_id: 'EMP005',
      position: 'Makeup Artist',
      specialties: 'Bridal, Editorial, SFX',
      experience_years: 6,
      hire_date: '2018-04-05',
      is_active: false,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-15T14:30:00Z',
    },
  ]
}
