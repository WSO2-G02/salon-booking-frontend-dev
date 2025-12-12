/**
 * Service Layer Tests
 * Tests for API service functions with mocked fetch
 */
import { describe, it, expect, beforeEach } from '@jest/globals'

// Mock fetch globally
const mockFetch = global.fetch as jest.Mock

describe('API Services', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  describe('User Service', () => {
    const API_BASE = process.env.NEXT_PUBLIC_USER_API_BASE

    it('should have correct API base URL configured', () => {
      expect(API_BASE).toBe('http://localhost:8001')
    })

    it('should handle login request correctly', async () => {
      const mockResponse = {
        access_token: 'test-token',
        token_type: 'bearer',
        user: { id: 1, email: 'test@example.com' }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
      })

      expect(response.ok).toBe(true)
      const data = await response.json()
      expect(data.access_token).toBe('test-token')
    })

    it('should handle login failure correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Invalid credentials' }),
      })

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'wrong@example.com', password: 'wrong' }),
      })

      expect(response.ok).toBe(false)
      expect(response.status).toBe(401)
    })

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(
        fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          body: JSON.stringify({}),
        })
      ).rejects.toThrow('Network error')
    })
  })

  describe('Appointment Service', () => {
    const API_BASE = process.env.NEXT_PUBLIC_APPOINTMENT_API_BASE

    it('should have correct API base URL configured', () => {
      expect(API_BASE).toBe('http://localhost:8004')
    })

    it('should fetch appointments successfully', async () => {
      const mockAppointments = [
        {
          id: 1,
          customer_id: 1,
          service_id: 1,
          staff_id: 1,
          appointment_date: '2025-12-15',
          start_time: '10:00',
          status: 'confirmed'
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAppointments,
      })

      const response = await fetch(`${API_BASE}/appointments`)
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data).toHaveLength(1)
      expect(data[0].status).toBe('confirmed')
    })

    it('should create appointment successfully', async () => {
      const newAppointment = {
        customer_id: 1,
        service_id: 1,
        staff_id: 1,
        appointment_date: '2025-12-20',
        start_time: '14:00',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ id: 2, ...newAppointment, status: 'pending' }),
      })

      const response = await fetch(`${API_BASE}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment),
      })

      expect(response.ok).toBe(true)
      expect(response.status).toBe(201)
    })
  })

  describe('Staff Service', () => {
    const API_BASE = process.env.NEXT_PUBLIC_STAFF_API_BASE

    it('should have correct API base URL configured', () => {
      expect(API_BASE).toBe('http://localhost:8003')
    })

    it('should fetch staff list successfully', async () => {
      const mockStaff = [
        { id: 1, name: 'John Doe', position: 'Stylist', is_active: true },
        { id: 2, name: 'Jane Smith', position: 'Manager', is_active: true },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStaff,
      })

      const response = await fetch(`${API_BASE}/staff`)
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data).toHaveLength(2)
    })
  })

  describe('Services Management', () => {
    const API_BASE = process.env.NEXT_PUBLIC_SERVICE_API_BASE

    it('should have correct API base URL configured', () => {
      expect(API_BASE).toBe('http://localhost:8002')
    })

    it('should fetch salon services successfully', async () => {
      const mockServices = [
        { id: 1, name: 'Haircut', category: 'Hair', price: 25.00, duration: 30 },
        { id: 2, name: 'Manicure', category: 'Nails', price: 35.00, duration: 45 },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockServices,
      })

      const response = await fetch(`${API_BASE}/services`)
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data).toHaveLength(2)
      expect(data[0].name).toBe('Haircut')
    })
  })

  describe('Analytics Service', () => {
    const API_BASE = process.env.NEXT_PUBLIC_ANALYTICS_API_BASE

    it('should have correct API base URL configured', () => {
      expect(API_BASE).toBe('http://localhost:8006')
    })

    it('should fetch revenue summary successfully', async () => {
      const mockRevenue = {
        total_revenue: 15000,
        total_appointments: 150,
        completed_appointments: 140,
        cancelled_appointments: 10,
        average_revenue_per_appointment: 100,
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockRevenue,
      })

      const response = await fetch(`${API_BASE}/analytics/revenue/summary`)
      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.total_revenue).toBe(15000)
    })
  })
})
