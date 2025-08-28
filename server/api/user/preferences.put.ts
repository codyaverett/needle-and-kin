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
    const body = await readBody<Partial<UserPreferences>>(event)
    
    // Validate favorite categories
    const validCategories = ['knitting', 'crochet', 'embroidery', 'quilting', 'sewing', 'weaving']
    if (body.favoriteCategories) {
      const invalidCategories = body.favoriteCategories.filter(cat => !validCategories.includes(cat))
      if (invalidCategories.length > 0) {
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid categories: ${invalidCategories.join(', ')}`
        })
      }
    }
    
    // Build updated preferences
    const updatedPreferences: UserPreferences = {
      newsletter: body.newsletter ?? false,
      emailNotifications: body.emailNotifications ?? true,
      favoriteCategories: body.favoriteCategories || []
    }
    
    // In production, this would update the database
    // For now, return the updated preferences
    return {
      success: true,
      message: 'Preferences updated successfully',
      preferences: updatedPreferences
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