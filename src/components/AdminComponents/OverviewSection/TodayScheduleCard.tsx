/**
 * TodayScheduleCard Component
 * 
 * Displays today's appointment schedule with time slots and status indicators.
 * Shows customer name, service, staff, duration, and appointment status.
 * 
 * @component
 */

'use client'

import { Calendar, Clock, User, Scissors } from 'lucide-react'

interface ScheduleItem {
  id: number
  time: string
  customerName: string
  serviceName: string
  staffName: string
  status: 'upcoming' | 'in-progress' | 'completed'
  duration: number
}

interface TodayScheduleCardProps {
  schedule: ScheduleItem[]
  loading?: boolean
}

const statusStyles = {
  upcoming: {
    border: 'border-l-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    label: 'Upcoming',
  },
  'in-progress': {
    border: 'border-l-green-500',
    bg: 'bg-green-50',
    text: 'text-green-700',
    label: 'In Progress',
  },
  completed: {
    border: 'border-l-gray-400',
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    label: 'Completed',
  },
}

export default function TodayScheduleCard({ schedule, loading = false }: TodayScheduleCardProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-40 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse border-l-4 border-gray-200 pl-4 py-3 bg-gray-50 rounded-r-lg">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
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
          <Calendar size={24} className="mr-2 text-red-600" />
          Today&apos;s Schedule
        </h3>
        <span className="text-sm text-gray-500">{today}</span>
      </div>
      
      {schedule.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock size={32} className="mx-auto mb-2 opacity-50" />
          <p>No appointments scheduled for today</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {schedule.map((item) => {
            const style = statusStyles[item.status]
            return (
              <div
                key={item.id}
                className={`border-l-4 ${style.border} pl-4 py-3 ${style.bg} rounded-r-lg transition-all hover:translate-x-1`}
              >
                {/* Time */}
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={14} className={style.text} />
                  <span className={`text-sm font-semibold ${style.text}`}>
                    {item.time}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text} border`}>
                    {style.label}
                  </span>
                </div>
                
                {/* Customer & Service */}
                <div className="flex items-center gap-2 text-gray-800">
                  <User size={14} className="text-gray-500" />
                  <span className="font-medium">{item.customerName}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Scissors size={14} className="text-gray-400" />
                  <span>{item.serviceName}</span>
                  <span className="text-gray-400">•</span>
                  <span>{item.staffName}</span>
                  <span className="text-gray-400">•</span>
                  <span>{item.duration} min</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
