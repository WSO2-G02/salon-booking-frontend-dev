# Overview Dashboard Documentation

Technical reference for the Admin Dashboard Overview implementation.

---

## Documentation Structure

### README.md (this file)
Quick start guide and overview of the Overview dashboard.

### IMPLEMENTATION_GUIDE.md
Complete technical reference including:
- Component architecture and file structure
- Sub-components overview
- Mock data integration
- API integration points

### COMPONENT_REFERENCE.md
Detailed specifications for each sub-component:
- StatCard
- QuickActionsCard
- RecentActivityCard
- TodayScheduleCard
- ServiceHealthCard
- RevenueChartMini
- TopServicesCard

---

## Quick Start

**Dashboard Access:**
```
URL: http://localhost:3000/admin/dashboard
Tab: Overview (default)
```

**Features:**
- Key statistics display (appointments, revenue, customers, services)
- Today's schedule with status indicators
- Recent activity feed
- Revenue mini chart (7-day trend)
- Top performing services
- Backend service health monitoring
- Quick action navigation buttons

---

## File Structure

```
src/components/AdminComponents/
├── OverviewTab.tsx              # Main container component
└── OverviewSection/
    ├── StatCard.tsx             # KPI statistic cards
    ├── QuickActionsCard.tsx     # Quick action buttons
    ├── RecentActivityCard.tsx   # Recent activity feed
    ├── TodayScheduleCard.tsx    # Today's appointments
    ├── ServiceHealthCard.tsx    # Backend health monitor
    ├── RevenueChartMini.tsx     # Revenue trend chart
    └── TopServicesCard.tsx      # Top services ranking
```

---

## API Integration

### Required Endpoints

| Endpoint | Service | Purpose |
|----------|---------|---------|
| `/api/v1/analytics/dashboard` | Analytics | Dashboard summary data |
| `/api/v1/analytics/revenue/summary` | Analytics | Revenue statistics |
| `/api/v1/analytics/appointments/summary` | Analytics | Appointment statistics |
| `/api/v1/analytics/services/popularity` | Analytics | Top services |
| `/api/v1/appointments/date/{date}` | Appointments | Today's schedule |
| `/api/v1/health` | All services | Health checks |

### Environment Variables

```env
NEXT_PUBLIC_ANALYTICS_API_BASE=https://analytics-report-service-salon.azurewebsites.net
NEXT_PUBLIC_APPOINTMENT_API_BASE=https://appointment-service-salon.azurewebsites.net
NEXT_PUBLIC_USER_API_BASE=https://user-service-salon.azurewebsites.net
NEXT_PUBLIC_STAFF_API_BASE=https://staff-service.azurewebsites.net
NEXT_PUBLIC_SERVICES_API_BASE=https://services-management.azurewebsites.net
NEXT_PUBLIC_NOTIFICATION_API_BASE=https://notification-service-salon.azurewebsites.net
```

---

## Component Overview

### StatCard
Displays a single KPI metric with icon, value, label, and optional change indicator.

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

### QuickActionsCard
Grid of action buttons for navigation to other dashboard tabs.

### TodayScheduleCard
Timeline view of today's appointments with status:
- `upcoming` - Scheduled for later
- `in-progress` - Currently happening
- `completed` - Finished

### RecentActivityCard
Feed of recent activities (bookings, completions, cancellations).

### ServiceHealthCard
Real-time health status of all backend microservices with response times.

### RevenueChartMini
Compact bar chart showing 7-day revenue trend.

### TopServicesCard
Ranked list of top-performing services by booking count.

---

## Mock Data

The Overview tab includes comprehensive mock data for development when APIs are unavailable:

- Statistics (appointments, revenue, customers, services)
- Today's schedule (5 sample appointments)
- Recent activities (5 sample activities)
- 7-day revenue data
- Top 5 services

Mock data is automatically used as fallback when API calls fail.

---

## Styling

All components follow the established design system:
- **Colors:** Slate, Red (primary), Blue, Green, Purple, Orange
- **Shadows:** `shadow-md` for cards
- **Borders:** `rounded-lg` for cards
- **Typography:** Tailwind default font stack
- **Icons:** Lucide React

---
