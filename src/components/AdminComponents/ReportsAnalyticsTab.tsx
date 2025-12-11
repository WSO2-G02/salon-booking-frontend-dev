'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAnalyticsData, type AnalyticsData } from '@/services/analyticsService'
import { showToast } from '@/components/Toast'
import { DollarSign, Calendar, Star, Users, AlertCircle } from 'lucide-react'

// Charts
import MetricCard from './ReportsAnalytics/MetricCard'
import DateRangeFilter from './ReportsAnalytics/DateRangeFilter'
import RevenueChart from './ReportsAnalytics/RevenueChart'
import ServicePopularityChart from './ReportsAnalytics/ServicePopularityChart'
import StaffPerformanceChart from './ReportsAnalytics/StaffPerformanceChart'
import AppointmentStatusChart from './ReportsAnalytics/AppointmentStatusChart'
import BusinessInsightsChart from './ReportsAnalytics/BusinessInsightsChart'

export default function ReportsAnalyticsTab() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    end: new Date().toISOString().split('T')[0],
  })

  // ----------------------------
  // LOAD DATA FROM REAL API
  // ----------------------------
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const analyticsData = await getAnalyticsData(dateRange.start, dateRange.end)
      setData(analyticsData)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load analytics data'
      setError(msg)
      showToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    loadData()
  }, [loadData])

  // ----------------------------
  // LOADING SCREEN
  // ----------------------------
  if (loading && !data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading analytics data...</p>
      </div>
    )
  }

  // ----------------------------
  // ERROR SCREEN
  // ----------------------------
  if (error && !data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center text-red-600">
          <AlertCircle size={48} className="mx-auto mb-3" />
          <p className="text-lg font-semibold">Failed to load analytics</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  // ----------------------------
  // RENDER DASHBOARD
  // ----------------------------
  return (
    <div className="space-y-6">
      <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          Icon={DollarSign}
          title="Total Revenue"
          value={`LKR ${data.revenue.total_revenue.toLocaleString()}`}
          change={data.revenue.growth_percentage}
          bgColor="bg-green-50"
          iconColor="text-green-600"
        />

        <MetricCard
          Icon={Calendar}
          title="Total Appointments"
          value={data.appointments.total.toString()}
          subtitle={`${data.appointments.confirmed} confirmed`}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />

        <MetricCard
          Icon={Star}
          title="Customer Satisfaction"
          value={`${data.businessInsights.customer_satisfaction_score}%`}
          subtitle="Based on feedback"
          bgColor="bg-yellow-50"
          iconColor="text-yellow-600"
        />

        <MetricCard
          Icon={Users}
          title="Active Customers"
          value={data.businessInsights.total_customers.toString()}
          subtitle={`${data.businessInsights.retention_rate}% retention`}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* REVENUE CHART */}
      <RevenueChart data={data.revenue.revenue_by_service} />

      {/* TWO COLUMN CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ServicePopularityChart data={data.servicePopularity} />
        <StaffPerformanceChart data={data.businessInsights.top_staff} />
      </div>

      {/* APPOINTMENT STATUS */}
      <AppointmentStatusChart data={data.appointments} />

      {/* BUSINESS INSIGHTS */}
      <BusinessInsightsChart
        peakHours={data.businessInsights.peak_hours}
        averageRevenue={data.revenue.average_revenue_per_appointment}
        retentionRate={data.businessInsights.retention_rate}
        growthPercentage={data.revenue.growth_percentage}
      />
    </div>
  )
}
