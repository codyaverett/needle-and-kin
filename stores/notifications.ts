import { defineStore } from 'pinia'
import type { Notification, NotificationPreferences, NotificationStats } from '~/types/notification'

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
    
    unreadNotifications: (state) => state.notifications.filter(n => !n.read),
    
    readNotifications: (state) => state.notifications.filter(n => n.read),
    
    notificationsByType: (state) => (type: string) => {
      return state.notifications.filter(n => n.type === type)
    },
    
    hasUnread: (state) => state.unreadCount > 0,
    
    sortedNotifications: (state) => {
      return [...state.notifications].sort((a, b) => {
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
        const { data } = await $fetch(`/api/notifications`, {
          params: {
            page: this.page,
            limit: 20
          },
          credentials: 'include'
        })

        if (data) {
          if (reset) {
            this.notifications = data.notifications
          } else {
            this.notifications.push(...data.notifications)
          }
          
          this.totalCount = data.total
          this.hasMore = data.hasMore
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
        const { data } = await $fetch('/api/notifications/unread-count', {
          credentials: 'include'
        })
        
        if (data) {
          this.unreadCount = data.count
        }
      } catch (error) {
        console.error('Failed to fetch unread count:', error)
      }
    },

    async markAsRead(notificationId: string) {
      const notification = this.notifications.find(n => n.id === notificationId)
      if (!notification || notification.read) return

      notification.read = true
      this.updateUnreadCount()

      try {
        await $fetch(`/api/notifications/${notificationId}/read`, {
          method: 'PUT',
          credentials: 'include'
        })
      } catch (error) {
        notification.read = false
        this.updateUnreadCount()
        console.error('Failed to mark notification as read:', error)
      }
    },

    async markAllAsRead() {
      const unreadIds = this.unreadNotifications.map(n => n.id)
      
      this.notifications.forEach(n => {
        if (!n.read) n.read = true
      })
      this.updateUnreadCount()

      try {
        await $fetch('/api/notifications/mark-all-read', {
          method: 'PUT',
          credentials: 'include'
        })
      } catch (error) {
        unreadIds.forEach(id => {
          const notification = this.notifications.find(n => n.id === id)
          if (notification) notification.read = false
        })
        this.updateUnreadCount()
        console.error('Failed to mark all notifications as read:', error)
      }
    },

    async deleteNotification(notificationId: string) {
      const index = this.notifications.findIndex(n => n.id === notificationId)
      if (index === -1) return

      const notification = this.notifications[index]
      this.notifications.splice(index, 1)
      this.totalCount--
      this.updateUnreadCount()

      try {
        await $fetch(`/api/notifications/${notificationId}`, {
          method: 'DELETE',
          credentials: 'include'
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
        const { data } = await $fetch('/api/notifications/preferences', {
          credentials: 'include'
        })
        
        if (data) {
          this.preferences = data
        }
      } catch (error) {
        console.error('Failed to fetch notification preferences:', error)
      }
    },

    async updatePreferences(preferences: NotificationPreferences) {
      this.preferences = preferences

      try {
        await $fetch('/api/notifications/preferences', {
          method: 'PUT',
          body: preferences,
          credentials: 'include'
        })
      } catch (error) {
        console.error('Failed to update notification preferences:', error)
        throw error
      }
    },

    addNotification(notification: Notification) {
      const exists = this.notifications.find(n => n.id === notification.id)
      if (!exists) {
        this.notifications.unshift(notification)
        this.totalCount++
        if (!notification.read) {
          this.unreadCount++
        }
      }
    },

    updateUnreadCount() {
      this.unreadCount = this.notifications.filter(n => !n.read).length
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
        const { data } = await $fetch('/api/notifications', {
          method: 'POST',
          body: notification,
          credentials: 'include'
        })
        
        if (data) {
          this.addNotification(data)
        }
        
        return data
      } catch (error) {
        console.error('Failed to create notification:', error)
        throw error
      }
    }
  }
})