# Reports & Analytics Implementation Guide

This document outlines the implementation of the Admin Portal Reports & Analytics module.

---

## Implementation Overview

### Authentication System

**Route:** `/login`

**Features:**
- Dual-mode login form (User/Admin tabs)
- Tab-based navigation with dynamic form fields
- Demo credentials: admin/admin123
- Toast notification integration for feedback

**Files:**
- `src/components/LoginComponents/LoginForm.tsx`
- `src/app/admin/login/page.tsx`

---

### Admin Dashboard

**Route:** `/admin/dashboard`

**Navigation Sections:**
- Overview
- Reports & Analytics (primary focus)
- Appointments
- Services
- Staff
- Customers

**Files:**
- `src/app/admin/dashboard/page.tsx`
- `src/components/AdminComponents/AdminDashboardLayout.tsx`

---

### Reports & Analytics Components

**Main Container:**
- `ReportsAnalyticsTab.tsx` - Core analytics dashboard with data orchestration

**Chart Components:**
- `DateRangeFilter.tsx` - Date selection with react-datepicker
- `MetricCard.tsx` - KPI display cards (revenue, appointments, satisfaction, customers)
- `RevenueChart.tsx` - Bar chart for revenue breakdown by service
- `ServicePopularityChart.tsx` - Pie chart for service booking distribution
- `StaffPerformanceChart.tsx` - Dual-axis chart (appointments and revenue)
- `AppointmentStatusChart.tsx` - Status distribution cards
- `BusinessInsightsChart.tsx` - Peak hours analysis with bar chart

**Features:**
- Real-time data filtering by date range
- Recharts integration for data visualization
- Loading states with modern spinner animation
- Error handling with retry functionality
- Mock data fallback for development

**File Location:** `src/components/AdminComponents/ReportsAnalytics/`

---

### Analytics Service Layer

**File:** `src/services/analyticsService.ts`

**API Endpoints:**
- `/api/v1/reports/revenue`
- `/api/v1/reports/service-popularity`
- `/api/v1/reports/appointments-summary`
- `/api/v1/reports/business-insights`

**Features:**
- TypeScript interfaces for type safety
- Mock data fallback for development
- Automatic error handling
- Date range parameter support

---

## Design Standards

**Color Scheme:**
- Primary: Red (#DC2626)
- Status: Green (success), Red (error), Blue (info), Yellow (warning)
- Neutral: Gray scale for backgrounds and text

**UI Principles:**
- Responsive grid layouts (mobile-first approach)
- Card-based design with consistent shadows and rounded corners
- Smooth transitions and loading states
- Touch-friendly interactive elements

---

## Backend Integration

**Current Status:** Mock data with automatic fallback

**Configuration:**
```env
NEXT_PUBLIC_ANALYTICS_API_BASE=http://localhost:8006
```

**Requirements:**
- Backend service on Port 8006
- Bearer token authentication (stored in localStorage as `admin_token`)
- Response format matching TypeScript interfaces in `analyticsService.ts`

**Data Flow:**
1. User selects date range
2. Service layer calls API endpoints
3. Data distributed to chart components
4. Recharts renders visualization

---

## File Structure

```
src/
├── app/
│   ├── login/page.tsx
│   └── admin/
│       ├── login/page.tsx
│       └── dashboard/page.tsx
├── components/
│   ├── LoginComponents/LoginForm.tsx
│   ├── AdminComponents/
│   │   ├── AdminDashboardLayout.tsx
│   │   ├── ReportsAnalyticsTab.tsx
│   │   └── ReportsAnalytics/
│   │       ├── DateRangeFilter.tsx
│   │       ├── MetricCard.tsx
│   │       ├── RevenueChart.tsx
│   │       ├── ServicePopularityChart.tsx
│   │       ├── StaffPerformanceChart.tsx
│   │       ├── AppointmentStatusChart.tsx
│   │       └── BusinessInsightsChart.tsx
│   └── Toast.tsx
└── services/
    └── analyticsService.ts
```

---

## Testing

**Admin Access:**
1. Navigate to `/login`
2. Select Admin Login tab
3. Credentials: `admin` / `admin123`
4. Verify redirect to `/admin/dashboard`

**Dashboard Functionality:**
1. Verify default view shows Reports & Analytics
2. Test date range selection with react-datepicker
3. Confirm all charts render with mock data
4. Verify responsive layout on mobile viewports

---

## Technical Stack

- Next.js 15 (App Router)
- React 19 with TypeScript
- Tailwind CSS 4
- Recharts for data visualization
- react-datepicker for date selection
- Lucide React for icons

---

## Development

**Start Server:**
```bash
npm run dev
```

**Access Points:**
- Application: `http://localhost:3000`
- Admin Login: `http://localhost:3000/login` (Admin tab)
- Dashboard: `http://localhost:3000/admin/dashboard`

**Demo Credentials:**
- Username: `admin`
- Password: `admin123`

---

