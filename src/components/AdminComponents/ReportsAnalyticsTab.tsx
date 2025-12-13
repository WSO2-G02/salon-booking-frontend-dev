"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAnalyticsData,
  type AnalyticsData,
} from "@/services/analyticsService";
import { showToast } from "@/components/Toast";

import { DollarSign, Calendar, Star, Users, AlertCircle } from "lucide-react";

// Charts
import MetricCard from "./ReportsAnalytics/MetricCard";
import DateRangeFilter from "./ReportsAnalytics/DateRangeFilter";
import RevenueChart from "./ReportsAnalytics/RevenueChart";
import ServicePopularityChart from "./ReportsAnalytics/ServicePopularityChart";
import StaffPerformanceChart from "./ReportsAnalytics/StaffPerformanceChart";
import AppointmentStatusChart from "./ReportsAnalytics/AppointmentStatusChart";
import BusinessInsightsChart from "./ReportsAnalytics/BusinessInsightsChart";

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

  // ----------------------------
  // LOAD DATA FROM REAL API
  // ----------------------------
  const loadData = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const analyticsData = await getAnalyticsData(
        dateRange.start,
        dateRange.end
      );
      setData(analyticsData);
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

  // ---------------------------------------------
  // ❌ REMOVE THE FULL-PAGE LOADING SCREEN
  // ---------------------------------------------
  // DO NOT BLOCK UI — let skeletons show immediately

  // ---------------------------------------------
  // ERROR SCREEN (only if no previous data)
  // ---------------------------------------------
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
    );
  }

  // ---------------------------------------------
  // IF STILL LOADING AND NO DATA YET → SHOW EMPTY SKELETONS
  // ---------------------------------------------
  const safeData = data || {
    revenue: {
      total_revenue: 0,
      growth_percentage: 0,
      average_revenue_per_appointment: 0,
      revenue_by_service: [],
    },
    appointments: {
      total: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      pending: 0,
    },
    servicePopularity: [],
    businessInsights: {
      customer_satisfaction_score: 0,
      total_customers: 0,
      retention_rate: 0,
      peak_hours: [],
      top_staff: [],
    },
  };

  // ---------------------------------------------
  // MAIN DASHBOARD RENDER (skeletons included)
  // ---------------------------------------------
  return (
    <div className="space-y-6">

      {/* DATE RANGE FILTER */}
      <DateRangeFilter
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* METRIC CARDS */}
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

      {/* REVENUE CHART */}
      <RevenueChart 
        data={safeData.revenue.revenue_by_service}
        loading={loading}
      />

      {/* TWO COLUMN CHARTS */}
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

      {/* APPOINTMENT STATUS */}
      <AppointmentStatusChart
        data={safeData.appointments}
        loading={loading}
      />

      {/* BUSINESS INSIGHTS */}
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
