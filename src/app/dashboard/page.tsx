'use client'

import { useEffect, useState } from 'react'
import { Users, Trophy, Coins, TrendingUp } from 'lucide-react' // Changed DollarSign to Coins
import api from '@/lib/api'
import AdminLayout from '@/components/layout/AdminLayout'

interface DashboardStats {
  totalUsers: number
  totalQuizzes: number
  totalEarnings: number
  activeUsers: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/api/v1/admin/dashboard-stats')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">Loading...</div>
      </AdminLayout>
    )
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Quizzes',
      value: stats?.totalQuizzes || 0,
      icon: Trophy,
      color: 'bg-green-500'
    },
    {
      title: 'Total Earnings',
      value: `${stats?.totalEarnings || 0} TBG`, // Changed from $ to TBG
      icon: Coins, // Changed from DollarSign to Coins
      color: 'bg-yellow-500'
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ]

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`${card.color} rounded-lg p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <p className="text-gray-600">Recent user activities will be displayed here.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-700">
                Create New Quiz
              </button>
              <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-md text-green-700">
                View User Reports
              </button>
              <button className="w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-md text-purple-700">
                Manage Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}