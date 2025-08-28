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
    const notificationId = getRouterParam(event, 'id')

    if (!notificationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Notification ID is required'
      })
    }

    const storage = useStorage('data')
    const notifications = await storage.getItem<Notification[]>('notifications') || []
    const notificationIndex = notifications.findIndex(n => n.id === notificationId && n.userId === userId)

    if (notificationIndex === -1) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Notification not found'
      })
    }

    notifications[notificationIndex].read = true
    notifications[notificationIndex].updatedAt = new Date().toISOString()
    await storage.setItem('notifications', notifications)

    return {
      success: true,
      data: notifications[notificationIndex]
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to mark notification as read'
    })
  }
})