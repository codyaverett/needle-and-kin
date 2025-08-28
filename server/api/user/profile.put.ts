import jwt from 'jsonwebtoken'
import type { JWTPayload } from '~/server/types/auth'

interface UpdateProfileBody {
  firstName?: string
  lastName?: string
  username?: string
  bio?: string
  avatar?: string
}

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
    const body = await readBody<UpdateProfileBody>(event)
    
    // Validate input
    if (body.username && (body.username.length < 3 || body.username.length > 20)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username must be between 3 and 20 characters'
      })
    }
    
    if (body.bio && body.bio.length > 500) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bio must be 500 characters or less'
      })
    }
    
    if (body.firstName && body.firstName.length > 50) {
      throw createError({
        statusCode: 400,
        statusMessage: 'First name must be 50 characters or less'
      })
    }
    
    if (body.lastName && body.lastName.length > 50) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Last name must be 50 characters or less'
      })
    }
    
    // Sanitize input
    const sanitizedData = {
      firstName: body.firstName?.trim(),
      lastName: body.lastName?.trim(),
      username: body.username?.trim().toLowerCase(),
      bio: body.bio?.trim(),
      avatar: body.avatar?.trim()
    }
    
    // Remove undefined values
    Object.keys(sanitizedData).forEach(key => {
      if (sanitizedData[key as keyof typeof sanitizedData] === undefined) {
        delete sanitizedData[key as keyof typeof sanitizedData]
      }
    })
    
    // In production, this would update the database
    // For now, return the updated profile
    const updatedProfile = {
      id: decoded.id,
      email: decoded.email,
      username: sanitizedData.username || decoded.username,
      firstName: sanitizedData.firstName || 'User',
      lastName: sanitizedData.lastName || '',
      bio: sanitizedData.bio || '',
      avatar: sanitizedData.avatar || '/avatars/default.jpg',
      role: decoded.role,
      joinedAt: '2024-01-01T00:00:00Z',
      isActive: true,
      emailVerified: true,
      updatedAt: new Date().toISOString()
    }
    
    return {
      success: true,
      message: 'Profile updated successfully',
      user: updatedProfile
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