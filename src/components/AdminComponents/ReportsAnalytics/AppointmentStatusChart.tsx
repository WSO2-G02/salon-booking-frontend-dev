"use client";

import { Calendar } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import StatusCard from "./StatusCard";

interface AppointmentData {
  total: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  pending: number;
}

interface AppointmentStatusChartProps {
  data?: AppointmentData;     // <-- now optional
  loading?: boolean;           // <-- new prop
}

/* -----------------------------
   🔹 Skeleton Loader Component
------------------------------*/
function AppointmentStatusSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="h-6 w-64 bg-gray-200 rounded mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left side skeleton cards */}
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 rounded-lg"
            ></div>
          ))}
        </div>

        {/* Right side donut skeleton */}
        <div className="flex items-center justify-center">
          <div className="w-40 h-40 border-8 border-gray-200 border-t-gray-300 rounded-full animate-spin-slow"></div>
        </div>
      </div>
    </div>
  );
}

/* Custom slow spin animation */
const styles = `
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}
`;

export default function AppointmentStatusChart({
  data,
  loading = false,
}: AppointmentStatusChartProps) {
  // Inject styles
  if (typeof document !== "undefined") {
    const styleTag = document.getElementById("spin-style") as HTMLStyleElement;
    if (!styleTag) {
      const tag = document.createElement("style");
      tag.id = "spin-style";
      tag.innerHTML = styles;
      document.head.appendChild(tag);
    }
  }

  // Show skeleton immediately while loading
  if (loading || !data) {
    return <AppointmentStatusSkeleton />;
  }

  // Prepare data for donut chart
  const chartData = [
    { name: "Confirmed", value: data.confirmed, color: "#10B981" },
    { name: "Completed", value: data.completed, color: "#3B82F6" },
    { name: "Cancelled", value: data.cancelled, color: "#EF4444" },
    { name: "Pending", value: data.pending, color: "#F59E0B" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Calendar size={24} className="mr-2 text-blue-600" />
        Appointment Status Distribution
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-4">
          <StatusCard label="Total" value={data.total} color="bg-gray-100 text-gray-800" />
          <StatusCard label="Confirmed" value={data.confirmed} color="bg-green-100 text-green-800" />
          <StatusCard label="Completed" value={data.completed} color="bg-blue-100 text-blue-800" />
          <StatusCard label="Cancelled" value={data.cancelled} color="bg-red-100 text-red-800" />
        </div>

        {/* Donut Chart */}
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />

            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
