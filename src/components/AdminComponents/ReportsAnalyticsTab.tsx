/**
 * ReportsAnalyticsTab Component
 * 
 * Main container for the Reports & Analytics dashboard.
 * Fetches data from the Reports & Analytics Service (Port 8006) and displays:
 * - Key metric cards (revenue, appointments, satisfaction, customers)
 * - Revenue breakdown chart
 * - Service popularity chart
 * - Staff performance chart
 * - Appointment status distribution
 * - Business insights with peak hours
 * 
 * API Endpoints Used (via analyticsService):
 * - GET /api/v1/analytics/revenue/summary
 * - GET /api/v1/analytics/revenue/by-service
 * - GET /api/v1/analytics/services/popularity
 * - GET /api/v1/analytics/appointments/summary
 * - GET /api/v1/analytics/staff/performance
 * - GET /api/v1/analytics/appointments/peak-hours
 * - GET /api/v1/analytics/customers/retention
 * 
 * @component
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAnalyticsData, type AnalyticsData } from '@/services/analyticsService'
import { showToast } from '@/components/Toast'
import { DollarSign, Calendar, Star, Users, Wifi, AlertCircle } from 'lucide-react'

// Import chart components
import MetricCard from './ReportsAnalytics/MetricCard'
import DateRangeFilter from './ReportsAnalytics/DateRangeFilter'
import RevenueChart from './ReportsAnalytics/RevenueChart'
import ServicePopularityChart from './ReportsAnalytics/ServicePopularityChart'
import StaffPerformanceChart from './ReportsAnalytics/StaffPerformanceChart'
import AppointmentStatusChart from './ReportsAnalytics/AppointmentStatusChart'
import BusinessInsightsChart from './ReportsAnalytics/BusinessInsightsChart'

export default function ReportsAnalyticsTab() {
  // =====================================================
  // STATE MANAGEMENT
  // =====================================================
  
  /** Loading state while fetching data */
  const [loading, setLoading] = useState(true)
  
  /** Analytics data from API */
  const [data, setData] = useState<AnalyticsData | null>(null)
  
  /** Selected date range (default: last 30 days) */
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  })
  
  /** Error message if data fetch fails */
  const [error, setError] = useState<string | null>(null)

  // =====================================================
  // DATA FETCHING
  // =====================================================
  
  /**
   * Load analytics data from API
   * Falls back to mock data if backend is unavailable
   */
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const analyticsData = await getAnalyticsData(dateRange.start, dateRange.end)
      setData(analyticsData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      showToast(errorMessage, 'error')
      // getAnalyticsData already falls back to mock data internally
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  /**
   * Fetch analytics data when date range changes
   */
  useEffect(() => {
    loadData()
  }, [loadData])

  // =====================================================
  // LOADING STATE
  // =====================================================
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        {/* Loading spinner */}
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading analytics data...</p>
      </div>
    )
  }

  // =====================================================
  // ERROR STATE
  // =====================================================
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center text-red-600">
          <AlertCircle size={48} className="mx-auto mb-3" />
          <p className="text-lg font-semibold">Error loading data</p>
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

  // Ensure data is loaded
  if (!data) return null

  // =====================================================
  // RENDER DASHBOARD
  // =====================================================
  
  return (
    <div className="space-y-6">
      {/* Date Range Filter Header */}
      <DateRangeFilter 
        dateRange={dateRange} 
        onDateRangeChange={setDateRange} 
      />

      {/* ================================================= */}
      {/* KEY METRICS ROW                                  */}
      {/* ================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Metric */}
        <MetricCard
          Icon={DollarSign}
          title="Total Revenue"
          value={`LKR ${data.revenue.total_revenue.toLocaleString()}`}
          change={data.revenue.growth_percentage}
          bgColor="bg-green-50"
          iconColor="text-green-600"
        />
        
        {/* Appointments Metric */}
        <MetricCard
          Icon={Calendar}
          title="Total Appointments"
          value={data.appointments.total.toString()}
          subtitle={`${data.appointments.confirmed} confirmed`}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        
        {/* Satisfaction Metric */}
        <MetricCard
          Icon={Star}
          title="Customer Satisfaction"
          value={`${data.businessInsights.customer_satisfaction_score}%`}
          subtitle="Based on feedback"
          bgColor="bg-yellow-50"
          iconColor="text-yellow-600"
        />
        
        {/* Customers Metric */}
        <MetricCard
          Icon={Users}
          title="Active Customers"
          value={data.businessInsights.total_customers.toString()}
          subtitle={`${data.businessInsights.retention_rate}% retention`}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* ================================================= */}
      {/* REVENUE BREAKDOWN CHART                          */}
      {/* ================================================= */}
      <RevenueChart data={data.revenue.revenue_by_service} />

      {/* ================================================= */}
      {/* TWO-COLUMN CHARTS SECTION                        */}
      {/* ================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Popularity Pie Chart */}
        <ServicePopularityChart data={data.servicePopularity} />

        {/* Staff Performance Bar Chart */}
        <StaffPerformanceChart data={data.businessInsights.top_staff} />
      </div>

      {/* ================================================= */}
      {/* APPOINTMENT STATUS DISTRIBUTION                  */}
      {/* ================================================= */}
      <AppointmentStatusChart data={data.appointments} />

      {/* ================================================= */}
      {/* BUSINESS INSIGHTS WITH PEAK HOURS                */}
      {/* ================================================= */}
      <BusinessInsightsChart
        peakHours={data.businessInsights.peak_hours}
        averageRevenue={data.revenue.average_revenue_per_appointment}
        retentionRate={data.businessInsights.retention_rate}
        growthPercentage={data.revenue.growth_percentage}
      />

      {/* ================================================= */}
      {/* API INTEGRATION STATUS NOTICE                    */}
      {/* ================================================= */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-start space-x-3">
          <Wifi size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900 mb-1">API Integration Ready</p>
            <p className="text-sm text-blue-800">
              Currently displaying mock data for development. All 5 backend endpoints from the Reports & Analytics 
              Service (Port 8006) are integrated and ready. Set <code className="bg-blue-100 px-1 py-0.5 rounded text-xs">
              NEXT_PUBLIC_ANALYTICS_API_BASE=http://localhost:8006</code> to enable real-time data.
            </p>
            <p className="text-xs text-blue-600 mt-2">
              ✅ Endpoints: /reports/revenue, /reports/service-popularity, /reports/appointments-summary, 
              /reports/business-insights, /reports/stylist-performance
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
