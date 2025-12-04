# Overview Dashboard - Implementation Guide

Complete technical reference for the Admin Dashboard Overview implementation.

---

## Architecture Overview

The Overview dashboard follows a modular component architecture with clear separation of concerns:

```
OverviewTab (Main Container)
├── State Management (useState, useEffect)
├── Data Fetching (API calls + mock fallbacks)
├── Service Health Monitoring
└── Child Components
    ├── StatCard (x4)
    ├── TodayScheduleCard
    ├── RecentActivityCard
    ├── RevenueChartMini
    ├── QuickActionsCard
    ├── TopServicesCard
    └── ServiceHealthCard
```

---

## Component Specifications

### OverviewTab.tsx

**Purpose:** Main container that orchestrates data fetching and renders all sub-components.

**Props:**
```typescript
interface OverviewTabProps {
  onTabChange?: (tab: string) => void  // Callback for Quick Actions navigation
}
```

**State:**
```typescript
const [loading, setLoading] = useState(true)
const [stats, setStats] = useState<OverviewStats>(MOCK_STATS)
const [schedule, setSchedule] = useState<ScheduleItem[]>(MOCK_SCHEDULE)
const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES)
const [revenueData, setRevenueData] = useState<DailyRevenue[]>(MOCK_REVENUE_DATA)
const [topServices, setTopServices] = useState<TopService[]>(MOCK_TOP_SERVICES)
const [serviceHealth, setServiceHealth] = useState<ServiceStatus[]>([...])
const [error, setError] = useState<string | null>(null)
```

**Key Functions:**
- `loadData()` - Fetches all dashboard data from APIs
- `checkServiceHealth()` - Pings all backend service health endpoints

---

### StatCard.tsx

**Purpose:** Displays a single KPI statistic with icon, value, and optional change indicator.

**Props:**
```typescript
interface StatCardProps {
  Icon: LucideIcon          // Lucide icon component
  value: string | number    // Main display value
  label: string             // Description label
  subtitle?: string         // Optional subtitle text
  change?: number           // Percentage change (positive = up, negative = down)
  bgColor: string           // Tailwind bg class (e.g., 'bg-blue-50')
  iconColor: string         // Tailwind text class (e.g., 'text-blue-600')
  loading?: boolean         // Shows skeleton loader
}
```

**Usage:**
```tsx
<StatCard
  Icon={Calendar}
  value={12}
  label="Today's Appointments"
  change={8.5}
  bgColor="bg-blue-50"
  iconColor="text-blue-600"
/>
```

---

### TodayScheduleCard.tsx

**Purpose:** Displays today's appointment schedule in a timeline format.

**Props:**
```typescript
interface TodayScheduleCardProps {
  schedule: ScheduleItem[]
  loading?: boolean
}

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

**Status Styling:**
| Status | Border Color | Background |
|--------|--------------|------------|
| upcoming | blue-500 | blue-50 |
| in-progress | green-500 | green-50 |
| completed | gray-400 | gray-50 |

---

### RecentActivityCard.tsx

**Purpose:** Shows a feed of recent appointment activities.

**Props:**
```typescript
interface RecentActivityCardProps {
  activities: Activity[]
  loading?: boolean
}

interface Activity {
  id: number
  type: 'appointment' | 'booking' | 'cancellation'
  customerName: string
  serviceName: string
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending'
  time: string              // Relative time (e.g., '10 min ago')
  staffName?: string
}
```

---

### ServiceHealthCard.tsx

**Purpose:** Monitors and displays health status of all backend microservices.

**Props:**
```typescript
interface ServiceHealthCardProps {
  services: ServiceStatus[]
  loading?: boolean
  onRefresh?: () => void    // Refresh callback
}

interface ServiceStatus {
  name: string              // Display name
  endpoint: string          // Base URL
  status: 'online' | 'offline' | 'checking'
  responseTime?: number     // in milliseconds
}
```

**Health Check Logic:**
```typescript
const checkServiceHealth = async () => {
  for (const service of SERVICE_ENDPOINTS) {
    const start = Date.now()
    try {
      const res = await fetch(`${service.endpoint}/api/v1/health`, {
        signal: AbortSignal.timeout(5000)
      })
      // Record status and response time
    } catch {
      // Mark as offline
    }
  }
}
```

---

### RevenueChartMini.tsx

**Purpose:** Compact bar chart showing 7-day revenue trend.

**Props:**
```typescript
interface RevenueChartMiniProps {
  data: DailyRevenue[]      // 7 days of data
  totalRevenue: number      // Sum for the period
  changePercent: number     // Week-over-week change
  loading?: boolean
}

interface DailyRevenue {
  day: string               // e.g., 'Mon', 'Tue'
  revenue: number
}
```

---

### QuickActionsCard.tsx

**Purpose:** Grid of navigation shortcuts to other dashboard tabs.

**Props:**
```typescript
interface QuickActionsCardProps {
  onTabChange: (tab: string) => void
}
```

**Actions:**
- New Appointment → appointments tab
- View Appointments → appointments tab
- Manage Staff → staff tab
- Manage Services → services tab
- View Reports → reports tab
- Customers → customers tab

---

### TopServicesCard.tsx

**Purpose:** Ranked list of top-performing services.

**Props:**
```typescript
interface TopServicesCardProps {
  services: TopService[]
  loading?: boolean
}

interface TopService {
  rank: number              // 1-5
  name: string
  category: string
  bookings: number
  revenue: number
}
```

---

## Data Flow

```
1. Component Mount
   ↓
2. loadData() called
   ↓
3. Fetch from APIs (with timeout)
   ├── Success → Update state
   └── Failure → Use mock data
   ↓
4. checkServiceHealth() called
   ↓
5. Ping all /api/v1/health endpoints
   ↓
6. Render components with data
```

---

## Error Handling

The Overview tab implements graceful degradation:

1. **API Timeout:** 5 second timeout on all requests
2. **Mock Fallback:** Uses mock data when APIs fail
3. **Error Display:** Shows error state with retry button
4. **Toast Notifications:** Shows error messages via toast

---

## Performance Considerations

- **Parallel Requests:** Health checks run in sequence to avoid overwhelming services
- **Skeleton Loaders:** All components support loading state
- **Memoization:** `useCallback` for data fetching functions
- **Lazy Loading:** Components only render when their tab is active

---

## Testing Checklist

- [ ] Stats display correctly with mock data
- [ ] Today's schedule shows correct status indicators
- [ ] Recent activity shows appropriate status badges
- [ ] Service health correctly reports online/offline status
- [ ] Quick actions navigate to correct tabs
- [ ] Loading states display properly
- [ ] Error state shows with retry button
- [ ] Responsive layout works on mobile

---
