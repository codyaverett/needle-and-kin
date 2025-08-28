import jwt from 'jsonwebtoken'
import type { JWTPayload } from '~/server/types/auth'

interface CommentBody {
  content: string
  parentId?: string // For replies
}

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'id')
  
  if (!postId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID is required'
    })
  }
  
  // Authentication required for posting comments
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required to post comments'
    })
  }
  
  let userId: string
  let userEmail: string
  let username: string
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload
    userId = decoded.id
    userEmail = decoded.email
    username = decoded.username
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token'
      })
    }
    throw error
  }
  
  const body = await readBody<CommentBody>(event)
  
  // Validate comment content
  if (!body.content || body.content.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Comment content is required'
    })
  }
  
  if (body.content.length > 2000) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Comment must be 2000 characters or less'
    })
  }
  
  // Sanitize content (basic sanitization)
  const sanitizedContent = body.content
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
  
  // Check if this is a reply to another comment
  if (body.parentId) {
    // In production, verify that parent comment exists
    // For now, we'll just accept it
  }
  
  // Create the new comment
  const newComment = {
    id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    postId,
    userId,
    userName: username || userEmail.split('@')[0],
    userAvatar: '/avatars/default.jpg',
    content: sanitizedContent,
    createdAt: new Date().toISOString(),
    likes: 0,
    isLiked: false,
    isAuthor: true,
    isEdited: false,
    parentId: body.parentId,
    replies: []
  }
  
  // In production, this would:
  // 1. Save to database
  // 2. Send notification to post author
  // 3. Send notifications to other commenters if enabled
  // 4. Update post comment count
  
  return {
    success: true,
    message: 'Comment posted successfully',
    comment: newComment,
    notification: {
      sent: true,
      recipients: ['post-author'],
      type: 'new-comment'
    }
  }
})