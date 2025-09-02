'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, Users, DollarSign, Trophy, Activity } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import AdminLayout from '@/components/layout/AdminLayout';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalQuizzes: number;
    totalEarnings: number;
    userGrowth: number;
    quizCompletions: number;
  };
  userStats: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  quizStats: {
    totalQuestions: number;
    averageScore: number;
    popularCategories: Array<{ category: string; count: number }>;
  };
  earningsStats: {
    totalPaid: number;
    pendingPayouts: number;
    averageEarningsPerUser: number;
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/v1/admin/analytics?range=${timeRange}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const onRefresh = () => {
    fetchAnalytics();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive insights into your platform performance
            </p>
          </div>
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Tabs value={timeRange} onValueChange={setTimeRange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="1d">24 Hours</TabsTrigger>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
            <TabsTrigger value="90d">90 Days</TabsTrigger>
          </TabsList>

          <TabsContent value={timeRange} className="space-y-6">
            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.overview.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +{analytics?.overview.userGrowth || 0}% from last period
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.overview.activeUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {((analytics?.overview.activeUsers || 0) / (analytics?.overview.totalUsers || 1) * 100).toFixed(1)}% of total users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analytics?.overview.totalEarnings || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Avg: ${analytics?.earningsStats.averageEarningsPerUser || 0} per user
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quiz Completions</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.overview.quizCompletions || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Avg score: {analytics?.quizStats.averageScore || 0}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>User registration trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Daily Signups</span>
                      <span className="text-sm text-muted-foreground">{analytics?.userStats.daily || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Weekly Signups</span>
                      <span className="text-sm text-muted-foreground">{analytics?.userStats.weekly || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Monthly Signups</span>
                      <span className="text-sm text-muted-foreground">{analytics?.userStats.monthly || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quiz Performance</CardTitle>
                  <CardDescription>Quiz and question statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Questions</span>
                      <span className="text-sm text-muted-foreground">{analytics?.quizStats.totalQuestions || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average Score</span>
                      <span className="text-sm text-muted-foreground">{analytics?.quizStats.averageScore || 0}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <span className="text-sm text-muted-foreground">
                        {((analytics?.overview.quizCompletions || 0) / (analytics?.overview.totalUsers || 1) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Categories</CardTitle>
                  <CardDescription>Most played quiz categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics?.quizStats.popularCategories?.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{category.category}</span>
                        <span className="text-sm text-muted-foreground">{category.count} plays</span>
                      </div>
                    )) || (
                      <p className="text-sm text-muted-foreground">No data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                  <CardDescription>Earnings and payout statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Paid</span>
                      <span className="text-sm text-muted-foreground">${analytics?.earningsStats.totalPaid || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pending Payouts</span>
                      <span className="text-sm text-muted-foreground">${analytics?.earningsStats.pendingPayouts || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Avg per User</span>
                      <span className="text-sm text-muted-foreground">${analytics?.earningsStats.averageEarningsPerUser || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </AdminLayout>

    );
}

// Remove unused import
// import { TrendingUp } from 'lucide-react'

// Fix useEffect dependency
useEffect(() => {
  fetchAnalytics()
}, []) // Add fetchAnalytics to dependencies or use useCallback

// Or use useCallback for fetchAnalytics
const fetchAnalytics = useCallback(async () => {
  // your fetch logic
}, [])

useEffect(() => {
  fetchAnalytics()
}, [fetchAnalytics])