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
    const likeIndex = likes.findIndex(l => l.activityId === activityId && l.userId === userId)
    
    if (likeIndex === -1) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Like not found'
      })
    }
    
    likes.splice(likeIndex, 1)
    await storage.setItem('activity-likes', likes)
    
    // Update activity like count
    activity.likesCount = Math.max(0, (activity.likesCount || 0) - 1)
    await storage.setItem('activities', activities)
    
    return {
      success: true,
      message: 'Like removed successfully'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to unlike activity'
    })
  }
})