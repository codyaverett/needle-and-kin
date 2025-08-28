import jwt from 'jsonwebtoken'
import type { JWTPayload } from '~/server/types/auth'

// Simple in-memory storage for likes (in production, use database)
const postLikes: Record<string, Set<string>> = {}
const likeCounts: Record<string, number> = {}

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'id')
  
  if (!postId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID is required'
    })
  }
  
  // Authentication required for liking posts
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required to like posts'
    })
  }
  
  let userId: string
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload
    userId = decoded.id
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token'
      })
    }
    throw error
  }
  
  // Initialize storage for this post if needed
  if (!postLikes[postId]) {
    postLikes[postId] = new Set()
    likeCounts[postId] = 0
  }
  
  const isCurrentlyLiked = postLikes[postId].has(userId)
  let action: 'liked' | 'unliked'
  
  if (isCurrentlyLiked) {
    // Unlike the post
    postLikes[postId].delete(userId)
    likeCounts[postId] = Math.max(0, likeCounts[postId] - 1)
    action = 'unliked'
  } else {
    // Like the post
    postLikes[postId].add(userId)
    likeCounts[postId]++
    action = 'liked'
  }
  
  // In production, this would:
  // 1. Update database like status
  // 2. Update post like count
  // 3. Add/remove from user's liked posts
  // 4. Send notification to post author (if liked and not own post)
  // 5. Update trending/popular posts cache
  
  return {
    success: true,
    action,
    postId,
    likeCount: likeCounts[postId],
    isLiked: !isCurrentlyLiked,
    notification: action === 'liked' ? {
      sent: true,
      recipient: 'post-author',
      type: 'post-liked'
    } : null
  }
})