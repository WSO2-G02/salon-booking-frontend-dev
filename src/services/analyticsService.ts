// // src/services/analyticsService.ts

// /**
//  * Analytics Service Client (Frontend)
//  *
//  * ✅ Calls Analytics microservice endpoints (FastAPI)
//  * ✅ Admin protected via JWT from User Service
//  * ✅ Provides typed methods + optional dummy/mock data fallback
//  *
//  * How to enable dummy data:
//  *   1) Create .env.local
//  *   2) Add:
//  *        NEXT_PUBLIC_USE_DUMMY_ANALYTICS=true
//  *
//  * When enabled, ALL functions return mock data instantly (no network calls).
//  */

// "use client";

// // =====================================================
// // CONFIGURATION
// // =====================================================

// /** Analytics service base URL (e.g., http://localhost:8005 or Azure URL) */
// const API_BASE = process.env.NEXT_PUBLIC_ANALYTICS_API_BASE!;

// /**
//  * Enable dummy data mode:
//  * - Good for UI development when backend is down
//  * - Good for demos
//  */
// const USE_DUMMY =
//   (process.env.NEXT_PUBLIC_USE_DUMMY_ANALYTICS || "").toLowerCase() === "true";

// // =====================================================
// // AUTH TOKEN (ADMIN JWT FROM USER SERVICE)
// // =====================================================

// /**
//  * Reads admin JWT from browser storage.
//  * NOTE: You said you store access token as "access_token"
//  */
// function getAuthToken(): string | null {
//   return typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
// }

// // =====================================================
// // GENERIC REQUEST WRAPPER
// // =====================================================

// /**
//  * apiRequest()
//  * - Adds Authorization header (Bearer token)
//  * - Appends query params
//  * - Throws with API status + body text
//  */
// async function apiRequest<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
//   const token = getAuthToken();

//   if (!token) {
//     throw new Error("Admin authentication required");
//   }

//   const url = new URL(`${API_BASE}${endpoint}`);

//   if (params) {
//     Object.entries(params).forEach(([k, v]) => {
//       if (v !== undefined && v !== null && v !== "") url.searchParams.append(k, v);
//     });
//   }

//   const res = await fetch(url.toString(), {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`API ${res.status}: ${text}`);
//   }

//   return res.json();
// }

// // =====================================================
// // TYPE DEFINITIONS (MATCH BACKEND README)
// // =====================================================

// /** GET /api/v1/analytics/revenue/summary */
// export interface RevenueSummary {
//   total_revenue: number;
//   total_appointments: number;
//   completed_appointments: number;
//   cancelled_appointments: number;
//   average_revenue_per_appointment: number;
//   period_start: string | null;
//   period_end: string | null;
// }

// /** GET /api/v1/analytics/revenue/daily */
// export interface DailyRevenueAPI {
//   date: string;
//   revenue: number;
//   appointment_count: number;
//   completed_count: number;
// }

// /** GET /api/v1/analytics/revenue/monthly */
// export interface MonthlyRevenue {
//   year: number;
//   month: number;
//   month_name: string;
//   revenue: number;
//   appointment_count: number;
//   completed_count: number;
// }

// /** GET /api/v1/analytics/revenue/by-service */
// export interface ServiceRevenue {
//   service_id: number;
//   service_name: string;
//   category: string;
//   total_revenue: number;
//   booking_count: number;
//   average_price: number;
//   percentage_of_total: number;
// }

// /** GET /api/v1/analytics/revenue/by-staff */
// export interface StaffRevenue {
//   staff_id: number;
//   staff_name: string;
//   position: string;
//   total_revenue: number;
//   booking_count: number;
//   completed_count: number;
//   average_revenue_per_booking: number;
//   percentage_of_total: number;
// }

// /** GET /api/v1/analytics/services/popularity */
// export interface ServicePopularity {
//   service_id: number;
//   service_name: string;
//   category: string;
//   booking_count: number;
//   completed_count: number;
//   cancellation_count: number;
//   completion_rate: number;
//   rank: number;
// }

