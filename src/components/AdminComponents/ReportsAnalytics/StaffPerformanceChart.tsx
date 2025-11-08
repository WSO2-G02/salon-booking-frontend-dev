/**
 * StaffPerformanceChart Component
 * 
 * Displays top performing staff with dual metrics using separate Y-axes.
 * Shows both appointments completed and total revenue per staff member.
 * Data fetched from /api/v1/reports/business-insights endpoint.
 * 
 * Features:
 * - Horizontal layout for better name readability
 * - Dual Y-axes (left for appointments, right for revenue)
 * - Separate scales to show both metrics clearly
 * - Interactive tooltips with formatted values
 * 
 * @component
 */

import { Trophy } from 'lucide-react'
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface StaffData {
  name: string
  position: string
  appointments_completed: number
  total_revenue: number
}

interface StaffPerformanceChartProps {
  /** Array of top staff performance data */
  data: StaffData[]
}

export default function StaffPerformanceChart({ data }: StaffPerformanceChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Chart header */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Trophy size={24} className="mr-2 text-yellow-600" />
        Top Performing Staff
      </h3>
      
      {/* Responsive chart container with dual Y-axes */}
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 60, left: 20, bottom: 10 }}
        >
          {/* Grid lines */}
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          
          {/* Left X-axis for appointments (purple) */}
          <XAxis
            xAxisId="appointments"
            type="number"
            orientation="top"
            tick={{ fill: '#A78BFA', fontSize: 11 }}
            label={{ value: 'Appointments', position: 'insideTop', offset: -5, fill: '#A78BFA', fontSize: 12, fontWeight: 600 }}
          />
          
          {/* Right X-axis for revenue (green) */}
          <XAxis
            xAxisId="revenue"
            type="number"
            orientation="bottom"
            tick={{ fill: '#10B981', fontSize: 11 }}
            label={{ value: 'Revenue (LKR)', position: 'insideBottom', offset: -5, fill: '#10B981', fontSize: 12, fontWeight: 600 }}
          />
          
          {/* Y-axis with staff names */}
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fill: '#6b7280', fontSize: 11 }}
          />
          
          {/* Interactive tooltip with custom formatting */}
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === 'Revenue (LKR)') return [`LKR ${value.toLocaleString()}`, 'Revenue']
              return [value, 'Appointments']
            }}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          
          {/* Chart legend */}
          <Legend wrapperStyle={{ paddingTop: '15px' }} />
          
          {/* Bar for appointments (purple) - uses left axis */}
          <Bar
            xAxisId="appointments"
            dataKey="appointments_completed"
            fill="#A78BFA"
            radius={[0, 4, 4, 0]}
            name="Appointments"
            barSize={20}
          />
          
          {/* Bar for revenue (green) - uses right axis */}
          <Bar
            xAxisId="revenue"
            dataKey="total_revenue"
            fill="#10B981"
            radius={[0, 4, 4, 0]}
            name="Revenue (LKR)"
            barSize={20}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
