# Staff Management API Integration Reference

This document details the API integration for the Staff Management module.

---

## Service Overview

**Service Name:** Staff Management Service  
**Default Port:** 8005  
**Production URL:** `https://staff-service.azurewebsites.net`

---

## Authentication

All endpoints except health check require authentication.

**Header Format:**
```
Authorization: Bearer <admin_token>
```

**Token Storage:**
```javascript
const token = localStorage.getItem('admin_token')
```

---

## API Endpoints

### 1. List Staff Members

**Endpoint:** `GET /api/v1/staff`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number (1-indexed) |
| limit | integer | 10 | Items per page (max: 100) |
| active_only | boolean | true | Filter active staff only |
| position | string | null | Filter by position |

**Request Example:**
```bash
GET /api/v1/staff?page=1&limit=10&active_only=true&position=Senior%20Stylist
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 10,
    "employee_id": "EMP001",
    "position": "Senior Stylist",
    "specialties": "Hair Coloring, Cutting, Styling",
    "experience_years": 8,
    "hire_date": "2016-03-15",
    "is_active": true,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-15T14:30:00Z"
  }
]
```

---

### 2. Get Staff Details

**Endpoint:** `GET /api/v1/staff/{staff_id}`

**Response:**
```json
{
  "id": 1,
  "user_id": 10,
  "employee_id": "EMP001",
  "position": "Senior Stylist",
  "specialties": "Hair Coloring, Cutting, Styling",
  "experience_years": 8,
  "hire_date": "2016-03-15",
  "is_active": true,
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-15T14:30:00Z"
}
```

---

### 3. Create Staff Member (Admin Only)

**Endpoint:** `POST /api/v1/staff`

**Request Body:**
```json
{
  "user_id": 10,
  "employee_id": "EMP006",
  "position": "Junior Stylist",
  "specialties": "Cutting, Blow Dry",
  "experience_years": 1,
  "hire_date": "2024-01-15"
}
```

**Required Fields:**
- `user_id` - Reference to user in user service
- `employee_id` - Unique employee identifier
- `position` - Job title

**Response:**
```json
{
  "status": "success",
  "data": {
    "staff": {
      "id": 6,
      "user_id": 10,
      "employee_id": "EMP006",
      "position": "Junior Stylist",
      "specialties": "Cutting, Blow Dry",
      "experience_years": 1,
      "hire_date": "2024-01-15",
      "is_active": true,
      "created_at": "2024-01-20T09:00:00Z",
      "updated_at": "2024-01-20T09:00:00Z"
    }
  },
  "message": "Staff member created successfully"
}
```

---

### 4. Update Staff Member (Admin Only)

**Endpoint:** `PUT /api/v1/staff/{staff_id}`

**Request Body:** (all fields optional)
```json
{
  "position": "Senior Stylist",
  "specialties": "Hair Coloring, Cutting, Styling, Treatments",
  "experience_years": 9,
  "hire_date": "2016-03-15",
  "is_active": true
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 10,
  "employee_id": "EMP001",
  "position": "Senior Stylist",
  "specialties": "Hair Coloring, Cutting, Styling, Treatments",
  "experience_years": 9,
  "hire_date": "2016-03-15",
  "is_active": true,
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-20T10:30:00Z"
}
```

---

### 5. Deactivate Staff Member (Admin Only)

**Endpoint:** `DELETE /api/v1/staff/{staff_id}`

**Response:** `204 No Content`

**Note:** This is a soft delete - sets `is_active = false`

---

### 6. Get Staff Availability

**Endpoint:** `GET /api/v1/staff/{staff_id}/availability`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| slot_date | string | Yes | Date in YYYY-MM-DD format |
| service_duration | integer | No | Duration in minutes (default: 60) |

**Request Example:**
```bash
GET /api/v1/staff/1/availability?slot_date=2024-01-25&service_duration=60
```

**Response:**
```json
{
  "staff_id": 1,
  "slot_date": "2024-01-25",
  "available_slots": [
    {
      "start_time": "09:00:00",
      "end_time": "10:00:00",
      "duration_minutes": 60
    },
    {
      "start_time": "10:00:00",
      "end_time": "11:00:00",
      "duration_minutes": 60
    },
    {
      "start_time": "14:00:00",
      "end_time": "15:00:00",
      "duration_minutes": 60
    }
  ],
  "total_available_minutes": 180
}
```

---

### 7. Create Availability Slot (Admin Only)

**Endpoint:** `POST /api/v1/staff/{staff_id}/availability`

**Request Body:**
```json
{
  "staff_id": 1,
  "slot_date": "2024-01-25",
  "start_time": "09:00",
  "end_time": "17:00",
  "availability_type": "work"
}
```

**Availability Types:**
- `work` - Available for appointments
- `break` - On break (not bookable)
- `unavailable` - Not available

**Response:**
```json
{
  "id": 15,
  "staff_id": 1,
  "slot_date": "2024-01-25",
  "start_time": "09:00:00",
  "end_time": "17:00:00",
  "availability_type": "work"
}
```

---

### 8. Get Staff by Specialty

**Endpoint:** `GET /api/v1/staff/specialty/{specialty}`

**Request Example:**
```bash
GET /api/v1/staff/specialty/Hair%20Coloring
```

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 10,
    "employee_id": "EMP001",
    "position": "Senior Stylist",
    "specialties": "Hair Coloring, Cutting, Styling",
    "experience_years": 8,
    "hire_date": "2016-03-15",
    "is_active": true,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-15T14:30:00Z"
  }
]
```

---

### 9. Health Check

**Endpoint:** `GET /api/v1/health`

**Response:**
```json
{
  "status": "healthy",
  "service": "staff_service",
  "database": "connected"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 404 Not Found
```json
{
  "detail": "Staff member not found"
}
```

### 409 Conflict
```json
{
  "detail": "Employee ID already exists"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "employee_id"],
      "msg": "Employee ID cannot be empty",
      "type": "value_error"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Staff creation failed"
}
```

---

## Frontend Integration Example

```typescript
import {
  getStaffMembers,
  createStaff,
  updateStaff,
  deleteStaff,
} from '@/services/staffService'

// List staff with filters
const staff = await getStaffMembers(1, 10, true, 'Senior Stylist')

// Create new staff
const newStaff = await createStaff({
  user_id: 10,
  employee_id: 'EMP007',
  position: 'Junior Stylist',
  specialties: 'Cutting',
})

// Update staff
const updated = await updateStaff(1, {
  position: 'Senior Stylist',
  experience_years: 5,
})

// Deactivate staff
await deleteStaff(1)
```

---