// /** GET /api/v1/analytics/appointments/summary */
// export interface AppointmentSummary {
//   total_appointments: number;
//   pending: number;
//   confirmed: number;
//   completed: number;
//   cancelled: number;
//   no_show: number;
//   completion_rate: number;
//   cancellation_rate: number;
//   no_show_rate: number;
// }

// /** GET /api/v1/analytics/appointments/peak-hours */
// export interface PeakHour {
//   hour: number;
//   hour_label: string;
//   booking_count: number;
//   percentage: number;
// }

// /** GET /api/v1/analytics/customers/retention */
// export interface CustomerRetention {
//   total_customers: number;
//   new_customers_this_month: number;
//   returning_customers: number;
//   retention_rate: number;
//   average_visits_per_customer: number;
//   average_lifetime_value: number;
// }

// /**
//  * GET /api/v1/analytics/dashboard
//  * Matches README response shape
//  */
// export interface DashboardAPIResponse {
//   revenue_summary: {
//     total_revenue: number;
//     total_appointments?: number;
//     completed_appointments?: number;
//     cancelled_appointments?: number;
//     average_revenue_per_appointment: number;
//     period_start?: string | null;
//     period_end?: string | null;
//   };
//   appointment_summary: {
//     total_appointments: number;
//     pending: number;
//     confirmed: number;
//     completed: number;
//     cancelled: number;
//     no_show?: number;
//   };
//   top_services: Array<{
//     service_name: string;
//     total_revenue: number;
//     booking_count?: number;
//     category?: string;
//   }>;
//   top_staff: Array<{
//     staff_name: string;
//     position: string;
//     total_revenue: number;
//     completed_appointments: number;
//   }>;
//   recent_revenue?: any[];
// }

// // =====================================================
// // DUMMY DATA (FOR UI DEV / DEMO)
// // =====================================================

// const DUMMY_REVENUE_SUMMARY: RevenueSummary = {
//   total_revenue: 245000,
//   total_appointments: 120,
//   completed_appointments: 95,
//   cancelled_appointments: 12,
//   average_revenue_per_appointment: 2578.95,
//   period_start: "2025-12-01",
//   period_end: "2025-12-30",
// };

// const DUMMY_DAILY_REVENUE: DailyRevenueAPI[] = (() => {
//   // last 7 days dummy
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const out: DailyRevenueAPI[] = [];
//   for (let i = 6; i >= 0; i--) {
//     const d = new Date(today);
//     d.setDate(today.getDate() - i);
//     const iso = d.toISOString().split("T")[0];

//     out.push({
//       date: iso,
//       revenue: Math.floor(20000 + Math.random() * 60000),
//       appointment_count: Math.floor(5 + Math.random() * 18),
//       completed_count: Math.floor(3 + Math.random() * 15),
//     });
//   }
//   return out;
// })();

// const DUMMY_MONTHLY_REVENUE: MonthlyRevenue[] = [
//   { year: 2025, month: 10, month_name: "October", revenue: 180000, appointment_count: 88, completed_count: 72 },
//   { year: 2025, month: 11, month_name: "November", revenue: 220000, appointment_count: 102, completed_count: 84 },
//   { year: 2025, month: 12, month_name: "December", revenue: 245000, appointment_count: 120, completed_count: 95 },
// ];

// const DUMMY_REVENUE_BY_SERVICE: ServiceRevenue[] = [
//   { service_id: 1, service_name: "Hair Cut", category: "Hair", total_revenue: 85000, booking_count: 40, average_price: 2125, percentage_of_total: 34.7 },
//   { service_id: 2, service_name: "Hair Coloring", category: "Hair", total_revenue: 62000, booking_count: 18, average_price: 3444, percentage_of_total: 25.3 },
//   { service_id: 3, service_name: "Facial", category: "Skin", total_revenue: 43000, booking_count: 22, average_price: 1954, percentage_of_total: 17.6 },
//   { service_id: 4, service_name: "Manicure", category: "Nails", total_revenue: 30000, booking_count: 25, average_price: 1200, percentage_of_total: 12.2 },
// ];

