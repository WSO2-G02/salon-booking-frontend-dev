"use client";

import { Lightbulb, Clock, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PeakHour {
  time_slot: string;
  booking_count: number;
}

interface BusinessInsightsChartProps {
  peakHours?: PeakHour[];
  averageRevenue?: number;
  retentionRate?: number;
  growthPercentage?: number;
  loading?: boolean; // <-- NEW
}

/* ------------------------------------------
   ⭐ Skeleton Loader Component
------------------------------------------- */
function BusinessInsightsSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">

      {/* Header Skeleton */}
      <div className="h-6 w-52 bg-gray-200 rounded mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Skeleton — Chart */}
        <div>
          <div className="h-5 w-40 bg-gray-200 rounded mb-4" />

          <div className="w-full h-56 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Right Skeleton — KPI Cards */}
        <div className="space-y-3">
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="h-4 w-40 bg-gray-300 rounded mb-3"></div>
            <div className="h-6 w-32 bg-gray-300 rounded"></div>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="h-4 w-40 bg-gray-300 rounded mb-3"></div>
            <div className="h-6 w-28 bg-gray-300 rounded"></div>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="h-4 w-40 bg-gray-300 rounded mb-3"></div>
            <div className="h-6 w-20 bg-gray-300 rounded"></div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ------------------------------------------
   ⭐ Actual Chart Component
------------------------------------------- */
export default function BusinessInsightsChart({
  peakHours,
  averageRevenue,
  retentionRate,
  growthPercentage,
  loading = false,
}: BusinessInsightsChartProps) {
  // Show skeleton immediately while loading or missing data
  if (loading || !peakHours) {
    return <BusinessInsightsSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">

      {/* Header */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Lightbulb size={24} className="mr-2 text-amber-600" />
        Business Insights
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: PEAK HOUR CHART */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <Clock size={18} className="mr-2 text-blue-600" />
            Peak Booking Hours
          </h4>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={peakHours}
              margin={{ top: 10, right: 10, left: -10, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

              <XAxis
                dataKey="time_slot"
                angle={-25}
                textAnchor="end"
                height={60}
                tick={{ fill: "#6b7280", fontSize: 11 }}
              />

              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />

              <Bar
                dataKey="booking_count"
                fill="#F59E0B"
                radius={[6, 6, 0, 0]}
                name="Bookings"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RIGHT: KPI CARDS */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <TrendingUp size={18} className="mr-2 text-green-600" />
            Key Performance Indicators
          </h4>

          <div className="space-y-3">

            {/* Average Revenue */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600 mb-1">
                Average Revenue per Appointment
              </p>
              <p className="text-2xl font-bold text-green-700">
                LKR {averageRevenue?.toLocaleString()}
              </p>
            </div>

            {/* Retention */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600 mb-1">
                Customer Retention Rate
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {retentionRate}%
              </p>
            </div>

            {/* Growth */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600 mb-1">
                Revenue Growth
              </p>
              <p className="text-2xl font-bold text-purple-700">
                +{growthPercentage}%
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
