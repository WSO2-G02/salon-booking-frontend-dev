/**
 * MetricCard Component
 * 
 * Displays a single KPI metric card with icon, value, and optional change percentage.
 * Used in the top row of the Reports & Analytics dashboard.
 * 
 * @component
 * @example
 * <MetricCard 
 *   Icon={DollarSign}
 *   title="Total Revenue"
 *   value="LKR 2,450,000"
 *   change={15.3}
 *   bgColor="bg-green-50"
 *   iconColor="text-green-600"
 * />
 */

import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  /** Lucide icon component */
  Icon: LucideIcon
  /** Card title/label */
  title: string
  /** Main value to display (formatted) */
  value: string
  /** Optional subtitle text */
  subtitle?: string
  /** Optional percentage change (positive or negative) */
  change?: number
  /** Background color for icon container (Tailwind class) */
  bgColor: string
  /** Text color for icon (Tailwind class) */
  iconColor: string
}

export default function MetricCard({
  Icon,
  title,
  value,
  subtitle,
  change,
  bgColor,
  iconColor,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header row: Icon and change badge */}
      <div className="flex items-center justify-between mb-3">
        {/* Icon container with Lucide icon */}
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
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      
      {/* Main value */}
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      
      {/* Optional subtitle */}
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  )
}
