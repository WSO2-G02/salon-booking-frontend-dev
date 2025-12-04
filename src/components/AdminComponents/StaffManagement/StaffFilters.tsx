/**
 * StaffFilters Component
 * 
 * Provides filter controls for the staff list including:
 * - Position filter (dropdown)
 * - Active/Inactive toggle
 * - Refresh button
 * 
 * @component
 */

import { Filter, RefreshCw } from 'lucide-react'

interface Filters {
  position: string
  activeOnly: boolean
}

interface StaffFiltersProps {
  /** Current filter state */
  filters: Filters
  /** Callback when filters change */
  onFilterChange: (filters: Filters) => void
  /** Callback to refresh data */
  onRefresh: () => void
  /** Loading state */
  loading: boolean
}

// Common positions for filtering
const POSITIONS = [
  { value: '', label: 'All Positions' },
  { value: 'Senior Stylist', label: 'Senior Stylist' },
  { value: 'Junior Stylist', label: 'Junior Stylist' },
  { value: 'Nail Technician', label: 'Nail Technician' },
  { value: 'Massage Therapist', label: 'Massage Therapist' },
  { value: 'Makeup Artist', label: 'Makeup Artist' },
  { value: 'Receptionist', label: 'Receptionist' },
]

export default function StaffFilters({
  filters,
  onFilterChange,
  onRefresh,
  loading,
}: StaffFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left side: Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Filter icon and label */}
          <div className="flex items-center text-gray-600">
            <Filter size={18} className="mr-2" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          {/* Position dropdown */}
          <select
            value={filters.position}
            onChange={(e) => onFilterChange({ ...filters, position: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
          >
            {POSITIONS.map((pos) => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
              </option>
            ))}
          </select>
          
          {/* Active only toggle */}
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.activeOnly}
              onChange={(e) => onFilterChange({ ...filters, activeOnly: e.target.checked })}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-700">Active only</span>
          </label>
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
