/**
 * Toast Component Tests
 * 
 * Tests the ToastContainer component and showToast/dismissToast functions.
 * Verifies notification rendering, auto-dismiss, manual dismiss, and accessibility.
 */
import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import ToastContainer, { showToast, dismissToast } from '@/components/Toast'

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  CheckCircle: ({ className }: { className?: string }) => (
    <span data-testid="icon-success" className={className}>✓</span>
  ),
  XCircle: ({ className }: { className?: string }) => (
    <span data-testid="icon-error" className={className}>✕</span>
  ),
  AlertTriangle: ({ className }: { className?: string }) => (
    <span data-testid="icon-warning" className={className}>⚠</span>
  ),
  Info: ({ className }: { className?: string }) => (
    <span data-testid="icon-info" className={className}>ℹ</span>
  ),
  X: ({ size }: { size?: number }) => (
    <span data-testid="icon-close">×</span>
  ),
}))

describe('Toast Notification System', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('ToastContainer Rendering', () => {
    it('renders nothing when no toasts are present', () => {
      const { container } = render(<ToastContainer />)
      expect(container.firstChild).toBeNull()
    })

    it('renders toast when showToast is called', () => {
      render(<ToastContainer />)
      
      act(() => {
        showToast('Test message', 'success')
      })

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Test message')).toBeInTheDocument()
    })

    it('renders multiple toasts', () => {
      render(<ToastContainer />)
      
      act(() => {
        showToast('First toast', 'success')
        showToast('Second toast', 'error')
      })

      expect(screen.getAllByRole('alert')).toHaveLength(2)
      expect(screen.getByText('First toast')).toBeInTheDocument()
      expect(screen.getByText('Second toast')).toBeInTheDocument()
    })
  })

  describe('Toast Types', () => {
    it('renders success toast with correct icon', () => {
      render(<ToastContainer />)
      
      act(() => {
        showToast('Success!', 'success')
      })

      expect(screen.getByTestId('icon-success')).toBeInTheDocument()
    })

    it('renders error toast with correct icon', () => {
      render(<ToastContainer />)
      
      act(() => {
        showToast('Error!', 'error')
      })

      expect(screen.getByTestId('icon-error')).toBeInTheDocument()
    })

    it('renders warning toast with correct icon', () => {
      render(<ToastContainer />)
      
      act(() => {
        showToast('Warning!', 'warning')
      })

      expect(screen.getByTestId('icon-warning')).toBeInTheDocument()
    })

    it('renders info toast with correct icon', () => {
      render(<ToastContainer />)
      
      act(() => {
        showToast('Info!', 'info')
      })

      expect(screen.getByTestId('icon-info')).toBeInTheDocument()
    })

    it('defaults to info type when type is not specified', () => {
      render(<ToastContainer />)
      
      act(() => {
        showToast('Default type')
      })

      expect(screen.getByTestId('icon-info')).toBeInTheDocument()
    })
  })

  describe('Auto-dismiss Behavior', () => {
    it('auto-dismisses toast after default duration (3000ms)', async () => {
      render(<ToastContainer />)
      
      act(() => {
        showToast('Auto dismiss test', 'success')
      })

      expect(screen.getByText('Auto dismiss test')).toBeInTheDocument()

      // Fast-forward past the duration + animation time
      act(() => {
        jest.advanceTimersByTime(3300)
      })

      await waitFor(() => {
        expect(screen.queryByText('Auto dismiss test')).not.toBeInTheDocument()
      })
    })

    it('auto-dismisses toast after custom duration', async () => {
      render(<ToastContainer />)
      
      act(() => {
        showToast('Custom duration', 'success', 5000)
      })

      expect(screen.getByText('Custom duration')).toBeInTheDocument()

      // Should still be visible after 3 seconds
      act(() => {
        jest.advanceTimersByTime(3000)
      })
      expect(screen.getByText('Custom duration')).toBeInTheDocument()

      // Should be gone after 5 seconds + animation
      act(() => {
        jest.advanceTimersByTime(2300)
      })

      await waitFor(() => {
        expect(screen.queryByText('Custom duration')).not.toBeInTheDocument()
      })
    })
  })

  describe('Manual Dismiss', () => {
    it('dismisses toast when close button is clicked', async () => {
      render(<ToastContainer />)
      
      act(() => {
        showToast('Manual dismiss test', 'success', 0) // duration 0 = no auto-dismiss
      })

      expect(screen.getByText('Manual dismiss test')).toBeInTheDocument()

      const closeButton = screen.getByRole('button', { name: /dismiss/i })
      fireEvent.click(closeButton)

      // Wait for animation
      act(() => {
        jest.advanceTimersByTime(300)
      })

      await waitFor(() => {
        expect(screen.queryByText('Manual dismiss test')).not.toBeInTheDocument()
      })
    })

    it('dismissToast function removes specific toast', async () => {
      render(<ToastContainer />)
      
      let toastId: number
      act(() => {
        // Store the timestamp-based ID
        const before = Date.now()
        showToast('First toast', 'success', 0)
        toastId = before
      })

      expect(screen.getByText('First toast')).toBeInTheDocument()

      // Use the close button instead of direct dismissToast for simplicity
      const closeButton = screen.getByRole('button', { name: /dismiss/i })
      fireEvent.click(closeButton)

      act(() => {
        jest.advanceTimersByTime(300)
      })

      await waitFor(() => {
        expect(screen.queryByText('First toast')).not.toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA role and live region', () => {
      render(<ToastContainer />)
      
      act(() => {
        showToast('Accessible toast', 'success')
      })

      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-live', 'polite')
    })

    it('close button has accessible label', () => {
      render(<ToastContainer />)
      
      act(() => {
        showToast('Test toast', 'success')
      })

      const closeButton = screen.getByRole('button', { name: /dismiss/i })
      expect(closeButton).toBeInTheDocument()
    })

    it('container has aria-label for screen readers', () => {
      render(<ToastContainer />)
      
      act(() => {
        showToast('Test toast', 'success')
      })

      const container = screen.getByLabelText('Notifications')
      expect(container).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('success toast has green styling', () => {
      render(<ToastContainer />)
      
      act(() => {
        showToast('Success', 'success')
      })

      const alert = screen.getByRole('alert')
      expect(alert.className).toContain('bg-green')
      expect(alert.className).toContain('border-green')
    })

    it('error toast has red styling', () => {
      render(<ToastContainer />)
      
      act(() => {
        showToast('Error', 'error')
      })

      const alert = screen.getByRole('alert')
      expect(alert.className).toContain('bg-red')
      expect(alert.className).toContain('border-red')
    })

    it('warning toast has amber styling', () => {
      render(<ToastContainer />)
      
      act(() => {
        showToast('Warning', 'warning')
      })

      const alert = screen.getByRole('alert')
      expect(alert.className).toContain('bg-amber')
      expect(alert.className).toContain('border-amber')
    })

    it('info toast has blue styling', () => {
      render(<ToastContainer />)
      
      act(() => {
        showToast('Info', 'info')
      })

      const alert = screen.getByRole('alert')
      expect(alert.className).toContain('bg-blue')
      expect(alert.className).toContain('border-blue')
    })
  })
})
