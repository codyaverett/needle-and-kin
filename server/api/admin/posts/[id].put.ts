import jwt from 'jsonwebtoken'
import type { JWTPayload } from '~/server/types/auth'
import { posts } from '~/server/utils/blog-data'

interface UpdatePostBody {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  category?: string
  tags?: string[]
  image?: string
  status?: 'draft' | 'published' | 'scheduled' | 'archived'
  scheduledFor?: string | null
  featured?: boolean
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
}

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
    
    // Check admin or author role
    if (userRole !== 'admin' && userRole !== 'author') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin or author access required'
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
  
  // For non-admin users, check if they own the post
  if (userRole === 'author' && existingPost.author.id !== parseInt(userId)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You can only edit your own posts'
    })
  }
  
  const body = await readBody<UpdatePostBody>(event)
  
  // Validate category if provided
  if (body.category) {
    const validCategories = ['knitting', 'crochet', 'embroidery', 'quilting', 'sewing', 'weaving']
    if (!validCategories.includes(body.category)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      })
    }
  }
  
  // Validate slug uniqueness if changed
  if (body.slug && body.slug !== existingPost.slug) {
    const slugExists = posts.some(p => p.slug === body.slug && p.id !== parseInt(postId))
    if (slugExists) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug already exists'
      })
    }
  }
  
  // Calculate new reading time if content changed
  let wordCount = 0
  let readingTime = existingPost.readTime
  
  if (body.content) {
    wordCount = body.content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / 200)
    readingTime = `${minutes} min`
  }
  
  // Build updated post
  const updatedPost = {
    ...existingPost,
    title: body.title?.trim() || existingPost.title,
    slug: body.slug || existingPost.slug,
    excerpt: body.excerpt?.trim() || existingPost.excerpt,
    content: body.content?.trim() || existingPost.content,
    category: body.category || existingPost.category,
    tags: body.tags || existingPost.tags,
    image: body.image || existingPost.image,
    status: body.status || 'published',
    featured: body.featured !== undefined ? body.featured : existingPost.featured,
    difficulty: body.difficulty || existingPost.difficulty,
    lastModified: new Date().toISOString(),
    readTime: readingTime,
    wordCount: wordCount || 0,
    scheduledFor: body.scheduledFor !== undefined ? body.scheduledFor : null,
    publishedAt: body.status === 'published' && !existingPost.publishedAt 
      ? new Date().toISOString() 
      : existingPost.publishedAt,
    seo: {
      title: body.seoTitle || body.title || existingPost.title,
      description: body.seoDescription || body.excerpt || existingPost.excerpt,
      keywords: body.seoKeywords || body.tags || existingPost.tags
    }
  }
  
  // Create revision history entry
  const revision = {
    id: `rev-${Date.now()}`,
    postId: parseInt(postId),
    userId,
    timestamp: new Date().toISOString(),
    changes: Object.keys(body).filter(key => 
      body[key as keyof UpdatePostBody] !== undefined
    ),
    previousValues: {
      title: existingPost.title,
      status: 'published',
      lastModified: existingPost.publishedAt
    }
  }
  
  // Log activity
  const activity = {
    action: 'post_updated',
    postId: parseInt(postId),
    userId,
    timestamp: new Date().toISOString(),
    details: {
      fields: Object.keys(body),
      status: body.status || 'published'
    }
  }
  
  return {
    success: true,
    message: 'Post updated successfully',
    post: updatedPost,
    revision,
    activity
  }
})