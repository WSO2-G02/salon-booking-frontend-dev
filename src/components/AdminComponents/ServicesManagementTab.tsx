'use client';

import { useState, useEffect, useCallback } from 'react';
import { Scissors, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { showToast } from '@/components/Toast';

import {
  getServices,
  getCategories,
  createService,
  updateService,
  deleteService,
  getServicesByCategory,
  type ServiceResponse,
  type ServiceCreate,
  type ServiceUpdate,
} from '@/services/servicesService';

// Subcomponents
import {
  ServicesFilters,
  ServicesList,
  ServiceModal,
} from './ServicesManagement';

// --------------------------------------------------------
// TYPES
// --------------------------------------------------------

interface Filters {
  category: string;
  activeOnly: boolean;
}

// --------------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------------

export default function ServicesManagementTab() {
  const [loading, setLoading] = useState(true);
  const [servicesList, setServicesList] = useState<ServiceResponse[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    category: '',
    activeOnly: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<ServiceResponse | null>(null);

  const [submitting, setSubmitting] = useState(false);

  // --------------------------------------------------------
  // LOAD DATA (REAL API ONLY)
  // --------------------------------------------------------

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let servicesData;

      if (filters.category) {
        servicesData = await getServicesByCategory(filters.category);
      } else if (filters.activeOnly) {
        const all = await getServices();
        servicesData = all.filter((s) => s.is_active);
      } else {
        servicesData = await getServices();
      }

      const cats = await getCategories();

      setServicesList(servicesData);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load services:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --------------------------------------------------------
  // HANDLERS
  // --------------------------------------------------------

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleAddNew = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service: ServiceResponse) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleSaveService = async (data: ServiceCreate | ServiceUpdate) => {
    setSubmitting(true);

    try {
      if (selectedService) {
        await updateService(selectedService.id, data as ServiceUpdate);
        showToast('Service updated successfully', 'success');
      } else {
        await createService(data as ServiceCreate);
        showToast('Service created successfully', 'success');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Operation failed',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (serviceId: number) => {
    if (!confirm('Are you sure you want to deactivate this service?')) return;

    try {
      await deleteService(serviceId);
      showToast('Service deactivated successfully', 'success');
      loadData();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to deactivate',
        'error'
      );
    }
  };

  // --------------------------------------------------------
  // STATS
  // --------------------------------------------------------

  const stats = {
    total: servicesList.length,
    active: servicesList.filter((s) => s.is_active).length,
    categories: new Set(
      servicesList.map((s) => s.category).filter(Boolean)
    ).size,
  };

  // --------------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------------

  if (loading && servicesList.length === 0 && !error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading services...</p>
      </div>
    );
  }

  // --------------------------------------------------------
  // ERROR STATE
  // --------------------------------------------------------

  if (error && servicesList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-red-700">
          Unable to load services
        </h2>
        <p className="text-gray-600 mt-2">{error}</p>

        <button
          onClick={loadData}
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 inline-flex items-center"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  // --------------------------------------------------------
  // MAIN VIEW
  // --------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Scissors size={28} className="text-red-600" />
            <div>
              <h2 className="text-2xl font-bold">Services Management</h2>
              <p className="text-sm text-gray-600">
                Manage salon services, pricing, and categories
              </p>
            </div>
          </div>

          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Plus size={18} />
            Add Service
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-gray-500">Total Services</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.categories}</p>
            <p className="text-xs text-gray-500">Categories</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ServicesFilters
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
        onRefresh={loadData}
        loading={loading}
      />

      {/* Services List */}
      <ServicesList
        services={servicesList}
        loading={loading}
        onEdit={handleEdit}
        onDeactivate={handleDeactivate}
      />

      {/* Modal */}
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
  );
}
