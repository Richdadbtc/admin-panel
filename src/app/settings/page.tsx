'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Save, RefreshCw, Shield, Bell, DollarSign, Globe } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import AdminLayout from '@/components/layout/AdminLayout';

interface AppSettings {
  general: {
    appName: string;
    appDescription: string;
    supportEmail: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
  };
  quiz: {
    defaultTimeLimit: number;
    maxQuestionsPerQuiz: number;
    minQuestionsPerQuiz: number;
    defaultReward: number;
    enableDailyQuiz: boolean;
  };
  notifications: {
    enablePushNotifications: boolean;
    enableEmailNotifications: boolean;
    welcomeMessageEnabled: boolean;
    welcomeMessage: string;
  };
  payments: {
    minimumWithdrawal: number;
    withdrawalFee: number;
    referralBonus: number;
    enableReferrals: boolean;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    enableTwoFactor: boolean;
    passwordMinLength: number;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/v1/admin/settings');
      setSettings(response.data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to fetch settings');
      // Set default settings if fetch fails
      setSettings({
        general: {
          appName: 'TBG Quiz App',
          appDescription: 'Earn money by playing quizzes',
          supportEmail: 'support@tbgquiz.com',
          maintenanceMode: false,
          registrationEnabled: true
        },
        quiz: {
          defaultTimeLimit: 30,
          maxQuestionsPerQuiz: 20,
          minQuestionsPerQuiz: 5,
          defaultReward: 1.0,
          enableDailyQuiz: true
        },
        notifications: {
          enablePushNotifications: true,
          enableEmailNotifications: true,
          welcomeMessageEnabled: true,
          welcomeMessage: 'Welcome to TBG Quiz! Start earning by playing quizzes.'
        },
        payments: {
          minimumWithdrawal: 10.0,
          withdrawalFee: 0.5,
          referralBonus: 5.0,
          enableReferrals: true
        },
        security: {
          sessionTimeout: 24,
          maxLoginAttempts: 5,
          enableTwoFactor: false,
          passwordMinLength: 8
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      await api.put('/api/v1/admin/settings', { settings });
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (section: keyof AppSettings, key: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Failed to load settings</p>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure your application settings and preferences
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchSettings} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={saveSettings} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              Quiz
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Basic application configuration and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appName">Application Name</Label>
                    <Input
                      id="appName"
                      value={settings.general.appName}
                      onChange={(e) => updateSetting('general', 'appName', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="appDescription">Application Description</Label>
                    <Textarea
                      id="appDescription"
                      value={settings.general.appDescription}
                      onChange={(e) => updateSetting('general', 'appDescription', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.general.supportEmail}
                      onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Temporarily disable the app for maintenance
                      </p>
                    </div>
                    <Switch
                      checked={settings.general.maintenanceMode}
                      onCheckedChange={(checked: any) => updateSetting('general', 'maintenanceMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>User Registration</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow new users to register
                      </p>
                    </div>
                    <Switch
                      checked={settings.general.registrationEnabled}
                      onCheckedChange={(checked: any) => updateSetting('general', 'registrationEnabled', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Settings</CardTitle>
                <CardDescription>
                  Configure quiz behavior and default values
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="defaultTimeLimit">Default Time Limit (seconds)</Label>
                    <Input
                      id="defaultTimeLimit"
                      type="number"
                      value={settings.quiz.defaultTimeLimit}
                      onChange={(e) => updateSetting('quiz', 'defaultTimeLimit', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultReward">Default Reward ($)</Label>
                    <Input
                      id="defaultReward"
                      type="number"
                      step="0.01"
                      value={settings.quiz.defaultReward}
                      onChange={(e) => updateSetting('quiz', 'defaultReward', parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minQuestions">Minimum Questions per Quiz</Label>
                    <Input
                      id="minQuestions"
                      type="number"
                      value={settings.quiz.minQuestionsPerQuiz}
                      onChange={(e) => updateSetting('quiz', 'minQuestionsPerQuiz', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxQuestions">Maximum Questions per Quiz</Label>
                    <Input
                      id="maxQuestions"
                      type="number"
                      value={settings.quiz.maxQuestionsPerQuiz}
                      onChange={(e) => updateSetting('quiz', 'maxQuestionsPerQuiz', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Daily Quiz</Label>
                    <p className="text-sm text-muted-foreground">
                      Provide a special daily quiz for users
                    </p>
                  </div>
                  <Switch
                    checked={settings.quiz.enableDailyQuiz}
                    onCheckedChange={(checked: any) => updateSetting('quiz', 'enableDailyQuiz', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when to send notifications to users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send push notifications to mobile devices
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.enablePushNotifications}
                      onCheckedChange={(checked: any) => updateSetting('notifications', 'enablePushNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.enableEmailNotifications}
                      onCheckedChange={(checked: any) => updateSetting('notifications', 'enableEmailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Welcome Message</Label>
                      <p className="text-sm text-muted-foreground">
                        Send welcome message to new users
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.welcomeMessageEnabled}
                      onCheckedChange={(checked: any) => updateSetting('notifications', 'welcomeMessageEnabled', checked)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message Content</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={settings.notifications.welcomeMessage}
                    onChange={(e) => updateSetting('notifications', 'welcomeMessage', e.target.value)}
                    disabled={!settings.notifications.welcomeMessageEnabled}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>
                  Configure payment and withdrawal settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="minimumWithdrawal">Minimum Withdrawal ($)</Label>
                    <Input
                      id="minimumWithdrawal"
                      type="number"
                      step="0.01"
                      value={settings.payments.minimumWithdrawal}
                      onChange={(e) => updateSetting('payments', 'minimumWithdrawal', parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="withdrawalFee">Withdrawal Fee ($)</Label>
                    <Input
                      id="withdrawalFee"
                      type="number"
                      step="0.01"
                      value={settings.payments.withdrawalFee}
                      onChange={(e) => updateSetting('payments', 'withdrawalFee', parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="referralBonus">Referral Bonus ($)</Label>
                    <Input
                      id="referralBonus"
                      type="number"
                      step="0.01"
                      value={settings.payments.referralBonus}
                      onChange={(e) => updateSetting('payments', 'referralBonus', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Referral System</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to earn referral bonuses
                    </p>
                  </div>
                  <Switch
                    checked={settings.payments.enableReferrals}
                    onCheckedChange={(checked: any) => updateSetting('payments', 'enableReferrals', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security and authentication settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for admin accounts
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.enableTwoFactor}
                    onCheckedChange={(checked: any) => updateSetting('security', 'enableTwoFactor', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      </AdminLayout>
    );
}