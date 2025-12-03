/**
 * StaffAvailabilityModal Component
 * 
 * Modal for viewing and managing staff availability slots.
 * Allows admins to:
 * - View available time slots for a specific date
 * - Add new availability slots (work, break, unavailable)
 * 
 * @component
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Calendar, Clock, Plus, AlertCircle, Check } from 'lucide-react'
import { showToast } from '@/components/Toast'
import {
  type StaffResponse,
  getStaffAvailability,
  createAvailability,
  type StaffAvailabilityResponse,
  type TimeSlot,
} from '@/services/staffService'

interface StaffAvailabilityModalProps {
  /** Whether modal is open */
  isOpen: boolean
  /** Callback to close modal */
  onClose: () => void
  /** Staff member to manage availability for */
  staff: StaffResponse
}

// Availability type options
const AVAILABILITY_TYPES = [
  { value: 'work', label: 'Work', color: 'bg-green-100 text-green-700' },
  { value: 'break', label: 'Break', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'unavailable', label: 'Unavailable', color: 'bg-red-100 text-red-700' },
]

export default function StaffAvailabilityModal({
  isOpen,
  onClose,
  staff,
}: StaffAvailabilityModalProps) {
  // =====================================================
  // STATE MANAGEMENT
  // =====================================================
  
  /** Selected date for viewing/adding availability */
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  
  /** Availability data from API */
  const [availability, setAvailability] = useState<StaffAvailabilityResponse | null>(null)
  
  /** Loading state */
  const [loading, setLoading] = useState(false)
  
  /** Error message */
  const [error, setError] = useState<string | null>(null)
  
  /** Show add form */
  const [showAddForm, setShowAddForm] = useState(false)
  
  /** Add form data */
  const [formData, setFormData] = useState({
    start_time: '09:00',
    end_time: '17:00',
    availability_type: 'work' as 'work' | 'break' | 'unavailable',
  })
  
  /** Submitting state */
  const [submitting, setSubmitting] = useState(false)

  // =====================================================
  // DATA FETCHING
  // =====================================================
  
  /**
   * Fetch availability for selected date
   */
  const loadAvailability = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await getStaffAvailability(staff.id, selectedDate, 30)
      setAvailability(data)
    } catch (err) {
      console.error('Failed to fetch availability:', err)
      setError(err instanceof Error ? err.message : 'Failed to load availability')
      setAvailability(null)
    } finally {
      setLoading(false)
    }
  }, [staff.id, selectedDate])

  useEffect(() => {
    if (isOpen && selectedDate) {
      loadAvailability()
    }
  }, [isOpen, selectedDate, loadAvailability])

  // =====================================================
  // EVENT HANDLERS
  // =====================================================
  
  /**
   * Handle date change
   */
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
    setShowAddForm(false)
  }

  /**
   * Handle form input change
   */
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  /**
   * Handle add availability
   */
  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate times
    if (formData.start_time >= formData.end_time) {
      showToast('End time must be after start time', 'error')
      return
    }
    
    setSubmitting(true)
    
    try {
      await createAvailability(staff.id, {
        slot_date: selectedDate,
        start_time: formData.start_time,
        end_time: formData.end_time,
        availability_type: formData.availability_type,
      })
      
      showToast('Availability slot added successfully', 'success')
      setShowAddForm(false)
      loadAvailability() // Refresh
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add availability'
      showToast(message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Format time for display
   */
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const h = parseInt(hours)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const displayHour = h % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  // =====================================================
  // RENDER
  // =====================================================
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <div className="flex items-center space-x-2">
                <Calendar size={24} className="text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage Availability
                </h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {staff.employee_id} - {staff.position}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Date Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              />
            </div>
            
            {/* Loading State */}
            {loading && (
              <div className="py-8 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading availability...</p>
              </div>
            )}
            
            {/* Error State */}
            {error && !loading && (
              <div className="py-4 px-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle size={20} />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}
            
            {/* Available Slots */}
            {availability && !loading && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Available Time Slots
                  </h4>
                  <span className="text-xs text-gray-500">
                    {availability.total_available_minutes} min total
                  </span>
                </div>
                
                {availability.available_slots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availability.available_slots.map((slot: TimeSlot, index: number) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm"
                      >
                        <Clock size={14} className="text-green-600" />
                        <span className="text-green-700">
                          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                    <Calendar size={24} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No availability set for this date</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Add Availability Section */}
            <div className="border-t border-gray-200 pt-4">
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Plus size={18} />
                  <span>Add Availability Slot</span>
                </button>
              ) : (
                <form onSubmit={handleAddAvailability} className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    Add New Availability Slot
                  </h4>
                  
                  {/* Time inputs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
                      />
                    </div>
                  </div>
                  
                  {/* Availability Type */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Availability Type
                    </label>
                    <select
                      name="availability_type"
                      value={formData.availability_type}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
                    >
                      {AVAILABILITY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      disabled={submitting}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-colors ${
                        submitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      <Check size={14} />
                      <span>{submitting ? 'Adding...' : 'Add Slot'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex justify-end p-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
