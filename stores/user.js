import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    isAuthenticated: false,
    token: null,
    profile: null,
    preferences: {
      newsletter: false,
      emailNotifications: true,
      pushNotifications: false,
      favoriteCategories: [],
      favoriteTags: [],
      readingHistory: [],
      savedProjects: [],
      followedAuthors: [],
    },
    craftingProfile: {
      skillLevel: 'beginner', // 'beginner', 'intermediate', 'advanced'
      interests: [],
      completedProjects: 0,
      currentProjects: [],
      wishlist: [],
      tools: [],
      materials: [],
    },
    stats: {
      postsRead: 0,
      commentsWritten: 0,
      projectsCompleted: 0,
      tutorialsCompleted: 0,
      totalCraftingTime: 0,
      achievements: [],
    },
    socialConnections: {
      following: [],
      followers: [],
      friends: [],
      groups: [],
    }
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    
    username: (state) => state.currentUser?.username || 'Guest',
    
    userAvatar: (state) => {
      return state.currentUser?.avatar || '/avatars/default.jpg'
    },
    
    userEmail: (state) => state.currentUser?.email,
    
    fullName: (state) => {
      if (!state.currentUser) return ''
      return `${state.currentUser.firstName || ''} ${state.currentUser.lastName || ''}`.trim()
    },
    
    memberSince: (state) => {
      if (!state.currentUser?.joinedAt) return null
      return new Date(state.currentUser.joinedAt)
    },
    
    isFollowing: (state) => (userId) => {
      return state.socialConnections.following.includes(userId)
    },
    
    hasCompletedTutorial: (state) => (tutorialId) => {
      return state.stats.achievements.some(a => 
        a.type === 'tutorial_completed' && a.referenceId === tutorialId
      )
    },
    
    savedProjectIds: (state) => {
      return state.preferences.savedProjects.map(p => p.id || p)
    },
    
    isProjectSaved: (state) => (projectId) => {
      return state.savedProjectIds.includes(projectId)
    },
    
    skillLevelNumeric: (state) => {
      const levels = { beginner: 1, intermediate: 2, advanced: 3 }
      return levels[state.craftingProfile.skillLevel] || 1
    },
    
    recommendedContent: (state) => {
      // Return content recommendations based on user preferences
      return {
        categories: state.preferences.favoriteCategories,
        tags: state.preferences.favoriteTags,
        skillLevel: state.craftingProfile.skillLevel,
        interests: state.craftingProfile.interests
      }
    },
    
    achievementCount: (state) => state.stats.achievements.length,
    
    hasAchievement: (state) => (achievementType) => {
      return state.stats.achievements.some(a => a.type === achievementType)
    },
  },

  actions: {
    async login(credentials) {
      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: credentials
        })
        
        this.token = response.token
        this.currentUser = response.user
        this.isAuthenticated = true
        
        // Save token to cookie
        if (process.client) {
          const token = useCookie('auth-token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7 // 7 days
          })
          token.value = response.token
        }
        
        // Load user preferences
        await this.loadUserPreferences()
        
        return response
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    
    async register(userData) {
      try {
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: userData
        })
        
        // Auto login after registration
        await this.login({
          email: userData.email,
          password: userData.password
        })
        
        return response
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      }
    },
    
    async logout() {
      try {
        await $fetch('/api/auth/logout', {
          method: 'POST'
        })
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // Clear user data
        this.currentUser = null
        this.isAuthenticated = false
        this.token = null
        this.profile = null
        
        // Clear cookie
        if (process.client) {
          const token = useCookie('auth-token')
          token.value = null
        }
        
        // Redirect to home
        await navigateTo('/')
      }
    },
    
    async fetchProfile() {
      try {
        const profile = await $fetch('/api/user/profile')
        this.profile = profile
        this.currentUser = { ...this.currentUser, ...profile }
        return profile
      } catch (error) {
        console.error('Error fetching profile:', error)
        throw error
      }
    },
    
    async updateProfile(profileData) {
      try {
        const updated = await $fetch('/api/user/profile', {
          method: 'PUT',
          body: profileData
        })
        
        this.profile = updated
        this.currentUser = { ...this.currentUser, ...updated }
        
        return updated
      } catch (error) {
        console.error('Error updating profile:', error)
        throw error
      }
    },
    
    async loadUserPreferences() {
      try {
        const prefs = await $fetch('/api/user/preferences')
        this.preferences = { ...this.preferences, ...prefs }
        
        const craftingProfile = await $fetch('/api/user/crafting-profile')
        this.craftingProfile = { ...this.craftingProfile, ...craftingProfile }
        
        const stats = await $fetch('/api/user/stats')
        this.stats = { ...this.stats, ...stats }
        
        return { preferences: prefs, craftingProfile, stats }
      } catch (error) {
        console.error('Error loading user preferences:', error)
      }
    },
    
    async updatePreferences(preferences) {
      try {
        const updated = await $fetch('/api/user/preferences', {
          method: 'PUT',
          body: preferences
        })
        
        this.preferences = { ...this.preferences, ...updated }
        return updated
      } catch (error) {
        console.error('Error updating preferences:', error)
        throw error
      }
    },
    
    async updateCraftingProfile(profile) {
      try {
        const updated = await $fetch('/api/user/crafting-profile', {
          method: 'PUT',
          body: profile
        })
        
        this.craftingProfile = { ...this.craftingProfile, ...updated }
        return updated
      } catch (error) {
        console.error('Error updating crafting profile:', error)
        throw error
      }
    },
    
    async followAuthor(authorId) {
      try {
        await $fetch(`/api/authors/${authorId}/follow`, {
          method: 'POST'
        })
        
        if (!this.socialConnections.following.includes(authorId)) {
          this.socialConnections.following.push(authorId)
        }
        
        if (!this.preferences.followedAuthors.includes(authorId)) {
          this.preferences.followedAuthors.push(authorId)
        }
      } catch (error) {
        console.error('Error following author:', error)
        throw error
      }
    },
    
    async unfollowAuthor(authorId) {
      try {
        await $fetch(`/api/authors/${authorId}/unfollow`, {
          method: 'POST'
        })
        
        const index = this.socialConnections.following.indexOf(authorId)
        if (index > -1) {
          this.socialConnections.following.splice(index, 1)
        }
        
        const prefIndex = this.preferences.followedAuthors.indexOf(authorId)
        if (prefIndex > -1) {
          this.preferences.followedAuthors.splice(prefIndex, 1)
        }
      } catch (error) {
        console.error('Error unfollowing author:', error)
        throw error
      }
    },
    
    async saveProject(projectId) {
      try {
        await $fetch(`/api/projects/${projectId}/save`, {
          method: 'POST'
        })
        
        if (!this.preferences.savedProjects.includes(projectId)) {
          this.preferences.savedProjects.push(projectId)
        }
      } catch (error) {
        console.error('Error saving project:', error)
        throw error
      }
    },
    
    async unsaveProject(projectId) {
      try {
        await $fetch(`/api/projects/${projectId}/unsave`, {
          method: 'POST'
        })
        
        const index = this.preferences.savedProjects.indexOf(projectId)
        if (index > -1) {
          this.preferences.savedProjects.splice(index, 1)
        }
      } catch (error) {
        console.error('Error unsaving project:', error)
        throw error
      }
    },
    
    async completeTutorial(tutorialId) {
      try {
        const achievement = await $fetch(`/api/tutorials/${tutorialId}/complete`, {
          method: 'POST'
        })
        
        this.stats.tutorialsCompleted++
        this.stats.achievements.push(achievement)
        
        return achievement
      } catch (error) {
        console.error('Error completing tutorial:', error)
        throw error
      }
    },
    
    async completeProject(projectData) {
      try {
        const project = await $fetch('/api/user/projects', {
          method: 'POST',
          body: projectData
        })
        
        this.stats.projectsCompleted++
        this.craftingProfile.completedProjects++
        
        // Remove from current projects if it was there
        const index = this.craftingProfile.currentProjects.findIndex(
          p => p.id === projectData.id
        )
        if (index > -1) {
          this.craftingProfile.currentProjects.splice(index, 1)
        }
        
        return project
      } catch (error) {
        console.error('Error completing project:', error)
        throw error
      }
    },
    
    addToReadingHistory(postId) {
      if (!this.preferences.readingHistory.includes(postId)) {
        this.preferences.readingHistory.unshift(postId)
        
        // Keep only last 50 items
        this.preferences.readingHistory = this.preferences.readingHistory.slice(0, 50)
        
        this.stats.postsRead++
      }
    },
    
    async checkAuthentication() {
      try {
        const token = useCookie('auth-token')
        if (!token.value) return false
        
        const user = await $fetch('/api/auth/me')
        this.currentUser = user
        this.isAuthenticated = true
        this.token = token.value
        
        // Load preferences
        await this.loadUserPreferences()
        
        return true
      } catch (error) {
        console.error('Auth check failed:', error)
        return false
      }
    },
    
    clearUserData() {
      this.currentUser = null
      this.isAuthenticated = false
      this.token = null
      this.profile = null
      this.preferences = {
        newsletter: false,
        emailNotifications: true,
        pushNotifications: false,
        favoriteCategories: [],
        favoriteTags: [],
        readingHistory: [],
        savedProjects: [],
        followedAuthors: [],
      }
      this.craftingProfile = {
        skillLevel: 'beginner',
        interests: [],
        completedProjects: 0,
        currentProjects: [],
        wishlist: [],
        tools: [],
        materials: [],
      }
      this.stats = {
        postsRead: 0,
        commentsWritten: 0,
        projectsCompleted: 0,
        tutorialsCompleted: 0,
        totalCraftingTime: 0,
        achievements: [],
      }
      this.socialConnections = {
        following: [],
        followers: [],
        friends: [],
        groups: [],
      }
    }
  }
})