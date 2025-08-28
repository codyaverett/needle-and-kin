import bcrypt from 'bcryptjs'
import { db, statements } from '../database/index.js'

// Helper to generate unique IDs
const generateId = (prefix) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Database wrapper with methods compatible with the old in-memory database
export const database = {
  users: {
    findByEmail: (email) => {
      return statements.getUserByEmail.get(email.toLowerCase())
    },
    
    findById: (id) => {
      return statements.getUserById.get(id)
    },
    
    findByUsername: (username) => {
      return statements.getUserByUsername.get(username)
    },
    
    create: async (userData) => {
      const existing = statements.getUserByEmail.get(userData.email.toLowerCase())
      if (existing) {
        throw new Error('User with this email already exists')
      }
      
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const userId = generateId('user')
      
      statements.createUser.run(
        userId,
        userData.email.toLowerCase(),
        userData.username || userData.email.split('@')[0],
        hashedPassword,
        userData.firstName,
        userData.lastName,
        userData.role || 'user',
        userData.avatar || `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=6b7280&color=fff`,
        userData.bio || '',
        userData.mustChangePassword ? 1 : 0,
        1, // is_active
        0  // email_verified
      )
      
      return statements.getUserById.get(userId)
    },
    
    update: (id, updates) => {
      const user = statements.getUserById.get(id)
      if (!user) return null
      
      // Don't allow direct password or email updates
      delete updates.password
      delete updates.email
      delete updates.id
      
      if (updates.first_name || updates.last_name || updates.username || updates.bio || updates.avatar) {
        statements.updateUser.run(
          updates.first_name || user.first_name,
          updates.last_name || user.last_name,
          updates.username || user.username,
          updates.bio || user.bio,
          updates.avatar || user.avatar,
          id
        )
      }
      
      return statements.getUserById.get(id)
    },
    
    updatePassword: async (id, newPassword) => {
      const user = statements.getUserById.get(id)
      if (!user) return null
      
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      statements.updatePassword.run(hashedPassword, id)
      
      return statements.getUserById.get(id)
    },
    
    delete: (id) => {
      const result = db.prepare('DELETE FROM users WHERE id = ?').run(id)
      return result.changes > 0
    },
    
    list: (filters = {}) => {
      let query = 'SELECT id, email, username, first_name, last_name, role, avatar, bio, joined_at, is_active, email_verified, last_login FROM users WHERE 1=1'
      const params = []
      
      if (filters.role) {
        query += ' AND role = ?'
        params.push(filters.role)
      }
      
      if (filters.isActive !== undefined) {
        query += ' AND is_active = ?'
        params.push(filters.isActive ? 1 : 0)
      }
      
      query += ' ORDER BY joined_at DESC'
      
      return db.prepare(query).all(...params)
    },
    
    verifyPassword: async (email, password) => {
      const user = statements.getUserByEmail.get(email.toLowerCase())
      if (!user) return false
      
      return await bcrypt.compare(password, user.password)
    },
    
    count: () => {
      const result = statements.countUsers.get()
      return result.count
    },
    
    updateLoginStats: (email) => {
      const user = statements.getUserByEmail.get(email.toLowerCase())
      if (!user) return null
      
      statements.updateLastLogin.run(user.id)
      return statements.getUserById.get(user.id)
    }
  },
  
  sessions: {
    create: (sessionData) => {
      const sessionId = generateId('session')
      const expiresAt = new Date(
        Date.now() + (sessionData.remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
      ).toISOString()
      
      statements.createSession.run(
        sessionId,
        sessionData.userId,
        sessionData.token || null,
        sessionData.ip || 'unknown',
        sessionData.userAgent || 'unknown',
        expiresAt
      )
      
      return statements.getSession.get(sessionId)
    },
    
    get: (sessionId) => {
      const session = statements.getSession.get(sessionId)
      if (!session) return null
      
      // Check if expired
      if (new Date(session.expires_at) < new Date()) {
        statements.deleteSession.run(sessionId)
        return null
      }
      
      return session
    },
    
    delete: (sessionId) => {
      const result = statements.deleteSession.run(sessionId)
      return result.changes > 0
    },
    
    deleteAllForUser: (userId) => {
      statements.deleteUserSessions.run(userId)
    },
    
    cleanup: () => {
      statements.cleanupSessions.run()
    }
  },
  
  posts: {
    create: (postData) => {
      const result = statements.createPost.run(
        postData.slug,
        postData.title,
        postData.excerpt || '',
        postData.content || '',
        postData.image || '',
        postData.category || '',
        postData.difficulty || 'beginner',
        postData.published ? new Date().toISOString() : null,
        postData.readTime || 5,
        postData.authorId || null,
        postData.featured ? 1 : 0,
        postData.published ? 1 : 0
      )
      
      const postId = result.lastInsertRowid
      
      // Add tags if provided
      if (postData.tags && postData.tags.length > 0) {
        for (const tagName of postData.tags) {
          let tag = statements.getTagByName.get(tagName)
          if (!tag) {
            const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-')
            statements.createTag.run(tagName, tagSlug)
            tag = statements.getTagByName.get(tagName)
          }
          statements.addPostTag.run(postId, tag.id)
        }
      }
      
      return statements.getPost.get(postId)
    },
    
    update: (postId, updates) => {
      const post = statements.getPost.get(postId)
      if (!post) return null
      
      statements.updatePost.run(
        updates.title || post.title,
        updates.excerpt || post.excerpt,
        updates.content || post.content,
        updates.image || post.image,
        updates.category || post.category,
        updates.difficulty || post.difficulty,
        updates.readTime || post.read_time,
        updates.featured ? 1 : 0,
        updates.published ? 1 : 0,
        updates.published ? (post.published_at || new Date().toISOString()) : null,
        postId
      )
      
      // Update tags if provided
      if (updates.tags) {
        statements.removePostTags.run(postId)
        for (const tagName of updates.tags) {
          let tag = statements.getTagByName.get(tagName)
          if (!tag) {
            const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-')
            statements.createTag.run(tagName, tagSlug)
            tag = statements.getTagByName.get(tagName)
          }
          statements.addPostTag.run(postId, tag.id)
        }
      }
      
      return statements.getPost.get(postId)
    },
    
    delete: (postId) => {
      const result = statements.deletePost.run(postId)
      return result.changes > 0
    },
    
    get: (postId) => {
      return statements.getPost.get(postId)
    },
    
    getBySlug: (slug) => {
      const post = statements.getPostBySlug.get(slug)
      if (post) {
        // Get tags
        post.tags = statements.getPostTags.all(post.id).map(t => t.name)
        
        // Get author info
        if (post.author_id) {
          const author = statements.getUserById.get(post.author_id)
          if (author) {
            post.author = {
              id: author.id,
              name: `${author.first_name} ${author.last_name}`,
              username: author.username,
              avatar: author.avatar,
              bio: author.bio
            }
          }
        }
      }
      return post
    },
    
    list: (filters = {}) => {
      const limit = filters.limit || 10
      const offset = filters.offset || 0
      
      let posts
      if (filters.category && filters.category !== 'all') {
        posts = statements.listPostsByCategory.all(filters.category, limit, offset)
      } else {
        posts = statements.listPosts.all(limit, offset)
      }
      
      // Add author info and tags to each post
      return posts.map(post => {
        if (post.author_id) {
          post.author = {
            id: post.author_id,
            name: `${post.first_name} ${post.last_name}`,
            username: post.username,
            avatar: post.avatar
          }
        }
        post.tags = statements.getPostTags.all(post.id).map(t => t.name)
        return post
      })
    },
    
    incrementViews: (postId) => {
      statements.incrementViews.run(postId)
    }
  },
  
  comments: {
    create: (commentData) => {
      const result = statements.createComment.run(
        commentData.postId,
        commentData.userId || null,
        commentData.parentId || null,
        commentData.content,
        commentData.approved ? 1 : 0
      )
      
      return db.prepare('SELECT * FROM comments WHERE id = ?').get(result.lastInsertRowid)
    },
    
    list: (postId) => {
      return statements.getComments.all(postId)
    }
  },
  
  favorites: {
    add: (userId, postId) => {
      statements.addFavorite.run(userId, postId)
    },
    
    remove: (userId, postId) => {
      statements.removeFavorite.run(userId, postId)
    },
    
    list: (userId) => {
      return statements.getUserFavorites.all(userId).map(f => f.post_id)
    },
    
    isFavorite: (userId, postId) => {
      return !!statements.isFavorite.get(userId, postId)
    }
  },
  
  siteContent: {
    get: (section) => {
      const content = statements.getSiteContent.get(section)
      return content ? JSON.parse(content.content) : null
    },
    
    update: (section, content, userId) => {
      const id = generateId('content')
      statements.updateSiteContent.run(
        id,
        section,
        JSON.stringify(content),
        userId
      )
    }
  },
  
  stats: {
    getUserCount: () => statements.countUsers.get().count,
    getPostCount: () => statements.countPosts.get().count,
    getTotalViews: () => statements.sumViews.get().total || 0,
    getCommentCount: () => statements.countComments.get().count
  }
}

// Export for compatibility with existing code
export const db_wrapper = database