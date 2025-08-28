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

    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const type = query.type as string

    const storage = useStorage('data')
    const allNotifications = await storage.getItem<Notification[]>('notifications') || []
    
    let userNotifications = allNotifications.filter(n => n.userId === userId)
    
    if (type) {
      userNotifications = userNotifications.filter(n => n.type === type)
    }

    userNotifications.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })

    const start = (page - 1) * limit
    const end = start + limit
    const paginatedNotifications = userNotifications.slice(start, end)

    return {
      success: true,
      data: {
        notifications: paginatedNotifications,
        total: userNotifications.length,
        page,
        limit,
        hasMore: end < userNotifications.length
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch notifications'
    })
  }
})