/**
 * StatCard Component
 * 
 * Displays a single statistic card with icon, value, label, and optional trend indicator.
 * Used to show key metrics like appointments, revenue, customers, and services.
 * 
 * @component
 */

import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  /** Lucide icon component */
  Icon: LucideIcon
  /** Main numeric or string value */
  value: string | number
  /** Label describing the metric */
  label: string
  /** Optional subtitle text */
  subtitle?: string
  /** Optional trend indicator */
  change?: number
  /** Background color for icon container (Tailwind class) */
  bgColor: string
  /** Text color for icon (Tailwind class) */
  iconColor: string
  /** Optional loading state */
  loading?: boolean
}

export default function StatCard({
  Icon,
  value,
  label,
  subtitle,
  change,
  bgColor,
  iconColor,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
          <div className="w-16 h-6 bg-gray-200 rounded" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
        <div className="h-8 bg-gray-200 rounded w-32" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header row: Icon and change badge */}
      <div className="flex items-center justify-between mb-3">
        {/* Icon container */}
        <div className={`${bgColor} ${iconColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
          <Icon size={24} className="stroke-[1.5]" />
        </div>
        
        {/* Change percentage badge (if provided) */}
        {change !== undefined && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      
      {/* Card title */}
      <h3 className="text-sm text-gray-600 mb-1">{label}</h3>
      
      {/* Main value */}
      <p className="text-2xl font-bold text-gray-800">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      
      {/* Optional subtitle */}
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}
