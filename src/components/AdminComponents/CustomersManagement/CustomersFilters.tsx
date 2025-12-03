/**
 * CustomersFilters Component
 * 
 * Provides filter controls for the customers list including:
 * - Search input (username, email, name)
 * - User type filter (admin/user)
 * - Refresh button
 * 
 * @component
 */

import { Search, Filter, RefreshCw } from 'lucide-react'

interface Filters {
  userType: string
  search: string
}

interface CustomersFiltersProps {
  /** Current filter state */
  filters: Filters
  /** Callback when filters change */
  onFilterChange: (filters: Filters) => void
  /** Callback to refresh data */
  onRefresh: () => void
  /** Loading state */
  loading: boolean
}

export default function CustomersFilters({
  filters,
  onFilterChange,
  onRefresh,
  loading,
}: CustomersFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left side: Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          {/* Filter icon and label */}
          <div className="flex items-center text-gray-600">
            <Filter size={18} className="mr-2" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          {/* Search input */}
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="Search by name, email..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
            />
          </div>
          
          {/* User type dropdown */}
          <select
            value={filters.userType}
            onChange={(e) => onFilterChange({ ...filters, userType: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
          >
            <option value="">All Users</option>
            <option value="user">Customers Only</option>
            <option value="admin">Admins Only</option>
          </select>
        </div>
        
        {/* Right side: Refresh button */}
        <button
          onClick={onRefresh}
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
  )
}
