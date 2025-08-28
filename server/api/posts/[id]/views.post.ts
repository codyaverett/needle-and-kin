import jwt from 'jsonwebtoken'
import type { JWTPayload } from '~/server/types/auth'

// Simple in-memory storage for view tracking (in production, use database)
const viewCounts: Record<string, number> = {}
const userViews: Record<string, Set<string>> = {} // Track unique views per user

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'id')
  
  if (!postId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID is required'
    })
  }
  
  // Get user info if authenticated (for unique view tracking)
  let userId: string | null = null
  let ipAddress = getHeader(event, 'x-forwarded-for') || 
                  getHeader(event, 'x-real-ip') || 
                  event.node.req.socket.remoteAddress || 
                  'unknown'
  
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload
      userId = decoded.id
    } catch {
      // Not authenticated, use IP for tracking
    }
  }
  
  // Create unique viewer identifier
  const viewerId = userId || `anonymous-${ipAddress}`
  
  // Initialize tracking for this post if needed
  if (!viewCounts[postId]) {
    viewCounts[postId] = 0
    userViews[postId] = new Set()
  }
  
  // Check if this viewer has already viewed this post
  const hasViewed = userViews[postId].has(viewerId)
  
  if (!hasViewed) {
    // Increment view count
    viewCounts[postId]++
    userViews[postId].add(viewerId)
    
    // In production, this would:
    // 1. Update database view count
    // 2. Store view record with timestamp
    // 3. Update user's reading history if authenticated
    // 4. Potentially update trending/popular posts cache
    
    return {
      success: true,
      message: 'View recorded',
      viewCount: viewCounts[postId],
      isNewView: true,
      viewerId: userId ? 'authenticated' : 'anonymous'
    }
  } else {
    // User has already viewed this post
    return {
      success: true,
      message: 'View already recorded',
      viewCount: viewCounts[postId],
      isNewView: false,
      viewerId: userId ? 'authenticated' : 'anonymous'
    }
  }
})