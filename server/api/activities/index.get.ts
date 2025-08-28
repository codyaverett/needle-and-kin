import jwt from 'jsonwebtoken'
import type { Activity } from '~/types/activity'

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth-token')
    let userId: string | null = null
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
        userId = decoded.userId
      } catch {
        // Continue without authentication
      }
    }
    
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const sort = query.sort as string || 'recent'
    const following = query.following === 'true'
    const types = query.types ? (query.types as string).split(',') : []
    
    const storage = useStorage('data')
    let activities = await storage.getItem<Activity[]>('activities') || []
    
    // Filter by following if requested and user is authenticated
    if (following && userId) {
      const follows = await storage.getItem<any[]>('follows') || []
      const followingIds = follows
        .filter(f => f.followerId === userId)
        .map(f => f.followingId)
      
      activities = activities.filter(a => followingIds.includes(a.user.id))
    }
    
    // Filter by activity types
    if (types.length > 0) {
      activities = activities.filter(a => types.includes(a.type))
    }
    
    // Sort activities
    switch (sort) {
      case 'popular':
        activities.sort((a, b) => {
          const scoreA = (a.likesCount || 0) + (a.commentsCount || 0) * 2
          const scoreB = (b.likesCount || 0) + (b.commentsCount || 0) * 2
          return scoreB - scoreA
        })
        break
      case 'recent':
      default:
        activities.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return dateB - dateA
        })
    }
    
    // Add liked status if user is authenticated
    if (userId) {
      const likes = await storage.getItem<any[]>('activity-likes') || []
      activities = activities.map(activity => ({
        ...activity,
        isLiked: likes.some(l => l.activityId === activity.id && l.userId === userId)
      }))
    }
    
    // Paginate
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedActivities = activities.slice(start, end)
    
    return {
      success: true,
      data: {
        activities: paginatedActivities,
        total: activities.length,
        page,
        limit,
        hasMore: end < activities.length
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch activities'
    })
  }
})