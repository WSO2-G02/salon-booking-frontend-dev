# 💇‍♂️ Saloon System  
  
A full-stack Salon Appointment Management System built with **Fast API (Backend)** and **React/Next.js (Frontend)**. This system allows salon administrators and customers to manage appointments, services, staff schedules, and business insights in a modern, user-friendly interface.  

---  
 
## 🚀 Features  

- 💅 **Appointment Booking** – Customers can view available slots and book services easily.  
- 🧑‍💼 **Staff & Service Management** – Admins can manage employees, services, and working hours. 
- 🧾 **Reports & Analytics** – Summaries of bookings, revenue, and staff performance.  
- 🌐 **Full-Stack Architecture** – Fast REST API backend with a React/Next.js frontend.   
- 📱 **Responsive UI** – Built using TailwindCSS for a smooth, modern user experience.
- **Modern Toast Notifications** – Accessible notification system with four types (success, error, warning, information).  
  
---  
 
## 🏗️ Project Structure 
  
```bash  
saloon-system/
│   
├── frontend/             # React/Next.js UI 
│   ├── package.json  
│   ├── next.config.js  
│   ├── src/
|   |    ├──app/
|   |    ├──components/
|   |    ├──lib/
|   |    └──services/
│   └── public/  
│ 
├── .gitignore
├── package.json
├── package-lock.json
├── Salon_Microservices_API_Overview.md  
└── README.md  
```  
  
---  
   
## 💻 Frontend Setup (React/Next.js)  
  
```bash  
cd <folder>  
npm install  
npm run dev  
```  
  
Visit: http://localhost:3000  
  
--- 
  
## 🧩 API Routes Example  
  
```bash 
GET    /api/v1/profile  
POST   /api/v1/register  
``` 
  
--- 
  
## 🧠 Technologies Used 
  
**Frontend:** React, Next.js, TailwindCSS, Recharts, Lucide React
**Backend:** Fast API 
**Database:** PostgreSQL 
**Dev Tools:** Git, VS Code, Postman, Docker
  
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

### Documentation
For complete usage guide, examples, and customization options:

**[Toast Notification Guide](./TOAST_NOTIFICATION_GUIDE.md)**

**Component Location:** `src/components/Toast.tsx`

---
  
## 👨‍💻 Authors & Contributors  
  
- Developed by **Group 02**  
- Supervised and guided by academic staff 
  
---
  
⭐ If you like this project, please give it a star on GitHub!
