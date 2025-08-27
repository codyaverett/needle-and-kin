import { defineStore } from 'pinia'

export const useBlogStore = defineStore('blog', {
  state: () => ({
    posts: [],
    currentPost: null,
    categories: [],
    tags: [],
    authors: [],
    currentAuthor: null,
    searchQuery: '',
    selectedCategory: 'all',
    currentPage: 1,
    postsPerPage: 9,
    totalPosts: 0,
    loading: false,
    error: null,
    favorites: [],
    recentlyViewed: [],
    relatedPosts: [],
    comments: [],
  }),

  getters: {
    filteredPosts: (state) => {
      let filtered = [...state.posts]
      
      // Filter by search query
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        filtered = filtered.filter(post => 
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.content?.toLowerCase().includes(query) ||
          post.tags?.some(tag => tag.toLowerCase().includes(query))
        )
      }
      
      // Filter by category
      if (state.selectedCategory && state.selectedCategory !== 'all') {
        filtered = filtered.filter(post => 
          post.category === state.selectedCategory
        )
      }
      
      return filtered
    },
    
    paginatedPosts: (state) => {
      const start = (state.currentPage - 1) * state.postsPerPage
      const end = start + state.postsPerPage
      return state.filteredPosts.slice(start, end)
    },
    
    totalPages: (state) => {
      return Math.ceil(state.filteredPosts.length / state.postsPerPage)
    },
    
    popularPosts: (state) => {
      return [...state.posts]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
    },
    
    featuredPosts: (state) => {
      return state.posts.filter(post => post.featured)
    },
    
    postsByAuthor: (state) => (authorId) => {
      return state.posts.filter(post => post.author?.id === authorId)
    },
    
    postsByCategory: (state) => (category) => {
      return state.posts.filter(post => post.category === category)
    },
    
    postsByTag: (state) => (tag) => {
      return state.posts.filter(post => post.tags.includes(tag))
    },
    
    isFavorite: (state) => (postId) => {
      return state.favorites.includes(postId)
    },
    
    authorById: (state) => (authorId) => {
      return state.authors.find(author => author.id === authorId)
    },
    
    availableCategories: (state) => {
      const categories = new Set()
      state.posts.forEach(post => {
        if (post.category) categories.add(post.category)
      })
      return Array.from(categories)
    },
    
    availableTags: (state) => {
      const tags = new Set()
      state.posts.forEach(post => {
        post.tags?.forEach(tag => tags.add(tag))
      })
      return Array.from(tags).sort()
    },
  },

  actions: {
    async fetchPosts(params = {}) {
      this.loading = true
      this.error = null
      
      try {
        const { data } = await $fetch('/api/posts', {
          query: {
            page: params.page || this.currentPage,
            limit: params.limit || this.postsPerPage,
            category: params.category,
            tag: params.tag,
            author: params.author,
            search: params.search,
          }
        })
        
        this.posts = data.data || []
        this.totalPosts = data.total || 0
        
        // Extract unique categories and tags
        this.updateCategoriesAndTags()
        
        return data
      } catch (error) {
        this.error = error.message || 'Failed to fetch posts'
        console.error('Error fetching posts:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchPost(slug) {
      this.loading = true
      this.error = null
      
      try {
        const post = await $fetch(`/api/posts/${slug}`)
        this.currentPost = post
        
        // Add to recently viewed
        this.addToRecentlyViewed(post.id)
        
        // Fetch related posts
        await this.fetchRelatedPosts(post.id)
        
        // Fetch comments
        await this.fetchComments(post.id)
        
        return post
      } catch (error) {
        this.error = error.message || 'Failed to fetch post'
        console.error('Error fetching post:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchRelatedPosts(postId) {
      try {
        const { data } = await $fetch(`/api/posts/${postId}/related`)
        this.relatedPosts = data || []
      } catch (error) {
        console.error('Error fetching related posts:', error)
        this.relatedPosts = []
      }
    },
    
    async fetchComments(postId) {
      try {
        const { data } = await $fetch(`/api/posts/${postId}/comments`)
        this.comments = data || []
      } catch (error) {
        console.error('Error fetching comments:', error)
        this.comments = []
      }
    },
    
    async postComment(postId, comment) {
      try {
        const newComment = await $fetch(`/api/posts/${postId}/comments`, {
          method: 'POST',
          body: comment
        })
        
        this.comments.push(newComment)
        return newComment
      } catch (error) {
        console.error('Error posting comment:', error)
        throw error
      }
    },
    
    async fetchAuthors() {
      try {
        const { data } = await $fetch('/api/authors')
        this.authors = data || []
      } catch (error) {
        console.error('Error fetching authors:', error)
        this.authors = []
      }
    },
    
    async fetchAuthor(id) {
      try {
        const author = await $fetch(`/api/authors/${id}`)
        this.currentAuthor = author
        return author
      } catch (error) {
        console.error('Error fetching author:', error)
        throw error
      }
    },
    
    async searchPosts(query) {
      this.searchQuery = query
      this.currentPage = 1 // Reset to first page when searching
      
      if (!query) {
        return this.fetchPosts()
      }
      
      this.loading = true
      this.error = null
      
      try {
        const { data } = await $fetch('/api/posts/search', {
          query: { q: query }
        })
        
        this.posts = data || []
        this.updateCategoriesAndTags()
        
        return data
      } catch (error) {
        this.error = error.message || 'Search failed'
        console.error('Error searching posts:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    setCategory(category) {
      this.selectedCategory = category
      this.currentPage = 1
    },
    
    clearFilters() {
      this.searchQuery = ''
      this.selectedCategory = 'all'
      this.currentPage = 1
    },
    
    setPage(page) {
      this.currentPage = page
    },
    
    toggleFavorite(postId) {
      const index = this.favorites.indexOf(postId)
      if (index > -1) {
        this.favorites.splice(index, 1)
      } else {
        this.favorites.push(postId)
      }
      
      // Persist to localStorage
      if (process.client) {
        localStorage.setItem('blog_favorites', JSON.stringify(this.favorites))
      }
    },
    
    loadFavorites() {
      if (process.client) {
        const stored = localStorage.getItem('blog_favorites')
        if (stored) {
          this.favorites = JSON.parse(stored)
        }
      }
    },
    
    addToRecentlyViewed(postId) {
      // Remove if already exists
      const index = this.recentlyViewed.indexOf(postId)
      if (index > -1) {
        this.recentlyViewed.splice(index, 1)
      }
      
      // Add to beginning
      this.recentlyViewed.unshift(postId)
      
      // Keep only last 10
      this.recentlyViewed = this.recentlyViewed.slice(0, 10)
      
      // Persist to localStorage
      if (process.client) {
        localStorage.setItem('blog_recently_viewed', JSON.stringify(this.recentlyViewed))
      }
    },
    
    loadRecentlyViewed() {
      if (process.client) {
        const stored = localStorage.getItem('blog_recently_viewed')
        if (stored) {
          this.recentlyViewed = JSON.parse(stored)
        }
      }
    },
    
    updateCategoriesAndTags() {
      // Extract unique categories
      const categories = new Set()
      const tags = new Set()
      
      this.posts.forEach(post => {
        if (post.category) categories.add(post.category)
        post.tags?.forEach(tag => tags.add(tag))
      })
      
      this.categories = Array.from(categories)
      this.tags = Array.from(tags).sort()
    },
    
    async incrementViews(postId) {
      try {
        await $fetch(`/api/posts/${postId}/views`, {
          method: 'POST'
        })
        
        // Update local post if it exists
        const post = this.posts.find(p => p.id === postId)
        if (post) {
          post.views = (post.views || 0) + 1
        }
        
        if (this.currentPost?.id === postId) {
          this.currentPost.views = (this.currentPost.views || 0) + 1
        }
      } catch (error) {
        console.error('Error incrementing views:', error)
      }
    },
  }
})