# Customers Management Implementation Guide

## Component Structure

This document provides detailed implementation guidance for the Customers Management Tab components.

## File Structure

```
src/
├── services/
│   └── customersService.ts        # API client for user service
├── components/AdminComponents/
│   ├── CustomersManagementTab.tsx # Main container
│   └── CustomersManagement/
│       ├── index.ts               # Barrel exports
│       ├── CustomersTable.tsx     # Data table component
│       ├── CustomersFilters.tsx   # Filter controls
│       └── CustomerModal.tsx      # Create user modal
```

## CustomersManagementTab.tsx

### State Management

```typescript
// Customers data
const [customers, setCustomers] = useState<UserListResponse[]>([])

// Pagination
const [page, setPage] = useState(1)
const [pagination, setPagination] = useState({
  total: 0,
  page: 1,
  limit: 20,
  total_pages: 0
})

// Filters
const [filters, setFilters] = useState({
  userType: '',
  search: ''
})

// UI state
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
const [showModal, setShowModal] = useState(false)
const [submitting, setSubmitting] = useState(false)
```

### Data Fetching Pattern

```typescript
const fetchCustomers = useCallback(async () => {
  setLoading(true)
  setError(null)
  
  try {
    const response = await customersService.getCustomers({
      skip: (page - 1) * 20,
      limit: 20,
      user_type: filters.userType || undefined,
      search: filters.search || undefined
    })
    
    setCustomers(response.users)
    setPagination({
      total: response.total,
      page: response.page,
      limit: response.limit,
      total_pages: response.total_pages
    })
  } catch (err) {
    console.error('Failed to fetch customers:', err)
    setError('Failed to load customers')
    // Fall back to mock data in development
    setCustomers(MOCK_USERS)
  } finally {
    setLoading(false)
  }
}, [page, filters])
```

### Filter Debouncing

```typescript
// Debounce search to avoid excessive API calls
useEffect(() => {
  const timer = setTimeout(() => {
    if (filters.search !== debouncedSearch) {
      setDebouncedSearch(filters.search)
    }
  }, 300)
  return () => clearTimeout(timer)
}, [filters.search])
```

## CustomersTable.tsx

### Props Interface

```typescript
interface CustomersTableProps {
  customers: UserListResponse[]
  page: number
  pagination: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
  onPageChange: (page: number) => void
  loading: boolean
}
```

### User Type Badge Styling

```typescript
const getUserTypeBadge = (userType: string) => {
  const styles = userType === 'admin'
    ? 'bg-purple-100 text-purple-800'
    : 'bg-blue-100 text-blue-800'
  
  const icon = userType === 'admin' 
    ? <Shield size={12} className="mr-1" />
    : <UserCheck size={12} className="mr-1" />
  
  return { styles, icon }
}
```

### Empty State

```tsx
if (customers.length === 0 && !loading) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <User size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        No Users Found
      </h3>
      <p className="text-gray-500">
        No users match your current filters.
      </p>
    </div>
  )
}
```

## CustomersFilters.tsx

### Props Interface

```typescript
interface Filters {
  userType: string
  search: string
}

interface CustomersFiltersProps {
  filters: Filters
  onFilterChange: (filters: Filters) => void
  onRefresh: () => void
  loading: boolean
}
```

### Search Input with Icon

```tsx
<div className="relative flex-1 max-w-xs">
  <Search 
    size={16} 
    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
  />
  <input
    type="text"
    value={filters.search}
    onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
    placeholder="Search by name, email..."
    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg..."
  />
</div>
```

## CustomerModal.tsx

### Form Validation

```typescript
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {}
  
  // Username validation
  if (!formData.username.trim()) {
    newErrors.username = 'Username is required'
  } else if (formData.username.length < 3) {
    newErrors.username = 'Username must be at least 3 characters'
  } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
    newErrors.username = 'Username can only contain letters, numbers, and underscores'
  }
  
  // Email validation
  if (!formData.email.trim()) {
    newErrors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = 'Please enter a valid email address'
  }
  
  // Password validation
  if (!formData.password) {
    newErrors.password = 'Password is required'
  } else if (formData.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters'
  } else if (!/[A-Z]/.test(formData.password)) {
    newErrors.password = 'Password must contain at least one uppercase letter'
  } else if (!/[a-z]/.test(formData.password)) {
    newErrors.password = 'Password must contain at least one lowercase letter'
  } else if (!/\d/.test(formData.password)) {
    newErrors.password = 'Password must contain at least one digit'
  }
  
  // Confirm password
  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match'
  }
  
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

### Form Reset on Open

```typescript
useEffect(() => {
  if (isOpen) {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      full_name: '',
      phone: '',
      user_type: 'user',
    })
    setErrors({})
  }
}, [isOpen])
```

## Styling Guidelines

### Color Scheme

- **Primary Red**: `#dc2626` (red-600) for buttons and accents
- **Admin Purple**: `#9333ea` (purple-600) for admin badges
- **Customer Blue**: `#2563eb` (blue-600) for customer badges
- **Active Green**: `#16a34a` (green-600) for active status
- **Inactive Gray**: `#6b7280` (gray-500) for inactive status

### Responsive Breakpoints

```tsx
// Mobile-first responsive classes
<div className="flex flex-col sm:flex-row sm:items-center gap-4">
  {/* Content */}
</div>
```

## Integration with User Service API

### Service Configuration

```typescript
// customersService.ts
const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL 
  || 'https://user-service-salon.azurewebsites.net'

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token')
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}
```

### API Endpoints Used

1. **GET /api/v1/users**
   - Query params: `skip`, `limit`, `user_type`, `search`
   - Returns: Paginated list of users

2. **POST /api/v1/users**
   - Body: `UserCreateRequest`
   - Returns: Created user object

## Testing Considerations

### Mock Data for Development

```typescript
const MOCK_USERS: UserListResponse[] = [
  {
    id: 'mock-1',
    username: 'john_doe',
    email: 'john@example.com',
    full_name: 'John Doe',
    phone: '+94 77 123 4567',
    user_type: 'user',
    is_active: true,
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 'mock-2',
    username: 'admin_user',
    email: 'admin@liyosalon.com',
    full_name: 'Admin User',
    user_type: 'admin',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  }
]
```

## Future Enhancements

1. **User Detail View**: Click on row to view full user profile
2. **Edit User**: Modify existing user details
3. **Delete/Deactivate**: Toggle user active status
4. **Bulk Actions**: Select multiple users for batch operations
5. **Export**: Download user list as CSV/Excel
6. **Activity History**: View user's booking history
