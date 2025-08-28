import { defineStore } from 'pinia'
import type { Notification, NotificationPreferences } from '../types/notification'

// Use standard fetch API with proper typing
const fetchAPI = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return await response.json()
}

interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  totalCount: number
  preferences: NotificationPreferences | null
  loading: boolean
  error: string | null
  lastFetch: Date | null
  hasMore: boolean
  page: number
}

export const useNotificationsStore = defineStore('notifications', {
  state: (): NotificationsState => ({
    notifications: [],
    unreadCount: 0,
    totalCount: 0,
    preferences: null,
    loading: false,
    error: null,
    lastFetch: null,
    hasMore: true,
    page: 1
  }),

  getters: {
    recentNotifications: (state) => state.notifications.slice(0, 10),
    
    unreadNotifications: (state) => state.notifications.filter((n: Notification) => !n.read),
    
    readNotifications: (state) => state.notifications.filter((n: Notification) => n.read),
    
    notificationsByType: (state) => (type: string) => {
      return state.notifications.filter((n: Notification) => n.type === type)
    },
    
    hasUnread: (state) => state.unreadCount > 0,
    
    sortedNotifications: (state) => {
      return [...state.notifications].sort((a: Notification, b: Notification) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return dateB - dateA
      })
    }
  },

  actions: {
    async fetchNotifications(reset = false) {
      if (reset) {
        this.page = 1
        this.hasMore = true
        this.notifications = []
      }

      this.loading = true
      this.error = null

      try {
        const params = new URLSearchParams({
          page: this.page.toString(),
          limit: '20'
        })
        const result = await fetchAPI(`/api/notifications?${params}`)

        if (result?.data) {
          if (reset) {
            this.notifications = result.data.notifications
          } else {
            this.notifications.push(...result.data.notifications)
          }
          
          this.totalCount = result.data.total
          this.hasMore = result.data.hasMore
          this.lastFetch = new Date()
          
          this.updateUnreadCount()
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch notifications'
        console.error('Failed to fetch notifications:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchUnreadCount() {
      try {
        const result = await fetchAPI('/api/notifications/unread-count')
        
        if (result?.data) {
          this.unreadCount = result.data.count
        }
      } catch (error) {
        console.error('Failed to fetch unread count:', error)
      }
    },

    async markAsRead(notificationId: string) {
      const notification = this.notifications.find((n: Notification) => n.id === notificationId)
      if (!notification || notification.read) return

      notification.read = true
      this.updateUnreadCount()

      try {
        await fetchAPI(`/api/notifications/${notificationId}/read`, {
          method: 'PUT'
        })
      } catch (error) {
        notification.read = false
        this.updateUnreadCount()
        console.error('Failed to mark notification as read:', error)
      }
    },

    async markAllAsRead() {
      const unreadIds = this.unreadNotifications.map((n: Notification) => n.id)
      
      this.notifications.forEach((n: Notification) => {
        if (!n.read) n.read = true
      })
      this.updateUnreadCount()

      try {
        await fetchAPI('/api/notifications/mark-all-read', {
          method: 'PUT'
        })
      } catch (error) {
        unreadIds.forEach((id: string) => {
          const notification = this.notifications.find((n: Notification) => n.id === id)
          if (notification) notification.read = false
        })
        this.updateUnreadCount()
        console.error('Failed to mark all notifications as read:', error)
      }
    },

    async deleteNotification(notificationId: string) {
      const index = this.notifications.findIndex((n: Notification) => n.id === notificationId)
      if (index === -1) return

      const notification = this.notifications[index]
      this.notifications.splice(index, 1)
      this.totalCount--
      this.updateUnreadCount()

      try {
        await fetchAPI(`/api/notifications/${notificationId}`, {
          method: 'DELETE'
        })
      } catch (error) {
        this.notifications.splice(index, 0, notification)
        this.totalCount++
        this.updateUnreadCount()
        console.error('Failed to delete notification:', error)
      }
    },

    async loadMore() {
      if (!this.hasMore || this.loading) return
      
      this.page++
      await this.fetchNotifications()
    },

    async fetchPreferences() {
      try {
        const result = await fetchAPI('/api/notifications/preferences')
        
        if (result?.data) {
          this.preferences = result.data
        }
      } catch (error) {
        console.error('Failed to fetch notification preferences:', error)
      }
    },

    async updatePreferences(preferences: NotificationPreferences) {
      this.preferences = preferences

      try {
        await fetchAPI('/api/notifications/preferences', {
          method: 'PUT',
          body: JSON.stringify(preferences)
        })
      } catch (error) {
        console.error('Failed to update notification preferences:', error)
        throw error
      }
    },

    addNotification(notification: Notification) {
      const exists = this.notifications.find((n: Notification) => n.id === notification.id)
      if (!exists) {
        this.notifications.unshift(notification)
        this.totalCount++
        if (!notification.read) {
          this.unreadCount++
        }
      }
    },

    updateUnreadCount() {
      this.unreadCount = this.notifications.filter((n: Notification) => !n.read).length
    },

    clearNotifications() {
      this.notifications = []
      this.unreadCount = 0
      this.totalCount = 0
      this.page = 1
      this.hasMore = true
      this.lastFetch = null
    },

    async createNotification(notification: Partial<Notification>) {
      try {
        const result = await fetchAPI('/api/notifications', {
          method: 'POST',
          body: JSON.stringify(notification)
        })
        
        if (result?.data) {
          this.addNotification(result.data)
        }
        
        return result?.data
      } catch (error) {
        console.error('Failed to create notification:', error)
        throw error
      }
    }
  }
})