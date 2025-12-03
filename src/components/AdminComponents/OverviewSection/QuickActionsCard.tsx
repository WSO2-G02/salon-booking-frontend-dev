/**
 * QuickActionsCard Component
 * 
 * Displays a grid of quick action buttons for common admin tasks.
 * Provides shortcuts to navigate to different admin dashboard tabs.
 * 
 * @component
 */

'use client'

import { LucideIcon, Plus, Calendar, Users, Scissors, FileText, User } from 'lucide-react'

interface QuickAction {
  id: string
  label: string
  Icon: LucideIcon
  bgColor: string
  hoverBgColor: string
  iconColor: string
  onClick: () => void
}

interface QuickActionsCardProps {
  onTabChange: (tab: string) => void
}

export default function QuickActionsCard({ onTabChange }: QuickActionsCardProps) {
  const actions: QuickAction[] = [
    {
      id: 'new-appointment',
      label: 'New Appointment',
      Icon: Plus,
      bgColor: 'bg-red-50',
      hoverBgColor: 'hover:bg-red-100',
      iconColor: 'text-red-600',
      onClick: () => onTabChange('appointments'),
    },
    {
      id: 'view-appointments',
      label: 'View Appointments',
      Icon: Calendar,
      bgColor: 'bg-blue-50',
      hoverBgColor: 'hover:bg-blue-100',
      iconColor: 'text-blue-600',
      onClick: () => onTabChange('appointments'),
    },
    {
      id: 'manage-staff',
      label: 'Manage Staff',
      Icon: Users,
      bgColor: 'bg-purple-50',
      hoverBgColor: 'hover:bg-purple-100',
      iconColor: 'text-purple-600',
      onClick: () => onTabChange('staff'),
    },
    {
      id: 'manage-services',
      label: 'Manage Services',
      Icon: Scissors,
      bgColor: 'bg-green-50',
      hoverBgColor: 'hover:bg-green-100',
      iconColor: 'text-green-600',
      onClick: () => onTabChange('services'),
    },
    {
      id: 'view-reports',
      label: 'View Reports',
      Icon: FileText,
      bgColor: 'bg-yellow-50',
      hoverBgColor: 'hover:bg-yellow-100',
      iconColor: 'text-yellow-600',
      onClick: () => onTabChange('reports'),
    },
    {
      id: 'customers',
      label: 'Customers',
      Icon: User,
      bgColor: 'bg-gray-50',
      hoverBgColor: 'hover:bg-gray-100',
      iconColor: 'text-gray-600',
      onClick: () => onTabChange('customers'),
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`${action.bgColor} ${action.hoverBgColor} p-4 rounded-lg transition-colors duration-200 flex flex-col items-center gap-2 text-center`}
          >
            <action.Icon size={24} className={action.iconColor} />
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
