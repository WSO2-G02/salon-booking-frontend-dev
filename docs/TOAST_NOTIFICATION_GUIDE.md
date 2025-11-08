# Toast Notification System - Usage Guide

A toast notification system for displaying success, error, warning, and informational messages throughout the application.

---

## Features

- **Four Notification Types:** Success, Error, Warning, and Information
- **Auto-dismiss Functionality:** Configurable duration with default timeout
- **Manual Dismissal:** User-controlled close button
- **Smooth Animations:** Slide-in and slide-out transitions
- **Icon-based Visual Indicators:** Lucide React icon library integration


---

## Quick Start

### 1. Setup
The `<ToastContainer />` component has been integrated into `src/app/layout.tsx`. No additional configuration is required.

### 2. Import and Use
```tsx
import { showToast } from '@/components/Toast'

// Show success message
showToast('Operation successful!', 'success')

// Show error message  
showToast('Something went wrong', 'error')

// Show warning message
showToast('Please review your changes', 'warning')

// Show info message
showToast('New updates available', 'info')
```

---

## Usage Examples

### In Form Submissions

#### Login Form
```tsx
import { showToast } from '@/components/Toast'

const handleLogin = async (credentials) => {
  try {
    const result = await loginUser(credentials)
    showToast(`Welcome back, ${result.username}!`, 'success')
    // Redirect after showing toast
    setTimeout(() => router.push('/dashboard'), 1500)
  } catch (error) {
    showToast(error.message || 'Login failed', 'error')
  }
}
```

#### Registration Form
```tsx
const handleRegister = async (formData) => {
  try {
    const result = await registerUser(formData)
    showToast(`Account created! Welcome, ${result.name}`, 'success')
    setTimeout(() => router.push('/login'), 1500)
  } catch (error) {
    showToast(error.message || 'Registration failed', 'error')
  }
}
```

### In Data Operations

#### Save Data
```tsx
const handleSave = async () => {
  try {
    await saveData(data)
    showToast('Changes saved successfully', 'success')
  } catch (error) {
    showToast('Failed to save changes', 'error')
  }
}
```

#### Delete Data
```tsx
const handleDelete = async (id) => {
  try {
    await deleteItem(id)
    showToast('Item deleted successfully', 'success')
  } catch (error) {
    showToast('Failed to delete item', 'error')
  }
}
```

### With Custom Duration

```tsx
// Show for 5 seconds (default is 3 seconds)
showToast('This message stays longer', 'info', 5000)

// Show for 10 seconds
showToast('Important warning!', 'warning', 10000)

// Show indefinitely (duration = 0, manual dismiss only)
showToast('Click X to close', 'info', 0)
```

### Warning Messages

```tsx
// Unsaved changes warning
showToast('You have unsaved changes', 'warning')

// Session timeout warning
showToast('Your session will expire in 5 minutes', 'warning', 5000)

// Form validation warning
showToast('Please fill in all required fields', 'warning')
```

### Info Messages

```tsx
// General information
showToast('New features available in settings', 'info')

// Loading complete
showToast('Data loaded successfully', 'info')

// Update notification
showToast('A new version is available', 'info')
```

---

## Toast Types and Styling

### Success (Green)
```tsx
showToast('Operation successful!', 'success')
```
- ✅ CheckCircle icon
- 🟢 Green background (#F0FDF4)
- 🟢 Green border (#10B981)
- Use for: Successful operations, confirmations

### Error (Red)
```tsx
showToast('Something went wrong', 'error')
```
- ❌ XCircle icon
- 🔴 Red background (#FEF2F2)
- 🔴 Red border (#EF4444)
- Use for: Errors, failures, critical issues

### Warning (Amber)
```tsx
showToast('Please review your changes', 'warning')
```
- ⚠️ AlertTriangle icon
- 🟡 Amber background (#FFFBEB)
- 🟡 Amber border (#F59E0B)
- Use for: Warnings, cautions, important notices

### Info (Blue)
```tsx
showToast('New updates available', 'info')
```
- ℹ️ Info icon
- 🔵 Blue background (#EFF6FF)
- 🔵 Blue border (#3B82F6)
- Use for: Information, tips, notifications

---

## API Reference

### showToast(message, type, duration?)

**Parameters:**
- `message` (string, required): The text to display in the toast
- `type` ('success' | 'error' | 'warning' | 'info', required): Type of toast
- `duration` (number, optional): Auto-dismiss duration in milliseconds
  - Default: 3000 (3 seconds)
  - Set to 0 for no auto-dismiss (manual close only)

**Returns:** void

**Example:**
```tsx
showToast('Hello World!', 'success', 5000)
```

---

## Position and Behavior

### Position
- **Location:** Top-right corner
- **Z-index:** 9999 (appears above all content)
- **Responsive:** Adapts to mobile screens

### Animations
- **Slide in:** Smooth slide from right (0.3s)
- **Slide out:** Smooth slide to right (0.3s)
- **Timing:** Uses ease-out and ease-in functions

### Stacking
Multiple toasts stack vertically with spacing:
```
┌────────────────────┐
│ Toast 1 (newest)   │
└────────────────────┘
┌────────────────────┐
│ Toast 2            │
└────────────────────┘
┌────────────────────┐
│ Toast 3 (oldest)   │
└────────────────────┘
```

---

## Accessibility

### Screen Readers
- Uses `role="alert"` for immediate announcement
- `aria-live="polite"` for non-disruptive notifications
- Proper ARIA labels on close button

### Keyboard Support
- Close button is keyboard accessible (Tab + Enter)
- Focus management for better UX

---

## Customization

### Modify Duration Globally
Edit `Toast.tsx`:
```tsx
export function showToast(message: string, type: ToastType = 'info', duration: number = 5000) {
  // Change default from 3000 to 5000
}
```

### Modify Position
Edit `Toast.tsx` ToastContainer:
```tsx
// Current: top-right
className="fixed top-4 right-4"

// Change to top-left
className="fixed top-4 left-4"

// Change to bottom-right
className="fixed bottom-4 right-4"

// Center top
className="fixed top-4 left-1/2 -translate-x-1/2"
```

### Modify Colors
Edit `toastConfig` in `Toast.tsx`:
```tsx
const toastConfig = {
  success: {
    bgColor: 'bg-green-50',    // Change background
    borderColor: 'border-green-500',  // Change border
    iconColor: 'text-green-600',      // Change icon color
    textColor: 'text-green-800',      // Change text color
  },
  // ... other types
}
```

## Code Examples

Reference implementations can be found in:
- `src/components/LoginComponents/LoginForm.tsx`
- `src/components/RegisterComponents/RegisterForm.tsx`
- `src/components/BookNowComponents/StepConfirmPayment.tsx`

---
