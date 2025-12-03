# Staff Management Documentation

Technical reference for the Staff Management module implementation.

---

## Documentation Structure

### IMPLEMENTATION_GUIDE.md
Complete technical reference for Staff Management implementation:
- Component architecture and file structure
- CRUD operations (Create, Read, Update, Delete)
- Staff listing with pagination and filtering
- Availability management system
- API service layer integration

### API_INTEGRATION_REFERENCE.md
Backend integration specifications:
- Staff Service API endpoints
- Request/response formats
- Authentication requirements
- Error handling patterns

---

## Quick Start

**Dashboard Access:**
```
URL: http://localhost:3000/admin/dashboard
Tab: Staff
Credentials: admin / admin123
```

**API Configuration:**
```env
NEXT_PUBLIC_STAFF_API_BASE=http://localhost:8005
```

**Production URL:**
```env
NEXT_PUBLIC_STAFF_API_BASE=https://staff-service.azurewebsites.net
```

---

## Features

### Staff Listing
- Paginated table view of all staff members
- Filter by position and active status
- Quick actions: Edit, Manage Availability, Deactivate

### Staff CRUD Operations
- **Create:** Add new staff member with position, specialties, experience
- **Read:** View staff details in table format
- **Update:** Edit staff information via modal form
- **Delete:** Soft-delete (deactivate) staff members

### Availability Management
- View available time slots for any date
- Add new availability slots (work, break, unavailable types)
- Calculate bookable time windows

---

## Required Endpoints (Port 8005)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/staff` | List all staff (paginated) |
| POST | `/api/v1/staff` | Create new staff member |
| GET | `/api/v1/staff/{id}` | Get staff details |
| PUT | `/api/v1/staff/{id}` | Update staff member |
| DELETE | `/api/v1/staff/{id}` | Deactivate staff member |
| GET | `/api/v1/staff/{id}/availability` | Get availability slots |
| POST | `/api/v1/staff/{id}/availability` | Create availability slot |

---
