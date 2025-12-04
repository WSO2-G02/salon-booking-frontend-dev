# Services Management Implementation Guide

This document outlines the implementation of the Admin Portal Services Management module.

---

## Implementation Overview

### Services Management Tab

**Route:** `/admin/dashboard` (Services tab)

**Features:**
- Service listing with category filtering
- Card-based responsive grid layout
- Create/Edit service modal forms
- Category management (select or create new)
- Toast notifications for feedback
- Mock data fallback for development

**Main File:**
- `src/components/AdminComponents/ServicesManagementTab.tsx`

---

## Component Architecture

### Main Container
- `ServicesManagementTab.tsx` - Core services management dashboard with state orchestration

### Subcomponents
| Component | Purpose |
|-----------|---------|
| `ServicesList.tsx` | Displays services in responsive card grid |
| `ServicesFilters.tsx` | Category dropdown and active-only toggle |
| `ServiceModal.tsx` | Create/Edit service form modal |

**File Location:** `src/components/AdminComponents/ServicesManagement/`

---

## State Management

### ServicesManagementTab State
```typescript
// Services list data
const [servicesList, setServicesList] = useState<ServiceResponse[]>([])

// Available categories
const [categories, setCategories] = useState<string[]>([])

// Loading and error states
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

// Filters
const [filters, setFilters] = useState<Filters>({
  category: '',
  activeOnly: false,
})

// Modal state
const [isModalOpen, setIsModalOpen] = useState(false)
const [selectedService, setSelectedService] = useState<ServiceResponse | null>(null)
```

---

## API Service Layer

**File:** `src/services/servicesService.ts`

### Type Definitions
```typescript
interface ServiceResponse {
  id: number
  name: string
  description: string | null
  category: string | null
  price: number
  duration_minutes: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ServiceCreate {
  name: string
  description?: string
  category?: string
  price: number
  duration_minutes: number
}

interface ServiceUpdate {
  name?: string
  description?: string
  category?: string
  price?: number
  duration_minutes?: number
  is_active?: boolean
}
```

### API Functions
| Function | Description |
|----------|-------------|
| `getServices(activeOnly, category)` | Fetch services with optional filters |
| `getServiceById(serviceId)` | Get single service details |
| `createService(serviceData)` | Create new service |
| `updateService(serviceId, updateData)` | Update existing service |
| `deleteService(serviceId)` | Deactivate (soft delete) service |
| `getCategories()` | Get all available categories |
| `getServicesByCategory(category)` | Filter by category |
| `getServicesByPriceRange(min, max)` | Filter by price range |

---

## Design Standards

**Color Scheme:**
- Primary: Red (#DC2626) - Brand color
- Active Status: Green (#10B981)
- Inactive Status: Gray (#6B7280)
- Category Tags: Blue (#3B82F6)
- Price: Green (#10B981)

**UI Components:**
- Card-based grid layout (1/2/3 columns responsive)
- Modal overlays with backdrop
- Toast notifications for feedback

---

## File Structure

```
src/
├── components/
│   └── AdminComponents/
│       ├── AdminDashboardLayout.tsx    # Tab navigation
│       ├── ServicesManagementTab.tsx   # Main container
│       └── ServicesManagement/
│           ├── index.ts                # Exports
│           ├── ServicesList.tsx        # Service cards grid
│           ├── ServicesFilters.tsx     # Filter controls
│           └── ServiceModal.tsx        # Create/Edit form
├── services/
│   └── servicesService.ts              # API client
└── ...
```

---

## Backend Integration

**Current Status:** Fully integrated with mock data fallback

**Configuration:**
```env
# Development
NEXT_PUBLIC_SERVICES_API_BASE=http://localhost:8002

# Production
NEXT_PUBLIC_SERVICES_API_BASE=https://services-management.azurewebsites.net
```

**Authentication:**
- Bearer token stored in `localStorage` as `admin_token`
- Admin-only endpoints require valid admin token

**Data Flow:**
1. Tab loads → Fetch services and categories
2. User applies filters → Re-fetch with parameters
3. User clicks Add → Open ServiceModal (create mode)
4. User clicks Edit → Open ServiceModal (edit mode) with service data
5. User clicks Deactivate → Confirm and soft-delete

---

## Service Card Features

Each service card displays:
- **Header:** Service name, category tag, status badge
- **Body:** Description (truncated), price (LKR format), duration
- **Footer:** Edit and Deactivate action buttons

### Price Formatting
```typescript
const formatPrice = (price: number) => {
  return `LKR ${price.toLocaleString()}`
}
```

### Duration Formatting
```typescript
const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}
```

---

## Form Validation

### Required Fields (Create)
- Service Name
- Price (must be > 0)
- Duration (must be 1-1440 minutes)

### Optional Fields
- Description
- Category (select existing or create new)

### Edit Mode
- All fields optional
- is_active toggle available

---

## Toast Integration

```typescript
import { showToast } from '@/components/Toast'

// Success
showToast('Service created successfully', 'success')

// Error
showToast('Failed to update service', 'error')
```

---

## Testing Checklist

- [ ] Service cards load in grid layout
- [ ] Category filter works correctly
- [ ] Active-only toggle filters services
- [ ] Quick stats display accurately
- [ ] Create modal opens and validates input
- [ ] Edit modal populates existing data
- [ ] New category can be added inline
- [ ] Service can be deactivated with confirmation
- [ ] Toast notifications display correctly
- [ ] Mock data displays when API unavailable

---
