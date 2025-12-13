"use client";

import { Trophy } from "lucide-react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* -------------------------------------------------------
   ⭐ Skeleton Loader
------------------------------------------------------- */
function StaffPerformanceSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-gray-300 rounded mr-3"></div>
        <div className="h-5 w-64 bg-gray-300 rounded"></div>
      </div>

      {/* Chart skeleton box */}
      <div className="w-full h-[300px] bg-gray-200 rounded-lg"></div>
    </div>
  );
}

/* -------------------------------------------------------
   ⭐ MAIN COMPONENT
------------------------------------------------------- */

interface StaffData {
  name: string;
  position: string;
  appointments_completed: number;
  total_revenue: number;
}

interface StaffPerformanceChartProps {
  data: StaffData[];
  loading?: boolean;
}

export default function StaffPerformanceChart({
  data,
  loading = false,
}: StaffPerformanceChartProps) {
  // Show skeleton instantly if loading
  if (loading) return <StaffPerformanceSkeleton />;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Chart header */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Trophy size={24} className="mr-2 text-yellow-600" />
        Top Performing Staff
      </h3>

      {/* Main chart */}
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 60, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          <XAxis
            xAxisId="appointments"
            type="number"
            orientation="top"
            tick={{ fill: "#A78BFA", fontSize: 11 }}
            label={{
              value: "Appointments",
              position: "insideTop",
              offset: -5,
              fill: "#A78BFA",
              fontSize: 12,
              fontWeight: 600,
            }}
          />

          <XAxis
            xAxisId="revenue"
            type="number"
            orientation="bottom"
            tick={{ fill: "#10B981", fontSize: 11 }}
            label={{
              value: "Revenue (LKR)",
              position: "insideBottom",
              offset: -5,
              fill: "#10B981",
              fontSize: 12,
              fontWeight: 600,
            }}
          />

          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fill: "#6b7280", fontSize: 11 }}
          />

          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "Revenue (LKR)")
                return [`LKR ${value.toLocaleString()}`, "Revenue"];
              return [value, "Appointments"];
            }}
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />

          <Legend wrapperStyle={{ paddingTop: "15px" }} />

          <Bar
            xAxisId="appointments"
            dataKey="appointments_completed"
            fill="#A78BFA"
            radius={[0, 4, 4, 0]}
            name="Appointments"
            barSize={20}
          />

          <Bar
            xAxisId="revenue"
            dataKey="total_revenue"
            fill="#10B981"
            radius={[0, 4, 4, 0]}
            name="Revenue (LKR)"
            barSize={20}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
