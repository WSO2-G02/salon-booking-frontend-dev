/**
 * ServiceModal Component
 * 
 * Modal form for creating or editing salon services.
 * Handles form validation and submission.
 * 
 * @component
 */

'use client'

import { useState, useEffect } from 'react'
import { X, Tag, DollarSign, Clock, FileText, FolderOpen } from 'lucide-react'
import {
  type ServiceResponse,
  type ServiceCreate,
  type ServiceUpdate,
} from '@/services/servicesService'

interface ServiceModalProps {
  /** Whether modal is open */
  isOpen: boolean
  /** Callback to close modal */
  onClose: () => void
  /** Callback when form is submitted */
  onSave: (data: ServiceCreate | ServiceUpdate) => Promise<void>
  /** Service data for editing (null for create) */
  service: ServiceResponse | null
  /** Available categories */
  categories: string[]
  /** Submitting state */
  submitting: boolean
}

export default function ServiceModal({
  isOpen,
  onClose,
  onSave,
  service,
  categories,
  submitting,
}: ServiceModalProps) {
  // =====================================================
  // FORM STATE
  // =====================================================
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    duration_minutes: '',
    is_active: true,
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newCategory, setNewCategory] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)

  // =====================================================
  // POPULATE FORM FOR EDITING
  // =====================================================
  
  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description || '',
        category: service.category || '',
        price: service.price.toString(),
        duration_minutes: service.duration_minutes.toString(),
        is_active: service.is_active,
      })
    } else {
      // Reset form for create
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        duration_minutes: '',
        is_active: true,
      })
    }
    setErrors({})
    setNewCategory('')
    setShowNewCategory(false)
  }, [service, isOpen])

  // =====================================================
  // FORM VALIDATION
  // =====================================================
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Name required
    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required'
    }
    
    // Price required and positive
    if (!formData.price) {
      newErrors.price = 'Price is required'
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than zero'
    }
    
    // Duration required and positive
    if (!formData.duration_minutes) {
      newErrors.duration_minutes = 'Duration is required'
    } else if (parseInt(formData.duration_minutes) <= 0) {
      newErrors.duration_minutes = 'Duration must be greater than zero'
    } else if (parseInt(formData.duration_minutes) > 1440) {
      newErrors.duration_minutes = 'Duration cannot exceed 24 hours'
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
    
    // Determine category value
    const categoryValue = showNewCategory && newCategory.trim() 
      ? newCategory.trim() 
      : formData.category || undefined
    
    if (service) {
      // Update: only send changed fields
      const updateData: ServiceUpdate = {
        name: formData.name,
        description: formData.description || undefined,
        category: categoryValue,
        price: parseFloat(formData.price),
        duration_minutes: parseInt(formData.duration_minutes),
        is_active: formData.is_active,
      }
      await onSave(updateData)
    } else {
      // Create: send all required fields
      const createData: ServiceCreate = {
        name: formData.name.trim(),
        description: formData.description || undefined,
        category: categoryValue,
        price: parseFloat(formData.price),
        duration_minutes: parseInt(formData.duration_minutes),
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
              <Tag size={24} className="text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {service ? 'Edit Service' : 'Add New Service'}
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
            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Tag size={14} className="inline mr-1" />
                Service Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Haircut - Men"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-red-200 focus:border-red-500'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText size={14} className="inline mr-1" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Service description..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              />
            </div>
            
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FolderOpen size={14} className="inline mr-1" />
                Category
              </label>
              {!showNewCategory ? (
                <div className="flex gap-2">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(true)}
                    className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                  >
                    + New
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false)
                      setNewCategory('')
                    }}
                    className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            
            {/* Price and Duration Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign size={14} className="inline mr-1" />
                  Price (LKR) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g., 1500"
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                    errors.price 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-red-200 focus:border-red-500'
                  }`}
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600">{errors.price}</p>
                )}
              </div>
              
              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock size={14} className="inline mr-1" />
                  Duration (min) *
                </label>
                <input
                  type="number"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleChange}
                  placeholder="e.g., 60"
                  min="1"
                  max="1440"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                    errors.duration_minutes 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-red-200 focus:border-red-500'
                  }`}
                />
                {errors.duration_minutes && (
                  <p className="mt-1 text-xs text-red-600">{errors.duration_minutes}</p>
                )}
              </div>
            </div>
            
            {/* Active Status (edit only) */}
            {service && (
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active Service</span>
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
                {submitting ? 'Saving...' : (service ? 'Update Service' : 'Create Service')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
