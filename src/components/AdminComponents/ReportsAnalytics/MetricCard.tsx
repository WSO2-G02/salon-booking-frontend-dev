"use client";

import { LucideIcon } from "lucide-react";

/* ----------------------------------------------------
   ⭐ Skeleton Loader for MetricCard
---------------------------------------------------- */
function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        {/* Icon placeholder */}
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>

        {/* Percentage badge placeholder */}
        <div className="w-10 h-4 bg-gray-200 rounded"></div>
      </div>

      {/* Title placeholder */}
      <div className="h-3 w-32 bg-gray-200 rounded mb-3"></div>

      {/* Value placeholder */}
      <div className="h-6 w-24 bg-gray-300 rounded mb-2"></div>

      {/* Subtitle placeholder */}
      <div className="h-3 w-20 bg-gray-200 rounded"></div>
    </div>
  );
}

/* ----------------------------------------------------
   ⭐ Actual MetricCard Component
---------------------------------------------------- */
interface MetricCardProps {
  Icon: LucideIcon;
  title: string;
  value: string;
  subtitle?: string;
  change?: number;
  bgColor: string;
  iconColor: string;
  loading?: boolean; // <-- NEW
}

export default function MetricCard({
  Icon,
  title,
  value,
  subtitle,
  change,
  bgColor,
  iconColor,
  loading = false, // default
}: MetricCardProps) {
  // Show skeleton instantly while loading
  if (loading) return <MetricCardSkeleton />;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">

        {/* ICON */}
        <div className={`${bgColor} ${iconColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
          <Icon size={24} className="stroke-[1.5]" />
        </div>

        {/* CHANGE BADGE */}
        {change !== undefined && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              change >= 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
          </span>
        )}
      </div>

      {/* LABEL */}
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>

      {/* VALUE */}
      <p className="text-2xl font-bold text-gray-800">{value}</p>

      {/* SUBTITLE */}
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
