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

    const storage = useStorage('data')
    const preferences = await storage.getItem(`notification-prefs:${userId}`)

    const defaultPreferences: NotificationPreferences = {
      email: {
        comment_reply: true,
        post_like: false,
        new_follower: true,
        mention: true,
        achievement_unlocked: true,
        project_feedback: true,
        group_invite: true,
        system_announcement: true
      },
      inApp: {
        comment_reply: true,
        post_like: true,
        new_follower: true,
        mention: true,
        achievement_unlocked: true,
        project_feedback: true,
        group_invite: true,
        system_announcement: true
      },
      digestMode: false,
      digestFrequency: 'daily',
      quietHours: false,
      quietStart: '22:00',
      quietEnd: '08:00'
    }

    return {
      success: true,
      data: preferences || defaultPreferences
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch notification preferences'
    })
  }
})