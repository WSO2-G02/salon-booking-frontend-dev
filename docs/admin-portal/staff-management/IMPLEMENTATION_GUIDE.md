# Staff Management Implementation Guide

This document outlines the implementation of the Admin Portal Staff Management module.

---

## Implementation Overview

### Staff Management Tab

**Route:** `/admin/dashboard` (Staff tab)

**Features:**
- Staff listing with pagination
- Position and status filtering
- Create/Edit staff modal forms
- Availability management modal
- Toast notifications for feedback
- Mock data fallback for development

**Main File:**
- `src/components/AdminComponents/StaffManagementTab.tsx`

---

## Component Architecture

### Main Container
- `StaffManagementTab.tsx` - Core staff management dashboard with state orchestration

### Subcomponents
| Component | Purpose |
|-----------|---------|
| `StaffTable.tsx` | Displays staff in responsive table with pagination |
| `StaffFilters.tsx` | Position dropdown and active-only toggle |
| `StaffModal.tsx` | Create/Edit staff form modal |
| `StaffAvailabilityModal.tsx` | View and manage availability slots |

**File Location:** `src/components/AdminComponents/StaffManagement/`

---

## State Management

### StaffManagementTab State
```typescript
// Staff list data
const [staffList, setStaffList] = useState<StaffResponse[]>([])

// Loading and error states
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

// Pagination
const [page, setPage] = useState(1)
const [limit] = useState(10)

// Filters
const [filters, setFilters] = useState<Filters>({
  position: '',
  activeOnly: true,
})

// Modals
const [isModalOpen, setIsModalOpen] = useState(false)
const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false)
const [selectedStaff, setSelectedStaff] = useState<StaffResponse | null>(null)
```

---

## API Service Layer

**File:** `src/services/staffService.ts`

### Type Definitions
```typescript
interface StaffResponse {
  id: number
  user_id: number
  employee_id: string
  position: string
  specialties: string | null
  experience_years: number | null
  hire_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface StaffCreate {
  user_id: number
  employee_id: string
  position: string
  specialties?: string
  experience_years?: number
  hire_date?: string
}

interface StaffUpdate {
  position?: string
  specialties?: string
  experience_years?: number
  hire_date?: string
  is_active?: boolean
}
```

### API Functions
| Function | Description |
|----------|-------------|
| `getStaffMembers(page, limit, activeOnly, position)` | Fetch paginated staff list |
| `getStaffById(staffId)` | Get single staff details |
| `createStaff(staffData)` | Create new staff member |
| `updateStaff(staffId, updateData)` | Update existing staff |
| `deleteStaff(staffId)` | Deactivate (soft delete) staff |
| `getStaffAvailability(staffId, date, duration)` | Get available time slots |
| `createAvailability(staffId, data)` | Add availability slot |
| `getStaffBySpecialty(specialty)` | Filter by specialty |

---

## Design Standards

**Color Scheme:**
- Primary: Red (#DC2626) - Brand color
- Active Status: Green (#10B981)
- Inactive Status: Gray (#6B7280)
- Specialty Tags: Blue (#3B82F6)

**UI Components:**
- Card-based layout with shadows
- Responsive table with horizontal scroll
- Modal overlays with backdrop
- Toast notifications for feedback

---

## File Structure

```
src/
├── components/
│   └── AdminComponents/
│       ├── AdminDashboardLayout.tsx  # Tab navigation
│       ├── StaffManagementTab.tsx     # Main container
│       └── StaffManagement/
│           ├── index.ts               # Exports
│           ├── StaffTable.tsx         # Staff list table
│           ├── StaffFilters.tsx       # Filter controls
│           ├── StaffModal.tsx         # Create/Edit form
│           └── StaffAvailabilityModal.tsx  # Availability manager
├── services/
│   └── staffService.ts               # API client
└── ...
```

---

## Backend Integration

**Current Status:** Fully integrated with mock data fallback

**Configuration:**
```env
# Development
NEXT_PUBLIC_STAFF_API_BASE=http://localhost:8005

# Production
NEXT_PUBLIC_STAFF_API_BASE=https://staff-service.azurewebsites.net
```

**Authentication:**
- Bearer token stored in `localStorage` as `admin_token`
- Admin-only endpoints require valid admin token

**Data Flow:**
1. Tab loads → Fetch staff list with filters
2. User clicks Add → Open StaffModal (create mode)
3. User clicks Edit → Open StaffModal (edit mode) with staff data
4. User clicks Availability → Open StaffAvailabilityModal
5. User clicks Deactivate → Confirm and soft-delete

---

## Error Handling

### API Errors
```typescript
try {
  const data = await getStaffMembers(page, limit, activeOnly)
  setStaffList(data)
} catch (err) {
  // Fall back to mock data
  setStaffList(getMockStaffData())
  setError(err.message)
}
```

### Form Validation
- User ID and Employee ID required for create
- Position is always required
- Experience years must be non-negative
- End time must be after start time for availability

---

## Toast Integration

```typescript
import { showToast } from '@/components/Toast'

// Success
showToast('Staff member created successfully', 'success')

// Error
showToast('Failed to update staff', 'error')

// Warning
showToast('Please fill all required fields', 'warning')
```

---

## Testing Checklist

- [ ] Staff list loads with pagination
- [ ] Position filter works correctly
- [ ] Active-only toggle filters staff
- [ ] Create modal opens and validates input
- [ ] Edit modal populates existing data
- [ ] Staff can be deactivated with confirmation
- [ ] Availability modal shows time slots
- [ ] New availability can be added
- [ ] Toast notifications display correctly
- [ ] Mock data displays when API unavailable

---
