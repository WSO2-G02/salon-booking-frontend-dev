/**
 * ServicesManagementTab Component
 * 
 * Main container for the Services Management dashboard.
 * Fetches data from the Service Management Service (Port 8002) and provides:
 * - Service listing with category filtering
 * - Create, update, and deactivate services
 * - Price and duration management
 * 
 * API Endpoints Used (via servicesService):
 * - GET /api/v1/services - List all services
 * - POST /api/v1/services - Create service (Admin)
 * - GET /api/v1/services/{id} - Get service details
 * - PUT /api/v1/services/{id} - Update service (Admin)
 * - DELETE /api/v1/services/{id} - Deactivate service (Admin)
 * - GET /api/v1/categories - Get all categories
 * 
 * @component
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Scissors, Plus, AlertCircle, RefreshCw } from 'lucide-react'
import { showToast } from '@/components/Toast'

import {
  getServices,
  getCategories,
  createService,
  updateService,
  deleteService,
  getMockServicesData,
  getMockCategories,
  type ServiceResponse,
  type ServiceCreate,
  type ServiceUpdate,
} from '@/services/servicesService'

// Import subcomponents
import {
  ServicesFilters,
  ServicesList,
  ServiceModal,
} from './ServicesManagement'

// =====================================================
// TYPE DEFINITIONS
// =====================================================

interface Filters {
  category: string
  activeOnly: boolean
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function ServicesManagementTab() {
  // =====================================================
  // STATE MANAGEMENT
  // =====================================================
  
  /** Loading state while fetching data */
  const [loading, setLoading] = useState(true)
  
  /** Services list from API */
  const [servicesList, setServicesList] = useState<ServiceResponse[]>([])
  
  /** Available categories */
  const [categories, setCategories] = useState<string[]>([])
  
  /** Error message if data fetch fails */
  const [error, setError] = useState<string | null>(null)
  
  /** Filter state */
  const [filters, setFilters] = useState<Filters>({
    category: '',
    activeOnly: false,
  })
  
  /** Modal states */
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<ServiceResponse | null>(null)
  
  /** Submitting state for forms */
  const [submitting, setSubmitting] = useState(false)
  
  /** Using mock data flag */
  const [usingMockData, setUsingMockData] = useState(false)

  // =====================================================
  // DATA FETCHING
  // =====================================================
  
  /**
   * Load services data from API
   */
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [servicesData, categoriesData] = await Promise.all([
        getServices(filters.activeOnly, filters.category || undefined),
        getCategories(),
      ])
      setServicesList(servicesData)
      setCategories(categoriesData)
      setUsingMockData(false)
    } catch (err) {
      console.error('Failed to fetch services data:', err)
      // Fall back to mock data
      setServicesList(getMockServicesData())
      setCategories(getMockCategories())
      setUsingMockData(true)
      setError(err instanceof Error ? err.message : 'Failed to load services data')
    } finally {
      setLoading(false)
    }
  }, [filters])

  /**
   * Fetch services data on mount and when filters change
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
  }

  /**
   * Open modal to add new service
   */
  const handleAddNew = () => {
    setSelectedService(null)
    setIsModalOpen(true)
  }

  /**
   * Open modal to edit service
   */
  const handleEdit = (service: ServiceResponse) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  /**
   * Handle service creation/update
   */
  const handleSaveService = async (data: ServiceCreate | ServiceUpdate) => {
    setSubmitting(true)
    
    try {
      if (selectedService) {
        // Update existing service
        await updateService(selectedService.id, data as ServiceUpdate)
        showToast('Service updated successfully', 'success')
      } else {
        // Create new service
        await createService(data as ServiceCreate)
        showToast('Service created successfully', 'success')
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
   * Handle service deactivation
   */
  const handleDeactivate = async (serviceId: number) => {
    if (!confirm('Are you sure you want to deactivate this service?')) {
      return
    }
    
    try {
      await deleteService(serviceId)
      showToast('Service deactivated successfully', 'success')
      loadData() // Refresh the list
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to deactivate'
      showToast(message, 'error')
    }
  }

  // =====================================================
  // COMPUTED VALUES
  // =====================================================
  
  /** Calculate statistics */
  const stats = {
    total: servicesList.length,
    active: servicesList.filter(s => s.is_active).length,
    categories: new Set(servicesList.map(s => s.category).filter(Boolean)).size,
  }

  // =====================================================
  // LOADING STATE
  // =====================================================
  
  if (loading && servicesList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading services data...</p>
      </div>
    )
  }

  // =====================================================
  // ERROR STATE (with retry)
  // =====================================================
  
  if (error && !usingMockData && servicesList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center text-red-600">
          <AlertCircle size={48} className="mx-auto mb-3" />
          <p className="text-lg font-semibold">Error loading services data</p>
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
            <Scissors size={28} className="text-red-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Services Management</h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage salon services, pricing, and categories
              </p>
            </div>
          </div>
          
          {/* Add new service button */}
          <button
            onClick={handleAddNew}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            <Plus size={18} />
            <span>Add Service</span>
          </button>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-xs text-gray-500">Total Services</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-xs text-gray-500">Active Services</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.categories}</p>
            <p className="text-xs text-gray-500">Categories</p>
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
                Unable to connect to the Services Management Service. Displaying mock data for demonstration.
                {error && ` Error: ${error}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* FILTERS SECTION                                  */}
      {/* ================================================= */}
      <ServicesFilters 
        filters={filters} 
        categories={categories}
        onFilterChange={handleFilterChange}
        onRefresh={loadData}
        loading={loading}
      />

      {/* ================================================= */}
      {/* SERVICES LIST                                    */}
      {/* ================================================= */}
      <ServicesList
        services={servicesList}
        onEdit={handleEdit}
        onDeactivate={handleDeactivate}
        loading={loading}
      />

      {/* ================================================= */}
      {/* SERVICE CREATE/EDIT MODAL                        */}
      {/* ================================================= */}
      {isModalOpen && (
        <ServiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveService}
          service={selectedService}
          categories={categories}
          submitting={submitting}
        />
      )}
    </div>
  )
}
