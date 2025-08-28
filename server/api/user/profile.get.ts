import jwt from 'jsonwebtoken'
import type { JWTPayload, User } from '~/server/types/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload
    
    const mockUsers: Record<string, User> = {
      '1': {
        id: '1',
        email: 'admin@needleandkin.com',
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        avatar: '/avatars/default.jpg',
        bio: 'Site administrator with full access to all features.',
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
          postsRead: 42,
          commentsWritten: 15,
          lastLogin: new Date().toISOString()
        }
      },
      '2': {
        id: '2',
        email: 'jane.doe@example.com',
        username: 'janedoe',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'user',
        avatar: '/avatars/sarah.jpg',
        bio: 'Passionate crafter and knitting enthusiast. Always learning new patterns!',
        joinedAt: '2024-03-15T10:30:00Z',
        mustChangePassword: false,
        isActive: true,
        emailVerified: true,
        preferences: {
          newsletter: true,
          emailNotifications: false,
          favoriteCategories: ['knitting', 'embroidery']
        },
        stats: {
          postsRead: 128,
          commentsWritten: 34,
          lastLogin: new Date().toISOString()
        }
      }
    }
    
    const user = mockUsers[decoded.id]
    
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }
    
    const { password, ...userWithoutPassword } = user
    
    return {
      success: true,
      user: userWithoutPassword
    }
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token'
      })
    }
    throw error
  }
})