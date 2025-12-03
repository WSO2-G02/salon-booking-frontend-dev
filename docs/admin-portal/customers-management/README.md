# Customers Management Tab

## Overview

The Customers Management Tab provides administrators with a comprehensive interface to view and manage user accounts in the Liyo Salon booking system. It displays all registered users (both customers and admin accounts) with filtering and pagination capabilities.

## Features

- **User List View**: Display all registered users in a responsive table
- **Search & Filter**: Search by username, email, or name; filter by user type
- **User Creation**: Admin-only capability to create new user accounts
- **Status Visibility**: View active/inactive status of each user
- **Pagination**: Handle large user lists efficiently
- **Responsive Design**: Works on desktop and mobile devices

## Component Architecture

```
CustomersManagementTab.tsx     # Main container component
├── CustomersManagement/
│   ├── index.ts               # Barrel exports
│   ├── CustomersTable.tsx     # User list table with pagination
│   ├── CustomersFilters.tsx   # Search and filter controls
│   └── CustomerModal.tsx      # New user creation modal
```

## Quick Start

### Import in Admin Dashboard

```tsx
import CustomersManagementTab from './CustomersManagementTab'

// In your tab content
{activeTab === 'customers' && <CustomersManagementTab />}
```

### Standalone Usage

```tsx
import CustomersManagementTab from '@/components/AdminComponents/CustomersManagementTab'

export default function CustomersPage() {
  return <CustomersManagementTab />
}
```

## API Integration

The component integrates with the **User Service** backend:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/users` | GET | List all users (paginated) |
| `/api/v1/users` | POST | Create new user |

### Environment Configuration

```env
# .env.local
NEXT_PUBLIC_USER_SERVICE_URL=https://user-service-salon.azurewebsites.net
```

## Data Types

### User List Response

```typescript
interface UserListResponse {
  id: string
  username: string
  email: string
  full_name?: string
  phone?: string
  user_type: 'user' | 'admin'
  is_active: boolean
  created_at: string
}
```

### Paginated Response

```typescript
interface PaginatedResponse {
  users: UserListResponse[]
  total: number
  page: number
  limit: number
  total_pages: number
}
```

### User Creation Request

```typescript
interface UserCreateRequest {
  username: string
  email: string
  password: string
  full_name?: string
  phone?: string
  user_type: 'user' | 'admin'
}
```

## Component Features

### CustomersFilters

Provides search and filter capabilities:
- **Search**: Filter by username, email, or full name
- **User Type**: Filter by "All Users", "Customers Only", or "Admins Only"
- **Refresh**: Manual data refresh button

### CustomersTable

Displays user data in a responsive table:
- User avatar with icon (purple for admin, blue for customer)
- Username and display name
- Email with mail icon
- User type badge
- Active/Inactive status badge
- Join date
- Pagination controls

### CustomerModal

Form for creating new users with validation:
- Username (required, 3+ characters, alphanumeric)
- Email (required, valid format)
- Full name (optional)
- Phone (optional)
- User type selection (customer/admin)
- Password (required, 8+ chars, uppercase, lowercase, digit)
- Password confirmation

## Authentication

All API calls require admin authentication:

```typescript
const token = localStorage.getItem('admin_token')
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## Error Handling

The component handles:
- API errors with user-friendly messages
- Network failures with retry capability
- Form validation errors with inline feedback
- Loading states during data fetch

## Mock Data Mode

When the API is unavailable, the component falls back to mock data for development:

```typescript
const MOCK_USERS: UserListResponse[] = [
  {
    id: 'mock-1',
    username: 'john_doe',
    email: 'john@example.com',
    full_name: 'John Doe',
    user_type: 'user',
    is_active: true,
    created_at: '2024-01-15T08:00:00Z'
  },
  // ... more mock users
]
```

## Related Documentation

- [Staff Management Tab](../staff-management/README.md)
- [Services Management Tab](../services-management/README.md)
- [Reports & Analytics Tab](../reports-analytics/README.md)
- [Toast Notification Guide](../../TOAST_NOTIFICATION_GUIDE.md)
