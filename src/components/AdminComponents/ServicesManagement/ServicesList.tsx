/**
 * ServicesList Component
 * 
 * Displays services in a card grid layout.
 * Shows service details including name, description, price, duration, and status.
 * 
 * @component
 */

import { Edit, Trash2, Clock, DollarSign, Tag } from 'lucide-react'
import { type ServiceResponse } from '@/services/servicesService'

interface ServicesListProps {
  /** Array of services to display */
  services: ServiceResponse[]
  /** Callback when edit button is clicked */
  onEdit: (service: ServiceResponse) => void
  /** Callback when deactivate button is clicked */
  onDeactivate: (serviceId: number) => void
  /** Loading state */
  loading: boolean
}

export default function ServicesList({
  services,
  onEdit,
  onDeactivate,
  loading,
}: ServicesListProps) {
  /**
   * Format price for display (LKR)
   */
  const formatPrice = (price: number) => {
    return `LKR ${price.toLocaleString()}`
  }

  /**
   * Format duration for display
   */
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  // Empty state
  if (services.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Tag size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Services Found</h3>
        <p className="text-gray-500">
          No services match your current filters. Try adjusting the filters or add a new service.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <div
          key={service.id}
          className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
            !service.is_active ? 'opacity-60' : ''
          }`}
        >
          {/* Card Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {service.name}
                </h3>
                {service.category && (
                  <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                    <Tag size={10} className="mr-1" />
                    {service.category}
                  </span>
                )}
              </div>
              {/* Status Badge */}
              <span
                className={`ml-2 flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                  service.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {service.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          {/* Card Body */}
          <div className="p-4">
            {/* Description */}
            {service.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {service.description}
              </p>
            )}
            
            {/* Price and Duration */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-700">
                <DollarSign size={16} className="mr-1 text-green-600" />
                <span className="font-semibold">{formatPrice(service.price)}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Clock size={14} className="mr-1" />
                <span>{formatDuration(service.duration_minutes)}</span>
              </div>
            </div>
          </div>
          
          {/* Card Footer - Actions */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-end space-x-2">
            {/* Edit Button */}
            <button
              onClick={() => onEdit(service)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit Service"
            >
              <Edit size={16} />
            </button>
            
            {/* Deactivate Button (only for active services) */}
            {service.is_active && (
              <button
                onClick={() => onDeactivate(service.id)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                title="Deactivate Service"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
