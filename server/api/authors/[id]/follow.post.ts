import jwt from 'jsonwebtoken'
import type { JWTPayload } from '~/server/types/auth'

// Simple in-memory storage for followers (in production, use database)
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
      statusMessage: 'Authentication required to follow authors'
    })
  }
  
  let userId: string
  let userEmail: string
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload
    userId = decoded.id
    userEmail = decoded.email
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token'
    })
  }
  
  // Prevent self-following
  if (userId === authorId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You cannot follow yourself'
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
  
  // Check if already following
  const isAlreadyFollowing = authorFollowers[authorId].has(userId)
  
  if (isAlreadyFollowing) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You are already following this author'
    })
  }
  
  // Add follower relationship
  authorFollowers[authorId].add(userId)
  userFollowing[userId].add(authorId)
  
  // Get author details for notification
  const authorNames: Record<string, string> = {
    '1': 'Sarah Johnson',
    '2': 'Emily Chen',
    '3': 'Maria Garcia',
    '4': 'Lisa Anderson'
  }
  
  // In production, this would:
  // 1. Update database
  // 2. Send notification to author
  // 3. Update follower count cache
  // 4. Add to activity feed
  // 5. Send email if author has notifications enabled
  
  const notification = {
    type: 'new_follower',
    recipientId: authorId,
    recipientName: authorNames[authorId],
    followerId: userId,
    followerEmail: userEmail,
    timestamp: new Date().toISOString()
  }
  
  return {
    success: true,
    message: `You are now following ${authorNames[authorId]}`,
    following: true,
    authorId,
    followersCount: authorFollowers[authorId].size,
    notification,
    subscriptions: {
      newsletter: true, // Auto-subscribe to author's newsletter
      newPosts: true,   // Get notified of new posts
      updates: false    // Author updates (can be enabled later)
    }
  }
})