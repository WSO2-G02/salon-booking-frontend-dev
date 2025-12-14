/**
 * OverviewTab Component
 *
 * Main dashboard overview displaying key metrics and summaries.
 * Aggregates data from multiple microservices to provide a quick snapshot.
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
  Wifi,
  LayoutDashboard,
} from 'lucide-react'
import { showToast } from '@/components/Toast'

// Sub-components
import StatCard from './OverviewSection/StatCard'
import QuickActionsCard from './OverviewSection/QuickActionsCard'
import RecentActivityCard from './OverviewSection/RecentActivityCard'
import TodayScheduleCard from './OverviewSection/TodayScheduleCard'
import ServiceHealthCard from './OverviewSection/ServiceHealthCard'
import RevenueChartMini from './OverviewSection/RevenueChartMini'
import TopServicesCard from './OverviewSection/TopServicesCard'

// Services
import {
  getWeeklyRevenue,
  normalizeLast7Days,
} from '@/services/analyticsService'

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
  date: string // ✅ REQUIRED for date range
}

interface OverviewTabProps {
  onTabChange?: (tab: string) => void
}

// =====================================================
// MOCK DATA
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

const MOCK_TOP_SERVICES: TopService[] = [
  { rank: 1, name: 'Hair Styling', category: 'Hair Care', bookings: 145, revenue: 580000 },
  { rank: 2, name: 'Bridal Makeup', category: 'Bridal', bookings: 32, revenue: 480000 },
  { rank: 3, name: 'Hair Coloring', category: 'Hair Care', bookings: 89, revenue: 400000 },
  { rank: 4, name: 'Deep Cleansing Facial', category: 'Facial', bookings: 78, revenue: 312000 },
  { rank: 5, name: 'Keratin Treatment', category: 'Hair Treatment', bookings: 45, revenue: 270000 },
]

const SERVICE_ENDPOINTS = [
  { name: 'User Service', endpoint: process.env.NEXT_PUBLIC_USER_API_BASE || '', healthPath: '/api/v1/health' },
  { name: 'Appointment Service', endpoint: process.env.NEXT_PUBLIC_APPOINTMENT_API_BASE || '', healthPath: '/api/v1/health' },
  { name: 'Staff Service', endpoint: process.env.NEXT_PUBLIC_STAFF_API_BASE || '', healthPath: '/api/v1/health' },
  { name: 'Services Management', endpoint: process.env.NEXT_PUBLIC_SERVICES_API_BASE || '', healthPath: '/api/v1/health' },
  { name: 'Analytics Service', endpoint: process.env.NEXT_PUBLIC_ANALYTICS_API_BASE || '', healthPath: '/api/v1/analytics/health' },
  { name: 'Notification Service', endpoint: process.env.NEXT_PUBLIC_NOTIFICATION_API_BASE || '', healthPath: '/api/v1/health' },
]

// =====================================================
// COMPONENT
// =====================================================

export default function OverviewTab({ onTabChange }: OverviewTabProps) {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<OverviewStats>(MOCK_STATS)
  const [schedule, setSchedule] = useState(MOCK_SCHEDULE)
  const [activities, setActivities] = useState(MOCK_ACTIVITIES)
  const [topServices, setTopServices] = useState(MOCK_TOP_SERVICES)
  const [revenueData, setRevenueData] = useState<DailyRevenue[]>([])
  const [serviceHealth, setServiceHealth] = useState<ServiceStatus[]>(
    SERVICE_ENDPOINTS.map((s) => ({ ...s, status: 'checking' }))
  )
  const [error, setError] = useState<string | null>(null)

  // =====================================================
  // SERVICE HEALTH
  // =====================================================

  const checkServiceHealth = useCallback(async () => {
    const results: ServiceStatus[] = []

    for (const service of SERVICE_ENDPOINTS) {
      const start = Date.now()
      try {
        const res = await fetch(`${service.endpoint}${service.healthPath}`, {
          signal: AbortSignal.timeout(5000),
        })
        results.push({
          ...service,
          status: res.ok ? 'online' : 'offline',
          responseTime: Date.now() - start,
        })
      } catch {
        results.push({ ...service, status: 'offline' })
      }
    }

    setServiceHealth(results)
  }, [])

  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const weekly = await getWeeklyRevenue()

      const normalized = normalizeLast7Days(
        weekly.data.map((d) => ({
          date: d.date!,
          revenue: d.revenue,
        }))
      )

      setRevenueData(
        normalized.map((d) => ({
          day: d.day,
          revenue: d.revenue,
          date: d.date,
        }))
      )

      setStats((prev) => ({
        ...prev,
        totalRevenue: weekly.totalRevenue,
        revenueTrend: weekly.changePercent,
      }))

      setSchedule(MOCK_SCHEDULE)
      setActivities(MOCK_ACTIVITIES)
      setTopServices(MOCK_TOP_SERVICES)

      await checkServiceHealth()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load dashboard'
      setError(msg)
      showToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }, [checkServiceHealth])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Unable to Load Dashboard
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={28} className="text-red-600" />
          <div>
            <h2 className="text-2xl font-bold">Welcome back, Admin!</h2>
            <p className="text-sm text-gray-600">
              Here's what's happening today
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded">
          <Wifi size={16} />
          {serviceHealth.filter((s) => s.status === 'online').length}/
          {serviceHealth.length} services online
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          Icon={Calendar}
          value={stats.todayAppointments}
          label="Today's Appointments"
          loading={loading}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          Icon={DollarSign}
          value={`LKR ${(stats.totalRevenue / 1000).toFixed(0)}K`}
          label="Total Revenue"
          loading={loading}
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          Icon={Users}
          value={stats.totalCustomers}
          label="Customers"
          loading={loading}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          Icon={Scissors}
          value={stats.activeServices}
          label="Services"
          loading={loading}
          bgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TodayScheduleCard schedule={schedule} loading={loading} />
          <RecentActivityCard activities={activities} loading={loading} />
        </div>

        <div className="space-y-6">
          <RevenueChartMini
            data={revenueData}
            totalRevenue={stats.totalRevenue}
            changePercent={stats.revenueTrend}
            loading={loading}
          />
          <QuickActionsCard onTabChange={onTabChange || (() => {})} />
          <TopServicesCard services={topServices} loading={loading} />
        </div>
      </div>

      <ServiceHealthCard
        services={serviceHealth}
        loading={loading}
        onRefresh={checkServiceHealth}
      />
    </div>
  )
}
