/**
 * CustomersManagementTab Component
 * 
 * Main container for the Customers/Users Management dashboard.
 * Fetches data from the User Service (Port 8001) and provides:
 * - Customer/User listing with pagination
 * - Create new users (admin function)
 * - View user details and status
 * 
 * API Endpoints Used (via customersService):
 * - GET /api/v1/users - List all users (Admin, paginated)
 * - POST /api/v1/users - Create user (Admin)
 * 
 * @component
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { User, Plus, AlertCircle, RefreshCw } from 'lucide-react'
import { showToast } from '@/components/Toast'

import {
  getUsers,
  createUser,
  getMockCustomersData,
  getMockPagination,
  type UserListResponse,
  type UserCreateRequest,
} from '@/services/customersService'

// Import subcomponents
import {
  CustomersFilters,
  CustomersTable,
  CustomerModal,
} from './CustomersManagement'

// =====================================================
// TYPE DEFINITIONS
// =====================================================

interface Filters {
  userType: string
  search: string
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function CustomersManagementTab() {
  // =====================================================
  // STATE MANAGEMENT
  // =====================================================
  
  /** Loading state while fetching data */
  const [loading, setLoading] = useState(true)
  
  /** Customers list from API */
  const [customersList, setCustomersList] = useState<UserListResponse[]>([])
  
  /** Pagination info */
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 1,
  })
  
  /** Error message if data fetch fails */
  const [error, setError] = useState<string | null>(null)
  
  /** Current page */
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  
  /** Filter state */
  const [filters, setFilters] = useState<Filters>({
    userType: '',
    search: '',
  })
  
  /** Modal states */
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  /** Submitting state for forms */
  const [submitting, setSubmitting] = useState(false)
  
  /** Using mock data flag */
  const [usingMockData, setUsingMockData] = useState(false)

  // =====================================================
  // DATA FETCHING
  // =====================================================
  
  /**
   * Load customers data from API
   */
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await getUsers(page, limit)
      setCustomersList(response.data)
      setPagination(response.pagination)
      setUsingMockData(false)
    } catch (err) {
      console.error('Failed to fetch customers data:', err)
      // Fall back to mock data
      setCustomersList(getMockCustomersData())
      setPagination(getMockPagination())
      setUsingMockData(true)
      setError(err instanceof Error ? err.message : 'Failed to load customers data')
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  /**
   * Fetch customers data on mount and when page changes
   */
  useEffect(() => {
    loadData()
  }, [loadData])

  // =====================================================
  // COMPUTED VALUES - Client-side filtering
  // =====================================================
  
  const filteredCustomers = customersList.filter((customer) => {
    // Filter by user type
    if (filters.userType && customer.user_type !== filters.userType) {
      return false
    }
    
    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesUsername = customer.username.toLowerCase().includes(searchLower)
      const matchesEmail = customer.email.toLowerCase().includes(searchLower)
      const matchesName = customer.full_name?.toLowerCase().includes(searchLower) || false
      if (!matchesUsername && !matchesEmail && !matchesName) {
        return false
      }
    }
    
    return true
  })

  // =====================================================
  // EVENT HANDLERS
  // =====================================================
  
  /**
   * Handle filter changes
   */
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters)
  }

  /**
   * Open modal to add new customer
   */
  const handleAddNew = () => {
    setIsModalOpen(true)
  }

  /**
   * Handle customer creation
   */
  const handleSaveCustomer = async (data: UserCreateRequest) => {
    setSubmitting(true)
    
    try {
      await createUser(data)
      showToast('User created successfully', 'success')
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
   * Handle page change
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  // =====================================================
  // COMPUTED VALUES
  // =====================================================
  
  /** Calculate statistics */
  const stats = {
    total: pagination.total || customersList.length,
    active: customersList.filter(c => c.is_active).length,
    admins: customersList.filter(c => c.user_type === 'admin').length,
    customers: customersList.filter(c => c.user_type === 'user').length,
  }

  // =====================================================
  // LOADING STATE
  // =====================================================
  
  if (loading && customersList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading customers data...</p>
      </div>
    )
  }

  // =====================================================
  // ERROR STATE (with retry)
  // =====================================================
  
  if (error && !usingMockData && customersList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center text-red-600">
          <AlertCircle size={48} className="mx-auto mb-3" />
          <p className="text-lg font-semibold">Error loading customers data</p>
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
            <User size={28} className="text-red-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Customers & Users</h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage customer accounts and user access
              </p>
            </div>
          </div>
          
          {/* Add new user button */}
          <button
            onClick={handleAddNew}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            <Plus size={18} />
            <span>Add User</span>
          </button>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-xs text-gray-500">Total Users</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.customers}</p>
            <p className="text-xs text-gray-500">Customers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
            <p className="text-xs text-gray-500">Admins</p>
          </div>
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
                Unable to connect to the User Service. Displaying mock data for demonstration.
                {error && ` Error: ${error}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* FILTERS SECTION                                  */}
      {/* ================================================= */}
      <CustomersFilters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        onRefresh={loadData}
        loading={loading}
      />

      {/* ================================================= */}
      {/* CUSTOMERS TABLE                                  */}
      {/* ================================================= */}
      <CustomersTable
        customers={filteredCustomers}
        page={page}
        pagination={pagination}
        onPageChange={handlePageChange}
        loading={loading}
      />

      {/* ================================================= */}
      {/* CUSTOMER CREATE MODAL                            */}
      {/* ================================================= */}
      {isModalOpen && (
        <CustomerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCustomer}
          submitting={submitting}
        />
      )}
    </div>
  )
}
