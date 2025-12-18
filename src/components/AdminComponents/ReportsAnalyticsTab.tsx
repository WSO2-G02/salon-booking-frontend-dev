"use client";

import { useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/Toast";
import { DollarSign, Calendar, Star, Users, AlertCircle } from "lucide-react";

// 🔹 API (can be re-enabled later)
import { getDashboardData } from "@/services/analyticsService";

// Charts
import MetricCard from "./ReportsAnalytics/MetricCard";
import DateRangeFilter from "./ReportsAnalytics/DateRangeFilter";
import RevenueChart from "./ReportsAnalytics/RevenueChart";
import ServicePopularityChart from "./ReportsAnalytics/ServicePopularityChart";
import StaffPerformanceChart from "./ReportsAnalytics/StaffPerformanceChart";
import AppointmentStatusChart from "./ReportsAnalytics/AppointmentStatusChart";
import BusinessInsightsChart from "./ReportsAnalytics/BusinessInsightsChart";

// =====================================================
// TYPES (UI EXPECTED SHAPE)
// =====================================================

interface AnalyticsData {
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
    booking_count: number;
    category?: string;
  }[];
  businessInsights: {
    customer_satisfaction_score: number;
    total_customers: number;
    retention_rate: number;
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
  };
}

// =====================================================
// 🟡 DUMMY DATA (USED FOR UI DEV)
// =====================================================

const DUMMY_ANALYTICS_DATA: AnalyticsData = {
  revenue: {
    total_revenue: 51500,
    average_revenue_per_appointment: 5150,
    growth_percentage: 10.3,
    revenue_by_service: [
      { service_name: "Hair Relaxing", total_revenue:  20000 },
      { service_name: "Hair Tint", total_revenue:  12500 },
      { service_name: "Nail polish", total_revenue:  15000 },
      { service_name: "Hair Cut", total_revenue:  4000 },
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
// COMPONENT
// =====================================================

export default function ReportsAnalyticsTab() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  // =====================================================
  // LOAD DATA
  // =====================================================
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // =================================================
      // 🔴 REAL API (ENABLE LATER)
      // =================================================
      /*
      const dashboard = await getDashboardData(
        dateRange.start,
        dateRange.end
      );

      const normalized: AnalyticsData = {
        revenue: {
          total_revenue: dashboard.revenue_summary?.total_revenue ?? 0,
          average_revenue_per_appointment:
            dashboard.revenue_summary?.average_revenue_per_appointment ?? 0,
          growth_percentage: 0,
          revenue_by_service: dashboard.top_services ?? [],
        },
        appointments: {
          total: dashboard.appointment_summary?.total_appointments ?? 0,
          confirmed: dashboard.appointment_summary?.confirmed ?? 0,
          completed: dashboard.appointment_summary?.completed ?? 0,
          cancelled: dashboard.appointment_summary?.cancelled ?? 0,
          pending: dashboard.appointment_summary?.pending ?? 0,
        },
        servicePopularity: dashboard.top_services ?? [],
        businessInsights: {
          customer_satisfaction_score: 0,
          total_customers: 0,
          retention_rate: 0,
          peak_hours: [],
          top_staff:
            dashboard.top_staff?.map(s => ({
              name: s.staff_name,
              position: s.position,
              appointments_completed: s.completed_appointments,
              total_revenue: s.total_revenue,
            })) ?? [],
        },
      };

      setData(normalized);
      */

      // =================================================
      // 🟢 DUMMY DATA (CURRENT)
      // =================================================
      setData(DUMMY_ANALYTICS_DATA);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load analytics data";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // =====================================================
  // ERROR STATE
  // =====================================================
  if (error && !data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Failed to load analytics
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const safeData = data ?? DUMMY_ANALYTICS_DATA;

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="space-y-6">
      {/* DATE RANGE */}
      <DateRangeFilter
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          Icon={DollarSign}
          title="Total Revenue"
          value={`LKR ${safeData.revenue.total_revenue.toLocaleString()}`}
          change={safeData.revenue.growth_percentage}
          bgColor="bg-green-50"
          iconColor="text-green-600"
          loading={loading}
        />

        <MetricCard
          Icon={Calendar}
          title="Total Appointments"
          value={safeData.appointments.total.toString()}
          subtitle={`${safeData.appointments.confirmed} confirmed`}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
          loading={loading}
        />

        <MetricCard
          Icon={Star}
          title="Customer Satisfaction"
          value={`${safeData.businessInsights.customer_satisfaction_score}%`}
          subtitle="Based on feedback"
          bgColor="bg-yellow-50"
          iconColor="text-yellow-600"
          loading={loading}
        />

        <MetricCard
          Icon={Users}
          title="Active Customers"
          value={safeData.businessInsights.total_customers.toString()}
          subtitle={`${safeData.businessInsights.retention_rate}% retention`}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
          loading={loading}
        />
      </div>

      <RevenueChart
        data={safeData.revenue.revenue_by_service}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ServicePopularityChart
          data={safeData.servicePopularity}
          loading={loading}
        />
        <StaffPerformanceChart
          data={safeData.businessInsights.top_staff}
          loading={loading}
        />
      </div>

      <AppointmentStatusChart
        data={safeData.appointments}
        loading={loading}
      />

      <BusinessInsightsChart
        peakHours={safeData.businessInsights.peak_hours}
        averageRevenue={safeData.revenue.average_revenue_per_appointment}
        retentionRate={safeData.businessInsights.retention_rate}
        growthPercentage={safeData.revenue.growth_percentage}
        loading={loading}
      />
    </div>
  );
}
