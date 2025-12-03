/**
 * RevenueChartMini Component
 * 
 * A compact revenue chart for the overview dashboard.
 * Shows revenue trend over the last 7 days with total and percentage change.
 * 
 * @component
 */

'use client'

import { TrendingUp } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DailyRevenue {
  day: string
  revenue: number
}

interface RevenueChartMiniProps {
  /** Revenue data for last 7 days */
  data: DailyRevenue[]
  /** Total revenue for the period */
  totalRevenue: number
  /** Percentage change compared to previous period */
  changePercent: number
  /** Loading state */
  loading?: boolean
}

export default function RevenueChartMini({
  data,
  totalRevenue,
  changePercent,
  loading = false,
}: RevenueChartMiniProps) {
  const isPositive = changePercent >= 0

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-40 mb-2" />
        <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
        <div className="h-32 bg-gray-200 rounded" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <TrendingUp size={24} className="mr-2 text-red-600" />
          Weekly Revenue
        </h3>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${
            isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {isPositive ? '↑' : '↓'} {Math.abs(changePercent).toFixed(1)}%
        </span>
      </div>

      {/* Total Revenue */}
      <p className="text-2xl font-bold text-gray-800 mb-4">
        LKR {totalRevenue.toLocaleString()}
      </p>

      {/* Recharts Bar Chart */}
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 11 }}
          />
          <YAxis hide />
          <Tooltip
            formatter={(value: number) => [`LKR ${value.toLocaleString()}`, 'Revenue']}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Bar
            dataKey="revenue"
            fill="#DC2626"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
