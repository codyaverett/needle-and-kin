import jwt from 'jsonwebtoken'
import type { JWTPayload } from '~/server/types/auth'
import { posts } from '~/server/utils/blog-data'

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'id')
  
  if (!postId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID is required'
    })
  }
  
  // Check authentication
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }
  
  let userId: string
  let userRole: string
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload
    userId = decoded.id
    userRole = decoded.role
    
    // Only admins can delete posts
    if (userRole !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required to delete posts'
      })
    }
  } catch (error: any) {
    if (error.statusCode === 403) throw error
    
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token'
    })
  }
  
  // Find the post (in production, fetch from database)
  const existingPost = posts.find(p => p.id === parseInt(postId))
  
  if (!existingPost) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Post not found'
    })
  }
  
  // Check for soft delete option
  const query = getQuery(event)
  const softDelete = query.soft === 'true'
  
  let deletedPost
  let message
  
  if (softDelete) {
    // Soft delete - mark as archived
    deletedPost = {
      ...existingPost,
      status: 'archived',
      archivedAt: new Date().toISOString(),
      archivedBy: userId
    }
    message = 'Post archived successfully'
  } else {
    // Hard delete - actually remove the post
    deletedPost = {
      id: existingPost.id,
      title: existingPost.title,
      deletedAt: new Date().toISOString()
    }
    message = 'Post permanently deleted'
    
    // In production, this would:
    // 1. Delete from database
    // 2. Remove associated comments
    // 3. Clear cache
    // 4. Update search index
    // 5. Clean up media files
  }
  
  // Create backup before deletion
  const backup = {
    id: `backup-${Date.now()}`,
    postId: parseInt(postId),
    post: existingPost,
    deletedBy: userId,
    deletedAt: new Date().toISOString(),
    reason: getQuery(event).reason as string || 'No reason provided',
    type: softDelete ? 'soft' : 'hard'
  }
  
  // Log activity
  const activity = {
    action: softDelete ? 'post_archived' : 'post_deleted',
    postId: parseInt(postId),
    userId,
    timestamp: new Date().toISOString(),
    details: {
      title: existingPost.title,
      type: softDelete ? 'soft_delete' : 'hard_delete',
      reason: backup.reason
    }
  }
  
  return {
    success: true,
    message,
    deletedPost,
    backup,
    activity
  }
})