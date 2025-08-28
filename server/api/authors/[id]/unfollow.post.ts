import jwt from 'jsonwebtoken'
import type { JWTPayload } from '~/server/types/auth'

// Share storage with follow endpoint (in production, use database)
const authorFollowers: Record<string, Set<string>> = {
  '1': new Set(),
  '2': new Set(),
  '3': new Set(),
  '4': new Set(),
}

const userFollowing: Record<string, Set<string>> = {}

export default defineEventHandler(async (event) => {
  const authorId = getRouterParam(event, 'id')
  
  if (!authorId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Author ID is required'
    })
  }
  
  // Authentication required
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required to unfollow authors'
    })
  }
  
  let userId: string
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload
    userId = decoded.id
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token'
    })
  }
  
  // Check if author exists
  const validAuthors = ['1', '2', '3', '4']
  if (!validAuthors.includes(authorId)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Author not found'
    })
  }
  
  // Initialize storage if needed
  if (!authorFollowers[authorId]) {
    authorFollowers[authorId] = new Set()
  }
  if (!userFollowing[userId]) {
    userFollowing[userId] = new Set()
  }
  
  // Check if following
  const isFollowing = authorFollowers[authorId].has(userId)
  
  if (!isFollowing) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You are not following this author'
    })
  }
  
  // Remove follower relationship
  authorFollowers[authorId].delete(userId)
  userFollowing[userId].delete(authorId)
  
  // Get author name
  const authorNames: Record<string, string> = {
    '1': 'Sarah Johnson',
    '2': 'Emily Chen',
    '3': 'Maria Garcia',
    '4': 'Lisa Anderson'
  }
  
  // In production, this would:
  // 1. Update database
  // 2. Update follower count cache
  // 3. Remove from activity feed
  // 4. Unsubscribe from author notifications
  
  return {
    success: true,
    message: `You have unfollowed ${authorNames[authorId]}`,
    following: false,
    authorId,
    followersCount: authorFollowers[authorId].size,
    unsubscribed: {
      newsletter: true,
      newPosts: true,
      updates: true
    }
  }
})