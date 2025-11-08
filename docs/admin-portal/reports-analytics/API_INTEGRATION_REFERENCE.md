# API Integration Reference - Reports & Analytics

This document specifies the API requirements and component structure for the Reports & Analytics dashboard.

---

## Components Overview

The Reports & Analytics dashboard consists of the following components:

**Core Container:**
- `ReportsAnalyticsTab.tsx` - Main container managing data fetching and state

**UI Components:**
- `DateRangeFilter.tsx` - Date range selector with react-datepicker integration
- `MetricCard.tsx` - Key performance indicator cards
- `RevenueChart.tsx` - Bar chart for revenue breakdown by service
- `ServicePopularityChart.tsx` - Pie chart for service booking distribution
- `StaffPerformanceChart.tsx` - Dual-axis chart for staff appointments and revenue
- `AppointmentStatusChart.tsx` - Status distribution cards (confirmed, pending, cancelled, completed)
- `BusinessInsightsChart.tsx` - Peak hours bar chart with business metrics

**Services:**
- `analyticsService.ts` - API integration layer with mock data fallback

---

## Required API Endpoints

The frontend is configured to connect to **Port 8006** for analytics data.

### Base URL Configuration
```env
NEXT_PUBLIC_ANALYTICS_API_BASE=http://localhost:8006
```

---

## 📊 Endpoint Specifications

### 1. Revenue Report
**Endpoint:** `GET /api/v1/reports/revenue`

**Query Parameters:**
- `start_date`: string (YYYY-MM-DD format)
- `end_date`: string (YYYY-MM-DD format)

**Response Format:**
```typescript
{
  "total_revenue": number,
  "growth_percentage": number,
  "average_revenue_per_appointment": number,
  "revenue_by_service": [
    {
      "service_name": string,
      "revenue": number
    }
  ]
}
```

**Example Response:**
```json
{
  "total_revenue": 2450000,
  "growth_percentage": 15.3,
  "average_revenue_per_appointment": 12500,
  "revenue_by_service": [
    { "service_name": "Hair Styling", "revenue": 850000 },
    { "service_name": "Hair Coloring", "revenue": 650000 },
    { "service_name": "Keratin Treatment", "revenue": 550000 }
  ]
}
```

---

### 2. Service Popularity
**Endpoint:** `GET /api/v1/reports/service-popularity`

**Query Parameters:**
- `start_date`: string (YYYY-MM-DD format)
- `end_date`: string (YYYY-MM-DD format)

**Response Format:**
```typescript
[
  {
    "service_name": string,
    "bookings": number
  }
]
```

**Example Response:**
```json
[
  { "service_name": "Hair Styling", "bookings": 145 },
  { "service_name": "Hair Coloring", "bookings": 98 },
  { "service_name": "Facial Treatment", "bookings": 87 },
  { "service_name": "Keratin Treatment", "bookings": 76 }
]
```

---

### 3. Appointments Summary
**Endpoint:** `GET /api/v1/reports/appointments-summary`

**Query Parameters:**
- `start_date`: string (YYYY-MM-DD format)
- `end_date`: string (YYYY-MM-DD format)

**Response Format:**
```typescript
{
  "total": number,
  "confirmed": number,
  "pending": number,
  "cancelled": number,
  "completed": number
}
```

**Example Response:**
```json
{
  "total": 542,
  "confirmed": 385,
  "pending": 87,
  "cancelled": 45,
  "completed": 425
}
```

---

### 4. Business Insights
**Endpoint:** `GET /api/v1/reports/business-insights`

**Query Parameters:**
- `start_date`: string (YYYY-MM-DD format)
- `end_date`: string (YYYY-MM-DD format)

**Response Format:**
```typescript
{
  "total_customers": number,
  "customer_satisfaction_score": number,
  "retention_rate": number,
  "peak_hours": [
    {
      "time_slot": string,
      "booking_count": number
    }
  ],
  "top_staff": [
    {
      "name": string,
      "position": string,
      "appointments_completed": number,
      "total_revenue": number
    }
  ]
}
```

**Example Response:**
```json
{
  "total_customers": 1250,
  "customer_satisfaction_score": 92,
  "retention_rate": 78,
  "peak_hours": [
    { "time_slot": "9:00 AM", "booking_count": 45 },
    { "time_slot": "10:00 AM", "booking_count": 67 },
    { "time_slot": "11:00 AM", "booking_count": 58 }
  ],
  "top_staff": [
    {
      "name": "Shalini Fernando",
      "position": "Senior Stylist",
      "appointments_completed": 54,
      "total_revenue": 675000
    },
    {
      "name": "Ravi Perera",
      "position": "Hair Colorist",
      "appointments_completed": 43,
      "total_revenue": 537500
    }
  ]
}
```

---

### 5. Stylist Performance (Optional - Currently Not Used)
**Endpoint:** `GET /api/v1/reports/stylist-performance`

This endpoint was specified in the documentation but is currently covered by the `top_staff` field in Business Insights.

---

## Authentication

All API endpoints require:
- **Headers:** `Authorization: Bearer <token>`
- **Token Storage:** Admin token stored in `localStorage` as `admin_token`

---

## Error Handling

The frontend handles these scenarios:
- **Network Error:** Shows error message with retry button
- **Invalid Response:** Falls back to mock data
- **Missing Data:** Displays empty state with helpful message

**Error Response Format:**
```json
{
  "error": "Error message here",
  "status": 500
}
```

---

## Testing Integration

### Backend Setup
```bash
# Start FastAPI backend on Port 8006
uvicorn main:app --host 0.0.0.0 --port 8006
```

### Frontend Configuration
```env
# In .env.local
NEXT_PUBLIC_ANALYTICS_API_BASE=http://localhost:8006
```

### Verification Steps
1. Login as admin (admin/admin123)
2. Navigate to Reports & Analytics tab
3. Verify data loads from backend
4. Check browser DevTools Network tab for API calls

---

## Component Integration

### Data Flow
```
User selects date range (DateRangeFilter)
    ↓
ReportsAnalyticsTab triggers data fetch
    ↓
analyticsService.ts calls API endpoints
    ↓
Data distributed to chart components
    ↓
Components render with Recharts library
```

### Chart Library
All chart components use **Recharts** for data visualization:
- `BarChart` - Revenue and peak hours
- `PieChart` - Service popularity
- `ComposedChart` - Staff performance (dual-axis)

### Date Picker
DateRangeFilter uses **react-datepicker** for modern calendar selection with:
- Date range validation (start date ≤ end date)
- Custom styling with Lucide icons
- Formatted display (MMM dd, yyyy)

---
