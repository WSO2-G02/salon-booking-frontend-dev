/**
 * StaffTable Component
 * 
 * Displays staff members in a responsive table with action buttons.
 * Supports pagination and shows staff details including position,
 * specialties, experience, and status.
 * 
 * @component
 */

import { Edit, Trash2, Calendar, User, Briefcase, Clock } from 'lucide-react'
import { type StaffResponse } from '@/services/staffService'

interface StaffTableProps {
  /** Array of staff members to display */
  staffList: StaffResponse[]
  /** Callback when edit button is clicked */
  onEdit: (staff: StaffResponse) => void
  /** Callback when deactivate button is clicked */
  onDeactivate: (staffId: number) => void
  /** Callback when manage availability is clicked */
  onManageAvailability: (staff: StaffResponse) => void
  /** Current page number */
  page: number
  /** Items per page */
  limit: number
  /** Callback when page changes */
  onPageChange: (page: number) => void
  /** Loading state */
  loading: boolean
}

export default function StaffTable({
  staffList,
  onEdit,
  onDeactivate,
  onManageAvailability,
  page,
  limit,
  onPageChange,
  loading,
}: StaffTableProps) {
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Calculate if there are more pages (simplified - in real app, would use total count from API)
  const hasNextPage = staffList.length === limit
  const hasPrevPage = page > 1

  // Empty state
  if (staffList.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Staff Members Found</h3>
        <p className="text-gray-500">
          No staff members match your current filters. Try adjusting the filters or add a new staff member.
        </p>
      </div>
    )
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
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Specialties
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Experience
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Hire Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {staffList.map((staff) => (
              <tr
                key={staff.id}
                className={`hover:bg-gray-50 transition-colors ${
                  !staff.is_active ? 'opacity-60' : ''
                }`}
              >
                {/* Employee ID & Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-red-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{staff.employee_id}</p>
                      <p className="text-xs text-gray-500">ID: {staff.id}</p>
                    </div>
                  </div>
                </td>
                
                {/* Position */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Briefcase size={14} className="mr-2 text-gray-400" />
                    {staff.position}
                  </div>
                </td>
                
                {/* Specialties */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700 max-w-xs">
                    {staff.specialties ? (
                      <div className="flex flex-wrap gap-1">
                        {staff.specialties.split(',').slice(0, 3).map((specialty, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
                          >
                            {specialty.trim()}
                          </span>
                        ))}
                        {staff.specialties.split(',').length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{staff.specialties.split(',').length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">No specialties</span>
                    )}
                  </div>
                </td>
                
                {/* Experience */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock size={14} className="mr-2 text-gray-400" />
                    {staff.experience_years !== null ? (
                      <span>{staff.experience_years} year{staff.experience_years !== 1 ? 's' : ''}</span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </div>
                </td>
                
                {/* Hire Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatDate(staff.hire_date)}
                </td>
                
                {/* Status Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      staff.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {staff.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                
                {/* Action Buttons */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {/* Manage Availability */}
                    <button
                      onClick={() => onManageAvailability(staff)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Manage Availability"
                    >
                      <Calendar size={16} />
                    </button>
                    
                    {/* Edit */}
                    <button
                      onClick={() => onEdit(staff)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit Staff"
                    >
                      <Edit size={16} />
                    </button>
                    
                    {/* Deactivate (only for active staff) */}
                    {staff.is_active && (
                      <button
                        onClick={() => onDeactivate(staff.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Deactivate Staff"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
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
          Showing page {page} ({staffList.length} items)
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevPage || loading}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              hasPrevPage && !loading
                ? 'border-gray-300 text-gray-700 hover:bg-gray-100'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage || loading}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              hasNextPage && !loading
                ? 'border-gray-300 text-gray-700 hover:bg-gray-100'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
