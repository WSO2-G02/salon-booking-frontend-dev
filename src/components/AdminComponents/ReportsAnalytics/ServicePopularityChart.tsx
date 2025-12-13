"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Color palette for pie segments
const COLORS = ["#DC2626", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"];

/* -------------------------------------------------------
   ⭐ Skeleton Loader Component
------------------------------------------------------- */
function ServicePopularitySkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-gray-300 rounded mr-3"></div>
        <div className="h-5 w-52 bg-gray-300 rounded"></div>
      </div>

      {/* Chart Skeleton */}
      <div className="w-full h-[300px] bg-gray-200 rounded-lg"></div>
    </div>
  );
}

/* -------------------------------------------------------
   ⭐ MAIN COMPONENT
------------------------------------------------------- */

interface ServiceData {
  service_name: string;
  category: string;
  booking_count: number;
  total_revenue: number;
}

interface ServicePopularityChartProps {
  data: ServiceData[];
  loading?: boolean; // <--- NEW PROP
}

export default function ServicePopularityChart({
  data,
  loading = false,
}: ServicePopularityChartProps) {
  // Show skeleton instantly while data loads
  if (loading) return <ServicePopularitySkeleton />;

  // Prepare top 6 chart data
  const chartData = data.slice(0, 6).map((item) => ({
    name: item.service_name,
    value: item.booking_count,
    category: item.category,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Chart header */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <PieChartIcon size={24} className="mr-2 text-red-600" />
        Most Popular Services
      </h3>

      {/* Responsive chart container */}
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.name}: ${entry.value}`}
            outerRadius={100}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          {/* Tooltip */}
          <Tooltip
            formatter={(value: number) => [`${value} bookings`, "Bookings"]}
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />

          {/* Legend */}
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
