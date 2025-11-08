/**
 * ServicePopularityChart Component
 * 
 * Displays top 6 most popular services as a pie chart.
 * Data fetched from /api/v1/reports/service-popularity endpoint.
 * 
 * Features:
 * - Multi-color segments (6 colors)
 * - Custom labels with service name and booking count
 * - Interactive tooltips
 * - Legend at bottom
 * 
 * @component
 */

import { PieChart as PieChartIcon } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Color palette for pie chart segments
const COLORS = ['#DC2626', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899']

interface ServiceData {
  service_name: string
  category: string
  booking_count: number
  total_revenue: number
}

interface ServicePopularityChartProps {
  /** Array of service popularity data */
  data: ServiceData[]
}

export default function ServicePopularityChart({ data }: ServicePopularityChartProps) {
  // Transform data for pie chart (top 6 services only)
  const chartData = data.slice(0, 6).map((item) => ({
    name: item.service_name,
    value: item.booking_count,
    category: item.category,
  }))

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Chart header */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <PieChartIcon size={24} className="mr-2 text-red-600" />
        Most Popular Services
      </h3>
      
      {/* Responsive chart container */}
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.name}: ${entry.value}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {/* Apply colors to each segment */}
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          
          {/* Interactive tooltip */}
          <Tooltip
            formatter={(value: number) => [`${value} bookings`, 'Bookings']}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          
          {/* Chart legend */}
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
