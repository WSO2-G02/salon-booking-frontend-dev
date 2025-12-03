/**
 * TopServicesCard Component
 * 
 * Displays the top performing services using a horizontal bar chart.
 * Shows service name, category, booking count, and revenue.
 * 
 * @component
 */

'use client'

import { Award } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

// Color palette matching ServicePopularityChart
const COLORS = ['#DC2626', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']

interface TopService {
  rank: number
  name: string
  category: string
  bookings: number
  revenue: number
}

interface TopServicesCardProps {
  /** Top services data */
  services: TopService[]
  /** Loading state */
  loading?: boolean
}

export default function TopServicesCard({ services, loading = false }: TopServicesCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
        <div className="h-48 bg-gray-200 rounded" />
      </div>
    )
  }

  // Transform data for chart
  const chartData = services.map((s) => ({
    name: s.name.length > 15 ? s.name.substring(0, 15) + '...' : s.name,
    fullName: s.name,
    bookings: s.bookings,
    revenue: s.revenue,
  }))

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Award size={24} className="mr-2 text-red-600" />
        Top Services
      </h3>
      
      {services.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Award size={32} className="mx-auto mb-2 opacity-50" />
          <p>No service data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <XAxis
              type="number"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              width={75}
            />
            <Tooltip
              formatter={(value: number) => [`${value} bookings`, 'Bookings']}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="bookings" radius={[0, 4, 4, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
