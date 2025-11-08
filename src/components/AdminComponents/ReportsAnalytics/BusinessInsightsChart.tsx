/**
 * BusinessInsightsChart Component
 * 
 * Displays business insights including peak hours chart and key performance metrics.
 * Data fetched from /api/v1/reports/business-insights endpoint.
 * 
 * Features:
 * - Bar chart showing peak booking hours
 * - KPI cards for average revenue, retention rate, and growth
 * - Responsive two-column layout
 * 
 * @component
 */

import { Lightbulb, Clock, TrendingUp } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface PeakHour {
  time_slot: string
  booking_count: number
}

interface BusinessInsightsChartProps {
  /** Peak hours data */
  peakHours: PeakHour[]
  /** Average revenue per appointment */
  averageRevenue: number
  /** Customer retention rate percentage */
  retentionRate: number
  /** Revenue growth percentage */
  growthPercentage: number
}

export default function BusinessInsightsChart({
  peakHours,
  averageRevenue,
  retentionRate,
  growthPercentage,
}: BusinessInsightsChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Chart header */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Lightbulb size={24} className="mr-2 text-amber-600" />
        Business Insights
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side: Peak Hours Chart */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <Clock size={18} className="mr-2 text-blue-600" />
            Peak Booking Hours
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={peakHours}
              margin={{ top: 10, right: 10, left: -10, bottom: 40 }}
            >
              {/* Grid lines */}
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              
              {/* X-axis with angled labels */}
              <XAxis
                dataKey="time_slot"
                angle={-25}
                textAnchor="end"
                height={60}
                tick={{ fill: '#6b7280', fontSize: 11 }}
              />
              
              {/* Y-axis */}
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              
              {/* Interactive tooltip */}
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              
              {/* Bar with amber color */}
              <Bar dataKey="booking_count" fill="#F59E0B" radius={[6, 6, 0, 0]} name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right side: Key Performance Indicators */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <TrendingUp size={18} className="mr-2 text-green-600" />
            Key Performance Indicators
          </h4>
          <div className="space-y-3">
            {/* Average Revenue Card */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600 mb-1">Average Revenue per Appointment</p>
              <p className="text-2xl font-bold text-green-700">
                LKR {averageRevenue.toLocaleString()}
              </p>
            </div>
            
            {/* Retention Rate Card */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600 mb-1">Customer Retention Rate</p>
              <p className="text-2xl font-bold text-blue-700">{retentionRate}%</p>
            </div>
            
            {/* Growth Card */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600 mb-1">Revenue Growth</p>
              <p className="text-2xl font-bold text-purple-700">+{growthPercentage}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
