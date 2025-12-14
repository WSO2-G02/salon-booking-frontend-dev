"use client";

import { Filter, RefreshCw } from "lucide-react";
import { updateAppointment } from "@/services/appointmentService";

interface AppointmentFiltersProps {
  status: string;
  date: string;
  onFilterChange: (filters: { status: string; date: string }) => void;
  onRefresh: () => void;
  loading: boolean;
}

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no-show", label: "No Show" }
];

export default function AppointmentFilters({
  status,
  date,
  onFilterChange,
  onRefresh,
  loading
}: AppointmentFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="flex items-center text-gray-600">
          <Filter size={18} className="mr-2" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => onFilterChange({ status: e.target.value, date })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option value={opt.value} key={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={date}
            onChange={(e) => onFilterChange({ status, date: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm ${
              loading
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
