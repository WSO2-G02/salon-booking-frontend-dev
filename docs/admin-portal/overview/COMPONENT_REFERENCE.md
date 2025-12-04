# Overview Dashboard - Component Reference

Detailed specifications and usage examples for all Overview dashboard components.

---

## Table of Contents

1. [StatCard](#statcard)
2. [QuickActionsCard](#quickactionscard)
3. [RecentActivityCard](#recentactivitycard)
4. [TodayScheduleCard](#todayschedulecard)
5. [ServiceHealthCard](#servicehealthcard)
6. [RevenueChartMini](#revenuechartmini)
7. [TopServicesCard](#topservicescard)

---

## StatCard

Displays a single KPI metric with visual styling and optional trend indicator.

### Import

```tsx
import StatCard from '@/components/AdminComponents/OverviewSection/StatCard'
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `Icon` | `LucideIcon` | Yes | Lucide React icon component |
| `value` | `string \| number` | Yes | Main display value |
| `label` | `string` | Yes | Description label |
| `subtitle` | `string` | No | Optional subtitle text |
| `change` | `number` | No | Percentage change indicator |
| `bgColor` | `string` | Yes | Tailwind background class |
| `iconColor` | `string` | Yes | Tailwind text color class |
| `loading` | `boolean` | No | Shows skeleton loader |

### Examples

```tsx
// Basic usage
<StatCard
  Icon={Calendar}
  value={12}
  label="Today's Appointments"
  bgColor="bg-blue-50"
  iconColor="text-blue-600"
/>

// With change indicator
<StatCard
  Icon={DollarSign}
  value="LKR 2.4M"
  label="Total Revenue"
  change={15.3}
  bgColor="bg-green-50"
  iconColor="text-green-600"
/>

// Loading state
<StatCard
  Icon={Users}
  value={0}
  label="Loading..."
  bgColor="bg-gray-50"
  iconColor="text-gray-600"
  loading={true}
/>
```

### Color Combinations

| Metric | Background | Icon Color |
|--------|------------|------------|
| Appointments | `bg-blue-50` | `text-blue-600` |
| Revenue | `bg-green-50` | `text-green-600` |
| Customers | `bg-purple-50` | `text-purple-600` |
| Services | `bg-orange-50` | `text-orange-600` |

---

## QuickActionsCard

Grid of navigation buttons for quick access to other dashboard sections.

### Import

```tsx
import QuickActionsCard from '@/components/AdminComponents/OverviewSection/QuickActionsCard'
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onTabChange` | `(tab: string) => void` | Yes | Callback when action is clicked |

### Example

```tsx
<QuickActionsCard 
  onTabChange={(tab) => setActiveTab(tab)} 
/>
```

### Available Actions

| Action | Icon | Target Tab |
|--------|------|------------|
| New Appointment | Plus | appointments |
| View Appointments | Calendar | appointments |
| Manage Staff | Users | staff |
| Manage Services | Scissors | services |
| View Reports | FileText | reports |
| Customers | Settings | customers |

---

## RecentActivityCard

Displays a feed of recent appointment activities with status indicators.

### Import

```tsx
import RecentActivityCard from '@/components/AdminComponents/OverviewSection/RecentActivityCard'
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `activities` | `Activity[]` | Yes | Array of activity items |
| `loading` | `boolean` | No | Shows skeleton loader |

### Activity Interface

```typescript
interface Activity {
  id: number
  type: 'appointment' | 'booking' | 'cancellation'
  customerName: string
  serviceName: string
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending'
  time: string
  staffName?: string
}
```

### Status Styling

| Status | Icon | Background | Text Color |
|--------|------|------------|------------|
| confirmed | CheckCircle | `bg-blue-50` | `text-blue-600` |
| completed | CheckCircle | `bg-green-50` | `text-green-600` |
| cancelled | XCircle | `bg-red-50` | `text-red-600` |
| pending | AlertCircle | `bg-yellow-50` | `text-yellow-600` |

### Example

```tsx
const activities = [
  {
    id: 1,
    type: 'appointment',
    customerName: 'Sarah Johnson',
    serviceName: 'Hair Styling',
    status: 'completed',
    time: '10 min ago',
    staffName: 'Shalini F.'
  }
]

<RecentActivityCard activities={activities} />
```

---

## TodayScheduleCard

Timeline view of today's appointments with status-based styling.

### Import

```tsx
import TodayScheduleCard from '@/components/AdminComponents/OverviewSection/TodayScheduleCard'
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `schedule` | `ScheduleItem[]` | Yes | Array of schedule items |
| `loading` | `boolean` | No | Shows skeleton loader |

### ScheduleItem Interface

```typescript
interface ScheduleItem {
  id: number
  time: string              // e.g., '09:00 AM'
  customerName: string
  serviceName: string
  staffName: string
  status: 'upcoming' | 'in-progress' | 'completed'
  duration: number          // in minutes
}
```

### Status Styling

| Status | Border | Background | Label |
|--------|--------|------------|-------|
| upcoming | `border-l-blue-500` | `bg-blue-50` | Upcoming |
| in-progress | `border-l-green-500` | `bg-green-50` | In Progress |
| completed | `border-l-gray-400` | `bg-gray-50` | Completed |

### Example

```tsx
const schedule = [
  {
    id: 1,
    time: '09:00 AM',
    customerName: 'Sarah Johnson',
    serviceName: 'Hair Styling',
    staffName: 'Shalini F.',
    status: 'completed',
    duration: 60
  }
]

<TodayScheduleCard schedule={schedule} />
```

---

## ServiceHealthCard

Monitors and displays health status of backend microservices.

### Import

```tsx
import ServiceHealthCard from '@/components/AdminComponents/OverviewSection/ServiceHealthCard'
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `services` | `ServiceStatus[]` | Yes | Array of service statuses |
| `loading` | `boolean` | No | Shows loading spinner on refresh |
| `onRefresh` | `() => void` | No | Callback for refresh button |

### ServiceStatus Interface

```typescript
interface ServiceStatus {
  name: string              // Display name
  endpoint: string          // Base URL
  status: 'online' | 'offline' | 'checking'
  responseTime?: number     // in milliseconds
}
```

### Example

```tsx
const services = [
  {
    name: 'User Service',
    endpoint: 'https://user-service-salon.azurewebsites.net',
    status: 'online',
    responseTime: 125
  }
]

<ServiceHealthCard 
  services={services} 
  onRefresh={() => checkHealth()}
/>
```

---

## RevenueChartMini

Compact bar chart showing 7-day revenue trend.

### Import

```tsx
import RevenueChartMini from '@/components/AdminComponents/OverviewSection/RevenueChartMini'
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `data` | `DailyRevenue[]` | Yes | 7 days of revenue data |
| `totalRevenue` | `number` | Yes | Sum for the period |
| `changePercent` | `number` | Yes | Week-over-week change |
| `loading` | `boolean` | No | Shows skeleton loader |

### DailyRevenue Interface

```typescript
interface DailyRevenue {
  day: string       // e.g., 'Mon', 'Tue'
  revenue: number
}
```

### Example

```tsx
const revenueData = [
  { day: 'Mon', revenue: 85000 },
  { day: 'Tue', revenue: 92000 },
  { day: 'Wed', revenue: 78000 },
  // ... more days
]

<RevenueChartMini
  data={revenueData}
  totalRevenue={698000}
  changePercent={15.3}
/>
```

---

## TopServicesCard

Ranked list of top-performing services with progress bars.

### Import

```tsx
import TopServicesCard from '@/components/AdminComponents/OverviewSection/TopServicesCard'
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `services` | `TopService[]` | Yes | Array of top services |
| `loading` | `boolean` | No | Shows skeleton loader |

### TopService Interface

```typescript
interface TopService {
  rank: number        // 1-5
  name: string
  category: string
  bookings: number
  revenue: number
}
```

### Rank Styling

| Rank | Background | Text Color |
|------|------------|------------|
| 1 | `bg-yellow-100` | `text-yellow-700` |
| 2 | `bg-gray-100` | `text-gray-600` |
| 3 | `bg-orange-100` | `text-orange-700` |
| 4+ | `bg-slate-50` | `text-slate-600` |

### Example

```tsx
const topServices = [
  {
    rank: 1,
    name: 'Hair Styling',
    category: 'Hair Care',
    bookings: 145,
    revenue: 580000
  }
]

<TopServicesCard services={topServices} />
```

---

## Common Patterns

### Loading State

All components support a `loading` prop that displays skeleton loaders:

```tsx
<StatCard loading={true} ... />
<TodayScheduleCard loading={true} ... />
```

### Empty State

Components handle empty data gracefully:

```tsx
// Shows "No appointments scheduled for today"
<TodayScheduleCard schedule={[]} />

// Shows "No recent activity"
<RecentActivityCard activities={[]} />
```

### Error Handling

Wrap components in error boundaries for production:

```tsx
<ErrorBoundary fallback={<ErrorCard />}>
  <OverviewTab />
</ErrorBoundary>
```

---
