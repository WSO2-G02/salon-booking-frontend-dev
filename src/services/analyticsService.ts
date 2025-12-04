const API_BASE = process.env.NEXT_PUBLIC_ANALYTICS_API_BASE

// =====================================================
// TYPE DEFINITIONS
// =====================================================

// Revenue Analytics Types
export interface RevenueSummary {
  total_revenue: number
  total_appointments: number
  completed_appointments: number
  cancelled_appointments: number
  average_revenue_per_appointment: number
  period_start: string | null
  period_end: string | null
}

export interface DailyRevenue {
  date: string
  revenue: number
  appointment_count: number
  completed_count: number
}

export interface MonthlyRevenue {
  year: number
  month: number
  month_name: string
  revenue: number
  appointment_count: number
  completed_count: number
}

export interface ServiceRevenue {
  service_id: number
  service_name: string
  category: string | null
  total_revenue: number
  booking_count: number
  average_price: number
  percentage_of_total: number
}

export interface StaffRevenue {
  staff_id: number
  staff_name: string
  position: string | null
  total_revenue: number
  booking_count: number
  completed_count: number
  average_revenue_per_booking: number
  percentage_of_total: number
}

// Service Analytics Types
export interface ServicePopularity {
  service_id: number
  service_name: string
  category: string | null
  booking_count: number
  completed_count: number
  cancellation_count: number
  completion_rate: number
  rank: number
}

export interface ServicePerformance {
  service_id: number
  service_name: string
  category: string | null
  total_revenue: number
  booking_count: number
  average_price: number
  average_duration: number
  completion_rate: number
}

// Staff Analytics Types
export interface StaffPerformance {
  staff_id: number
  staff_name: string
  position: string | null
  total_appointments: number
  completed_appointments: number
  cancelled_appointments: number
  no_show_appointments: number
  total_revenue: number
  completion_rate: number
  average_revenue_per_appointment: number
}

export interface StaffStats {
  staff_id: number
  staff_name: string
  position: string | null
  total_appointments: number
  completed_appointments: number
  cancelled_appointments: number
  no_show_appointments: number
  pending_appointments: number
  total_revenue: number
  average_rating: number | null
  top_services: Array<Record<string, unknown>>
  busiest_day: string | null
  busiest_hour: number | null
}

// Appointment Analytics Types
export interface AppointmentSummary {
  total_appointments: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
  no_show: number
  completion_rate: number
  cancellation_rate: number
  no_show_rate: number
}

export interface BookingTrend {
  date: string
  booking_count: number
  completed_count: number
  cancelled_count: number
}

export interface PeakHour {
  hour: number
  hour_label: string
  booking_count: number
  percentage: number
}

// Customer Analytics Types
export interface TopCustomer {
  user_id: number
  customer_name: string
  email: string | null
  total_spent: number
  visit_count: number
  average_spent_per_visit: number
  last_visit: string | null
  rank: number
}

export interface CustomerRetention {
  total_customers: number
  new_customers_this_month: number
  returning_customers: number
  retention_rate: number
  average_visits_per_customer: number
  average_lifetime_value: number
}

// Dashboard Combined Type
export interface DashboardData {
  revenue_summary: RevenueSummary
  appointment_summary: AppointmentSummary
  top_services: ServicePopularity[]
  top_staff: StaffPerformance[]
  recent_revenue: DailyRevenue[]
}

// Legacy types for backward compatibility with existing components
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
 * Get authorization token from Storage
 */
function getAuthToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
}

/**
 * Helper function to make authenticated API requests
 */
async function apiRequest<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const token = getAuthToken()
  const url = new URL(`${API_BASE}${endpoint}`)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value)
    })
  }

  const res = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`API Error ${res.status}: ${errorText}`)
  }
  
  return await res.json()
}

// =====================================================
// REVENUE ANALYTICS ENDPOINTS
// =====================================================

/**
 * Get revenue summary
 * Endpoint: GET /api/v1/analytics/revenue/summary
 */
export async function getRevenueSummary(startDate?: string, endDate?: string): Promise<RevenueSummary> {
  return apiRequest<RevenueSummary>('/api/v1/analytics/revenue/summary', {
    start_date: startDate || '',
    end_date: endDate || '',
  })
}

/**
 * Get daily revenue data
 * Endpoint: GET /api/v1/analytics/revenue/daily
 */
export async function getDailyRevenue(startDate?: string, endDate?: string): Promise<DailyRevenue[]> {
  return apiRequest<DailyRevenue[]>('/api/v1/analytics/revenue/daily', {
    start_date: startDate || '',
    end_date: endDate || '',
  })
}

