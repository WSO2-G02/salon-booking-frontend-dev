/**
 * CustomersFilters Component
 *
 * Enhanced UI including:
 * - Search input
 * - User type filter
 * - Page size dropdown (“Show entries”)
 * - Clear filters
 * - Refresh button
 */

import { Search, Filter, RefreshCw, X } from "lucide-react";

interface Filters {
  userType: string;
  search: string;
}

interface CustomersFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onRefresh: () => void;
  loading: boolean;

  /** NEW: page size handler */
  limit: number;
  onLimitChange: (limit: number) => void;
}

export default function CustomersFilters({
  filters,
  onFilterChange,
  onRefresh,
  loading,
  limit,
  onLimitChange,
}: CustomersFiltersProps) {
  const clearFilters = () =>
    onFilterChange({
      userType: "",
      search: "",
    });

  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* LEFT SECTION — Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1">

          {/* FILTER LABEL */}
          <div className="flex items-center text-gray-600">
            <Filter size={18} className="mr-2" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Filters
            </span>
          </div>

          {/* SEARCH BOX */}
          <div className="relative flex-1 max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                onFilterChange({ ...filters, search: e.target.value })
              }
              placeholder="Search name, email, username..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 
              focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition"
            />
          </div>

          {/* USER TYPE DROPDOWN */}
          <select
            value={filters.userType}
            onChange={(e) =>
              onFilterChange({ ...filters, userType: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white 
            focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition"
          >
            <option value="">All Users</option>
            <option value="user">Customers Only</option>
            <option value="admin">Admins Only</option>
          </select>

          {/* PAGE SIZE DROPDOWN — added here */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>

            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white"
            >
              {[5, 10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <span className="text-sm text-gray-600">entries</span>
          </div>

          {/* CLEAR FILTERS */}
          {(filters.search || filters.userType) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>

        {/* RIGHT SECTION — Refresh */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition 
            ${
              loading
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            }`}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}
