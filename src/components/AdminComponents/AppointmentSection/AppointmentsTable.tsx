/**
 * AppointmentsTable Component
 *
 * Displays appointments in a responsive table with action buttons.
 * Supports pagination, viewing, editing, and deleting appointments.
 *
 * FIXES APPLIED:
 * - Modals rendered ONCE at root level (not inside table rows)
 * - Prevents nested scroll & broken modal behavior
 *
 * @component
 */

'use client'

import { useState } from "react"
import {
  Edit,
  Trash2,
  Calendar,
  User,
  Briefcase,
  Clock,
  DollarSign,
} from "lucide-react"

import AppointmentModal from "./AppointmentModal"
import AppointmentViewModal from "./AppointmentViewModal"

import {
  deleteAppointment,
} from "@/services/appointmentService"

import { showToast } from "@/components/Toast"

// =====================================================
// PROPS
// =====================================================

interface AppointmentTableProps {
  appointmentsList: any[]
  page: number
  limit: number
  onPageChange: (page: number) => void
  onEdit: () => void
  loading: boolean
}

// =====================================================
// COMPONENT
// =====================================================

export default function AppointmentsTable({
  appointmentsList,
  page,
  limit,
  onPageChange,
  onEdit,
  loading,
}: AppointmentTableProps) {

  // =====================================================
  // STATE
  // =====================================================

  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

  // =====================================================
  // HELPERS
  // =====================================================

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleDeleteAppointment = async (appointmentId: number) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return

    try {
      await deleteAppointment(appointmentId)
      showToast("Appointment deleted", "success")
      onEdit() // refresh list
    } catch (err) {
      showToast("Failed to delete appointment", "error")
      console.error(err)
    }
  }

  const hasNextPage = appointmentsList.length === limit
  const hasPrevPage = page > 1

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (appointmentsList.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Appointments Found
        </h3>
        <p className="text-gray-500">
          No appointments match your current filters.
        </p>
      </div>
    )
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">

            {/* HEADER */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Staff</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Service</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Notes</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-gray-200">
              {appointmentsList.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">

                  {/* ID */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Calendar size={18} className="text-red-600 mr-2" />
                      {appointment.id}
                    </div>
                  </td>

                  {/* STAFF */}
                  <td className="px-6 py-4">
                    {appointment.staff_id || "Unassigned"}
                  </td>

                  {/* SERVICE */}
                  <td className="px-6 py-4">
                    {appointment.service_id}
                  </td>

                  {/* PRICE */}
                  <td className="px-6 py-4">
                    {appointment.service_price ?? "N/A"} LKR
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4">
                    {formatDate(appointment.appointment_datetime)}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                      {appointment.status}
                    </span>
                  </td>

                  {/* NOTES */}
                  <td className="px-6 py-4">
                    {appointment.customer_notes || "—"}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">

                      {/* VIEW */}
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment)
                          setIsViewModalOpen(true)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Calendar size={16} />
                      </button>

                      {/* EDIT */}
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment)
                          setIsEditModalOpen(true)
                        }}
                        className="p-2 text-gray-800 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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

        {/* ================= PAGINATION ================= */}
        <div className="bg-gray-50 px-6 py-3 flex justify-between">
          <span className="text-sm text-gray-600">
            Page {page}
          </span>

          <div className="flex gap-2">
            <button
              disabled={!hasPrevPage}
              onClick={() => onPageChange(page - 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={!hasNextPage}
              onClick={() => onPageChange(page + 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODALS (ROOT LEVEL) ================= */}

      {isViewModalOpen && selectedAppointment && (
        <AppointmentViewModal
          isOpen={isViewModalOpen}
          appointment={selectedAppointment}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      {isEditModalOpen && selectedAppointment && (
        <AppointmentModal
          isOpen={isEditModalOpen}
          appointment={selectedAppointment}
          onClose={() => {
            setIsEditModalOpen(false)
            onEdit()
          }}
        />
      )}
    </>
  )
}
