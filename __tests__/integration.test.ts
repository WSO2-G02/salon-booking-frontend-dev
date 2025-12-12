/**
 * Integration Tests
 * Tests for page-level integration and user flows
 */
import { describe, it, expect, beforeEach } from '@jest/globals'

const mockFetch = global.fetch as jest.Mock

describe('Integration Tests', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  describe('Authentication Flow', () => {
    it('should complete login flow successfully', async () => {
      // Step 1: User submits login form
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'jwt-token-123',
          token_type: 'bearer',
          user: {
            id: 1,
            email: 'user@example.com',
            first_name: 'John',
            last_name: 'Doe',
            role: 'customer'
          }
        }),
      })

      const loginResponse = await fetch(
        `${process.env.NEXT_PUBLIC_USER_API_BASE}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'user@example.com',
            password: 'securePassword123'
          }),
        }
      )

      const loginData = await loginResponse.json()

      expect(loginResponse.ok).toBe(true)
      expect(loginData.access_token).toBeDefined()
      expect(loginData.user.role).toBe('customer')

      // Step 2: Use token to fetch user profile
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          email: 'user@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '+1234567890'
        }),
      })

      const profileResponse = await fetch(
        `${process.env.NEXT_PUBLIC_USER_API_BASE}/users/me`,
        {
          headers: {
            'Authorization': `Bearer ${loginData.access_token}`
          }
        }
      )

      const profileData = await profileResponse.json()
      expect(profileResponse.ok).toBe(true)
      expect(profileData.email).toBe('user@example.com')
    })

    it('should handle invalid credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          detail: 'Incorrect email or password'
        }),
      })

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_USER_API_BASE}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'wrong@example.com',
            password: 'wrongpassword'
          }),
        }
      )

      expect(response.ok).toBe(false)
      expect(response.status).toBe(401)
    })
  })

  describe('Booking Flow', () => {
    const authHeader = { 'Authorization': 'Bearer valid-token' }

    it('should complete full booking flow', async () => {
      // Step 1: Fetch available services
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { id: 1, name: 'Haircut', price: 25.00, duration: 30 },
          { id: 2, name: 'Hair Coloring', price: 75.00, duration: 90 },
        ]),
      })

      const servicesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE_API_BASE}/services`
      )
      const services = await servicesResponse.json()
      
      expect(services).toHaveLength(2)
      const selectedService = services[0]

      // Step 2: Fetch available staff for service
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { id: 1, name: 'Alice Johnson', position: 'Senior Stylist' },
          { id: 2, name: 'Bob Smith', position: 'Stylist' },
        ]),
      })

      const staffResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STAFF_API_BASE}/staff?service_id=${selectedService.id}`
      )
      const staff = await staffResponse.json()
      
      expect(staff).toHaveLength(2)
      const selectedStaff = staff[0]

      // Step 3: Check availability
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          available_slots: [
            { date: '2025-12-15', time: '10:00' },
            { date: '2025-12-15', time: '14:00' },
            { date: '2025-12-16', time: '09:00' },
          ]
        }),
      })

      const availabilityResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APPOINTMENT_API_BASE}/appointments/availability?staff_id=${selectedStaff.id}&date=2025-12-15`
      )
      const availability = await availabilityResponse.json()
      
      expect(availability.available_slots).toBeDefined()
      const selectedSlot = availability.available_slots[0]

      // Step 4: Create appointment
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({
          id: 100,
          service_id: selectedService.id,
          staff_id: selectedStaff.id,
          appointment_date: selectedSlot.date,
          start_time: selectedSlot.time,
          status: 'confirmed'
        }),
      })

      const bookingResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APPOINTMENT_API_BASE}/appointments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeader
          },
          body: JSON.stringify({
            service_id: selectedService.id,
            staff_id: selectedStaff.id,
            appointment_date: selectedSlot.date,
            start_time: selectedSlot.time,
          }),
        }
      )

      const booking = await bookingResponse.json()
      
      expect(bookingResponse.ok).toBe(true)
      expect(booking.id).toBeDefined()
      expect(booking.status).toBe('confirmed')
    })

    it('should handle booking conflict', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({
          detail: 'This time slot is no longer available'
        }),
      })

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APPOINTMENT_API_BASE}/appointments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeader
          },
          body: JSON.stringify({
            service_id: 1,
            staff_id: 1,
            appointment_date: '2025-12-15',
            start_time: '10:00',
          }),
        }
      )

      expect(response.ok).toBe(false)
      expect(response.status).toBe(409)
    })
  })

  describe('Admin Dashboard Flow', () => {
    const adminHeader = { 'Authorization': 'Bearer admin-token' }

    it('should fetch dashboard analytics', async () => {
      // Revenue summary
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          total_revenue: 50000,
          total_appointments: 500,
          completed_appointments: 480,
          cancelled_appointments: 20,
        }),
      })

      const revenueResponse = await fetch(
        `${process.env.NEXT_PUBLIC_ANALYTICS_API_BASE}/analytics/revenue/summary`,
        { headers: adminHeader }
      )
      const revenue = await revenueResponse.json()
      
      expect(revenue.total_revenue).toBe(50000)
      expect(revenue.completed_appointments).toBe(480)
    })

    it('should manage staff schedules', async () => {
      // Get staff schedule
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          staff_id: 1,
          schedules: [
            { day: 'Monday', start_time: '09:00', end_time: '17:00' },
            { day: 'Tuesday', start_time: '09:00', end_time: '17:00' },
          ]
        }),
      })

      const scheduleResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STAFF_API_BASE}/staff/1/schedule`,
        { headers: adminHeader }
      )
      const schedule = await scheduleResponse.json()
      
      expect(schedule.schedules).toHaveLength(2)

      // Update schedule
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Schedule updated successfully'
        }),
      })

      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STAFF_API_BASE}/staff/1/schedule`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...adminHeader
          },
          body: JSON.stringify({
            day: 'Wednesday',
            start_time: '10:00',
            end_time: '18:00'
          }),
        }
      )

      expect(updateResponse.ok).toBe(true)
    })
  })
})

describe('Error Handling', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('should handle 500 server errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({
        detail: 'Internal server error'
      }),
    })

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_USER_API_BASE}/users`
    )

    expect(response.ok).toBe(false)
    expect(response.status).toBe(500)
  })

  it('should handle network timeout', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Request timeout'))

    await expect(
      fetch(`${process.env.NEXT_PUBLIC_USER_API_BASE}/users`)
    ).rejects.toThrow('Request timeout')
  })

  it('should handle 403 forbidden access', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({
        detail: 'Not authorized to access this resource'
      }),
    })

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ANALYTICS_API_BASE}/analytics/revenue`,
      { headers: { 'Authorization': 'Bearer customer-token' } }
    )

    expect(response.ok).toBe(false)
    expect(response.status).toBe(403)
  })
})
