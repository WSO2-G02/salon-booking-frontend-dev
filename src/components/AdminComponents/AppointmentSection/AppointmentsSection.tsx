"use client";

import { useEffect, useState, useCallback } from "react";
// import { appointmentsApiFetch } from "@/lib/appointmentApi";
import { appointmentsApiFetch } from "@/lib/appointmentApi";
import { Calendar } from "lucide-react";

type Appointment = {
  id: number;
  user_id: number;
  staff_id: number;
  service_id: number;
  appointment_datetime: string;
  duration_minutes: number;
  service_price: string;
  status: string;
  customer_notes: string;
  staff_notes: string;
  cancellation_reason: string;
  created_at: string;
  updated_at: string;
  completed_at: string;
};

const statusOptions = ["pending", "confirmed", "completed", "cancelled", "no-show"];

export default function AppointmentsSection() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const loadAppointments = useCallback(async () => {
    setLoading(true);

    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(statusFilter ? { status_filter: statusFilter } : {}),
      ...(dateFilter ? { from_datetime: dateFilter } : {}),
    });

    try {
      const res = await appointmentsApiFetch(`/appointments?${query.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        throw new Error(data.detail || "Failed to load appointments");
      }

      setAppointments(data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, dateFilter]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="flex items-center gap-3 mb-4">
        <Calendar size={32} className="text-red-600" />
        <h2 className="text-2xl font-bold text-gray-800">Appointments Management</h2>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 items-end flex-wrap">
        <div>
          <label className="text-sm font-semibold">Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2 w-40"
          >
            <option value="">All</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold">From Date</label>
          <input
            type="datetime-local"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Items per Page</label>
          <input
            type="number"
            min={1}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border rounded px-3 py-2 w-20"
          />
        </div>

        <button
          onClick={loadAppointments}
          className="bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-600"
        >
          Apply
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-500">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-center text-gray-500">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">User</th>
                <th className="p-2 border">Staff</th>
                <th className="p-2 border">Service</th>
                <th className="p-2 border">Date & Time</th>
                <th className="p-2 border">Duration</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="text-sm text-center">
                  <td className="p-2 border">{a.id}</td>
                  <td className="p-2 border">{a.user_id}</td>
                  <td className="p-2 border">{a.staff_id}</td>
                  <td className="p-2 border">{a.service_id}</td>
                  <td className="p-2 border">
                    {new Date(a.appointment_datetime).toLocaleString()}
                  </td>
                  <td className="p-2 border">{a.duration_minutes} min</td>
                  <td className="p-2 border">Rs. {Number(a.service_price)}</td>
                  <td className="p-2 border capitalize">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => page > 1 && setPage(page - 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Previous
        </button>
        <span className="font-semibold">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
