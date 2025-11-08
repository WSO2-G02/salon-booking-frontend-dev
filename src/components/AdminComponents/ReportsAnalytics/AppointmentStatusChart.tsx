/**
 * AppointmentStatusChart Component
 * 
 * Displays appointment status distribution using status cards and a donut chart.
 * Data fetched from /api/v1/reports/appointments-summary endpoint.
 * 
 * Features:
 * - Status cards with color coding
 * - Donut chart (pie with inner radius)
 * - Color-coded segments (green, blue, red, amber)
 * - Legend at bottom
 * 
 * @component
 */

import { Calendar } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import StatusCard from './StatusCard'

interface AppointmentData {
  total: number
  confirmed: number
  completed: number
  cancelled: number
  pending: number
}

interface AppointmentStatusChartProps {
  /** Appointment summary data */
  data: AppointmentData
}

export default function AppointmentStatusChart({ data }: AppointmentStatusChartProps) {
  // Prepare data for donut chart with colors
  const chartData = [
    { name: 'Confirmed', value: data.confirmed, color: '#10B981' },
    { name: 'Completed', value: data.completed, color: '#3B82F6' },
    { name: 'Cancelled', value: data.cancelled, color: '#EF4444' },
    { name: 'Pending', value: data.pending, color: '#F59E0B' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Chart header */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Calendar size={24} className="mr-2 text-blue-600" />
        Appointment Status Distribution
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side: Status cards */}
        <div className="grid grid-cols-2 gap-4">
          <StatusCard label="Total" value={data.total} color="bg-gray-100 text-gray-800" />
          <StatusCard label="Confirmed" value={data.confirmed} color="bg-green-100 text-green-800" />
          <StatusCard label="Completed" value={data.completed} color="bg-blue-100 text-blue-800" />
          <StatusCard label="Cancelled" value={data.cancelled} color="bg-red-100 text-red-800" />
        </div>
        
        {/* Right side: Donut chart */}
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {/* Apply colors to each segment */}
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            
            {/* Interactive tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            
            {/* Chart legend */}
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
