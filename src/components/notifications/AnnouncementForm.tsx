'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2, Send } from 'lucide-react'
import api from '@/lib/api'

interface AnnouncementFormProps {
  onSuccess: () => Promise<void>
}

interface AnnouncementData {
  title: string
  body: string
  type: string
  priority: string
  imageUrl?: string
  actionUrl?: string
}

export default function AnnouncementForm({ onSuccess }: AnnouncementFormProps) {
  const [formData, setFormData] = useState<AnnouncementData>({
    title: '',
    body: '',
    type: 'system',
    priority: 'normal'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await api.post('/api/v1/admin/notifications/announcement', formData)

      if (response.status !== 200) {
        throw new Error('Failed to send announcement')
      }

      // Reset form
      setFormData({
        title: '',
        body: '',
        type: 'system',
        priority: 'normal',
        imageUrl: '',
        actionUrl: ''
      })

      // Call onSuccess callback to refresh stats
      await onSuccess()
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send announcement')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send Announcement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Announcement title"
              required
            />
          </div>

          <div>
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="Announcement message"
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
                <Send className="mr-2 h-4 w-4" />
                Send Announcement
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}