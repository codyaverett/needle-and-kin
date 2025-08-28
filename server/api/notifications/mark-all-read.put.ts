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
    
    let updatedCount = 0
    notifications.forEach(notification => {
      if (notification.userId === userId && !notification.read) {
        notification.read = true
        notification.updatedAt = new Date().toISOString()
        updatedCount++
      }
    })

    await storage.setItem('notifications', notifications)

    return {
      success: true,
      data: {
        updatedCount
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to mark all notifications as read'
    })
  }
})