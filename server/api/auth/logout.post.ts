import { auth } from '~/server/utils/auth'
import { db } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) || {}
    const refreshToken = getCookie(event, 'refresh-token')
    
    if (body.allDevices && refreshToken) {
      // Find session to get userId
      const session = db.sessions.findByToken(refreshToken)
      if (session) {
        db.sessions.deleteAllForUser(session.userId)
      }
      auth.clearAuthCookies(event)
      return {
        success: true,
        message: 'Logged out from all devices successfully'
      }
    } else if (refreshToken) {
      // Delete specific session
      try {
        db.sessions.deleteByToken(refreshToken)
      } catch {
        // Continue even if deletion fails
      }
    }
    
    // Clear auth cookies
    auth.clearAuthCookies(event)
    
    return {
      success: true,
      message: 'Logged out successfully'
    }
  } catch {
    // Still clear cookies on error
    auth.clearAuthCookies(event)
    return {
      success: true,
      message: 'Logged out successfully'
    }
  }
})