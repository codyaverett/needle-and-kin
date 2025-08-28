import bcrypt from 'bcryptjs'

// In-memory database for MVP
// In production, replace with real database (MongoDB, PostgreSQL, etc.)
const users = new Map()
const sessions = new Map()
const posts = new Map()

// Initialize with default admin user
const initializeDatabase = async () => {
  const adminEmail = 'admin@needleandkin.com'
  
  if (!users.has(adminEmail)) {
    const hashedPassword = await bcrypt.hash('ChangeMe123!', 10)
    users.set(adminEmail, {
      id: 'admin-001',
      email: adminEmail,
      password: hashedPassword,
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=9333ea&color=fff',
      bio: 'Site administrator',
      joinedAt: new Date().toISOString(),
      mustChangePassword: true,
      isActive: true,
      emailVerified: true,
      preferences: {
        newsletter: false,
        emailNotifications: true,
        favoriteCategories: [],
      },
      stats: {
        postsRead: 0,
        commentsWritten: 0,
        lastLogin: null,
      }
    })
    console.info('Default admin user created: admin@needleandkin.com / ChangeMe123!')
  }

  // Add some demo users
  const demoUsers = [
    {
      email: 'sarah@example.com',
      password: 'Demo123!',
      username: 'sarahknits',
      firstName: 'Sarah',
      lastName: 'Mitchell',
      role: 'author',
      bio: 'Knitting enthusiast with 15 years of experience'
    },
    {
      email: 'emily@example.com',
      password: 'Demo123!',
      username: 'emilycrochets',
      firstName: 'Emily',
      lastName: 'Chen',
      role: 'author',
      bio: 'Crochet designer and teacher'
    },
    {
      email: 'user@example.com',
      password: 'Demo123!',
      username: 'craftlover',
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'user',
      bio: 'Love all things crafty!'
    }
  ]

  for (const userData of demoUsers) {
    if (!users.has(userData.email)) {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      users.set(userData.email, {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...userData,
        password: hashedPassword,
        avatar: `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=db2777&color=fff`,
        joinedAt: new Date().toISOString(),
        mustChangePassword: false,
        isActive: true,
        emailVerified: true,
        preferences: {
          newsletter: false,
          emailNotifications: true,
          favoriteCategories: [],
        },
        stats: {
          postsRead: 0,
          commentsWritten: 0,
          lastLogin: null,
        }
      })
    }
  }
}

// Initialize database on module load
initializeDatabase()

// User methods
export const db = {
  users: {
    findByEmail: (email) => {
      return users.get(email)
    },
    
    findById: (id) => {
      for (const user of users.values()) {
        if (user.id === id) return user
      }
      return null
    },
    
    create: async (userData) => {
      if (users.has(userData.email)) {
        throw new Error('User with this email already exists')
      }
      
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const user = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...userData,
        password: hashedPassword,
        role: userData.role || 'user',
        avatar: userData.avatar || `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}&background=6b7280&color=fff`,
        joinedAt: new Date().toISOString(),
        mustChangePassword: false,
        isActive: true,
        emailVerified: false,
        preferences: {
          newsletter: false,
          emailNotifications: true,
          favoriteCategories: [],
        },
        stats: {
          postsRead: 0,
          commentsWritten: 0,
          lastLogin: null,
        }
      }
      
      users.set(userData.email, user)
      return user
    },
    
    update: (email, updates) => {
      const user = users.get(email)
      if (!user) return null
      
      // Don't allow direct password updates through this method
      delete updates.password
      delete updates.email // Email changes need special handling
      
      const updatedUser = { ...user, ...updates }
      users.set(email, updatedUser)
      return updatedUser
    },
    
    updatePassword: async (email, newPassword) => {
      const user = users.get(email)
      if (!user) return null
      
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword
      user.mustChangePassword = false
      users.set(email, user)
      return user
    },
    
    delete: (email) => {
      return users.delete(email)
    },
    
    list: (filters = {}) => {
      let userList = Array.from(users.values())
      
      if (filters.role) {
        userList = userList.filter(u => u.role === filters.role)
      }
      
      if (filters.isActive !== undefined) {
        userList = userList.filter(u => u.isActive === filters.isActive)
      }
      
      // Remove sensitive data
      return userList.map(u => {
        const { password: _password, ...safeUser } = u
        return safeUser
      })
    },
    
    verifyPassword: async (email, password) => {
      const user = users.get(email)
      if (!user) return false
      
      return await bcrypt.compare(password, user.password)
    },
    
    count: () => users.size,
    
    updateLoginStats: (email) => {
      const user = users.get(email)
      if (!user) return null
      
      user.stats.lastLogin = new Date().toISOString()
      users.set(email, user)
      return user
    }
  },
  
  sessions: {
    create: (sessionData) => {
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const session = {
        id: sessionId,
        ...sessionData,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (sessionData.remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)).toISOString()
      }
      sessions.set(sessionId, session)
      return session
    },
    
    get: (sessionId) => {
      const session = sessions.get(sessionId)
      if (!session) return null
      
      // Check if session has expired
      if (new Date(session.expiresAt) < new Date()) {
        sessions.delete(sessionId)
        return null
      }
      
      return session
    },
    
    delete: (sessionId) => {
      return sessions.delete(sessionId)
    },
    
    deleteByToken: (refreshToken) => {
      for (const [sessionId, session] of sessions.entries()) {
        if (session.refreshToken === refreshToken) {
          sessions.delete(sessionId)
          return true
        }
      }
      return false
    },
    
    findByToken: (refreshToken) => {
      for (const session of sessions.values()) {
        if (session.refreshToken === refreshToken) {
          return session
        }
      }
      return null
    },
    
    deleteAllForUser: (userId) => {
      let deletedCount = 0
      for (const [sessionId, session] of sessions.entries()) {
        if (session.userId === userId) {
          sessions.delete(sessionId)
          deletedCount++
        }
      }
      return deletedCount
    },
    
    cleanup: () => {
      const now = new Date()
      for (const [sessionId, session] of sessions.entries()) {
        if (new Date(session.expiresAt) < now) {
          sessions.delete(sessionId)
        }
      }
    }
  },
  
  // Blog post management (for admin)
  posts: {
    create: (postData) => {
      const postId = `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const post = {
        id: postId,
        ...postData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        published: postData.published || false
      }
      posts.set(postId, post)
      return post
    },
    
    update: (postId, updates) => {
      const post = posts.get(postId)
      if (!post) return null
      
      const updatedPost = {
        ...post,
        ...updates,
        updatedAt: new Date().toISOString()
      }
      posts.set(postId, updatedPost)
      return updatedPost
    },
    
    delete: (postId) => {
      return posts.delete(postId)
    },
    
    get: (postId) => {
      return posts.get(postId)
    },
    
    list: (filters = {}) => {
      let postList = Array.from(posts.values())
      
      if (filters.published !== undefined) {
        postList = postList.filter(p => p.published === filters.published)
      }
      
      if (filters.authorId) {
        postList = postList.filter(p => p.authorId === filters.authorId)
      }
      
      if (filters.category) {
        postList = postList.filter(p => p.category === filters.category)
      }
      
      return postList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  }
}

// Cleanup expired sessions periodically
if (process.server) {
  setInterval(() => {
    db.sessions.cleanup()
  }, 60 * 60 * 1000) // Every hour
}