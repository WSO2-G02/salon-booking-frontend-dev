'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, TrendingUp, Calendar, Scissors, Users, User, LogOut } from 'lucide-react'
import ReportsAnalyticsTab from './ReportsAnalyticsTab'
import StaffManagementTab from './StaffManagementTab'
import ServicesManagementTab from './ServicesManagementTab'
import CustomersManagementTab from './CustomersManagementTab'

type TabType = 'overview' | 'reports' | 'appointments' | 'services' | 'staff' | 'customers'

export default function AdminDashboardLayout() {
  const [activeTab, setActiveTab] = useState<TabType>('reports')
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    router.push('/admin/login')
  }

  const tabs = [
    { id: 'overview', label: 'Overview', Icon: BarChart3 },
    { id: 'reports', label: 'Reports & Analytics', Icon: TrendingUp },
    { id: 'appointments', label: 'Appointments', Icon: Calendar },
    { id: 'services', label: 'Services', Icon: Scissors },
    { id: 'staff', label: 'Staff', Icon: Users },
    { id: 'customers', label: 'Customers', Icon: User },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Liyo Salon <span className="text-red-600">Admin</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">Admin</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-1 min-w-[140px] px-4 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-red-600 text-red-600 bg-red-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <tab.Icon size={18} />
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'overview' && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <BarChart3 size={32} className="text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
              </div>
              <p className="text-gray-600">Overview tab content will be implemented here.</p>
            </div>
          )}

          {activeTab === 'reports' && <ReportsAnalyticsTab />}

          {activeTab === 'appointments' && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Calendar size={32} className="text-red-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Appointments Management</h2>
              </div>
              <p className="text-gray-600">Appointments tab content will be implemented here.</p>
            </div>
          )}

          {activeTab === 'services' && <ServicesManagementTab />}

          {activeTab === 'staff' && <StaffManagementTab />}

          {activeTab === 'customers' && <CustomersManagementTab />}
        </div>
      </div>
    </div>
  )
}
