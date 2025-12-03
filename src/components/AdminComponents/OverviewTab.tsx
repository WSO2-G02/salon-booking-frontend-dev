/**
 * OverviewTab Component
 * 
 * Main dashboard overview displaying key metrics and summaries.
 * Aggregates data from multiple microservices to provide a quick snapshot.
 * 
 * Features:
 * - Key statistics cards (appointments, revenue, customers, services)
 * - Today's schedule
 * - Recent activity feed
 * - Revenue mini chart
 * - Top services
 * - Service health monitoring
 * - Quick action buttons
 * 
 * API Endpoints Used:
 * - Analytics: /api/v1/analytics/dashboard
 * - Analytics: /api/v1/analytics/revenue/summary
 * - Analytics: /api/v1/analytics/appointments/summary
 * - Analytics: /api/v1/analytics/services/popularity
 * - Appointments: /api/v1/appointments/date/{today}
 * - Health checks for all services
 * 
 * @component
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Scissors, 
  AlertCircle,
  Wifi 
} from 'lucide-react'
import { showToast } from '@/components/Toast'

// Import sub-components
import StatCard from './OverviewSection/StatCard'
import QuickActionsCard from './OverviewSection/QuickActionsCard'
import RecentActivityCard from './OverviewSection/RecentActivityCard'
import TodayScheduleCard from './OverviewSection/TodayScheduleCard'
import ServiceHealthCard from './OverviewSection/ServiceHealthCard'
import RevenueChartMini from './OverviewSection/RevenueChartMini'
import TopServicesCard from './OverviewSection/TopServicesCard'

// =====================================================
// TYPE DEFINITIONS
// =====================================================

interface OverviewStats {
  todayAppointments: number
  totalRevenue: number
  totalCustomers: number
  activeServices: number
  appointmentsTrend: number
  revenueTrend: number
  customersTrend: number
}

interface ScheduleItem {
  id: number
  time: string
  customerName: string
  serviceName: string
  staffName: string
  status: 'upcoming' | 'in-progress' | 'completed'
  duration: number
}

interface Activity {
  id: number
  type: 'appointment' | 'booking' | 'cancellation'
  customerName: string
  serviceName: string
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending'
  time: string
  staffName?: string
}

interface ServiceStatus {
  name: string
  endpoint: string
  status: 'online' | 'offline' | 'checking'
  responseTime?: number
}

interface TopService {
  rank: number
  name: string
  category: string
  bookings: number
  revenue: number
}

interface DailyRevenue {
  day: string
  revenue: number
}

interface OverviewTabProps {
  /** Callback to change active tab */
  onTabChange?: (tab: string) => void
}

// =====================================================
// MOCK DATA (Used when API is unavailable)
// =====================================================

const MOCK_STATS: OverviewStats = {
  todayAppointments: 12,
  totalRevenue: 2450000,
  totalCustomers: 156,
  activeServices: 24,
  appointmentsTrend: 8.5,
  revenueTrend: 15.3,
  customersTrend: 12.1,
}

const MOCK_SCHEDULE: ScheduleItem[] = [
  { id: 1, time: '09:00 AM', customerName: 'Sarah Johnson', serviceName: 'Hair Styling', staffName: 'Shalini F.', status: 'completed', duration: 60 },
  { id: 2, time: '10:30 AM', customerName: 'Emma Wilson', serviceName: 'Bridal Makeup', staffName: 'Ravi P.', status: 'in-progress', duration: 90 },
  { id: 3, time: '12:00 PM', customerName: 'Michael Brown', serviceName: 'Hair Cut', staffName: 'Kamal S.', status: 'upcoming', duration: 45 },
  { id: 4, time: '02:00 PM', customerName: 'Lisa Anderson', serviceName: 'Facial Treatment', staffName: 'Nimali W.', status: 'upcoming', duration: 60 },
  { id: 5, time: '03:30 PM', customerName: 'David Lee', serviceName: 'Hair Coloring', staffName: 'Shalini F.', status: 'upcoming', duration: 120 },
]

const MOCK_ACTIVITIES: Activity[] = [
  { id: 1, type: 'appointment', customerName: 'Sarah Johnson', serviceName: 'Hair Styling', status: 'completed', time: '10 min ago', staffName: 'Shalini F.' },
  { id: 2, type: 'appointment', customerName: 'Emma Wilson', serviceName: 'Bridal Makeup', status: 'confirmed', time: '25 min ago' },
  { id: 3, type: 'cancellation', customerName: 'John Doe', serviceName: 'Hair Cut', status: 'cancelled', time: '1 hour ago' },
  { id: 4, type: 'booking', customerName: 'Lisa Anderson', serviceName: 'Facial Treatment', status: 'pending', time: '2 hours ago' },
  { id: 5, type: 'appointment', customerName: 'Michael Brown', serviceName: 'Manicure', status: 'confirmed', time: '3 hours ago' },
]

const MOCK_REVENUE_DATA: DailyRevenue[] = [
  { day: 'Mon', revenue: 85000 },
  { day: 'Tue', revenue: 92000 },
  { day: 'Wed', revenue: 78000 },
  { day: 'Thu', revenue: 105000 },
  { day: 'Fri', revenue: 125000 },
  { day: 'Sat', revenue: 145000 },
  { day: 'Sun', revenue: 68000 },
]