// const DUMMY_REVENUE_BY_STAFF: StaffRevenue[] = [
//   { staff_id: 1, staff_name: "Shalini F.", position: "Senior Stylist", total_revenue: 98000, booking_count: 35, completed_count: 30, average_revenue_per_booking: 2800, percentage_of_total: 40 },
//   { staff_id: 2, staff_name: "Ravi P.", position: "Makeup Artist", total_revenue: 72000, booking_count: 20, completed_count: 18, average_revenue_per_booking: 3600, percentage_of_total: 29 },
//   { staff_id: 3, staff_name: "Nimali W.", position: "Therapist", total_revenue: 42000, booking_count: 22, completed_count: 19, average_revenue_per_booking: 1909, percentage_of_total: 17 },
// ];

// const DUMMY_SERVICE_POPULARITY: ServicePopularity[] = [
//   { service_id: 1, service_name: "Hair Cut", category: "Hair", booking_count: 48, completed_count: 42, cancellation_count: 3, completion_rate: 87.5, rank: 1 },
//   { service_id: 3, service_name: "Facial", category: "Skin", booking_count: 36, completed_count: 33, cancellation_count: 1, completion_rate: 91.7, rank: 2 },
//   { service_id: 4, service_name: "Manicure", category: "Nails", booking_count: 30, completed_count: 28, cancellation_count: 1, completion_rate: 93.3, rank: 3 },
// ];

// const DUMMY_APPOINTMENT_SUMMARY: AppointmentSummary = {
//   total_appointments: 120,
//   pending: 10,
//   confirmed: 22,
//   completed: 95,
//   cancelled: 12,
//   no_show: 3,
//   completion_rate: 79.2,
//   cancellation_rate: 10.0,
//   no_show_rate: 2.5,
// };

// const DUMMY_PEAK_HOURS: PeakHour[] = [
//   { hour: 10, hour_label: "10:00 - 10:59", booking_count: 26, percentage: 22.0 },
//   { hour: 14, hour_label: "14:00 - 14:59", booking_count: 21, percentage: 17.8 },
//   { hour: 16, hour_label: "16:00 - 16:59", booking_count: 18, percentage: 15.2 },
// ];

// const DUMMY_CUSTOMER_RETENTION: CustomerRetention = {
//   total_customers: 156,
//   new_customers_this_month: 22,
//   returning_customers: 98,
//   retention_rate: 62.8,
//   average_visits_per_customer: 2.4,
//   average_lifetime_value: 14500,
// };

// const DUMMY_DASHBOARD: DashboardAPIResponse = {
//   revenue_summary: {
//     total_revenue: DUMMY_REVENUE_SUMMARY.total_revenue,
//     average_revenue_per_appointment: DUMMY_REVENUE_SUMMARY.average_revenue_per_appointment,
//     period_start: DUMMY_REVENUE_SUMMARY.period_start,
//     period_end: DUMMY_REVENUE_SUMMARY.period_end,
//   },
//   appointment_summary: {
//     total_appointments: DUMMY_APPOINTMENT_SUMMARY.total_appointments,
//     pending: DUMMY_APPOINTMENT_SUMMARY.pending,
//     confirmed: DUMMY_APPOINTMENT_SUMMARY.confirmed,
//     completed: DUMMY_APPOINTMENT_SUMMARY.completed,
//     cancelled: DUMMY_APPOINTMENT_SUMMARY.cancelled,
//     no_show: DUMMY_APPOINTMENT_SUMMARY.no_show,
//   },
//   top_services: DUMMY_REVENUE_BY_SERVICE.map((s) => ({
//     service_name: s.service_name,
//     total_revenue: s.total_revenue,
//     category: s.category,
//     booking_count: s.booking_count,
//   })),
//   top_staff: DUMMY_REVENUE_BY_STAFF.map((s) => ({
//     staff_name: s.staff_name,
//     position: s.position,
//     total_revenue: s.total_revenue,
//     completed_appointments: s.completed_count,
//   })),
//   recent_revenue: DUMMY_DAILY_REVENUE,
// };

