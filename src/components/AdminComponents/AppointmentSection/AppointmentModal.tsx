"use client";

import { useEffect, useState } from "react";
import {
  X,
  Tag,
  User,
  UserCheck,
  Calendar,
  Clock,
  DollarSign,
  FileText,
} from "lucide-react";
import { showToast } from "@/components/Toast";
import { bookAppointment, updateAppointment } from "@/services/appointmentService";
import { appointmentsApiFetch } from "@/lib/appointmentApi";

type Appointment = {
  id: number;
  user_id: number;
  staff_id: number;
  service_id: number;
  appointment_datetime: string;
  duration_minutes: number;
  service_price: number;
  status: string;
  customer_notes: string | null;
  staff_notes: string | null;
  cancellation_reason: string | null;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment | null;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  appointment,
}: Props) {
  const initial = {
    user_id: appointment?.user_id?.toString() ?? "",
    staff_id: appointment?.staff_id?.toString() ?? "",
    service_id: appointment?.service_id?.toString() ?? "",
    appointment_datetime: appointment?.appointment_datetime ?? "",
    duration_minutes: appointment?.duration_minutes?.toString() ?? "60",
    service_price: appointment?.service_price?.toString() ?? "0",
    status: appointment?.status ?? "pending",
    customer_notes: appointment?.customer_notes ?? "",
    staff_notes: appointment?.staff_notes ?? "",
    cancellation_reason: appointment?.cancellation_reason ?? "",
  };

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(initial);
    setErrors({});
  }, [appointment, isOpen]);

  if (!isOpen) return null;

  // -----------------------------------
  // HANDLERS
  // -----------------------------------

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.user_id || isNaN(Number(form.user_id)))
      e.user_id = "User ID is required";
    if (!form.service_id || isNaN(Number(form.service_id)))
      e.service_id = "Service ID is required";
    if (!form.appointment_datetime)
      e.appointment_datetime = "Appointment date & time required";
    if (Number(form.duration_minutes) <= 0)
      e.duration_minutes = "Duration must be > 0";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      const res  = await bookAppointment({
        user_id: Number(form.user_id),
        staff_id: Number(form.staff_id) || undefined,
        appointment_date: form.appointment_datetime.split("T")[0],
        service_id: Number(form.service_id),
        appointment_datetime: form.appointment_datetime,
        customer_notes: form.customer_notes,
      });

      showToast("Appointment created", "success");
    
      onClose();
    } catch (err: any) {
      showToast(err.message || "Create failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!appointment) return;

    setSubmitting(true);

    const payload: any = {};
    if (Number(form.user_id) !== appointment.user_id)
      payload.user_id = Number(form.user_id);

    if (Number(form.staff_id) !== appointment.staff_id)
      payload.staff_id = Number(form.staff_id);

    if (Number(form.service_id) !== appointment.service_id)
      payload.service_id = Number(form.service_id);

    if (form.appointment_datetime !== appointment.appointment_datetime)
      payload.appointment_datetime = form.appointment_datetime;

    if (Number(form.duration_minutes) !== appointment.duration_minutes)
      payload.duration_minutes = Number(form.duration_minutes);

    if (Number(form.service_price) !== appointment.service_price)
      payload.service_price = Number(form.service_price);

    if (form.status !== appointment.status)
      payload.status = form.status;

    if ((form.customer_notes || "") !== (appointment.customer_notes || ""))
      payload.customer_notes = form.customer_notes || null;

    if ((form.staff_notes || "") !== (appointment.staff_notes || ""))
      payload.staff_notes = form.staff_notes || null;

    if (
      (form.cancellation_reason || "") !==
      (appointment.cancellation_reason || "")
    )
      payload.cancellation_reason = form.cancellation_reason || null;

    try {
      const res = await updateAppointment(appointment.id, payload);

     
      if (!res) throw new Error("Update failed");

      showToast("Appointment updated", "success");
    
      onClose();
    } catch (err: any) {
      showToast(err.message || "Update failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (appointment) await handleUpdate();
    else await handleCreate();
  };

  // -----------------------------------
  // UI (IDENTICAL STYLE TO STAFFMODAL)
  // -----------------------------------

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200">

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Tag size={24} className="text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {appointment ? "Edit Appointment" : "Create Appointment"}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="p-4 space-y-4">
            
            {/* GRID FIELDS */}
            <div className="grid grid-cols-2 gap-4">

              {/* USER ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User size={14} className="inline mr-1" />
                  User ID *
                </label>

                <input
                  name="user_id"
                  value={form.user_id}
                  onChange={handleChange}
                  placeholder="User ID"
                  className={`w-full text-gray-600 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                    errors.user_id
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-red-200 focus:border-red-500"
                  }`}
                />
                {errors.user_id && (
                  <p className="mt-1 text-xs text-red-600">{errors.user_id}</p>
                )}
              </div>

              {/* STAFF ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <UserCheck size={14} className="inline mr-1" />
                  Staff ID
                </label>

                <input
                  name="staff_id"
                  value={form.staff_id}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
                />
              </div>

              {/* SERVICE ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Tag size={14} className="inline mr-1" />
                  Service ID *
                </label>

                <input
                  name="service_id"
                  value={form.service_id}
                  onChange={handleChange}
                  placeholder="Service ID"
                  className={`w-full text-gray-600 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                    errors.service_id
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-red-200 focus:border-red-500"
                  }`}
                />
                {errors.service_id && (
                  <p className="mt-1 text-xs text-red-600">{errors.service_id}</p>
                )}
              </div>

              {/* PRICE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign size={14} className="inline mr-1" />
                  Price
                </label>
                <input
                  name="service_price"
                  type="number"
                  value={form.service_price}
                  onChange={handleChange}
                  className="w-full text-gray-600 px-3 py-2 border text-gray-900 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
                />
              </div>

              {/* APPOINTMENT DATETIME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={14} className="inline mr-1" />
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="appointment_datetime"
                  value={form.appointment_datetime}
                  onChange={handleChange}
                  className={`w-full text-gray-600 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                    errors.appointment_datetime
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-red-200 focus:border-red-500"
                  }`}
                />
                {errors.appointment_datetime && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.appointment_datetime}
                  </p>
                )}
              </div>

              {/* DURATION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock size={14} className="inline mr-1" />
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration_minutes"
                  value={form.duration_minutes}
                  onChange={handleChange}
                  className={`w-full text-gray-600 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                    errors.duration_minutes
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-red-200 focus:border-red-500"
                  }`}
                />
                {errors.duration_minutes && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.duration_minutes}
                  </p>
                )}
              </div>
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText size={14} className="inline mr-1" />
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              >
                <option value="pending">Pending</option>

                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No-show</option>
              </select>
            </div>

            {/* NOTES */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Notes
              </label>
              <textarea
                name="customer_notes"
                rows={2}
                value={form.customer_notes}
                onChange={handleChange}
                className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Staff Notes
              </label>
              <textarea
                name="staff_notes"
                rows={2}
                value={form.staff_notes}
                onChange={handleChange}
                className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cancellation Reason
              </label>
              <input
                name="cancellation_reason"
                value={form.cancellation_reason}
                onChange={handleChange}
                className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              />
            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2   text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  submitting
                    ? "cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {submitting
                  ? "Saving..."
                  : appointment
                  ? "Update Appointment"
                  : "Create Appointment"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
