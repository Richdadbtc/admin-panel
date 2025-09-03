'use client'

import { useEffect, useState } from 'react'
import { Send, Users, Target, BarChart3 } from 'lucide-react'
import api from '@/lib/api'
import AdminLayout from '@/components/layout/AdminLayout'
import AnnouncementForm from '@/components/notifications/AnnouncementForm'
import TargetedNotificationForm from '@/components/notifications/TargetedNotificationForm'
import NotificationAnalytics from '@/components/notifications/NotificationAnalytics'

type TabType = 'announcement' | 'targeted' | 'analytics'

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('announcement')
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalNotifications: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/dashboard-stats')
      setStats({
        totalUsers: response.data.totalUsers || 0,
        activeUsers: response.data.activeUsers || 0,
        totalNotifications: response.data.totalNotifications || 0
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const tabs = [
    {
      id: 'announcement' as TabType,
      name: 'Send Announcement',
      icon: Send,
      description: 'Send notifications to all users'
    },
    {
      id: 'targeted' as TabType,
      name: 'Targeted Notification',
      icon: Target,
      description: 'Send notifications to specific users'
    },
    {
      id: 'analytics' as TabType,
      name: 'Analytics',
      icon: BarChart3,
      description: 'View notification analytics'
    }
  ]

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Notification Management</h1>
          <p className="text-gray-600">Manage announcements and targeted notifications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Send className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Notifications Sent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalNotifications}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'announcement' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Send Announcement</h3>
                  <p className="text-gray-600">Send a notification to all active users in the app.</p>
                </div>
                <AnnouncementForm onSuccess={fetchStats} />
              </div>
            )}

            {activeTab === 'targeted' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Targeted Notification</h3>
                  <p className="text-gray-600">Send notifications to specific users based on criteria.</p>
                </div>
                <TargetedNotificationForm onSuccess={fetchStats} />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Notification Analytics</h3>
                  <p className="text-gray-600">View detailed analytics about notification performance.</p>
                </div>
                <NotificationAnalytics onRefresh={async (): Promise<void> => {
                  // Implement refresh logic here
                  console.log('Refreshing analytics...');
                }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}