// // =====================================================
// // REVENUE ENDPOINTS
// // =====================================================

// /**
//  * ✅ GET /api/v1/analytics/revenue/summary
//  * Overall revenue summary (supports date range filters in backend)
//  * Query params: start_date, end_date
//  */
// export const getRevenueSummary = async (start?: string, end?: string) => {
//   if (USE_DUMMY) return DUMMY_REVENUE_SUMMARY;

//   return apiRequest<RevenueSummary>("/api/v1/analytics/revenue/summary", {
//     start_date: start || "",
//     end_date: end || "",
//   });
// };

// /**
//  * ✅ GET /api/v1/analytics/revenue/daily
//  * Daily revenue breakdown (supports limit)
//  * Query params: limit
//  */
// export const getDailyRevenue = async (limit = 7) => {
//   if (USE_DUMMY) return DUMMY_DAILY_REVENUE.slice(-limit);

//   return apiRequest<DailyRevenueAPI[]>("/api/v1/analytics/revenue/daily", {
//     limit: limit.toString(),
//   });
// };

// /**
//  * ✅ GET /api/v1/analytics/revenue/monthly
//  * Monthly revenue breakdown for a year
//  * Query params: year
//  */
// export const getMonthlyRevenue = async (year?: number) => {
//   if (USE_DUMMY) return DUMMY_MONTHLY_REVENUE;

//   return apiRequest<MonthlyRevenue[]>("/api/v1/analytics/revenue/monthly", {
//     year: year?.toString() || "",
//   });
// };

// /**
//  * ✅ GET /api/v1/analytics/revenue/by-service
//  * Revenue grouped by service
//  * Query params: limit
//  */
// export const getRevenueByService = async (limit = 10) => {
//   if (USE_DUMMY) return DUMMY_REVENUE_BY_SERVICE.slice(0, limit);

//   return apiRequest<ServiceRevenue[]>("/api/v1/analytics/revenue/by-service", {
//     limit: limit.toString(),
//   });
// };

// /**
//  * ✅ GET /api/v1/analytics/revenue/by-staff
//  * Revenue grouped by staff
//  * Query params: limit
//  */
// export const getRevenueByStaff = async (limit = 10) => {
//   if (USE_DUMMY) return DUMMY_REVENUE_BY_STAFF.slice(0, limit);

//   return apiRequest<StaffRevenue[]>("/api/v1/analytics/revenue/by-staff", {
//     limit: limit.toString(),
//   });
// };

// // =====================================================
// // SERVICE ANALYTICS
// // =====================================================

// /**
//  * ✅ GET /api/v1/analytics/services/popularity
//  * Service popularity ranking
//  * Query params: limit
//  */
// export const getServicePopularity = async (limit = 10) => {
//   if (USE_DUMMY) return DUMMY_SERVICE_POPULARITY.slice(0, limit);

//   return apiRequest<ServicePopularity[]>("/api/v1/analytics/services/popularity", {
//     limit: limit.toString(),
//   });
// };

// /**
//  * ✅ GET /api/v1/analytics/services/performance
//  * Service performance metrics (backend-defined response)
//  */
// export const getServicePerformance = async () => {
//   if (USE_DUMMY) return { data: "dummy service performance" };

//   return apiRequest("/api/v1/analytics/services/performance");
// };

// // =====================================================
// // STAFF ANALYTICS
// // =====================================================

