import jwt from 'jsonwebtoken'
import type { JWTPayload, UserPreferences } from '~/server/types/auth'

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
    
    // In production, this would fetch from database
    const mockPreferences: Record<string, UserPreferences> = {
      '1': {
        newsletter: true,
        emailNotifications: true,
        favoriteCategories: ['knitting', 'crochet', 'embroidery']
      },
      '2': {
        newsletter: true,
        emailNotifications: false,
        favoriteCategories: ['knitting', 'quilting']
      }
    }
    
    const preferences = mockPreferences[decoded.id] || {
      newsletter: false,
      emailNotifications: true,
      favoriteCategories: []
    }
    
    return {
      success: true,
      preferences
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