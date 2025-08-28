import jwt from 'jsonwebtoken'
import type { NotificationPreferences } from '~/types/notification'

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth-token')
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const userId = decoded.userId

    const body = await readBody(event) as NotificationPreferences

    if (!body || !body.email || !body.inApp) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid preferences data'
      })
    }

    const storage = useStorage('data')
    await storage.setItem(`notification-prefs:${userId}`, body)

    return {
      success: true,
      data: body
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to update notification preferences'
    })
  }
})