// /**
//  * ✅ GET /api/v1/analytics/staff/performance
//  * Staff performance list (backend-defined response)
//  * Query params: limit
//  */
// export const getStaffPerformanceList = async (limit = 10) => {
//   if (USE_DUMMY) return DUMMY_REVENUE_BY_STAFF.slice(0, limit);

//   return apiRequest("/api/v1/analytics/staff/performance", {
//     limit: limit.toString(),
//   });
// };

// /**
//  * ✅ GET /api/v1/analytics/staff/{staff_id}/stats
//  * Individual staff statistics (backend-defined response)
//  */
// export const getStaffStats = async (id: number) => {
//   if (USE_DUMMY)
//     return {
//       staff_id: id,
//       staff_name: "Dummy Staff",
//       position: "Senior Stylist",
//       total_appointments: 50,
//       completed_appointments: 45,
//       cancelled_appointments: 3,
//       no_show_appointments: 2,
//       total_revenue: 1800,
//     };

//   return apiRequest(`/api/v1/analytics/staff/${id}/stats`);
// };

// // =====================================================
// // APPOINTMENT ANALYTICS
// // =====================================================

// /**
//  * ✅ GET /api/v1/analytics/appointments/summary
//  * Appointment status summary
//  */
// export const getAppointmentsSummary = async () => {
//   if (USE_DUMMY) return DUMMY_APPOINTMENT_SUMMARY;

//   return apiRequest<AppointmentSummary>("/api/v1/analytics/appointments/summary");
// };

// /**
//  * ✅ GET /api/v1/analytics/appointments/trends
//  * Booking trends over time (supports limit)
//  * Query params: limit
//  */
// export const getBookingTrends = async (limit = 7) => {
//   if (USE_DUMMY) return DUMMY_DAILY_REVENUE.slice(-limit);

//   return apiRequest("/api/v1/analytics/appointments/trends", {
//     limit: limit.toString(),
//   });
// };

// /**
//  * ✅ GET /api/v1/analytics/appointments/peak-hours
//  * Peak booking hours
//  */
// export const getPeakHours = async () => {
//   if (USE_DUMMY) return DUMMY_PEAK_HOURS;

//   return apiRequest<PeakHour[]>("/api/v1/analytics/appointments/peak-hours");
// };

// // =====================================================
// // CUSTOMER ANALYTICS
// // =====================================================

// /**
//  * ✅ GET /api/v1/analytics/customers/top
//  * Top customers (supports limit)
//  * Query params: limit
//  */
// export const getTopCustomers = async (limit = 10) => {
//   if (USE_DUMMY)
//     return Array.from({ length: Math.min(limit, 5) }).map((_, i) => ({
//       user_id: i + 1,
//       customer_name: `Customer ${i + 1}`,
//       total_spent: 10000 + i * 5000,
//       visit_count: 1 + i,
//       rank: i + 1,
//     }));

//   return apiRequest("/api/v1/analytics/customers/top", {
//     limit: limit.toString(),
//   });
// };

// /**
//  * ✅ GET /api/v1/analytics/customers/retention
//  * Customer retention metrics
//  */
// export const getCustomerRetention = async () => {
//   if (USE_DUMMY) return DUMMY_CUSTOMER_RETENTION;

//   return apiRequest<CustomerRetention>("/api/v1/analytics/customers/retention");
// };

// // =====================================================
// // DASHBOARD
// // =====================================================

// /**
//  * ✅ GET /api/v1/analytics/dashboard
//  * Combined dashboard data (backend response shape is DashboardAPIResponse)
//  * Query params: start_date, end_date
//  */
// export const getDashboardData = async (start?: string, end?: string) => {
//   if (USE_DUMMY) return DUMMY_DASHBOARD;

//   return apiRequest<DashboardAPIResponse>("/api/v1/analytics/dashboard", {
//     start_date: start || "",
//     end_date: end || "",
//   });
// };

// // =====================================================
// // WEEKLY REVENUE (FRONTEND DERIVED)
// // =====================================================

// interface WeeklyChartPoint {
//   day: string;
//   revenue: number;
//   date: string;
// }

