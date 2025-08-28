import { auth } from '~/server/utils/auth'
import { db } from '~/server/utils/database'
import type { User, RefreshTokenPayload } from '~/server/types/auth'

export default defineEventHandler(async (event) => {
  try {
    // Get refresh token from cookie
    const refreshToken = getCookie(event, 'refresh-token')
    
    if (!refreshToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Refresh token required'
      })
    }
    
    // Verify refresh token
    let decoded
    try {
      decoded = auth.verifyRefreshToken(refreshToken) as RefreshTokenPayload | null
    } catch {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid refresh token'
      })
    }
    
    if (!decoded) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid refresh token'
      })
    }
    
    // Get user - handle both 'id' and 'userId' in decoded token
    const userId = (decoded as any).userId || (decoded as any).id
    const user = db.users.findById(userId) as User | null
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }
    
    if (!user.isActive) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Account has been deactivated'
      })
    }
    
    // Delete old session
    db.sessions.deleteByToken(refreshToken)
    
    // Generate new tokens
    const newAccessToken = auth.generateAccessToken(user)
    const newRefreshToken = auth.generateRefreshToken(user)
    
    // Create new session
    db.sessions.create({
      userId: user.id,
      userEmail: user.email,
      refreshToken: newRefreshToken
    })
    
    // Set new auth cookies
    auth.setAuthCookies(event, newAccessToken, newRefreshToken)
    
    return {
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  } catch (error) {
    // Re-throw createError instances
    if (error.statusCode) {
      throw error
    }
    // Handle unexpected errors
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid refresh token'
    })
  }
})