import jwt from 'jsonwebtoken'

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
    const activityId = getRouterParam(event, 'id')
    
    if (!activityId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Activity ID is required'
      })
    }
    
    const storage = useStorage('data')
    const activities = await storage.getItem<any[]>('activities') || []
    const activity = activities.find(a => a.id === activityId)
    
    if (!activity) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Activity not found'
      })
    }
    
    const likes = await storage.getItem<any[]>('activity-likes') || []
    const existingLike = likes.find(l => l.activityId === activityId && l.userId === userId)
    
    if (existingLike) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Activity already liked'
      })
    }
    
    const like = {
      id: `like-${Date.now()}`,
      activityId,
      userId,
      createdAt: new Date().toISOString()
    }
    
    likes.push(like)
    await storage.setItem('activity-likes', likes)
    
    // Update activity like count
    activity.likesCount = (activity.likesCount || 0) + 1
    await storage.setItem('activities', activities)
    
    // Create notification for activity owner
    if (activity.user.id !== userId) {
      const notifications = await storage.getItem<any[]>('notifications') || []
      const users = await storage.getItem<any[]>('users') || []
      const liker = users.find(u => u.id === userId)
      
      if (liker) {
        const notification = {
          id: `notif-${Date.now()}`,
          userId: activity.user.id,
          type: 'activity_like',
          title: `${liker.name} liked your activity`,
          message: 'Someone liked your recent activity',
          read: false,
          metadata: {
            activityId,
            userId: liker.id,
            userName: liker.name
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        notifications.push(notification)
        await storage.setItem('notifications', notifications)
      }
    }
    
    return {
      success: true,
      data: like
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to like activity'
    })
  }
})