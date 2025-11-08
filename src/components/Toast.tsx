/**
 * Toast Notification Component
 * 
 * Toast notification system for success, error, warning, and info messages.
 * Automatically dismisses after a set duration and supports manual dismissal.
 * 
 * Features:
 * - 4 types: success, error, warning, info
 * - Auto-dismiss with configurable duration
 * - Manual dismiss with close button
 * - Smooth slide-in/out animations
 * - Icon-based visual indicators (Lucide React)
 * - Accessible with proper ARIA labels
 * 
 * @component
 * 
 * ## Usage Examples:
 * 
 * ### Basic Usage:
 * ```tsx
 * import { showToast } from '@/components/Toast'
 * 
 * // Success message
 * showToast('Login successful!', 'success')
 * 
 * // Error message
 * showToast('Login failed. Please try again.', 'error')
 * 
 * // Warning message
 * showToast('Session expires in 5 minutes', 'warning')
 * 
 * // Info message
 * showToast('New updates available', 'info')
 * ```
 * 
 * ### With Custom Duration:
 * ```tsx
 * showToast('This message stays for 5 seconds', 'success', 5000)
 * ```
 * 
 * ### In Form Submissions:
 * ```tsx
 * const handleLogin = async (credentials) => {
 *   try {
 *     const result = await loginUser(credentials)
 *     showToast(`Welcome back, ${result.username}!`, 'success')
 *     // Redirect or other actions
 *   } catch (error) {
 *     showToast(error.message || 'Login failed', 'error')
 *   }
 * }
 * ```
 * 
 * ### Setup in Your App:
 * Add `<ToastContainer />` to your root layout (layout.tsx):
 * ```tsx
 * import ToastContainer from '@/components/Toast'
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <ToastContainer />
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 * 
 * ## API Reference:
 * 
 * ### showToast(message, type, duration?)
 * - `message` (string): The text to display
 * - `type` ('success' | 'error' | 'warning' | 'info'): Toast type
 * - `duration` (number, optional): Auto-dismiss duration in ms (default: 3000)
 * 
 * ## Styling:
 * - Success: Green background with CheckCircle icon
 * - Error: Red background with XCircle icon
 * - Warning: Amber background with AlertTriangle icon
 * - Info: Blue background with Info icon
 * 
 * ## Accessibility:
 * - ARIA live region for screen readers
 * - Keyboard accessible close button
 * - High contrast colors
 */

'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

// Toast type definition
export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
  duration: number
}

// Global toast state
let toasts: Toast[] = []
let listeners: Array<(toasts: Toast[]) => void> = []

// Subscribe to toast updates
function subscribe(listener: (toasts: Toast[]) => void) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

// Notify all listeners
function notifyListeners() {
  listeners.forEach((listener) => listener([...toasts]))
}

// Add a new toast
export function showToast(message: string, type: ToastType = 'info', duration: number = 3000) {
  const id = Date.now()
  const newToast: Toast = { id, message, type, duration }
  toasts.push(newToast)
  notifyListeners()

  // Auto-dismiss after duration
  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id)
    }, duration)
  }
}

// Remove a toast
export function dismissToast(id: number) {
  toasts = toasts.filter((toast) => toast.id !== id)
  notifyListeners()
}

// Toast configuration by type
const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    iconColor: 'text-green-600',
    textColor: 'text-green-800',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    iconColor: 'text-red-600',
    textColor: 'text-red-800',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500',
    iconColor: 'text-amber-600',
    textColor: 'text-amber-800',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-800',
  },
}

// Single toast component
function ToastItem({ toast }: { toast: Toast }) {
  const [isExiting, setIsExiting] = useState(false)
  const config = toastConfig[toast.type]
  const Icon = config.icon

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => {
      dismissToast(toast.id)
    }, 300) // Match animation duration
  }

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4 ${config.bgColor} ${config.borderColor} ${
        isExiting ? 'animate-slide-out' : 'animate-slide-in'
      }`}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <Icon size={20} className={`${config.iconColor} flex-shrink-0 mt-0.5`} />

      {/* Message */}
      <p className={`flex-1 text-sm font-medium ${config.textColor}`}>{toast.message}</p>

      {/* Close button */}
      <button
        onClick={handleDismiss}
        className={`${config.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Dismiss notification"
      >
        <X size={18} />
      </button>
    </div>
  )
}

// Toast container component
export default function ToastContainer() {
  const [activeToasts, setActiveToasts] = useState<Toast[]>([])

  useEffect(() => {
    const unsubscribe = subscribe(setActiveToasts)
    return unsubscribe
  }, [])

  if (activeToasts.length === 0) return null

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none"
      aria-label="Notifications"
    >
      {activeToasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  )
}