/**
 * Get monthly revenue data
 * Endpoint: GET /api/v1/analytics/revenue/monthly
 */
export async function getMonthlyRevenue(months?: number): Promise<MonthlyRevenue[]> {
  return apiRequest<MonthlyRevenue[]>('/api/v1/analytics/revenue/monthly', {
    months: months?.toString() || '',
  })
}

/**
 * Get revenue for a specific date range (required dates)
 * Endpoint: GET /api/v1/analytics/revenue/by-date-range
 */
export async function getRevenueByDateRange(startDate: string, endDate: string): Promise<RevenueSummary> {
  return apiRequest<RevenueSummary>('/api/v1/analytics/revenue/by-date-range', {
    start_date: startDate,
    end_date: endDate,
  })
}

/**
 * Get revenue by service
 * Endpoint: GET /api/v1/analytics/revenue/by-service
 */
export async function getRevenueByService(startDate?: string, endDate?: string, limit?: number): Promise<ServiceRevenue[]> {
  return apiRequest<ServiceRevenue[]>('/api/v1/analytics/revenue/by-service', {
    start_date: startDate || '',
    end_date: endDate || '',
    limit: limit?.toString() || '',
  })
}

/**
 * Get revenue by staff
 * Endpoint: GET /api/v1/analytics/revenue/by-staff
 */
export async function getRevenueByStaff(startDate?: string, endDate?: string, limit?: number): Promise<StaffRevenue[]> {
  return apiRequest<StaffRevenue[]>('/api/v1/analytics/revenue/by-staff', {
    start_date: startDate || '',
    end_date: endDate || '',
    limit: limit?.toString() || '',
  })
}

// =====================================================
// SERVICE ANALYTICS ENDPOINTS
// =====================================================

/**
 * Get service popularity metrics
 * Endpoint: GET /api/v1/analytics/services/popularity
 */
export async function getServicePopularity(startDate?: string, endDate?: string, limit?: number): Promise<ServicePopularity[]> {
  return apiRequest<ServicePopularity[]>('/api/v1/analytics/services/popularity', {
    start_date: startDate || '',
    end_date: endDate || '',
    limit: limit?.toString() || '',
  })
}

/**
 * Get service performance metrics
 * Endpoint: GET /api/v1/analytics/services/performance
 */
export async function getServicePerformance(startDate?: string, endDate?: string): Promise<ServicePerformance[]> {
  return apiRequest<ServicePerformance[]>('/api/v1/analytics/services/performance', {
    start_date: startDate || '',
    end_date: endDate || '',
  })
}

// =====================================================
// STAFF ANALYTICS ENDPOINTS
// =====================================================

/**
 * Get staff performance metrics
 * Endpoint: GET /api/v1/analytics/staff/performance
 */
export async function getStaffPerformanceList(startDate?: string, endDate?: string, limit?: number): Promise<StaffPerformance[]> {
  return apiRequest<StaffPerformance[]>('/api/v1/analytics/staff/performance', {
    start_date: startDate || '',
    end_date: endDate || '',
    limit: limit?.toString() || '',
  })
}

/**
 * Get individual staff statistics
 * Endpoint: GET /api/v1/analytics/staff/{staff_id}/stats
 */
export async function getStaffStats(staffId: number, startDate?: string, endDate?: string): Promise<StaffStats> {
  return apiRequest<StaffStats>(`/api/v1/analytics/staff/${staffId}/stats`, {
    start_date: startDate || '',
    end_date: endDate || '',
  })
}

// =====================================================
// APPOINTMENT ANALYTICS ENDPOINTS
// =====================================================

/**
 * Get appointments summary
 * Endpoint: GET /api/v1/analytics/appointments/summary
 */
export async function getAppointmentsSummary(startDate?: string, endDate?: string): Promise<AppointmentSummary> {
  return apiRequest<AppointmentSummary>('/api/v1/analytics/appointments/summary', {
    start_date: startDate || '',
    end_date: endDate || '',
  })
}

/**
 * Get booking trends
 * Endpoint: GET /api/v1/analytics/appointments/trends
 */
export async function getBookingTrends(startDate?: string, endDate?: string): Promise<BookingTrend[]> {
  return apiRequest<BookingTrend[]>('/api/v1/analytics/appointments/trends', {
    start_date: startDate || '',
    end_date: endDate || '',
  })
}

/**
 * Get peak hours data
 * Endpoint: GET /api/v1/analytics/appointments/peak-hours
 */
export async function getPeakHours(startDate?: string, endDate?: string): Promise<PeakHour[]> {
  return apiRequest<PeakHour[]>('/api/v1/analytics/appointments/peak-hours', {
    start_date: startDate || '',
    end_date: endDate || '',
  })
}