const MOCK_TOP_SERVICES: TopService[] = [
  { rank: 1, name: 'Hair Styling', category: 'Hair Care', bookings: 145, revenue: 580000 },
  { rank: 2, name: 'Bridal Makeup', category: 'Bridal', bookings: 32, revenue: 480000 },
  { rank: 3, name: 'Hair Coloring', category: 'Hair Care', bookings: 89, revenue: 400000 },
  { rank: 4, name: 'Deep Cleansing Facial', category: 'Facial', bookings: 78, revenue: 312000 },
  { rank: 5, name: 'Keratin Treatment', category: 'Hair Treatment', bookings: 45, revenue: 270000 },
]

const SERVICE_ENDPOINTS = [
  { name: 'User Service', endpoint: 'https://user-service-salon.azurewebsites.net' },
  { name: 'Appointment Service', endpoint: 'https://appointment-service-salon.azurewebsites.net' },
  { name: 'Staff Service', endpoint: 'https://staff-service.azurewebsites.net' },
  { name: 'Services Management', endpoint: 'https://services-management.azurewebsites.net' },
  { name: 'Analytics Service', endpoint: 'https://analytics-report-service-salon.azurewebsites.net' },
  { name: 'Notification Service', endpoint: 'https://notification-service-salon.azurewebsites.net' },
]

// =====================================================
// COMPONENT
// =====================================================

export default function OverviewTab({ onTabChange }: OverviewTabProps) {
  // State
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<OverviewStats>(MOCK_STATS)
  const [schedule, setSchedule] = useState<ScheduleItem[]>(MOCK_SCHEDULE)
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES)
  const [revenueData, setRevenueData] = useState<DailyRevenue[]>(MOCK_REVENUE_DATA)
  const [topServices, setTopServices] = useState<TopService[]>(MOCK_TOP_SERVICES)
  const [serviceHealth, setServiceHealth] = useState<ServiceStatus[]>(
    SERVICE_ENDPOINTS.map((s) => ({ ...s, status: 'checking' as const }))
  )
  const [error, setError] = useState<string | null>(null)

  // =====================================================
  // DATA FETCHING
  // =====================================================

  /**
   * Check health of all backend services
   */
  const checkServiceHealth = useCallback(async () => {
    const results: ServiceStatus[] = []

    for (const service of SERVICE_ENDPOINTS) {
      const start = Date.now()
      try {
        const res = await fetch(`${service.endpoint}/api/v1/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        })
        const responseTime = Date.now() - start
        results.push({
          ...service,
          status: res.ok ? 'online' : 'offline',
          responseTime,
        })
      } catch {
        results.push({ ...service, status: 'offline' })
      }
    }

    setServiceHealth(results)
  }, [])

  /**
   * Load overview data from APIs
   */
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // In a real implementation, we would fetch from actual APIs:
      // const dashboardRes = await analyticsApiFetch('/api/v1/analytics/dashboard')
      // const appointmentsRes = await appointmentApiFetch('/api/v1/appointments/date/today')
      
      // For now, simulate API delay and use mock data
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Set mock data (replace with actual API calls when backend is ready)
      setStats(MOCK_STATS)
      setSchedule(MOCK_SCHEDULE)
      setActivities(MOCK_ACTIVITIES)
      setRevenueData(MOCK_REVENUE_DATA)
      setTopServices(MOCK_TOP_SERVICES)

      // Check service health
      await checkServiceHealth()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard data'
      setError(message)
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }, [checkServiceHealth])

  /**
   * Initial data load
   */
  useEffect(() => {
    loadData()
  }, [loadData])

  // =====================================================
  // TAB CHANGE HANDLER
  // =====================================================

  const handleTabChange = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab)
    }
  }

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    )
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Dashboard</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, Admin!</h1>
            <p className="text-slate-300">Here&apos;s what&apos;s happening at Aurora Salon today</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm">
            <Wifi size={16} className={serviceHealth.every(s => s.status === 'online') ? 'text-green-400' : 'text-yellow-400'} />
            <span className="text-slate-300">
              {serviceHealth.filter(s => s.status === 'online').length}/{serviceHealth.length} services online
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          Icon={Calendar}
          value={stats.todayAppointments}
          label="Today's Appointments"
          change={stats.appointmentsTrend}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          Icon={DollarSign}
          value={`LKR ${(stats.totalRevenue / 1000).toFixed(0)}K`}
          label="Total Revenue"
          change={stats.revenueTrend}
          bgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          Icon={Users}
          value={stats.totalCustomers}
          label="Total Customers"
          change={stats.customersTrend}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          Icon={Scissors}
          value={stats.activeServices}
          label="Active Services"
          bgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Schedule & Activity */}
        <div className="lg:col-span-2 space-y-6">
          <TodayScheduleCard schedule={schedule} />
          <RecentActivityCard activities={activities} />
        </div>

        {/* Right Column - Charts & Quick Actions */}
        <div className="space-y-6">
          <RevenueChartMini
            data={revenueData}
            totalRevenue={revenueData.reduce((sum, d) => sum + d.revenue, 0)}
            changePercent={stats.revenueTrend}
          />
          <QuickActionsCard onTabChange={handleTabChange} />
          <TopServicesCard services={topServices} />
        </div>
      </div>

      {/* Service Health Section */}
      <ServiceHealthCard
        services={serviceHealth}
        onRefresh={checkServiceHealth}
      />

      {/* API Integration Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">API Integration Notice</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              The Overview dashboard is currently displaying mock data for demonstration purposes.
              Once the backend APIs are fully connected, this dashboard will show real-time data from:
            </p>
            <ul className="text-blue-700 text-sm mt-2 ml-4 list-disc space-y-1">
              <li><strong>Analytics Service:</strong> Dashboard metrics, revenue summary, service popularity</li>
              <li><strong>Appointment Service:</strong> Today&apos;s schedule and recent activities</li>
              <li><strong>Health Endpoints:</strong> Service status monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
