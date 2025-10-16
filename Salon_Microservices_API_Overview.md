# 💇‍♀️ Salon Microservices API Overview

This document summarizes all API endpoints available in the Salon System — built using FastAPI microservices architecture.

---

## 🧑‍💼 1. User Service (Port 8001)

| Endpoint | Method | Description | Request Body / Params | Returns |
|-----------|---------|--------------|------------------------|----------|
| `/api/v1/register` | POST | Register new user | `{ email, username, password, full_name, phone }` | Created user (no password) |
| `/api/v1/login` | POST | User login & get JWT | `{ username/email, password }` | `{ access_token, token_type, user info }` |
| `/api/v1/profile` | GET | Get current logged user | Bearer token | User info |
| `/api/v1/profile/{user_id}` | GET | Get user by ID | Path param: `user_id`, Bearer token | User info |
| `/api/v1/profile` | PUT | Update current user | `{ full_name?, phone?, email? }`, Bearer token | Updated user info |
| `/health` | GET | Health check | — | `{ status: healthy }` |

---

## ✂️ 2. Service Management Service (Port 8002)

| Endpoint | Method | Description | Request Body / Params | Returns |
|-----------|---------|--------------|------------------------|----------|
| `/api/v1/services/` | POST | Add a new salon service | `{ name, description?, category, price, duration_minutes, is_active? }` | Created service |
| `/api/v1/services/` | GET | List services (with filters) | `skip, limit, category?, active_only?` | Array of services |
| `/api/v1/services/{id}` | GET | Get service details | Path param: `id` | Service object |
| `/api/v1/services/{id}` | PUT | Update service details | `{ name?, category?, price?, duration_minutes?, is_active? }` | Updated service |
| `/api/v1/services/{id}` | DELETE | Deactivate service (soft delete) | Path param: `id` | No content |
| `/api/v1/services/category/{category}` | GET | List services by category | Path param: `category` | Array of services |

---

## 💇‍♀️ 3. Staff Management Service (Port 8003)

| Endpoint | Method | Description | Request Body / Params | Returns |
|-----------|---------|--------------|------------------------|----------|
| `/api/v1/staff/` | POST | Create new staff | `{ user_id, employee_id, position, specialties[], experience_years, phone?, hire_date? }` | Created staff member |
| `/api/v1/staff/` | GET | List staff | `skip, limit, active_only?, position?` | Array of staff |
| `/api/v1/staff/{id}` | GET | Get staff details | Path param: `id` | Staff info |
| `/api/v1/staff/{id}` | PUT | Update staff info | `{ position?, specialties?, experience_years?, phone?, is_active? }` | Updated staff |
| `/api/v1/staff/{id}/availability` | POST | Add work slot | `{ date, start_time, end_time, availability_type?, is_available?, notes? }` | Created slot |
| `/api/v1/staff/{id}/availability` | GET | Get available slots | `date, service_duration` | `{ available_slots[], total_available_minutes }` |
| `/api/v1/staff/specialty/{specialty}` | GET | List staff by skill | Path param: `specialty` | Array of staff |

---

## 📅 4. Appointment Service (Port 8004)

| Endpoint | Method | Description | Request Body / Params | Returns |
|-----------|---------|--------------|------------------------|----------|
| `/api/v1/appointments/book` | POST | Book a new appointment | `{ service_id, staff_id, appointment_datetime, customer_notes? }` | `{ appointment_id, status, message }` |
| `/api/v1/appointments/{id}` | GET | Get appointment details | Path param: `id` | Appointment info |
| `/api/v1/appointments/user/{user_id}` | GET | Get user’s bookings | `status_filter?, skip, limit` | Array of appointments |
| `/api/v1/appointments/staff/{staff_id}` | GET | Get staff’s bookings | `date?` | Array of appointments |
| `/api/v1/appointments/{id}/confirm` | PUT | Confirm a pending appointment | — | Updated appointment |
| `/api/v1/appointments/{id}/reschedule` | PUT | Reschedule appointment | `new_datetime` | Updated appointment |
| `/api/v1/appointments/{id}/cancel` | DELETE | Cancel appointment | `cancellation_reason?` | No content |

---

## ✉️ 5. Notification Service (RabbitMQ Consumer)

**Not HTTP-based.**  
Listens for events from RabbitMQ:
- `appointment.booked`
- `appointment.confirmed`
- `appointment.cancelled`

Sends **emails & SMS** via SMTP.  
Frontend does **not** call this directly — triggered by other services’ events.

---

## 📊 6. Reports & Analytics Service (Port 8006)

| Endpoint | Method | Description | Request Body / Params | Returns |
|-----------|---------|--------------|------------------------|----------|
| `/api/v1/reports/revenue` | GET | Generate revenue report | `start_date, end_date` | `{ total_revenue, revenue_by_service, ... }` |
| `/api/v1/reports/stylist-performance/{staff_id}` | GET | Staff performance report | `start_date?, end_date?` | Stylist metrics |
| `/api/v1/reports/service-popularity` | GET | Popular services report | — | Array of services by bookings |
| `/api/v1/reports/business-insights` | GET | Overall salon insights | — | KPIs: peak times, top staff, retention |
| `/api/v1/reports/appointments-summary` | GET | Appointment summary | `start_date?, end_date?` | Stats breakdown |

---

### 🧠 Notes
- All endpoints are prefixed with `/api/v1/` per microservice.  
- Inter-service communication uses **RabbitMQ** for event notifications.  
- Authentication handled via JWT (from User Service).

