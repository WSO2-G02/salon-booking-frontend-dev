/**
 * RecentActivityCard Component
 * 
 * Displays a list of recent appointments and activities.
 * Shows appointment status, customer, service, and time.
 * 
 * @component
 */

'use client'

import { Activity, Clock, CheckCircle, XCircle, AlertCircle, User } from 'lucide-react'

interface ActivityItem {
  id: number
  type: 'appointment' | 'booking' | 'cancellation'
  customerName: string
  serviceName: string
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending'
  time: string
  staffName?: string
}

interface RecentActivityCardProps {
  activities: ActivityItem[]
  loading?: boolean
}

const statusConfig = {
  confirmed: {
    Icon: CheckCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    label: 'Confirmed',
  },
  completed: {
    Icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    label: 'Completed',
  },
  cancelled: {
    Icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    label: 'Cancelled',
  },
  pending: {
    Icon: AlertCircle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    label: 'Pending',
  },
}

export default function RecentActivityCard({ activities, loading = false }: RecentActivityCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 p-3 rounded-lg bg-gray-50">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="w-20 h-6 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Activity size={24} className="mr-2 text-red-600" />
          Recent Activity
        </h3>
        <span className="text-sm text-gray-500">Last 24 hours</span>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock size={32} className="mx-auto mb-2 opacity-50" />
          <p>No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => {
            const config = statusConfig[activity.status]
            return (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {/* Customer Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={20} className="text-gray-600" />
                </div>
                
                {/* Activity Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {activity.customerName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {activity.serviceName}
                    {activity.staffName && ` • ${activity.staffName}`}
                  </p>
                </div>
                
                {/* Status Badge */}
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bgColor}`}>
                  <config.Icon size={14} className={config.color} />
                  <span className={`text-xs font-medium ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                
                {/* Time */}
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
