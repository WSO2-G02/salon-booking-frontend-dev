# Salon Booking System - Frontend

A full-stack Salon Appointment Management System built with **FastAPI (Backend)** and **React/Next.js (Frontend)**. This system allows salon administrators and customers to manage appointments, services, staff schedules, and business insights in a modern, user-friendly interface.

---

## Features

- **Appointment Booking** – Customers can view available slots and book services easily.
- **Staff Management** – Admins can manage employees, positions, specialties, and availability schedules.
- **Service Management** – Admins can create, update, and manage salon services with pricing and duration.
- **Customer Management** – Admins can view and manage customer accounts.
- **Reports & Analytics** – Revenue reports, service popularity, staff performance, and business insights.
- **Full-Stack Architecture** – FastAPI REST backend with a React/Next.js frontend.
- **Responsive UI** – Built using TailwindCSS for a smooth, modern user experience.
- **Toast Notifications** – Accessible notification system with four types (success, error, warning, info).  
  
---

## Project Structure

```
salon-booking-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Admin dashboard pages
│   │   ├── booknow/            # Booking flow pages
│   │   ├── login/              # Authentication pages
│   │   └── register/           # Registration pages
│   ├── components/
│   │   ├── AdminComponents/    # Admin dashboard components
│   │   │   ├── ReportsAnalytics/       # Charts and metrics
│   │   │   ├── StaffManagement/        # Staff CRUD components
│   │   │   ├── ServicesManagement/     # Services CRUD components
│   │   │   └── CustomersManagement/    # Customers components
│   │   ├── BookNowComponents/  # Booking wizard steps
│   │   ├── HomePageComponents/ # Landing page sections
│   │   └── Toast.tsx           # Toast notification system
│   ├── services/               # API client services
│   │   ├── analyticsService.ts
│   │   ├── staffService.ts
│   │   ├── servicesService.ts
│   │   ├── customersService.ts
│   │   ├── userService.ts
│   │   └── appointmentService.ts
│   └── lib/                    # Utility functions
├── docs/                       # Documentation
│   ├── admin-portal/           # Admin components docs
│   └── TOAST_NOTIFICATION_GUIDE.md
├── public/                     # Static assets
└── package.json
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit: http://localhost:3000

---

## Admin Portal

The admin dashboard provides comprehensive management capabilities:

| Tab | Description | Documentation |
|-----|-------------|---------------|
| **Overview** | Dashboard home with quick stats, today's schedule, recent activity, service health monitoring | [docs/admin-portal/overview/](./docs/admin-portal/overview/) |
| **Reports & Analytics** | In-depth revenue charts, service popularity, staff performance, business insights with date filtering | [docs/admin-portal/reports-analytics/](./docs/admin-portal/reports-analytics/) |
| **Staff Management** | Create, edit, deactivate staff; manage availability schedules | [docs/admin-portal/staff-management/](./docs/admin-portal/staff-management/) |
| **Services Management** | Manage salon services, pricing, duration, and categories | [docs/admin-portal/services-management/](./docs/admin-portal/services-management/) |
| **Customers Management** | View and manage customer accounts | [docs/admin-portal/customers-management/](./docs/admin-portal/customers-management/) |
| **Appointments** | Appointment management (in development) | — |

### Overview vs Reports & Analytics

| Aspect | Overview | Reports & Analytics |
|--------|----------|---------------------|
| **Purpose** | Quick snapshot dashboard | Deep-dive analytical reports |
| **Data Scope** | Today + summary stats | Custom date range analysis |
| **Key Features** | Today's schedule, Recent activity, Service health, Quick actions | Revenue charts, Staff performance, Service popularity, Business insights |
| **Use Case** | Daily operational check | Strategic planning & analysis |
| **Date Filter** | Fixed (today/7 days) | Customizable date range picker |

---

## API Integration

This frontend integrates with the following backend microservices:

| Service | Port | Purpose |
|---------|------|---------|
| User Service | 8001 | Authentication, user profiles |
| Service Management | 8002 | Salon services CRUD |
| Staff Management | 8003 | Staff members and availability |
| Appointment Service | 8004 | Booking and scheduling |
| Analytics Service | 8006 | Reports and business insights |

See [Salon_Microservices_API_Overview.md](./Salon_Microservices_API_Overview.md) for complete API documentation.

---

## Technologies Used

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 15, React 19 |
| **Styling** | TailwindCSS 4 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Date Picker** | react-datepicker |
| **Language** | TypeScript 5 |

---

## Environment Variables

Create `.env.local` for development or `.env.production` for production:

```env
NEXT_PUBLIC_USER_API_BASE=http://localhost:8001
NEXT_PUBLIC_SERVICES_API_BASE=http://localhost:8002
NEXT_PUBLIC_STAFF_API_BASE=http://localhost:8003
NEXT_PUBLIC_APPOINTMENT_API_BASE=http://localhost:8004
NEXT_PUBLIC_ANALYTICS_API_BASE=http://localhost:8006
```
  
--- 

## Toast Notification System

This project includes a production-ready toast notification system for displaying user feedback messages.

### Quick Usage

```tsx
import { showToast } from '@/components/Toast'

// Show success message
showToast('Login successful!', 'success')

// Show error message
showToast('Failed to save changes', 'error')

// Show warning message
showToast('Please review your input', 'warning')

// Show info message
showToast('New updates available', 'info')
```

### Features
- Four notification types: Success, Error, Warning, Information
- Auto-dismiss functionality with configurable duration
- Manual dismiss with close button
- Smooth slide-in and slide-out animations
- Fully accessible with ARIA labels and keyboard support
- Color-coded interface with icon indicators (Lucide React)

For complete usage guide: [Toast Notification Guide](./docs/TOAST_NOTIFICATION_GUIDE.md)

---

## Documentation

| Document | Description |
|----------|-------------|
| [Salon Microservices API Overview](./Salon_Microservices_API_Overview.md) | Complete backend API reference |
| [Toast Notification Guide](./docs/TOAST_NOTIFICATION_GUIDE.md) | Toast component usage and examples |
| [Overview Dashboard](./docs/admin-portal/overview/README.md) | Overview tab implementation guide |
| [Reports & Analytics](./docs/admin-portal/reports-analytics/README.md) | Reports tab implementation guide |
| [Staff Management](./docs/admin-portal/staff-management/README.md) | Staff tab implementation guide |
| [Services Management](./docs/admin-portal/services-management/README.md) | Services tab implementation guide |
| [Customers Management](./docs/admin-portal/customers-management/README.md) | Customers tab implementation guide |

---

