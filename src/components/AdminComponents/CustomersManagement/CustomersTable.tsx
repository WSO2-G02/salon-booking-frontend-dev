/**
 * CustomersTable Component
 * 
 * Displays customers/users in a responsive table with pagination.
 * Shows user details including username, email, type, and status.
 * 
 * @component
 */

import { User, Mail, Shield, UserCheck } from 'lucide-react'
import { type UserListResponse } from '@/services/customersService'

interface CustomersTableProps {
  /** Array of customers to display */
  customers: UserListResponse[]
  /** Current page number */
  page: number
  /** Pagination info */
  pagination: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
  /** Callback when page changes */
  onPageChange: (page: number) => void
  /** Loading state */
  loading: boolean
}

export default function CustomersTable({
  customers,
  page,
  pagination,
  onPageChange,
  loading,
}: CustomersTableProps) {
  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Empty state
  if (customers.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Users Found</h3>
        <p className="text-gray-500">
          No users match your current filters. Try adjusting the search or filters.
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
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Joined
              </th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className={`hover:bg-gray-50 transition-colors ${
                  !customer.is_active ? 'opacity-60' : ''
                }`}
              >
                {/* User Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                      customer.user_type === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      {customer.user_type === 'admin' ? (
                        <Shield size={20} className="text-purple-600" />
                      ) : (
                        <User size={20} className="text-blue-600" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {customer.full_name || customer.username}
                      </p>
                      <p className="text-xs text-gray-500">@{customer.username}</p>
                    </div>
                  </div>
                </td>
                
                {/* Email */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-700">
                    <Mail size={14} className="mr-2 text-gray-400" />
                    {customer.email}
                  </div>
                </td>
                
                {/* User Type Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.user_type === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {customer.user_type === 'admin' ? (
                      <>
                        <Shield size={12} className="mr-1" />
                        Admin
                      </>
                    ) : (
                      <>
                        <UserCheck size={12} className="mr-1" />
                        Customer
                      </>
                    )}
                  </span>
                </td>
                
                {/* Status Badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {customer.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                
                {/* Join Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatDate(customer.created_at)}
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
          Showing {customers.length} of {pagination.total} users (Page {page} of {pagination.total_pages})
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || loading}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              page > 1 && !loading
                ? 'border-gray-300 text-gray-700 hover:bg-gray-100'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pagination.total_pages || loading}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              page < pagination.total_pages && !loading
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
