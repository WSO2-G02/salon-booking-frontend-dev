/**
 * StaffTable Component
 *
 * Displays staff members in a responsive table with action buttons.
 * Supports pagination and shows staff details including position,
 * specialties, experience, and status.
 *
 * @component
 */

import { Edit, Trash2, Calendar, User, Briefcase, Clock, DollarSign } from "lucide-react";
import { type StaffResponse } from "@/services/staffService";
import AppointmentViewModal from "./AppointmentViewModal";

interface AppointmentTableProps {
  /** Array of staff members to display */
  appointmentsList: any[];
  /** Callback when edit button is clicked */
  /** Current page number */
  page: number;
  /** Items per page */
  limit: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  onEdit: () => void;
  /** Loading state */
  loading: boolean;
}

import { useState } from "react"; // Add this import
import AppointmentModal from "./AppointmentModal";
import {
  updateAppointment,
  deleteAppointment,
} from "@/services/appointmentService";
import { showToast } from "@/components/Toast";
import { on } from "events";

export default function AppointmentsTable({
  appointmentsList,
  page,
  limit,
  onEdit,
  onPageChange,
  loading,
}: AppointmentTableProps) {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Add this line
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null); // Add this line
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

    // Delete appointment handler
    const handleDeleteAppointment = async (appointmentId: number) => {
        try {
            await deleteAppointment(appointmentId);
            showToast("Appointment deleted", "success");
            // Optionally, refresh the appointment list here
        } catch (err) {
            showToast("Failed to delete appointment", "error");
            console.log(err)
        }   
    }

  // Calculate if there are more pages (simplified - in real app, would use total count from API)
  const hasNextPage = appointmentsList.length === limit;
  const hasPrevPage = page > 1;

  // Empty state
  if (appointmentsList.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Appointments Found
        </h3>
        <p className="text-gray-500">
          No appointments match your current filters. Try adjusting the filters
          or add a new appointment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* ================================================= */}
      {/* TABLE CONTAINER                                  */}
      {/* ================================================= */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Appointment ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Staff
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Service ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Appointment Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Customer Notes
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {appointmentsList.map((appointment) => (
              <tr
                key={appointment.id}
                className={`hover:bg-gray-50 transition-colors ${
                  !appointment.is_active ? "opacity-60" : ""
                }`}
              >
                {/* Appointment ID & Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Calendar size={20} className="text-red-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {appointment.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {appointment.id}
                      </p>
                    </div>
                  </div>
                </td>
                {/* Staff */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Briefcase size={14} className="mr-2 text-gray-400" />
                    {appointment.staff_id || "Unassigned"}
                  </div>
                </td>
                {/* Service ID */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div className="flex items-center text-sm text-gray-900">
                    <Briefcase size={14} className="mr-2 text-gray-400" />
                    {appointment.service_id}
                  </div>
                </td>
                {/* Price */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-700">
                    <DollarSign size={14} className="mr-2 text-gray-400" />
                    {appointment.price !== null ? (
                      <span>{appointment.service_price} LKR</span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </div>
                </td>
                {/* Appointment Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div className="flex items-center text-sm text-gray-900">
                    <Clock size={14} className="mr-2 text-gray-400" />
                    {formatDate(appointment.appointment_datetime)}
                  </div>
                </td>
                {/* Status Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      appointment.status === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : appointment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : appointment.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {appointment.status === "confirmed"
                      ? "Confirmed"
                      : appointment.status === "pending"
                      ? "Pending"
                      : appointment.status === "completed"
                      ? "Completed"
                      : appointment.status === "cancelled"
                      ? "Cancelled"
                      : "No-Show"}
                  </span>
                </td>
                {/* Customer Notes */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div className="flex items-center text-sm text-gray-900">
                    <Clock size={14} className="mr-2 text-gray-400" />
                    {appointment.customer_notes ? (
                      <span>{appointment.customer_notes}</span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </div>
                </td>
                {/* Action Buttons */}
                <td className="px-0 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {/* View */}
                    <button
                      onClick={() => {
                        setIsViewModalOpen(true);
                        setSelectedAppointment(appointment);
                      }}
                      className="p-2 text-blue-800 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                      title="View Appointment"
                    >
                      <Calendar size={16} />
                    </button>
                    {/* Open ViewAppointmentModal */}
                    {isViewModalOpen && (
                      <AppointmentViewModal
                        isOpen={isViewModalOpen}
                        onClose={() => setIsViewModalOpen(false)}
                        appointment={selectedAppointment}
                      />
                    )}

                    {/* Edit */}
                    <button
                      onClick={() => {
                        setIsEditModalOpen(true);
                        setSelectedAppointment(appointment);
                      }}
                      className="p-2 text-gray-900 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Appointment"
                    >
                      <Edit size={16} />
                    </button>
                    {isEditModalOpen && (
                      <AppointmentModal
                        isOpen={isEditModalOpen}
                        onClose={() => { setIsEditModalOpen(false); onEdit(); }}
                        appointment={selectedAppointment}
                      />
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Appointment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================================================= */}
      {/* PAGINATION                                       */}
      {/* ================================================= */}
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing page {page} ({appointmentsList.length} items)
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevPage || loading}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              hasPrevPage && !loading
                ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                : "border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage || loading}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              hasNextPage && !loading
                ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                : "border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
