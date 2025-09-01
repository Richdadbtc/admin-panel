'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2, Send, Target, Users } from 'lucide-react'
import api from '@/lib/api'

interface TargetedNotificationFormProps {
  onSuccess: () => Promise<void>
}

interface TargetedNotificationData {
  userIds: string[]
  title: string
  body: string
  type: string
  priority: string
  imageUrl?: string
  actionUrl?: string
}

export default function TargetedNotificationForm({ onSuccess }: TargetedNotificationFormProps) {
  const [formData, setFormData] = useState<TargetedNotificationData>({
    userIds: [],
    title: '',
    body: '',
    type: 'system',
    priority: 'normal'
  })
  const [userIdsInput, setUserIdsInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await api.post('/api/v1/admin/notifications/targeted', formData)

      if (response.status !== 200) {
        throw new Error('Failed to send notification')
      }

      // Reset form
      setFormData({
        title: '',
        body: '',
        type: 'system',
        priority: 'normal',
        userIds: [],
        imageUrl: '',
        actionUrl: ''
      })

      // Call onSuccess callback
      await onSuccess()
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send notification')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Send Targeted Notification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="userIds">User IDs</Label>
            <Textarea
              id="userIds"
              value={userIdsInput}
              onChange={(e) => setUserIdsInput(e.target.value)}
              placeholder="Enter user IDs separated by commas (e.g., user1, user2, user3)"
              rows={3}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter multiple user IDs separated by commas
            </p>
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Notification title"
              required
            />
          </div>

          <div>
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="Notification message"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="earning">Earning</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl || ''}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label htmlFor="actionUrl">Action URL (Optional)</Label>
            <Input
              id="actionUrl"
              value={formData.actionUrl || ''}
              onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
              placeholder="https://example.com/action"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Target className="mr-2 h-4 w-4" />
                Send Notification
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function setError(arg0: string) {
    throw new Error('Function not implemented.')
}