// /**
//  * getWeeklyRevenue()
//  * - Calls daily revenue limit=7
//  * - Normalizes calendar days so chart always shows 7 bars
//  * - Returns chart data + total + % change
//  */
// export async function getWeeklyRevenue(): Promise<{
//   data: WeeklyChartPoint[];
//   totalRevenue: number;
//   changePercent: number;
// }> {
//   const daily = await getDailyRevenue(7);

//   // Normalize dates (UTC SAFE)
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const map = new Map<string, number>();
//   daily.forEach((d) => {
//     map.set(d.date, d.revenue);
//   });

//   const result: WeeklyChartPoint[] = [];

//   for (let i = 6; i >= 0; i--) {
//     const d = new Date(today);
//     d.setDate(today.getDate() - i);

//     const iso = d.toISOString().split("T")[0];

//     result.push({
//       date: iso,
//       day: d.toLocaleDateString("en-US", { weekday: "short" }),
//       revenue: map.get(iso) || 0,
//     });
//   }

//   const totalRevenue = result.reduce((s, d) => s + d.revenue, 0);

//   let changePercent = 0;
//   if (result.length >= 2 && result[0].revenue > 0) {
//     changePercent =
//       ((result[result.length - 1].revenue - result[0].revenue) / result[0].revenue) *
//       100;
//   }

//   return {
//     data: result,
//     totalRevenue,
//     changePercent: Number(changePercent.toFixed(1)),
//   };
// }

// /**
//  * normalizeLast7Days()
//  * Exported because your OverviewTab imports it.
//  * It ensures all last 7 calendar days exist even if API returns gaps.
//  */
// export function normalizeLast7Days(apiData: { date: string; revenue: number }[]) {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const revenueMap = new Map<string, number>();
//   apiData.forEach((d) => {
//     revenueMap.set(d.date, d.revenue);
//   });

//   const result: { date: string; day: string; revenue: number }[] = [];

//   for (let i = 6; i >= 0; i--) {
//     const day = new Date(today);
//     day.setDate(today.getDate() - i);

//     const isoDate = day.toISOString().split("T")[0];

//     result.push({
//       date: isoDate,
//       day: day.toLocaleDateString("en-US", { weekday: "short" }),
//       revenue: revenueMap.get(isoDate) || 0,
//     });
//   }

//   return result;
// }



// =====================================================
// ANALYTICS SERVICE (DUMMY MODE ENABLED)
// =====================================================
// 👉 All real API endpoints are COMMENTED
// 👉 Dummy data is returned for UI development
// 👉 Later: uncomment API calls & set USE_DUMMY = false
// =====================================================

const API_BASE = process.env.NEXT_PUBLIC_ANALYTICS_API_BASE!;
const USE_DUMMY = true;

// =====================================================
// AUTH TOKEN (ADMIN JWT FROM USER SERVICE)
// =====================================================
function getAuthToken(): string | null {
  return typeof window !== "undefined"
    ? localStorage.getItem("access_token")
    : null;
}

// =====================================================
// GENERIC REQUEST WRAPPER (REAL API - DISABLED)
// =====================================================

// async function apiRequest<T>(
//   endpoint: string,
//   params?: Record<string, string>
// ): Promise<T> {
//   const token = getAuthToken();
//   if (!token) throw new Error("Admin authentication required");
//
//   const url = new URL(`${API_BASE}${endpoint}`);
//   if (params) {
//     Object.entries(params).forEach(([k, v]) => {
//       if (v) url.searchParams.append(k, v);
//     });
//   }
//
//   const res = await fetch(url.toString(), {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });
//
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`API ${res.status}: ${text}`);
//   }
//
//   return res.json();
// }

// =====================================================
// TYPE DEFINITIONS
// =====================================================

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
  appointments: {
    total: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    pending: number;
  };
  servicePopularity: {
    service_name: string;
    category: string;
    booking_count: number;
    total_revenue: number;
  }[];
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
// DUMMY DASHBOARD DATA
// =====================================================

