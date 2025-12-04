# Services Management Documentation

Technical reference for the Services Management module implementation.

---

## Documentation Structure

### IMPLEMENTATION_GUIDE.md
Complete technical reference for Services Management implementation:
- Component architecture and file structure
- CRUD operations (Create, Read, Update, Delete)
- Service listing with category filtering
- Price and duration management
- API service layer integration

### API_INTEGRATION_REFERENCE.md
Backend integration specifications:
- Service Management API endpoints
- Request/response formats
- Authentication requirements
- Error handling patterns

---

## Quick Start

**Dashboard Access:**
```
URL: http://localhost:3000/admin/dashboard
Tab: Services
Credentials: admin / admin123
```

**API Configuration:**
```env
NEXT_PUBLIC_SERVICES_API_BASE=http://localhost:8002
```

**Production URL:**
```env
NEXT_PUBLIC_SERVICES_API_BASE=https://services-management.azurewebsites.net
```

---

## Features

### Service Listing
- Card-based grid view of all services
- Filter by category
- Filter by active/inactive status
- Quick stats (total, active, categories)

### Service CRUD Operations
- **Create:** Add new service with name, description, category, price, duration
- **Read:** View services in card format with key details
- **Update:** Edit service information via modal form
- **Delete:** Soft-delete (deactivate) services

### Category Management
- Dynamic category dropdown from API
- Add new categories inline

---

## Required Endpoints (Port 8002)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/services` | List all services |
| POST | `/api/v1/services` | Create new service |
| GET | `/api/v1/services/{id}` | Get service details |
| PUT | `/api/v1/services/{id}` | Update service |
| DELETE | `/api/v1/services/{id}` | Deactivate service |
| GET | `/api/v1/categories` | Get all categories |
| GET | `/api/v1/services/category/{name}` | Filter by category |
| GET | `/api/v1/services/price-range` | Filter by price range |

---
