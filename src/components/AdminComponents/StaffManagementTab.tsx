/**
 * StaffManagementTab Component
 * 
 * Main container for the Staff Management dashboard.
 * Fetches data from the Staff Service (Port 8005) and provides:
 * - Staff listing with pagination and filters
 * - Create, update, and deactivate staff members
 * - Manage staff availability schedules
 * 
 * API Endpoints Used (via staffService):
 * - GET /api/v1/staff - List all staff (paginated)
 * - POST /api/v1/staff - Create staff member (Admin)
 * - GET /api/v1/staff/{id} - Get staff details
 * - PUT /api/v1/staff/{id} - Update staff member (Admin)
 * - DELETE /api/v1/staff/{id} - Deactivate staff (Admin)
 * - GET /api/v1/staff/{id}/availability - Get availability
 * - POST /api/v1/staff/{id}/availability - Create availability (Admin)
 * 
 * @component
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, Plus, AlertCircle, RefreshCw } from 'lucide-react'
import { showToast } from '@/components/Toast'

import {
  getStaffMembers,
  createStaff,
  updateStaff,
  deleteStaff,
  getMockStaffData,
  type StaffResponse,
  type StaffCreate,
  type StaffUpdate,
} from '@/services/staffService'

// Import subcomponents
import {
  StaffFilters,
  StaffTable,
  StaffModal,
  StaffAvailabilityModal,
} from './StaffManagement'

// =====================================================
// TYPE DEFINITIONS
// =====================================================

interface Filters {
  position: string
  activeOnly: boolean
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function StaffManagementTab() {
  // =====================================================
  // STATE MANAGEMENT
  // =====================================================
  
  /** Loading state while fetching data */
  const [loading, setLoading] = useState(true)
  
  /** Staff list from API */
  const [staffList, setStaffList] = useState<StaffResponse[]>([])
  
  /** Error message if data fetch fails */
  const [error, setError] = useState<string | null>(null)
  
  /** Current pagination state */
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  
  /** Filter state */
  const [filters, setFilters] = useState<Filters>({
    position: '',
    activeOnly: true,
  })
  
  /** Modal states */
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffResponse | null>(null)
  
  /** Submitting state for forms */
  const [submitting, setSubmitting] = useState(false)
  
  /** Using mock data flag */
  const [usingMockData, setUsingMockData] = useState(false)

  // =====================================================
  // DATA FETCHING
  // =====================================================
  
  /**
   * Load staff data from API
   */
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await getStaffMembers(
        page,
        limit,
        filters.activeOnly,
        filters.position || undefined
      )
      setStaffList(data)
      setUsingMockData(false)
    } catch (err) {
      console.error('Failed to fetch staff data:', err)
      // Fall back to mock data
      setStaffList(getMockStaffData())
      setUsingMockData(true)
      setError(err instanceof Error ? err.message : 'Failed to load staff data')
    } finally {
      setLoading(false)
    }
  }, [page, limit, filters])

  /**
   * Fetch staff data on mount and when filters/pagination change
   */
  useEffect(() => {
    loadData()
  }, [loadData])

  // =====================================================
  // EVENT HANDLERS
  // =====================================================
  
  /**
   * Handle filter changes
   */
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
  }

  /**
   * Open modal to add new staff
   */
  const handleAddNew = () => {
    setSelectedStaff(null)
    setIsModalOpen(true)
  }

  /**
   * Open modal to edit staff
   */
  const handleEdit = (staff: StaffResponse) => {
    setSelectedStaff(staff)
    setIsModalOpen(true)
  }

  /**
   * Open availability modal
   */
  const handleManageAvailability = (staff: StaffResponse) => {
    setSelectedStaff(staff)
    setIsAvailabilityModalOpen(true)
  }

  /**
   * Handle staff creation/update
   */
  const handleSaveStaff = async (data: StaffCreate | StaffUpdate) => {
    setSubmitting(true)
    
    try {
      if (selectedStaff) {
        // Update existing staff
        await updateStaff(selectedStaff.id, data as StaffUpdate)
        showToast('Staff member updated successfully', 'success')
      } else {
        // Create new staff
        await createStaff(data as StaffCreate)
        showToast('Staff member created successfully', 'success')
      }
      
      setIsModalOpen(false)
      loadData() // Refresh the list
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Operation failed'
      showToast(message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Handle staff deactivation
   */
  const handleDeactivate = async (staffId: number) => {
    if (!confirm('Are you sure you want to deactivate this staff member?')) {
      return
    }
    
    try {
      await deleteStaff(staffId)
      showToast('Staff member deactivated successfully', 'success')
      loadData() // Refresh the list
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to deactivate'
      showToast(message, 'error')
    }
  }

  /**
   * Handle page change
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  // =====================================================
  // LOADING STATE
  // =====================================================
  
  if (loading && staffList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading staff data...</p>
      </div>
    )
  }

  // =====================================================
  // ERROR STATE (with retry)
  // =====================================================
  
  if (error && !usingMockData && staffList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center text-red-600">
          <AlertCircle size={48} className="mx-auto mb-3" />
          <p className="text-lg font-semibold">Error loading staff data</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 inline-flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Retry</span>
          </button>
        </div>
      </div>
    )
  }

  // =====================================================
  // RENDER DASHBOARD
  // =====================================================
  
  return (
    <div className="space-y-6">
      {/* ================================================= */}
      {/* HEADER SECTION                                   */}
      {/* ================================================= */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Title with icon */}
          <div className="flex items-center space-x-3">
            <Users size={28} className="text-red-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage salon staff members, positions, and availability
              </p>
            </div>
          </div>
          
          {/* Add new staff button */}
          <button
            onClick={handleAddNew}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            <Plus size={18} />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* MOCK DATA NOTICE                                 */}
      {/* ================================================= */}
      {usingMockData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Using Demo Data</p>
              <p className="text-sm text-yellow-700">
                Unable to connect to the Staff Service. Displaying mock data for demonstration.
                {error && ` Error: ${error}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* FILTERS SECTION                                  */}
      {/* ================================================= */}
      <StaffFilters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        onRefresh={loadData}
        loading={loading}
      />

      {/* ================================================= */}
      {/* STAFF TABLE                                      */}
      {/* ================================================= */}
      <StaffTable
        staffList={staffList}
        onEdit={handleEdit}
        onDeactivate={handleDeactivate}
        onManageAvailability={handleManageAvailability}
        page={page}
        limit={limit}
        onPageChange={handlePageChange}
        loading={loading}
      />

      {/* ================================================= */}
      {/* STAFF CREATE/EDIT MODAL                          */}
      {/* ================================================= */}
      {isModalOpen && (
        <StaffModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStaff}
          staff={selectedStaff}
          submitting={submitting}
        />
      )}

      {/* ================================================= */}
      {/* AVAILABILITY MODAL                               */}
      {/* ================================================= */}
      {isAvailabilityModalOpen && selectedStaff && (
        <StaffAvailabilityModal
          isOpen={isAvailabilityModalOpen}
          onClose={() => setIsAvailabilityModalOpen(false)}
          staff={selectedStaff}
        />
      )}
    </div>
  )
}
