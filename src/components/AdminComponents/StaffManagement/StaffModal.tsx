/**
 * StaffModal Component
 * 
 * Modal form for creating or editing staff members.
 * Handles form validation and submission.
 * 
 * @component
 */

'use client'

import { useState, useEffect } from 'react'
import { X, User, Briefcase, Award, Calendar, Hash } from 'lucide-react'
import {
  type StaffResponse,
  type StaffCreate,
  type StaffUpdate,
} from '@/services/staffService'

interface StaffModalProps {
  /** Whether modal is open */
  isOpen: boolean
  /** Callback to close modal */
  onClose: () => void
  /** Callback when form is submitted */
  onSave: (data: StaffCreate | StaffUpdate) => Promise<void>
  /** Staff data for editing (null for create) */
  staff: StaffResponse | null
  /** Submitting state */
  submitting: boolean
}

// Position options
const POSITIONS = [
  'Senior Stylist',
  'Junior Stylist',
  'Nail Technician',
  'Massage Therapist',
  'Makeup Artist',
  'Receptionist',
  'Manager',
]

export default function StaffModal({
  isOpen,
  onClose,
  onSave,
  staff,
  submitting,
}: StaffModalProps) {
  // =====================================================
  // FORM STATE
  // =====================================================
  
  const [formData, setFormData] = useState({
    user_id: '',
    employee_id: '',
    position: POSITIONS[0],
    specialties: '',
    experience_years: '',
    hire_date: '',
    is_active: true,
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  // =====================================================
  // POPULATE FORM FOR EDITING
  // =====================================================
  
  useEffect(() => {
    if (staff) {
      setFormData({
        user_id: staff.user_id.toString(),
        employee_id: staff.employee_id,
        position: staff.position,
        specialties: staff.specialties || '',
        experience_years: staff.experience_years?.toString() || '',
        hire_date: staff.hire_date || '',
        is_active: staff.is_active,
      })
    } else {
      // Reset form for create
      setFormData({
        user_id: '',
        employee_id: '',
        position: POSITIONS[0],
        specialties: '',
        experience_years: '',
        hire_date: '',
        is_active: true,
      })
    }
    setErrors({})
  }, [staff, isOpen])

  // =====================================================
  // FORM VALIDATION
  // =====================================================
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // User ID required for create
    if (!staff && !formData.user_id) {
      newErrors.user_id = 'User ID is required'
    } else if (!staff && isNaN(parseInt(formData.user_id))) {
      newErrors.user_id = 'User ID must be a number'
    }
    
    // Employee ID required for create
    if (!staff && !formData.employee_id.trim()) {
      newErrors.employee_id = 'Employee ID is required'
    }
    
    // Position required
    if (!formData.position) {
      newErrors.position = 'Position is required'
    }
    
    // Experience must be positive
    if (formData.experience_years && parseInt(formData.experience_years) < 0) {
      newErrors.experience_years = 'Experience cannot be negative'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // =====================================================
  // FORM SUBMISSION
  // =====================================================
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    if (staff) {
      // Update: only send changed fields
      const updateData: StaffUpdate = {
        position: formData.position,
        specialties: formData.specialties || undefined,
        experience_years: formData.experience_years 
          ? parseInt(formData.experience_years) 
          : undefined,
        hire_date: formData.hire_date || undefined,
        is_active: formData.is_active,
      }
      await onSave(updateData)
    } else {
      // Create: send all required fields
      const createData: StaffCreate = {
        user_id: parseInt(formData.user_id),
        employee_id: formData.employee_id.trim().toUpperCase(),
        position: formData.position,
        specialties: formData.specialties || undefined,
        experience_years: formData.experience_years 
          ? parseInt(formData.experience_years) 
          : undefined,
        hire_date: formData.hire_date || undefined,
      }
      await onSave(createData)
    }
  }

  // =====================================================
  // INPUT CHANGE HANDLER
  // =====================================================
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // =====================================================
  // RENDER
  // =====================================================
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <User size={24} className="text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* User ID (create only) */}
            {!staff && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Hash size={14} className="inline mr-1" />
                  User ID *
                </label>
                <input
                  type="number"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  placeholder="Reference to user service"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                    errors.user_id 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-red-200 focus:border-red-500'
                  }`}
                />
                {errors.user_id && (
                  <p className="mt-1 text-xs text-red-600">{errors.user_id}</p>
                )}
              </div>
            )}
            
            {/* Employee ID (create only) */}
            {!staff && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Hash size={14} className="inline mr-1" />
                  Employee ID *
                </label>
                <input
                  type="text"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  placeholder="e.g., EMP001"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                    errors.employee_id 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-red-200 focus:border-red-500'
                  }`}
                />
                {errors.employee_id && (
                  <p className="mt-1 text-xs text-red-600">{errors.employee_id}</p>
                )}
              </div>
            )}
            
            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Briefcase size={14} className="inline mr-1" />
                Position *
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  errors.position 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-red-200 focus:border-red-500'
                }`}
              >
                {POSITIONS.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
              {errors.position && (
                <p className="mt-1 text-xs text-red-600">{errors.position}</p>
              )}
            </div>
            
            {/* Specialties */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Award size={14} className="inline mr-1" />
                Specialties
              </label>
              <textarea
                name="specialties"
                value={formData.specialties}
                onChange={handleChange}
                placeholder="Comma-separated, e.g., Hair Coloring, Cutting, Styling"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              />
            </div>
            
            {/* Experience Years */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience (Years)
              </label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                placeholder="e.g., 5"
                min="0"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  errors.experience_years 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-red-200 focus:border-red-500'
                }`}
              />
              {errors.experience_years && (
                <p className="mt-1 text-xs text-red-600">{errors.experience_years}</p>
              )}
            </div>
            
            {/* Hire Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar size={14} className="inline mr-1" />
                Hire Date
              </label>
              <input
                type="date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              />
            </div>
            
            {/* Active Status (edit only) */}
            {staff && (
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active Staff Member</span>
                </label>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  submitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {submitting ? 'Saving...' : (staff ? 'Update Staff' : 'Create Staff')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
