# Chart Components Reference


This document explains the chart types and visualization components used in the Reports & Analytics dashboard.

---

## 📊 Chart Library

**Recharts** (v2.x) - React charting library built on D3
- Tree-shakeable and optimized for React
- Responsive and mobile-friendly
- Interactive tooltips and legends
- TypeScript support

---

## 🎨 Chart Types Implemented

### 1. Bar Chart - Revenue Breakdown
**Component:** `RevenueChart.tsx`  
**Data Source:** `/api/v1/reports/revenue` → `revenue_by_service`

**Features:**
- Red gradient bars (#DC2626)
- Rounded corners (radius 8px)
- Interactive tooltips with LKR formatting
- Responsive height (350px)

---

### 2. Pie Chart - Service Popularity
**Component:** `ServicePopularityChart.tsx`  
**Data Source:** `/api/v1/reports/service-popularity`

**Features:**
- Vibrant color palette (red, blue, green, amber, purple)
- Percentage labels on each slice
- Legend with color indicators
- Interactive tooltips with booking counts

---

### 3. Horizontal Bar Chart - Staff Performance
**Component:** `StaffPerformanceChart.tsx`  
**Data Source:** `/api/v1/reports/business-insights` → `top_staff`

**Features:**
- Dual metrics: Appointments (purple #A78BFA) + Revenue (green #10B981)
- Horizontal layout for better name readability
- Interactive tooltips with formatted values
- Legend showing both metrics

---

### 4. Donut Chart - Appointment Status
**Component:** `AppointmentStatusChart.tsx`  
**Data Source:** `/api/v1/reports/appointments-summary`

**Features:**
- Color-coded status (green=confirmed, blue=pending, red=cancelled, gray=completed)
- Donut chart with center hole (innerRadius 60%)
- Percentage labels
- Status breakdown cards

---

### 5. Area Chart - Peak Booking Hours
**Component:** `BusinessInsightsChart.tsx`  
**Data Source:** `/api/v1/reports/business-insights` → `peak_hours`

**Features:**
- Amber bar chart (#F59E0B)
- Shows hourly booking trends
- Angled X-axis labels for readability
- Grid lines for easier reading

---

## 🎨 Icon Library

**Lucide React** 
- Lightweight SVG icon library

### Icons Used:
```typescript
BarChart3      // Revenue charts
PieChart       // Service popularity
Trophy         // Staff performance
Calendar       // Appointments
Lightbulb      // Business insights
Clock          // Peak hours
TrendingUp     // Growth metrics
DollarSign     // Revenue metrics
Star           // Satisfaction
Users          // Customer metrics
AlertCircle    // Error states
```

---

## 📐 Design System

### Color Palette
```scss
// Primary Brand
$red-600: #DC2626;

// Metric Cards
$green-600: #10B981;  // Revenue
$blue-600: #2563EB;   // Appointments
$yellow-600: #FBBF24; // Satisfaction
$purple-600: #9333EA; // Customers
$amber-600: #F59E0B;  // Insights

// Chart Colors
$chart-1: #EF4444;  // Red
$chart-2: #3B82F6;  // Blue
$chart-3: #10B981;  // Green
$chart-4: #F59E0B;  // Amber
$chart-5: #A78BFA;  // Purple
```

### Spacing
```scss
// Card Padding
$card-padding: 1.5rem;  // 24px

// Icon Sizes
$icon-sm: 18px;   // Tab navigation
$icon-md: 24px;   // Headers, metrics
$icon-lg: 32px;   // Section headers
$icon-xl: 48px;   // Loading, errors

// Chart Heights
$chart-height: 350px;  // Standard chart
$chart-height-sm: 250px;  // Compact chart
```

---

## 🔧 Component Architecture

### File Structure
```
components/AdminComponents/ReportsAnalytics/
├── MetricCard.tsx              // Reusable KPI card
├── DateRangeFilter.tsx         // Date selector
├── RevenueChart.tsx            // Bar chart component
├── ServicePopularityChart.tsx  // Pie chart component
├── StaffPerformanceChart.tsx   // Horizontal bar chart
├── AppointmentStatusChart.tsx  // Donut chart component
├── BusinessInsightsChart.tsx   // Peak hours + KPI cards
└── StatusCard.tsx              // Status display component
```

### Shared Props Pattern
```typescript
interface ChartProps {
  data: DataType[];  // Chart data from API
  title?: string;    // Optional custom title
  height?: number;   // Optional custom height
}
```
---
## 📝 Adding New Charts

### Template for New Chart Component:

```typescript
/**
 * NewChart Component
 * 
 * Description of what the chart displays
 * Data fetched from [API endpoint]
 * 
 * @component
 */

import { IconName } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface NewChartProps {
  data: YourDataType[]
}

export default function NewChart({ data }: NewChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <IconName size={24} className="mr-2 text-red-600" />
        Chart Title
      </h3>
      
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#DC2626" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
```