// =====================================================
// CUSTOMER ANALYTICS ENDPOINTS
// =====================================================

/**
 * Get top customers
 * Endpoint: GET /api/v1/analytics/customers/top
 */
export async function getTopCustomers(startDate?: string, endDate?: string, limit?: number): Promise<TopCustomer[]> {
  return apiRequest<TopCustomer[]>('/api/v1/analytics/customers/top', {
    start_date: startDate || '',
    end_date: endDate || '',
    limit: limit?.toString() || '',
  })
}

/**
 * Get customer retention metrics
 * Endpoint: GET /api/v1/analytics/customers/retention
 */
export async function getCustomerRetention(): Promise<CustomerRetention> {
  return apiRequest<CustomerRetention>('/api/v1/analytics/customers/retention')
}

// =====================================================
// DASHBOARD ENDPOINT
// =====================================================

/**
 * Get combined dashboard data
 * Endpoint: GET /api/v1/analytics/dashboard
 */
export async function getDashboardData(startDate?: string, endDate?: string): Promise<DashboardData> {
  return apiRequest<DashboardData>('/api/v1/analytics/dashboard', {
    start_date: startDate || '',
    end_date: endDate || '',
  })
}

// =====================================================
// LEGACY API FUNCTION - For backward compatibility
// =====================================================

/**
 * Fetches comprehensive analytics data (legacy format)
 * Transforms new API responses to legacy format for existing components
 * Falls back to mock data if backend is unavailable
 */
export async function getAnalyticsData(
  startDate: string,
  endDate: string
): Promise<AnalyticsData> {
  try {
    // Fetch data from new endpoints
    const [
      revenueSummary,
      serviceRevenue,
      servicePopularity,
      appointmentSummary,
      staffPerformance,
      peakHours,
      customerRetention,
    ] = await Promise.all([
      getRevenueSummary(startDate, endDate),
      getRevenueByService(startDate, endDate, 10),
      getServicePopularity(startDate, endDate, 10),
      getAppointmentsSummary(startDate, endDate),
      getStaffPerformanceList(startDate, endDate, 10),
      getPeakHours(startDate, endDate),
      getCustomerRetention(),
    ])

    // Transform to legacy format
    return {
      revenue: {
        total_revenue: revenueSummary.total_revenue,
        average_revenue_per_appointment: revenueSummary.average_revenue_per_appointment,
        growth_percentage: 0, // Not directly available in new API
        revenue_by_service: serviceRevenue.map((s) => ({
          service_name: s.service_name,
          total_revenue: s.total_revenue,
        })),
      },
      servicePopularity: servicePopularity.map((s) => ({
        service_name: s.service_name,
        category: s.category || 'Uncategorized',
        booking_count: s.booking_count,
        total_revenue: 0, // Not in ServicePopularity, would need ServicePerformance
      })),
      appointments: {
        total: appointmentSummary.total_appointments,
        confirmed: appointmentSummary.confirmed,
        completed: appointmentSummary.completed,
        cancelled: appointmentSummary.cancelled,
        pending: appointmentSummary.pending,
      },
      businessInsights: {
        peak_hours: peakHours.map((p) => ({
          time_slot: p.hour_label,
          booking_count: p.booking_count,
        })),
        top_staff: staffPerformance.map((s) => ({
          name: s.staff_name,
          position: s.position || 'Staff',
          appointments_completed: s.completed_appointments,
          total_revenue: s.total_revenue,
        })),
        retention_rate: customerRetention.retention_rate,
        customer_satisfaction_score: 0, // Not available in new API
        total_customers: customerRetention.total_customers,
      },
    }
  } catch (error) {
    console.warn('⚠️ Backend API unavailable, using mock data:', error)
    return MOCK_DATA
  }
}

/**
 * Fetch staff performance report (legacy)
 * Endpoint: GET /api/v1/analytics/staff/{staff_id}/stats
 */
export async function getStaffPerformance(
  staffId: number,
  startDate?: string,
  endDate?: string
): Promise<{ staff_id: number; name: string; appointments_completed: number; total_revenue: number; average_rating: number }> {
  try {
    const stats = await getStaffStats(staffId, startDate, endDate)
    return {
      staff_id: stats.staff_id,
      name: stats.staff_name,
      appointments_completed: stats.completed_appointments,
      total_revenue: stats.total_revenue,
      average_rating: stats.average_rating || 0,
    }
  } catch (error) {
    console.warn('Backend API unavailable, using mock data:', error)
    return {
      staff_id: staffId,
      name: 'Mock Staff Member',
      appointments_completed: 45,
      total_revenue: 360000,
      average_rating: 4.7,
    }
  }
}
