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

"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Plus, AlertCircle, RefreshCw, Filter } from "lucide-react";
import { showToast } from "@/components/Toast";

// Import subcomponents

import { getAllAppointments } from "@/services/appointmentService";
import AppointmentsTable from "./AppointmentSection/AppointmentsTable";
import { StaffResponse } from "@/services/staffService";
import AppointmentModal from "./AppointmentSection/AppointmentModal";

// =====================================================
// TYPE DEFINITIONS
// =====================================================

interface Filters {
  position: string;
  activeOnly: boolean;
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function AppointmentsTab() {
  // =====================================================
  // STATE MANAGEMENT
  // =====================================================

  /** Loading state while fetching data */
  const [loading, setLoading] = useState(true);

  /** Staff list from API */
  const[activeAppointments, setActiveAppointments] = useState<any[]>([]);
  const [appointmentList, setAppointmentList] = useState<any[]>([]);
  const [confirmedAppointments, setConfirmedAppointments] = useState<any[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<any[]>([]);
  const [completedAppointments, setCompletedAppointments] = useState<any[]>([]);
  const [cancelledAppointments, setCancelledAppointments] = useState<any[]>([]);
  const [noShowAppointments, setNoShowAppointments] = useState<any[]>([]);

  /** Error message if data fetch fails */
  const [error, setError] = useState<string | null>(null);

  /** Current pagination state */
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  /** Filter state */
  const [filters, setFilters] = useState<Filters>({
    position: "",
    activeOnly: true,
  });

  /** Modal states */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(
    null
  );

  /** Submitting state for forms */
  const [submitting, setSubmitting] = useState(false);

  /** Using mock data flag */
  const [usingMockData, setUsingMockData] = useState(false);

  // =====================================================
  // DATA FETCHING
  // =====================================================

  /**
   * Load staff data from API
   */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllAppointments();
      setActiveAppointments(data);
      setAppointmentList(data);
      setConfirmedAppointments(
        data.filter((appt: { status: string }) => appt.status === "confirmed")
      );
      setPendingAppointments(
        data.filter((appt: { status: string }) => appt.status === "pending")
      );
      setCompletedAppointments(
        data.filter((appt: { status: string }) => appt.status === "completed")
      );
      setCancelledAppointments(
        data.filter((appt: { status: string }) => appt.status === "cancelled")
      );
      setNoShowAppointments(
        data.filter((appt: { status: string }) => appt.status === "no-show")
      );
    } catch (err) {
      console.error("Failed to fetch staff data:", err);
      // Fall back to mock data
      setError(
        err instanceof Error ? err.message : "Failed to load staff data"
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  /**
   * Fetch staff data on mount and when filters/pagination change
   */
  useEffect(() => {
    loadData();
  }, [loadData, isAddModalOpen]);

  // =====================================================
  // EVENT HANDLERS
  // =====================================================

  /**
   * Handle filter changes
   */
  const handleFilterChange = (value: string) => {
    if (value === "active") {
        setActiveAppointments(confirmedAppointments);
    }else if (value === "pending") {
        setActiveAppointments(pendingAppointments);
    }else if (value === "confirmed") {
        setActiveAppointments(confirmedAppointments);
    }else if (value === "completed") {
        setActiveAppointments(completedAppointments);
    }else if (value === "cancelled") {
        setActiveAppointments(cancelledAppointments);
    }else if (value === "no-show") {
        setActiveAppointments(noShowAppointments);
    }else {
        setActiveAppointments(appointmentList);
    }

  };

  /**
   * Open modal to add new staff
   */
  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  /**
   * Handle page change
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading && appointmentList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading appointments data...</p>
      </div>
    );
  }

  // =====================================================
  // ERROR STATE (with retry)
  // =====================================================

  if (error && !usingMockData && appointmentList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center text-red-600">
          <AlertCircle size={48} className="mx-auto mb-3" />
          <p className="text-lg font-semibold">
            Error loading appointments data
          </p>
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
    );
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
              <h2 className="text-2xl font-bold text-gray-800">
                Appointments Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage salon appointments, schedules, and bookings
              </p>
            </div>
          </div>

          {/* Add new staff button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            <Plus size={18} />
            <span>Add Appointment</span>
          </button>
          {isAddModalOpen && (
            <AppointmentModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
            />
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* MOCK DATA NOTICE                                 */}
      {/* ================================================= */}
      {usingMockData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle
              size={20}
              className="text-yellow-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="font-medium text-yellow-800">Using Demo Data</p>
              <p className="text-sm text-yellow-700">
                Unable to connect to the Staff Service. Displaying mock data for
                demonstration.
                {error && ` Error: ${error}`}
              </p>
            </div>
          </div>
        </div>
      )}

  
      {/* ================================================= */}
      {/* FILTERS SECTION                                  */}
      {/* ================================================= */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-end sm:justify-between gap-4">
          {/* Status Filter */}
          <div className="flex flex-col">
          <div className="flex items-center text-gray-600 pb-2">
            <Filter size={18} className="mr-2" />
            <span className="text-sm font-medium">Filter by status</span>
          </div>
          

            <select
              value={filters.position}
              onChange={(e) =>
                handleFilterChange(e.target.value)
              }
              className="w-full sm:w-64 px-3 py-2 border text-gray-900 border-gray-300 rounded-lg text-sm 
                   focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
            >
              <option value="">Show All</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>

          {/* Refresh Button */}
        <button
          onClick={loadData}
          disabled={loading}
          className={`flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            loading
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* STAFF TABLE                                      */}
      {/* ================================================= */}
      <AppointmentsTable
        appointmentsList={activeAppointments}
        onEdit={() => {
          useEffect;
        }}
        page={page}
        limit={limit}
        onPageChange={handlePageChange}
        loading={loading}
      />

      {/* ================================================= */}
      {/* STAFF CREATE/EDIT MODAL                          */}
      {/* ================================================= */}
      {/* {isModalOpen && (
        <StaffModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStaff}
          staff={selectedStaff}
          submitting={submitting}
        />
      )} */}

      {/* ================================================= */}
      {/* AVAILABILITY MODAL                               */}
      {/* ================================================= */}
      {/* {isAvailabilityModalOpen && selectedStaff && (
        <StaffAvailabilityModal
          isOpen={isAvailabilityModalOpen}
          onClose={() => setIsAvailabilityModalOpen(false)}
          staff={selectedStaff}
        />
      )} */}
    </div>
  );
}
