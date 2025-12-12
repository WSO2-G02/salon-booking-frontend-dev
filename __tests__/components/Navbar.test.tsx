/**
 * Navbar Component Tests
 * Industry-standard tests using React Testing Library
 * 
 * Best Practices:
 * - Test behavior, not implementation
 * - Query by accessible roles/labels
 * - Mock external dependencies
 */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Navbar from '@/components/Navbar'

// Mock Next.js navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.clear()
  })

  describe('Rendering', () => {
    it('renders the brand logo', () => {
      render(<Navbar />)
      expect(screen.getByText('AURORA')).toBeInTheDocument()
    })

    it('renders all navigation links', () => {
      render(<Navbar />)
      
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /services/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
    })

    it('has correct href attributes for navigation links', () => {
      render(<Navbar />)
      
      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
      expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about')
      expect(screen.getByRole('link', { name: /services/i })).toHaveAttribute('href', '/services')
      expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact')
    })
  })

  describe('Authentication State - Logged Out', () => {
    it('shows Book Now button linking to login when not authenticated', () => {
      localStorageMock.getItem.mockReturnValue(null)
      render(<Navbar />)
      
      // When logged out, the "Book Now" link goes to /login
      const bookNowLink = screen.getByRole('link', { name: /book now/i })
      expect(bookNowLink).toHaveAttribute('href', '/login')
    })

    it('shows profile icon linking to login when not authenticated', () => {
      localStorageMock.getItem.mockReturnValue(null)
      render(<Navbar />)
      
      // The profile icon (👤) links to /login when logged out
      expect(screen.getByRole('link', { name: '👤' })).toHaveAttribute('href', '/login')
    })
  })

  describe('Authentication State - Logged In', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue('valid-token')
    })

    it('shows Book Now button when authenticated', async () => {
      render(<Navbar />)
      
      await waitFor(() => {
        expect(screen.getByText(/book now/i)).toBeInTheDocument()
      })
    })

    it('shows Profile link when authenticated', async () => {
      render(<Navbar />)
      
      await waitFor(() => {
        // Profile link has 👤 icon and links to /profile
        const profileLink = screen.getByRole('link', { name: '👤' })
        expect(profileLink).toHaveAttribute('href', '/profile')
      })
    })

    it('shows Logout button when authenticated', async () => {
      render(<Navbar />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
      })
    })
  })

  describe('Logout Functionality', () => {
    it('clears token and redirects on logout', async () => {
      localStorageMock.getItem.mockReturnValue('valid-token')
      render(<Navbar />)
      
      await waitFor(() => {
        const logoutButton = screen.getByRole('button', { name: /logout/i })
        fireEvent.click(logoutButton)
      })

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token')
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  describe('Accessibility', () => {
    it('has a navigation landmark', () => {
      render(<Navbar />)
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('links are keyboard accessible', () => {
      render(<Navbar />)
      
      const homeLink = screen.getByRole('link', { name: /home/i })
      homeLink.focus()
      expect(document.activeElement).toBe(homeLink)
    })
  })
})
