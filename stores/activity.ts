import { defineStore } from 'pinia'
import type { Activity, ActivityFilter, ActivityFeedOptions } from '../types/activity'

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

interface ActivityState {
  activities: Activity[]
  followingActivities: Activity[]
  userActivities: Record<string, Activity[]>
  loading: boolean
  error: string | null
  hasMore: boolean
  currentPage: number
  pageSize: number
  filter: ActivityFilter | null
  lastFetch: Date | null
}

export const useActivityStore = defineStore('activity', {
  state: (): ActivityState => ({
    activities: [],
    followingActivities: [],
    userActivities: {},
    loading: false,
    error: null,
    hasMore: true,
    currentPage: 1,
    pageSize: 20,
    filter: null,
    lastFetch: null
  }),

  getters: {
    allActivities: (state) => state.activities,
    
    filteredActivities: (state) => {
      if (!state.filter) return state.activities
      
      let filtered = [...state.activities]
      
      if (state.filter.types?.length) {
        filtered = filtered.filter(a => state.filter!.types!.includes(a.type))
      }
      
      if (state.filter.userIds?.length) {
        filtered = filtered.filter(a => state.filter!.userIds!.includes(a.user.id))
      }
      
      if (state.filter.dateFrom) {
        const fromDate = new Date(state.filter.dateFrom)
        filtered = filtered.filter(a => new Date(a.createdAt) >= fromDate)
      }
      
      if (state.filter.dateTo) {
        const toDate = new Date(state.filter.dateTo)
        filtered = filtered.filter(a => new Date(a.createdAt) <= toDate)
      }
      
      return filtered
    },
    
    recentActivities: (state) => {
      return [...state.activities]
        .sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return dateB - dateA
        })
        .slice(0, 10)
    },
    
    popularActivities: (state) => {
      return [...state.activities]
        .sort((a, b) => {
          const scoreA = (a.likesCount || 0) + (a.commentsCount || 0) * 2
          const scoreB = (b.likesCount || 0) + (b.commentsCount || 0) * 2
          return scoreB - scoreA
        })
        .slice(0, 10)
    },
    
    getUserActivities: (state) => (userId: string) => {
      return state.userActivities[userId] || []
    }
  },

  actions: {
    async fetchActivities(options?: ActivityFeedOptions) {
      this.loading = true
      this.error = null
      
      try {
        const params = new URLSearchParams()
        
        if (options?.page) params.append('page', options.page.toString())
        if (options?.limit) params.append('limit', options.limit.toString())
        if (options?.sort) params.append('sort', options.sort)
        if (options?.filter?.following) params.append('following', 'true')
        if (options?.filter?.types?.length) {
          params.append('types', options.filter.types.join(','))
        }
        
        const result = await fetchAPI(`/api/activities?${params}`)
        
        if (result?.data) {
          if (options?.page === 1) {
            this.activities = result.data.activities
          } else {
            this.activities.push(...result.data.activities)
          }
          
          this.hasMore = result.data.hasMore
          this.currentPage = result.data.page
          this.lastFetch = new Date()
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch activities'
        console.error('Failed to fetch activities:', error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchFollowingActivities() {
      this.loading = true
      
      try {
        const result = await fetchAPI('/api/activities/following')
        
        if (result?.data) {
          this.followingActivities = result.data.activities
        }
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch following activities'
        console.error('Failed to fetch following activities:', error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchUserActivities(userId: string) {
      try {
        const result = await fetchAPI(`/api/users/${userId}/activities`)
        
        if (result?.data) {
          this.userActivities[userId] = result.data.activities
        }
      } catch (error) {
        console.error(`Failed to fetch activities for user ${userId}:`, error)
      }
    },
    
    async createActivity(activity: Partial<Activity>) {
      try {
        const result = await fetchAPI('/api/activities', {
          method: 'POST',
          body: JSON.stringify(activity)
        })
        
        if (result?.data) {
          this.activities.unshift(result.data)
        }
        
        return result?.data
      } catch (error) {
        console.error('Failed to create activity:', error)
        throw error
      }
    },
    
    async likeActivity(activityId: string) {
      const activity = this.activities.find(a => a.id === activityId)
      if (!activity) return
      
      const wasLiked = activity.isLiked
      activity.isLiked = !wasLiked
      activity.likesCount = wasLiked ? activity.likesCount - 1 : activity.likesCount + 1
      
      try {
        await fetchAPI(`/api/activities/${activityId}/like`, {
          method: wasLiked ? 'DELETE' : 'POST'
        })
      } catch (error) {
        // Revert on error
        activity.isLiked = wasLiked
        activity.likesCount = wasLiked ? activity.likesCount + 1 : activity.likesCount - 1
        console.error('Failed to like activity:', error)
      }
    },
    
    async deleteActivity(activityId: string) {
      const index = this.activities.findIndex(a => a.id === activityId)
      if (index === -1) return
      
      const activity = this.activities[index]
      this.activities.splice(index, 1)
      
      try {
        await fetchAPI(`/api/activities/${activityId}`, {
          method: 'DELETE'
        })
      } catch (error) {
        // Restore on error
        this.activities.splice(index, 0, activity)
        console.error('Failed to delete activity:', error)
      }
    },
    
    setFilter(filter: ActivityFilter | null) {
      this.filter = filter
    },
    
    async loadMore() {
      if (!this.hasMore || this.loading) return
      
      this.currentPage++
      await this.fetchActivities({
        page: this.currentPage,
        limit: this.pageSize,
        filter: this.filter || undefined
      })
    },
    
    clearActivities() {
      this.activities = []
      this.followingActivities = []
      this.userActivities = {}
      this.currentPage = 1
      this.hasMore = true
      this.filter = null
      this.lastFetch = null
    },
    
    addActivity(activity: Activity) {
      const exists = this.activities.find(a => a.id === activity.id)
      if (!exists) {
        this.activities.unshift(activity)
      }
    },
    
    updateActivity(activityId: string, updates: Partial<Activity>) {
      const index = this.activities.findIndex(a => a.id === activityId)
      if (index !== -1) {
        this.activities[index] = { ...this.activities[index], ...updates }
      }
    }
  }
})