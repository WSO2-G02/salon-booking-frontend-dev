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
// TYPE DEFINITIONS (no changes)
// =====================================================
// export * from "./analyticsTypes"; // You can also keep your types in this file
// (All your interfaces remain exactly the same)

// =====================================================
// REVENUE ENDPOINTS
// =====================================================
export const getRevenueSummary = (start?: string, end?: string) =>
  apiRequest("/api/v1/analytics/revenue/summary", {
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
  apiRequest("/api/v1/analytics/revenue/by-service", {
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
  apiRequest("/api/v1/analytics/services/popularity", {
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
  apiRequest("/api/v1/analytics/staff/performance", {
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
  apiRequest("/api/v1/analytics/appointments/summary", {
    start_date: start || "",
    end_date: end || "",
  });

export const getBookingTrends = (start?: string, end?: string) =>
  apiRequest("/api/v1/analytics/appointments/trends", {
    start_date: start || "",
    end_date: end || "",
  });

export const getPeakHours = (start?: string, end?: string) =>
  apiRequest("/api/v1/analytics/appointments/peak-hours", {
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
  apiRequest("/api/v1/analytics/customers/retention");

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
