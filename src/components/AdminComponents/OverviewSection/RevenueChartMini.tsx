/**
 * RevenueChartMini Component
 *
 * Compact weekly revenue chart with total, percentage change,
 * and rolling date range (last 7 days).
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

// =====================================================
// TYPES
// =====================================================

interface DailyRevenue {
  day: string          // Mon, Tue, Wed...
  revenue: number
  date: string         // YYYY-MM-DD (required)
}

interface RevenueChartMiniProps {
  data: DailyRevenue[]
  totalRevenue: number
  changePercent: number
  loading?: boolean
}

// =====================================================
// HELPERS
// =====================================================

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB')
}

// =====================================================
// COMPONENT
// =====================================================

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

  // ✅ Ensure valid dates + correct order
  const sortedData = data
    .filter((d) => d.date)
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    )

  const startDate =
    sortedData.length > 0 ? formatDate(sortedData[0].date) : null

  const endDate =
    sortedData.length > 0
      ? formatDate(sortedData[sortedData.length - 1].date)
      : null

  return (
    <></>
    // <div className="bg-white rounded-lg shadow-md p-6">
    //   {/* Header */}
    //   <div className="flex items-start justify-between mb-2">
    //     <h3 className="text-xl font-bold text-gray-800 flex items-center">
    //       <TrendingUp size={24} className="mr-2 text-red-600" />
    //       Weekly Revenue
    //     </h3>

    //     {/* % + Date range */}
    //     <div className="flex flex-col items-end">
    //       <span
    //         className={`text-xs font-semibold px-2 py-1 rounded ${
    //           isPositive
    //             ? 'bg-green-100 text-green-700'
    //             : 'bg-red-100 text-red-700'
    //         }`}
    //       >
    //         {isPositive ? '↑' : '↓'} {Math.abs(changePercent).toFixed(1)}%
    //       </span>

    //       {startDate && endDate && (
    //         <span className="mt-1 text-[11px] text-gray-500">
    //           {startDate} – {endDate}
    //         </span>
    //       )}
    //     </div>
    //   </div>

    //   {/* Total Revenue */}
    //   <p className="text-2xl font-bold text-gray-800 mb-4">
    //     LKR {totalRevenue.toLocaleString()}
    //   </p>

    //   {/* Chart */}
    //   <ResponsiveContainer width="100%" height={120}>
    //     <BarChart data={sortedData}>
    //       <XAxis
    //         dataKey="day"
    //         axisLine={false}
    //         tickLine={false}
    //         tick={{ fill: '#6b7280', fontSize: 11 }}
    //       />
    //       <YAxis hide />
    //       <Tooltip
    //         formatter={(value: number) => [
    //           `LKR ${value.toLocaleString()}`,
    //           'Revenue',
    //         ]}
    //         contentStyle={{
    //           backgroundColor: '#ffffff',
    //           border: '1px solid #e5e7eb',
    //           borderRadius: '8px',
    //           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    //         }}
    //       />
    //       <Bar
    //         dataKey="revenue"
    //         fill="#DC2626"
    //         radius={[4, 4, 0, 0]}
    //       />
    //     </BarChart>
    //   </ResponsiveContainer>
    // </div>
  )
}
