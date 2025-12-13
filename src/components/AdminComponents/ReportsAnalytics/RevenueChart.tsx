"use client";

import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* -----------------------------------------------------
   ⭐ Skeleton Loader for RevenueChart
----------------------------------------------------- */
function RevenueChartSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-gray-300 rounded mr-3"></div>
        <div className="h-5 w-48 bg-gray-300 rounded"></div>
      </div>

      {/* Chart Skeleton */}
      <div className="w-full h-[300px] bg-gray-200 rounded-lg"></div>
    </div>
  );
}

/* -----------------------------------------------------
   ⭐ Actual RevenueChart Component
----------------------------------------------------- */

interface RevenueService {
  service_name: string;
  total_revenue: number;
}

interface RevenueChartProps {
  data: RevenueService[];
  loading?: boolean; // <--- NEW
}

export default function RevenueChart({ data, loading = false }: RevenueChartProps) {
  // Show skeleton instantly while waiting for data
  if (loading) return <RevenueChartSkeleton />;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Chart header */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <BarChart3 size={24} className="mr-2 text-red-600" />
        Revenue by Service Category
      </h3>

      {/* Responsive chart container */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          {/* Grid lines */}
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          {/* X-axis */}
          <XAxis
            dataKey="service_name"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />

          {/* Y-axis */}
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />

          {/* Tooltip */}
          <Tooltip
            formatter={(value: number) => [`LKR ${value.toLocaleString()}`, "Revenue"]}
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          />

          <Legend wrapperStyle={{ paddingTop: "20px" }} />

          {/* Bar styling */}
          <Bar
            dataKey="total_revenue"
            fill="#DC2626"
            radius={[8, 8, 0, 0]}
            name="Revenue (LKR)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
