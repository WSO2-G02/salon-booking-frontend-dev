/**
 * DateRangeFilter Component
 *
 * Provides date range selection controls for filtering analytics data.
 * Updates parent component when date range changes.
 *
 * Features:
 * - Start date and end date inputs
 * - Responsive layout (stacks on mobile)
 * - Controlled component pattern
 */

import 'react-datepicker/dist/react-datepicker.css'

import DatePicker from 'react-datepicker'
import { BarChart3, CalendarDays } from 'lucide-react'

interface DateRange {
  start: string
  end: string
}

interface DateRangeFilterProps {
  /** Current date range */
  dateRange: DateRange
  /** Callback when date range changes */
  onDateRangeChange: (dateRange: DateRange) => void
}

export default function DateRangeFilter({ dateRange, onDateRangeChange }: DateRangeFilterProps) {
  const parseISODate = (value: string): Date | null => {
    if (!value) return null
    const [year, month, day] = value.split('-').map(Number)
    if (!year || !month || !day) return null
    return new Date(year, month - 1, day)
  }

  const formatToISODate = (date: Date | null): string => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const startDate = parseISODate(dateRange.start)
  const endDate = parseISODate(dateRange.end)

  const handleStartDateChange = (date: Date | null) => {
    const formatted = formatToISODate(date)
    const updatedEnd = endDate && date && endDate < date ? formatted : dateRange.end
    onDateRangeChange({ start: formatted, end: updatedEnd })
  }

  const handleEndDateChange = (date: Date | null) => {
    onDateRangeChange({ ...dateRange, end: formatToISODate(date) })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Header section with icon */}
        <div className="flex items-center space-x-3">
          <BarChart3 size={28} className="text-red-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
            <p className="text-sm text-gray-600 mt-1">
              Comprehensive business insights and performance metrics
            </p>
          </div>
        </div>
        
        {/* Date range inputs */}
        <div className="flex items-center space-x-4">
          {/* Start date input */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">From:</label>
            <div className="relative">
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                dateFormat="MMM dd, yyyy"
                maxDate={endDate ?? undefined}
                placeholderText="Select start date"
                className="w-44 cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                calendarClassName="shadow-lg border border-gray-200 rounded-lg"
                popperClassName="z-50"
              />
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          {/* End date input */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">To:</label>
            <div className="relative">
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                dateFormat="MMM dd, yyyy"
                minDate={startDate ?? undefined}
                placeholderText="Select end date"
                className="w-44 cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                calendarClassName="shadow-lg border border-gray-200 rounded-lg"
                popperClassName="z-50"
              />
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
