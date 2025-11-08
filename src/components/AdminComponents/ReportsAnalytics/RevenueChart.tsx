/**
 * RevenueChart Component
 * 
 * Displays revenue breakdown by service category as a vertical bar chart.
 * Data fetched from /api/v1/reports/revenue endpoint.
 * 
 * Features:
 * - Responsive container
 * - Red bars matching brand color
 * - Tooltips with LKR formatting
 * - Angled labels for readability
 * 
 * @component
 */

import { BarChart3 } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface RevenueService {
  service_name: string
  total_revenue: number
}

interface RevenueChartProps {
  /** Array of services with revenue data */
  data: RevenueService[]
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Chart header */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <BarChart3 size={24} className="mr-2 text-red-600" />
        Revenue by Service Category
      </h3>
      
      {/* Responsive chart container */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          {/* Grid lines */}
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          
          {/* X-axis with angled labels */}
          <XAxis
            dataKey="service_name"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          
          {/* Y-axis with abbreviated numbers (e.g., 500k) */}
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          
          {/* Interactive tooltip */}
          <Tooltip
            formatter={(value: number) => [`LKR ${value.toLocaleString()}`, 'Revenue']}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          
          {/* Chart legend */}
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          {/* Bar with brand color and rounded corners */}
          <Bar
            dataKey="total_revenue"
            fill="#DC2626"
            radius={[8, 8, 0, 0]}
            name="Revenue (LKR)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
