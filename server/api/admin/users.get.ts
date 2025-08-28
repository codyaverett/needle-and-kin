import jwt from 'jsonwebtoken'
import type { JWTPayload, User } from '~/server/types/auth'

interface AdminUsersQuery {
  page?: string
  limit?: string
  role?: 'user' | 'author' | 'admin'
  status?: 'active' | 'inactive' | 'suspended'
  search?: string
  sortBy?: string
  order?: 'asc' | 'desc'
}

export default defineEventHandler(async (event) => {
  // Check authentication
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }
  
  let userRole: string
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload
    userRole = decoded.role
    
    // Check admin role
    if (userRole !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required'
      })
    }
  } catch (error: any) {
    if (error.statusCode === 403) throw error
    
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token'
    })
  }
  
  const query = getQuery(event) as AdminUsersQuery
  
  // Mock users data
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@needleandkin.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      avatar: '/avatars/default.jpg',
      bio: 'Site administrator',
      joinedAt: '2024-01-01T00:00:00Z',
      mustChangePassword: false,
      isActive: true,
      emailVerified: true,
      preferences: {
        newsletter: true,
        emailNotifications: true,
        favoriteCategories: ['knitting', 'crochet']
      },
      stats: {
        postsRead: 247,
        commentsWritten: 89,
        lastLogin: new Date(Date.now() - 3600000).toISOString()
      }
    },
    {
      id: '2',
      email: 'sarah.johnson@example.com',
      username: 'sarahjohnson',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'author',
      avatar: '/avatars/sarah.jpg',
      bio: 'Professional knitter and content creator',
      joinedAt: '2024-02-15T00:00:00Z',
      mustChangePassword: false,
      isActive: true,
      emailVerified: true,
      preferences: {
        newsletter: true,
        emailNotifications: true,
        favoriteCategories: ['knitting']
      },
      stats: {
        postsRead: 156,
        commentsWritten: 45,
        lastLogin: new Date(Date.now() - 86400000).toISOString()
      }
    },
    {
      id: '3',
      email: 'emily.chen@example.com',
      username: 'emilychen',
      firstName: 'Emily',
      lastName: 'Chen',
      role: 'author',
      avatar: '/avatars/emily.jpg',
      bio: 'Embroidery expert and instructor',
      joinedAt: '2024-03-10T00:00:00Z',
      mustChangePassword: false,
      isActive: true,
      emailVerified: true,
      preferences: {
        newsletter: true,
        emailNotifications: false,
        favoriteCategories: ['embroidery', 'cross-stitch']
      },
      stats: {
        postsRead: 89,
        commentsWritten: 23,
        lastLogin: new Date(Date.now() - 172800000).toISOString()
      }
    },
    {
      id: '4',
      email: 'maria.garcia@example.com',
      username: 'mariagarcia',
      firstName: 'Maria',
      lastName: 'Garcia',
      role: 'user',
      avatar: '/avatars/maria.jpg',
      bio: 'Hobbyist crafter',
      joinedAt: '2024-04-20T00:00:00Z',
      mustChangePassword: false,
      isActive: true,
      emailVerified: true,
      preferences: {
        newsletter: true,
        emailNotifications: true,
        favoriteCategories: ['sewing', 'upcycling']
      },
      stats: {
        postsRead: 67,
        commentsWritten: 12,
        lastLogin: new Date(Date.now() - 259200000).toISOString()
      }
    },
    {
      id: '5',
      email: 'lisa.anderson@example.com',
      username: 'lisaanderson',
      firstName: 'Lisa',
      lastName: 'Anderson',
      role: 'user',
      avatar: '/avatars/lisa.jpg',
      bio: 'Learning to crochet',
      joinedAt: '2024-05-05T00:00:00Z',
      mustChangePassword: false,
      isActive: true,
      emailVerified: false,
      preferences: {
        newsletter: false,
        emailNotifications: true,
        favoriteCategories: ['crochet']
      },
      stats: {
        postsRead: 23,
        commentsWritten: 5,
        lastLogin: new Date(Date.now() - 604800000).toISOString() // 7 days ago
      }
    },
    {
      id: '6',
      email: 'john.smith@example.com',
      username: 'johnsmith',
      firstName: 'John',
      lastName: 'Smith',
      role: 'user',
      avatar: '/avatars/default.jpg',
      bio: '',
      joinedAt: '2024-06-01T00:00:00Z',
      mustChangePassword: true,
      isActive: false, // Inactive user
      emailVerified: false,
      preferences: {
        newsletter: false,
        emailNotifications: false,
        favoriteCategories: []
      },
      stats: {
        postsRead: 2,
        commentsWritten: 0,
        lastLogin: null
      }
    }
  ]
  
  // Add additional admin data to users
  const adminUsers = mockUsers.map(user => ({
    ...user,
    status: user.isActive ? 'active' : 'inactive',
    totalPosts: user.role === 'author' ? Math.floor(Math.random() * 50) + 5 : 0,
    totalComments: user.stats?.commentsWritten || 0,
    totalLikes: Math.floor(Math.random() * 200),
    accountAge: Math.floor((Date.now() - new Date(user.joinedAt).getTime()) / (1000 * 60 * 60 * 24)), // days
    lastActive: user.stats?.lastLogin || user.joinedAt,
    warnings: Math.floor(Math.random() * 3),
    ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
    twoFactorEnabled: user.role === 'admin',
    subscriptionPlan: user.role === 'author' ? 'pro' : 'free'
  }))
  
  // Filter users
  let filteredUsers = [...adminUsers]
  
  // Role filter
  if (query.role) {
    filteredUsers = filteredUsers.filter(user => user.role === query.role)
  }
  
  // Status filter
  if (query.status) {
    filteredUsers = filteredUsers.filter(user => user.status === query.status)
  }
  
  // Search filter
  if (query.search) {
    const searchLower = query.search.toLowerCase()
    filteredUsers = filteredUsers.filter(user => 
      user.email.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower)
    )
  }
  
  // Sorting
  const sortBy = query.sortBy || 'joinedAt'
  const order = query.order || 'desc'
  
  filteredUsers.sort((a, b) => {
    let aVal: any
    let bVal: any
    
    switch (sortBy) {
      case 'name':
        aVal = `${a.firstName} ${a.lastName}`
        bVal = `${b.firstName} ${b.lastName}`
        break
      case 'email':
        aVal = a.email
        bVal = b.email
        break
      case 'role':
        aVal = a.role
        bVal = b.role
        break
      case 'lastActive':
        aVal = new Date(a.lastActive).getTime()
        bVal = new Date(b.lastActive).getTime()
        break
      case 'totalPosts':
        aVal = a.totalPosts
        bVal = b.totalPosts
        break
      case 'joinedAt':
      default:
        aVal = new Date(a.joinedAt).getTime()
        bVal = new Date(b.joinedAt).getTime()
        break
    }
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
  
  // Pagination
  const page = parseInt(query.page || '1')
  const limit = parseInt(query.limit || '20')
  const offset = (page - 1) * limit
  const paginatedUsers = filteredUsers.slice(offset, offset + limit)
  
  // Calculate stats
  const stats = {
    total: filteredUsers.length,
    admins: filteredUsers.filter(u => u.role === 'admin').length,
    authors: filteredUsers.filter(u => u.role === 'author').length,
    users: filteredUsers.filter(u => u.role === 'user').length,
    active: filteredUsers.filter(u => u.status === 'active').length,
    inactive: filteredUsers.filter(u => u.status === 'inactive').length,
    unverified: filteredUsers.filter(u => !u.emailVerified).length,
    newThisMonth: filteredUsers.filter(u => 
      new Date(u.joinedAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
    ).length
  }
  
  return {
    success: true,
    users: paginatedUsers,
    pagination: {
      page,
      limit,
      total: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / limit),
      hasMore: offset + limit < filteredUsers.length
    },
    stats,
    filters: {
      role: query.role,
      status: query.status,
      search: query.search
    }
  }
})