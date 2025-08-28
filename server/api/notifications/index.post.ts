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
    const userRole = decoded.role

    if (userRole !== 'admin' && userRole !== 'moderator') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin or moderator access required'
      })
    }

    const body = await readBody(event)
    const { userId, type, title, message, metadata } = body

    if (!userId || !type || !title || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    const notification: Notification = {
      id: `notif-${Date.now()}`,
      userId,
      type,
      title,
      message,
      read: false,
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const storage = useStorage('data')
    const notifications = await storage.getItem<Notification[]>('notifications') || []
    notifications.push(notification)
    await storage.setItem('notifications', notifications)

    return {
      success: true,
      data: notification
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to create notification'
    })
  }
})