const DUMMY_ANALYTICS_DATA: AnalyticsData = {
  revenue: {
    total_revenue: 245000,
    average_revenue_per_appointment: 3500,
    growth_percentage: 12.5,
    revenue_by_service: [
      { service_name: "Hair Cut", total_revenue: 85000 },
      { service_name: "Facial", total_revenue: 62000 },
      { service_name: "Bridal Makeup", total_revenue: 98000 },
    ],
  },
  appointments: {
    total: 10,
    confirmed: 3,
    completed: 2,
    cancelled: 0,
    pending: 5,
  },
  servicePopularity: [
    { service_name: "Hair Relaxing", category: "Hair", booking_count: 2, total_revenue: 20000 },
    { service_name: "Hair Tint", category: "Hair", booking_count: 5, total_revenue: 12500 },
    { service_name: "Nail polish", category: "Nail", booking_count: 1, total_revenue: 15000 },
    { service_name: "Hair Cut", category: "Hair", booking_count: 2, total_revenue: 4000 },
  ],
  businessInsights: {
    total_customers: 22,
    retention_rate: 10,
    customer_satisfaction_score: 0,
    peak_hours: [
      { time_slot: "10:00 - 11:00", booking_count: 3 },
      { time_slot: "15:00 - 16:00", booking_count: 2 },
    ],
    top_staff: [
      {
        name: "JOHN DOE",
        position: "Senior Stylist",
        appointments_completed: 5,
        total_revenue: 24000,
      },
      {
        name: "EPM150",
        position: "Hair dresser",
        appointments_completed: 2,
        total_revenue: 5000,
      },
    ],
  },
};

// =====================================================
// DASHBOARD ROOT (USED BY UI)
// =====================================================

export async function getDashboardData(
  start?: string,
  end?: string
): Promise<AnalyticsData> {
  if (USE_DUMMY) {
    return DUMMY_ANALYTICS_DATA;
  }

  // 🔓 REAL API (ENABLE LATER)
  // return apiRequest<AnalyticsData>("/api/v1/analytics/dashboard", {
  //   start_date: start || "",
  //   end_date: end || "",
  // });

  throw new Error("Real API mode disabled");
}

// =====================================================
// WEEKLY REVENUE (USED BY OverviewTab)
// =====================================================

interface WeeklyChartPoint {
  day: string;
  revenue: number;
  date: string;
}

export async function getWeeklyRevenue(): Promise<{
  data: WeeklyChartPoint[];
  totalRevenue: number;
  changePercent: number;
}> {
  // Dummy last 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result: WeeklyChartPoint[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    result.push({
      date: d.toISOString().split("T")[0],
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      revenue: Math.floor(Math.random() * 30000) + 10000,
    });
  }

  const totalRevenue = result.reduce((s, d) => s + d.revenue, 0);

  const first = result[0].revenue;
  const last = result[result.length - 1].revenue;

  const changePercent =
    first > 0 ? ((last - first) / first) * 100 : 0;

  return {
    data: result,
    totalRevenue,
    changePercent: Number(changePercent.toFixed(1)),
  };
}

// =====================================================
// NORMALIZE LAST 7 DAYS (EXPORTED - FIXES YOUR ERROR)
// =====================================================

export function normalizeLast7Days(
  apiData: { date: string; revenue: number }[]
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const map = new Map<string, number>();
  apiData.forEach(d => map.set(d.date, d.revenue));

  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const iso = d.toISOString().split("T")[0];

    result.push({
      date: iso,
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      revenue: map.get(iso) || 0,
    });
  }

  return result;
}

// =====================================================
// LEGACY EXPORT (PREVENTS IMPORT ERRORS)
// =====================================================

export async function getAnalyticsData(
  start: string,
  end: string
): Promise<AnalyticsData> {
  return getDashboardData(start, end);
}
