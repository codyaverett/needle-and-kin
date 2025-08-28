import jwt from 'jsonwebtoken'
import type { Notification } from '~/types/notification'

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
    const notifications = await storage.getItem<Notification[]>('notifications') || []
    
    const unreadCount = notifications.filter(n => n.userId === userId && !n.read).length

    return {
      success: true,
      data: {
        count: unreadCount
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch unread count'
    })
  }
})