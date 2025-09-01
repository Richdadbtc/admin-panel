'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, TrendingUp, Users, Bell, Eye } from 'lucide-react'
import api from '@/lib/api'

interface NotificationAnalyticsProps {
  onRefresh: () => Promise<any>
}

interface AnalyticsData {
  totalSent: number
  totalRead: number
  readRate: number
  byType: Record<string, { sent: number; read: number }>
  byPriority: Record<string, { sent: number; read: number }>
  recentNotifications: Array<{
    _id: string
    title: string
    type: string
    priority: string
    createdAt: string
    readCount: number
    totalRecipients: number
  }>
}

export default function NotificationAnalytics({ onRefresh }: NotificationAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/api/v1/admin/notifications/analytics')
      setAnalytics(response.data.analytics || {})
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      // Fallback to onRefresh if direct API call fails
      try {
        const data = await onRefresh()
        setAnalytics(data)
      } catch (refreshError) {
        console.error('Error fetching analytics via onRefresh:', refreshError)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold">{analytics.totalSent}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Read</p>
                <p className="text-2xl font-bold">{analytics.totalRead}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Read Rate</p>
                <p className="text-2xl font-bold">{analytics.readRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Button onClick={fetchAnalytics} disabled={isLoading} variant="outline" size="sm">
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics by Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.byType).map(([type, data]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{type}</Badge>
                    <span className="text-sm text-gray-600">
                      {data.sent} sent, {data.read} read
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {data.sent > 0 ? ((data.read / data.sent) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.byPriority).map(([priority, data]) => (
                <div key={priority} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={priority === 'urgent' ? 'destructive' : priority === 'high' ? 'default' : 'secondary'}
                    >
                      {priority}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {data.sent} sent, {data.read} read
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {data.sent > 0 ? ((data.read / data.sent) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recentNotifications.map((notification) => (
              <div key={notification._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{notification.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{notification.type}</Badge>
                    <Badge 
                      variant={notification.priority === 'urgent' ? 'destructive' : notification.priority === 'high' ? 'default' : 'secondary'}
                    >
                      {notification.priority}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {notification.readCount}/{notification.totalRecipients} read
                  </p>
                  <p className="text-xs text-gray-500">
                    {notification.totalRecipients > 0 ? 
                      ((notification.readCount / notification.totalRecipients) * 100).toFixed(1) : 0}% rate
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

