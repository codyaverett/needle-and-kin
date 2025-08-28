import jwt from 'jsonwebtoken'
import type { Activity } from '~/types/activity'

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
    
    const body = await readBody(event)
    const { type, target, metadata } = body
    
    if (!type) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Activity type is required'
      })
    }
    
    const storage = useStorage('data')
    const users = await storage.getItem<any[]>('users') || []
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }
    
    const activity: Activity = {
      id: `activity-${Date.now()}`,
      type,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        isVerified: user.isVerified
      },
      target: target || undefined,
      metadata: metadata || {},
      isLiked: false,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString()
    }
    
    const activities = await storage.getItem<Activity[]>('activities') || []
    activities.push(activity)
    await storage.setItem('activities', activities)
    
    // Create notifications for followers
    const follows = await storage.getItem<any[]>('follows') || []
    const followers = follows.filter(f => f.followingId === userId)
    
    const notifications = await storage.getItem<any[]>('notifications') || []
    
    for (const follower of followers) {
      const notification = {
        id: `notif-${Date.now()}-${follower.followerId}`,
        userId: follower.followerId,
        type: 'activity',
        title: `${user.name} ${getActivityText(type)}`,
        message: getActivityMessage(activity),
        read: false,
        metadata: {
          activityId: activity.id,
          userId: user.id
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      notifications.push(notification)
    }
    
    await storage.setItem('notifications', notifications)
    
    return {
      success: true,
      data: activity
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to create activity'
    })
  }
})

function getActivityText(type: string): string {
  const texts: Record<string, string> = {
    'posted': 'shared a new post',
    'liked': 'liked something',
    'commented': 'commented on something',
    'followed': 'followed someone',
    'created_project': 'created a new project',
    'completed_tutorial': 'completed a tutorial',
    'joined_group': 'joined a group',
    'earned_achievement': 'earned an achievement',
    'shared': 'shared something',
    'updated_profile': 'updated their profile'
  }
  return texts[type] || type
}

function getActivityMessage(activity: Activity): string {
  if (activity.metadata?.comment) {
    return activity.metadata.comment
  }
  if (activity.target?.title) {
    return `Check out "${activity.target.title}"`
  }
  return 'View their activity'
}