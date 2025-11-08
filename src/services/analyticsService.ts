const API_BASE = process.env.NEXT_PUBLIC_ANALYTICS_API_BASE || 'http://localhost:8006'

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface RevenueData {
  total_revenue: number
  revenue_by_service: Array<{
    service_name: string
    total_revenue: number
  }>
  average_revenue_per_appointment: number
  growth_percentage: number
}

export interface ServicePopularityData {
  service_name: string
  category: string
  booking_count: number
  total_revenue: number
}

export interface AppointmentsSummary {
  total: number
  confirmed: number
  completed: number
  cancelled: number
  pending: number
}

export interface BusinessInsights {
  peak_hours: Array<{
    time_slot: string
    booking_count: number
  }>
  top_staff: Array<{
    name: string
    position: string
    appointments_completed: number
    total_revenue: number
  }>
  retention_rate: number
  customer_satisfaction_score: number
  total_customers: number
}

export interface AnalyticsData {
  revenue: RevenueData
  servicePopularity: ServicePopularityData[]
  appointments: AppointmentsSummary
  businessInsights: BusinessInsights
}

// =====================================================
// MOCK DATA FOR DEVELOPMENT
// =====================================================

const MOCK_DATA: AnalyticsData = {
  revenue: {
    total_revenue: 2450000,
    growth_percentage: 15.3,
    average_revenue_per_appointment: 8500,
    revenue_by_service: [
      { service_name: 'Hair Styling & Coloring', total_revenue: 980000 },
      { service_name: 'Bridal Packages', total_revenue: 750000 },
      { service_name: 'Facial & Skincare', total_revenue: 420000 },
      { service_name: 'Manicure & Pedicure', total_revenue: 180000 },
      { service_name: 'Hair Treatment', total_revenue: 120000 },
    ],
  },
  servicePopularity: [
    {
      service_name: 'Hair Styling',
      category: 'Hair Care',
      booking_count: 145,
      total_revenue: 580000,
    },
    {
      service_name: 'Bridal Makeup',
      category: 'Bridal',
      booking_count: 32,
      total_revenue: 480000,
    },
    {
      service_name: 'Hair Coloring',
      category: 'Hair Care',
      booking_count: 89,
      total_revenue: 400000,
    },
    {
      service_name: 'Deep Cleansing Facial',
      category: 'Facial',
      booking_count: 78,
      total_revenue: 312000,
    },
    {
      service_name: 'Keratin Treatment',
      category: 'Hair Treatment',
      booking_count: 45,
      total_revenue: 270000,
    },
    {
      service_name: 'Manicure',
      category: 'Nail Care',
      booking_count: 95,
      total_revenue: 142500,
    },
    {
      service_name: 'Pedicure',
      category: 'Nail Care',
      booking_count: 87,
      total_revenue: 130500,
    },
  ],
  appointments: {
    total: 288,
    confirmed: 156,
    completed: 89,
    cancelled: 18,
    pending: 25,
  },
  businessInsights: {
    peak_hours: [
      { time_slot: '10:00 AM - 12:00 PM', booking_count: 78 },
      { time_slot: '02:00 PM - 04:00 PM', booking_count: 65 },
      { time_slot: '04:00 PM - 06:00 PM', booking_count: 54 },
    ],
    top_staff: [
      {
        name: 'Shalini Fernando',
        position: 'Senior Stylist',
        appointments_completed: 67,
        total_revenue: 536000,
      },
      {
        name: 'Ravi Perera',
        position: 'Hair Colorist',
        appointments_completed: 54,
        total_revenue: 432000,
      },
      {
        name: 'Nishani Silva',
        position: 'Beautician',
        appointments_completed: 48,
        total_revenue: 384000,
      },
      {
        name: 'Kasun Jayawardena',
        position: 'Stylist',
        appointments_completed: 42,
        total_revenue: 336000,
      },
    ],
    retention_rate: 78,
    customer_satisfaction_score: 92,
    total_customers: 456,
  },
}

// =====================================================
// API FUNCTIONS
// =====================================================

/**
 * Fetches comprehensive analytics data
 * Falls back to mock data if backend is unavailable
 */
export async function getAnalyticsData(
  startDate: string,
  endDate: string
): Promise<AnalyticsData> {
  try {
    // Try to fetch from real API
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null

    const [revenue, popularity, appointments, insights] = await Promise.all([
      fetchRevenueReport(startDate, endDate, token),
      fetchServicePopularity(token),
      fetchAppointmentsSummary(startDate, endDate, token),
      fetchBusinessInsights(token),
    ])

    return {
      revenue,
      servicePopularity: popularity,
      appointments,
      businessInsights: insights,
    }
  } catch (error) {
    console.warn('⚠️ Backend API unavailable, using mock data:', error)
    // Return mock data when backend is not available
    return MOCK_DATA
  }
}

/**
 * Fetch revenue report from API
 * Endpoint: GET /api/v1/reports/revenue
 */
async function fetchRevenueReport(
  startDate: string,
  endDate: string,
  token: string | null
): Promise<RevenueData> {
  const res = await fetch(
    `${API_BASE}/api/v1/reports/revenue?start_date=${startDate}&end_date=${endDate}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  )

  if (!res.ok) throw new Error('Failed to fetch revenue report')
  return await res.json()
}

/**
 * Fetch service popularity report from API
 * Endpoint: GET /api/v1/reports/service-popularity
 */
async function fetchServicePopularity(token: string | null): Promise<ServicePopularityData[]> {
  const res = await fetch(`${API_BASE}/api/v1/reports/service-popularity`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })

  if (!res.ok) throw new Error('Failed to fetch service popularity')
  return await res.json()
}

/**
 * Fetch appointments summary from API
 * Endpoint: GET /api/v1/reports/appointments-summary
 */
async function fetchAppointmentsSummary(
  startDate: string,
  endDate: string,
  token: string | null
): Promise<AppointmentsSummary> {
  const res = await fetch(
    `${API_BASE}/api/v1/reports/appointments-summary?start_date=${startDate}&end_date=${endDate}`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  )

  if (!res.ok) throw new Error('Failed to fetch appointments summary')
  return await res.json()
}

/**
 * Fetch business insights from API
 * Endpoint: GET /api/v1/reports/business-insights
 */
async function fetchBusinessInsights(token: string | null): Promise<BusinessInsights> {
  const res = await fetch(`${API_BASE}/api/v1/reports/business-insights`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })

  if (!res.ok) throw new Error('Failed to fetch business insights')
  return await res.json()
}

/**
 * Fetch staff performance report
 * Endpoint: GET /api/v1/reports/stylist-performance/{staff_id}
 */
export async function getStaffPerformance(
  staffId: number,
  startDate?: string,
  endDate?: string
): Promise<{ staff_id: number; name: string; appointments_completed: number; total_revenue: number; average_rating: number }> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    const params = new URLSearchParams()
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)

    const res = await fetch(
      `${API_BASE}/api/v1/reports/stylist-performance/${staffId}?${params}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    )

    if (!res.ok) throw new Error('Failed to fetch staff performance')
    return await res.json()
  } catch (error) {
    console.warn('⚠️ Backend API unavailable, using mock data:', error)
    return {
      staff_id: staffId,
      name: 'Mock Staff Member',
      appointments_completed: 45,
      total_revenue: 360000,
      average_rating: 4.7,
    }
  }
}
