/**
 * ServiceHealthCard Component
 * 
 * Displays the health status of all backend microservices.
 * Shows connectivity status and response time for each service endpoint.
 * 
 * @component
 */

'use client'

import { Server, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react'

interface ServiceStatus {
  name: string
  endpoint: string
  status: 'online' | 'offline' | 'checking'
  responseTime?: number
}

interface ServiceHealthCardProps {
  services: ServiceStatus[]
  loading?: boolean
  onRefresh?: () => void
}

export default function ServiceHealthCard({ 
  services, 
  loading = false,
  onRefresh 
}: ServiceHealthCardProps) {
  const onlineCount = services.filter(s => s.status === 'online').length
  const totalCount = services.length

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Server size={24} className="mr-2 text-red-600" />
            Service Health
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {onlineCount}/{totalCount} services online
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh status"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
          >
            <div className="flex items-center gap-3">
              {service.status === 'checking' ? (
                <Loader2 size={18} className="text-gray-400 animate-spin" />
              ) : service.status === 'online' ? (
                <CheckCircle size={18} className="text-green-500" />
              ) : (
                <XCircle size={18} className="text-red-500" />
              )}
              <div>
                <p className="font-medium text-gray-800 text-sm">{service.name}</p>
                {service.responseTime !== undefined && service.status === 'online' && (
                  <p className="text-xs text-gray-400">{service.responseTime}ms</p>
                )}
              </div>
            </div>
            
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                service.status === 'online'
                  ? 'bg-green-100 text-green-700'
                  : service.status === 'offline'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {service.status === 'checking' ? '...' : service.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
