import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    // Navigation
    mobileMenuOpen: false,
    searchModalOpen: false,
    
    // Layout
    sidebarOpen: true,
    sidebarCollapsed: false,
    
    // Theme
    theme: 'light', // 'light' or 'dark'
    
    // Loading states
    globalLoading: false,
    pageTransition: false,
    
    // Notifications
    notifications: [],
    
    // Modals
    activeModal: null,
    modalData: null,
    
    // Filters panel
    filtersOpen: false,
    
    // View preferences
    viewMode: 'grid', // 'grid', 'list', 'masonry'
    postsPerRow: 3,
    
    // Toast messages
    toasts: [],
    
    // Scroll position
    scrollPosition: 0,
    showBackToTop: false,
  }),

  getters: {
    isDarkMode: (state) => state.theme === 'dark',
    
    hasNotifications: (state) => state.notifications.length > 0,
    
    unreadNotifications: (state) => {
      return state.notifications.filter(n => !n.read)
    },
    
    hasUnreadNotifications: (state) => {
      return state.unreadNotifications.length > 0
    },
    
    isModalOpen: (state) => state.activeModal !== null,
  },

  actions: {
    // Navigation
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    
    closeMobileMenu() {
      this.mobileMenuOpen = false
    },
    
    toggleSearchModal() {
      this.searchModalOpen = !this.searchModalOpen
    },
    
    closeSearchModal() {
      this.searchModalOpen = false
    },
    
    // Sidebar
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    
    collapseSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    
    // Theme
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      this.saveThemePreference()
      this.applyTheme()
    },
    
    setTheme(theme) {
      this.theme = theme
      this.saveThemePreference()
      this.applyTheme()
    },
    
    loadThemePreference() {
      if (process.client) {
        const stored = localStorage.getItem('theme')
        if (stored) {
          this.theme = stored
        } else {
          // Check system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          this.theme = prefersDark ? 'dark' : 'light'
        }
        this.applyTheme()
      }
    },
    
    saveThemePreference() {
      if (process.client) {
        localStorage.setItem('theme', this.theme)
      }
    },
    
    applyTheme() {
      if (process.client) {
        if (this.theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    },
    
    // Loading
    setGlobalLoading(loading) {
      this.globalLoading = loading
    },
    
    setPageTransition(transitioning) {
      this.pageTransition = transitioning
    },
    
    // Notifications
    addNotification(notification) {
      const id = Date.now()
      this.notifications.push({
        id,
        read: false,
        timestamp: new Date(),
        ...notification
      })
      return id
    },
    
    markNotificationAsRead(id) {
      const notification = this.notifications.find(n => n.id === id)
      if (notification) {
        notification.read = true
      }
    },
    
    markAllNotificationsAsRead() {
      this.notifications.forEach(n => {
        n.read = true
      })
    },
    
    removeNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },
    
    clearNotifications() {
      this.notifications = []
    },
    
    // Modals
    openModal(modalName, data = null) {
      this.activeModal = modalName
      this.modalData = data
      
      // Prevent body scroll when modal is open
      if (process.client) {
        document.body.style.overflow = 'hidden'
      }
    },
    
    closeModal() {
      this.activeModal = null
      this.modalData = null
      
      // Restore body scroll
      if (process.client) {
        document.body.style.overflow = ''
      }
    },
    
    // Filters
    toggleFilters() {
      this.filtersOpen = !this.filtersOpen
    },
    
    closeFilters() {
      this.filtersOpen = false
    },
    
    // View preferences
    setViewMode(mode) {
      this.viewMode = mode
      this.saveViewPreferences()
    },
    
    setPostsPerRow(count) {
      this.postsPerRow = count
      this.saveViewPreferences()
    },
    
    loadViewPreferences() {
      if (process.client) {
        const stored = localStorage.getItem('view_preferences')
        if (stored) {
          const prefs = JSON.parse(stored)
          this.viewMode = prefs.viewMode || 'grid'
          this.postsPerRow = prefs.postsPerRow || 3
        }
      }
    },
    
    saveViewPreferences() {
      if (process.client) {
        localStorage.setItem('view_preferences', JSON.stringify({
          viewMode: this.viewMode,
          postsPerRow: this.postsPerRow
        }))
      }
    },
    
    // Toast messages
    showToast(message, type = 'info', duration = 3000) {
      const id = Date.now()
      const toast = {
        id,
        message,
        type, // 'success', 'error', 'warning', 'info'
        duration
      }
      
      this.toasts.push(toast)
      
      // Auto remove after duration
      setTimeout(() => {
        this.removeToast(id)
      }, duration)
      
      return id
    },
    
    removeToast(id) {
      const index = this.toasts.findIndex(t => t.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },
    
    showSuccess(message, duration = 3000) {
      return this.showToast(message, 'success', duration)
    },
    
    showError(message, duration = 5000) {
      return this.showToast(message, 'error', duration)
    },
    
    showWarning(message, duration = 4000) {
      return this.showToast(message, 'warning', duration)
    },
    
    showInfo(message, duration = 3000) {
      return this.showToast(message, 'info', duration)
    },
    
    // Scroll
    updateScrollPosition(position) {
      this.scrollPosition = position
      this.showBackToTop = position > 300
    },
    
    scrollToTop() {
      if (process.client) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    },
    
    // Initialize
    initialize() {
      this.loadThemePreference()
      this.loadViewPreferences()
      
      if (process.client) {
        // Track scroll position
        window.addEventListener('scroll', () => {
          this.updateScrollPosition(window.scrollY)
        })
      }
    }
  }
})