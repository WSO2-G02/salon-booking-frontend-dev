# Reports & Analytics Documentation

Technical reference for the Reports & Analytics dashboard implementation.

---

## Documentation Structure

### IMPLEMENTATION_GUIDE.md
Complete technical reference for Reports & Analytics implementation:
- Component architecture and file structure
- Chart components overview (DateRangeFilter, MetricCard, RevenueChart, ServicePopularityChart, StaffPerformanceChart, AppointmentStatusChart, BusinessInsightsChart)
- API service layer and mock data integration
- Testing procedures
- Technology stack (Next.js, React, TypeScript, Recharts, react-datepicker)

### API_INTEGRATION_REFERENCE.md
Backend integration specifications:
- Component overview and data flow
- Five required API endpoints with request/response formats
- Authentication and error handling
- Integration testing procedures

### CHART_COMPONENTS_REFERENCE.md
Chart implementation details:
- Component specifications
- Data format requirements
- Recharts configuration
- Icon integration (Lucide React)

---

## Quick Start

**Dashboard Access:**
```
URL: http://localhost:3000/admin/dashboard
Credentials: admin / admin123
```

**API Configuration:**
```env
NEXT_PUBLIC_ANALYTICS_API_BASE=http://localhost:8006
```

**Required Endpoints (Port 8006):**
- GET `/api/v1/reports/revenue`
- GET `/api/v1/reports/service-popularity`
- GET `/api/v1/reports/appointments-summary`
- GET `/api/v1/reports/business-insights`

---
