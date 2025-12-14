// =====================================================
// CONFIGURATION
// =====================================================
const API_BASE = process.env.NEXT_PUBLIC_ANALYTICS_API_BASE;

// =====================================================
// AUTH TOKEN
// =====================================================
function getAuthToken(): string | null {
  return typeof window !== "undefined"
    ? localStorage.getItem("admin_token")
    : null;
}

// =====================================================
// GENERIC REQUEST WRAPPER
// =====================================================
async function apiRequest<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> {
  const token = getAuthToken();

  const url = new URL(`${API_BASE}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.append(k, v);
      }
    });
  }

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json();
}

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface RevenueSummary {
  total_revenue: number;
  average_revenue_per_appointment: number;
  growth_percentage?: number;
}

export interface ServiceRevenue {
  service_name: string;
  total_revenue: number;
}

export interface ServicePopularity {
  service_name: string;
  category?: string;
  booking_count: number;
}

export interface AppointmentSummary {
  total_appointments: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  pending: number;
}

export interface StaffPerformance {
  staff_name: string;
  position?: string;
  completed_appointments: number;
  total_revenue: number;
}

export interface PeakHour {
  hour_label: string;
  booking_count: number;
}

export interface CustomerRetention {
  total_customers: number;
  retention_rate: number;
}

export interface AnalyticsData {
  revenue: {
    total_revenue: number;
    average_revenue_per_appointment: number;
    growth_percentage: number;
    revenue_by_service: {
      service_name: string;
      total_revenue: number;
    }[];
  };
  servicePopularity: {
    service_name: string;
    category: string;
    booking_count: number;
    total_revenue: number;
  }[];
  appointments: {
    total: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    pending: number;
  };
  businessInsights: {
    peak_hours: {
      time_slot: string;
      booking_count: number;
    }[];
    top_staff: {
      name: string;
      position: string;
      appointments_completed: number;
      total_revenue: number;
    }[];
    retention_rate: number;
    customer_satisfaction_score: number;
    total_customers: number;
  };
}

// =====================================================
// REVENUE ENDPOINTS
// =====================================================
export const getRevenueSummary = (start?: string, end?: string) =>
  apiRequest<RevenueSummary>("/api/v1/analytics/revenue/summary", {
    start_date: start || "",
    end_date: end || "",
  });

export const getDailyRevenue = (start?: string, end?: string) =>
  apiRequest("/api/v1/analytics/revenue/daily", {
    start_date: start || "",
    end_date: end || "",
  });

export const getMonthlyRevenue = (months?: number) =>
  apiRequest("/api/v1/analytics/revenue/monthly", {
    months: months?.toString() || "",
  });

export const getRevenueByDateRange = (start: string, end: string) =>
  apiRequest("/api/v1/analytics/revenue/by-date-range", {
    start_date: start,
    end_date: end,
  });

export const getRevenueByService = (start?: string, end?: string, limit?: number) =>
  apiRequest<ServiceRevenue[]>("/api/v1/analytics/revenue/by-service", {
    start_date: start || "",
    end_date: end || "",
    limit: limit?.toString() || "",
  });

export const getRevenueByStaff = (start?: string, end?: string, limit?: number) =>
  apiRequest("/api/v1/analytics/revenue/by-staff", {
    start_date: start || "",
    end_date: end || "",
    limit: limit?.toString() || "",
  });

// =====================================================
// SERVICE ANALYTICS
// =====================================================
export const getServicePopularity = (start?: string, end?: string, limit?: number) =>
  apiRequest<ServicePopularity[]>("/api/v1/analytics/services/popularity", {
    start_date: start || "",
    end_date: end || "",
    limit: limit?.toString() || "",
  });

export const getServicePerformance = (start?: string, end?: string) =>
  apiRequest("/api/v1/analytics/services/performance", {
    start_date: start || "",
    end_date: end || "",
  });

// =====================================================
// STAFF ANALYTICS
// =====================================================
export const getStaffPerformanceList = (start?: string, end?: string, limit?: number) =>
  apiRequest<StaffPerformance[]>("/api/v1/analytics/staff/performance", {
    start_date: start || "",
    end_date: end || "",
    limit: limit?.toString() || "",
  });

export const getStaffStats = (id: number, start?: string, end?: string) =>
  apiRequest(`/api/v1/analytics/staff/${id}/stats`, {
    start_date: start || "",
    end_date: end || "",
  });

// =====================================================
// APPOINTMENTS ANALYTICS
// =====================================================
export const getAppointmentsSummary = (start?: string, end?: string) =>
  apiRequest<AppointmentSummary>("/api/v1/analytics/appointments/summary", {
    start_date: start || "",
    end_date: end || "",
  });

export const getBookingTrends = (start?: string, end?: string) =>
  apiRequest("/api/v1/analytics/appointments/trends", {
    start_date: start || "",
    end_date: end || "",
  });

export const getPeakHours = (start?: string, end?: string) =>
  apiRequest<PeakHour[]>("/api/v1/analytics/appointments/peak-hours", {
    start_date: start || "",
    end_date: end || "",
  });

// =====================================================
// CUSTOMER ANALYTICS
// =====================================================
export const getTopCustomers = (start?: string, end?: string, limit?: number) =>
  apiRequest("/api/v1/analytics/customers/top", {
    start_date: start || "",
    end_date: end || "",
    limit: limit?.toString() || "",
  });

export const getCustomerRetention = () =>
  apiRequest<CustomerRetention>("/api/v1/analytics/customers/retention");

// =====================================================
// DASHBOARD ROOT ENDPOINT
// =====================================================
export const getDashboardData = (start?: string, end?: string) =>
  apiRequest("/api/v1/analytics/dashboard", {
    start_date: start || "",
    end_date: end || "",
  });

// =====================================================
// LEGACY AGGREGATOR (PURE API, NO MOCKS)
// =====================================================
export async function getAnalyticsData(start: string, end: string) {
  const [
    revenueSummary,
    serviceRevenue,
    servicePopularity,
    appointmentSummary,
    staffPerformance,
    peakHours,
    customerRetention,
  ] = await Promise.all([
    getRevenueSummary(start, end),
    getRevenueByService(start, end, 10),
    getServicePopularity(start, end, 10),
    getAppointmentsSummary(start, end),
    getStaffPerformanceList(start, end, 10),
    getPeakHours(start, end),
    getCustomerRetention(),
  ]);

  return {
    revenue: {
      total_revenue: revenueSummary.total_revenue,
      average_revenue_per_appointment: revenueSummary.average_revenue_per_appointment,
      growth_percentage: 0,
      revenue_by_service: serviceRevenue.map((s) => ({
        service_name: s.service_name,
        total_revenue: s.total_revenue,
      })),
    },
    servicePopularity: servicePopularity.map((s) => ({
      service_name: s.service_name,
      category: s.category || "Uncategorized",
      booking_count: s.booking_count,
      total_revenue: 0,
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
        position: s.position || "Staff",
        appointments_completed: s.completed_appointments,
        total_revenue: s.total_revenue,
      })),
      retention_rate: customerRetention.retention_rate,
      customer_satisfaction_score: 0,
      total_customers: customerRetention.total_customers,
    },
  };
}


// =====================================================
// WEEKLY REVENUE (DERIVED FROM DAILY REVENUE)
// =====================================================

interface DailyRevenueAPI {
  date: string
  revenue: number
  appointment_count: number
  completed_count: number
}

interface WeeklyRevenue {
  day: string
  revenue: number
}

/**
 * Get last 7 days revenue (frontend-safe)
 */
export async function getWeeklyRevenue(): Promise<{
  data: { day: string; revenue: number; date: string }[]
  totalRevenue: number
  changePercent: number
}> {
  // 1️⃣ Fetch raw API data
  const daily: { date: string; revenue: number }[] = await apiRequest(
    "/api/v1/analytics/revenue/daily",
    { limit: "7" }
  )

  // 2️⃣ Filter → only last 7 calendar days
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 6)

  const filtered = daily.filter(d => {
    const date = new Date(d.date)
    return date >= sevenDaysAgo && date <= today
  })

  // 3️⃣ Normalize → ensure all 7 days exist
  const normalized = normalizeLast7Days(filtered)

  // 4️⃣ Chart-ready data
  const chartData = normalized.map(d => ({
    day: d.day,
    revenue: d.revenue,
    date: d.date,
  }))

  // 5️⃣ Totals
  const totalRevenue = chartData.reduce((s, d) => s + d.revenue, 0)

  // 6️⃣ Trend (first vs last day)
  let changePercent = 0
  if (chartData.length >= 2) {
    const first = chartData[0].revenue
    const last = chartData[chartData.length - 1].revenue
    if (first > 0) {
      changePercent = ((last - first) / first) * 100
    }
  }

  return {
    data: chartData,
    totalRevenue,
    changePercent: Number(changePercent.toFixed(1)),
  }
}

// utils/revenueUtils.ts
export function normalizeLast7Days(
  apiData: { date: string; revenue: number }[]
) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Create map for quick lookup
  const revenueMap = new Map<string, number>()
  apiData.forEach((d) => {
    revenueMap.set(d.date, d.revenue)
  })

  // Build last 7 calendar days
  const result = []

  for (let i = 6; i >= 0; i--) {
    const day = new Date(today)
    day.setDate(today.getDate() - i)

    const isoDate = day.toISOString().split("T")[0]

    result.push({
      date: isoDate,
      day: day.toLocaleDateString("en-US", { weekday: "short" }),
      revenue: revenueMap.get(isoDate) || 0,
    })
  }

  return result
}
