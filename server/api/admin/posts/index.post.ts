import jwt from 'jsonwebtoken'
import type { JWTPayload } from '~/server/types/auth'

interface CreatePostBody {
  title: string
  slug?: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  image?: string
  status: 'draft' | 'published' | 'scheduled'
  scheduledFor?: string
  featured?: boolean
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
}

export default defineEventHandler(async (event) => {
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
  let username: string
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload
    userId = decoded.id
    userRole = decoded.role
    username = decoded.username
    
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
  
  const body = await readBody<CreatePostBody>(event)
  
  // Validate required fields
  if (!body.title || body.title.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title is required'
    })
  }
  
  if (!body.excerpt || body.excerpt.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Excerpt is required'
    })
  }
  
  if (!body.content || body.content.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Content is required'
    })
  }
  
  if (!body.category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category is required'
    })
  }
  
  // Validate category
  const validCategories = ['knitting', 'crochet', 'embroidery', 'quilting', 'sewing', 'weaving']
  if (!validCategories.includes(body.category)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid category. Must be one of: ${validCategories.join(', ')}`
    })
  }
  
  // Generate slug if not provided
  const slug = body.slug || body.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = body.content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)
  
  // Create the new post
  const newPost = {
    id: Date.now(),
    title: body.title.trim(),
    slug,
    excerpt: body.excerpt.trim(),
    content: body.content.trim(),
    category: body.category,
    tags: body.tags || [],
    image: body.image || `/blog/${body.category}-default.jpg`,
    status: body.status,
    featured: body.featured || false,
    difficulty: body.difficulty || 'beginner',
    author: {
      id: userId,
      name: username,
      avatar: '/avatars/default.jpg'
    },
    createdAt: new Date().toISOString(),
    publishedAt: body.status === 'published' ? new Date().toISOString() : null,
    scheduledFor: body.scheduledFor || null,
    lastModified: new Date().toISOString(),
    readTime: `${readingTime} min`,
    wordCount,
    views: 0,
    likes: 0,
    comments: 0,
    seo: {
      title: body.seoTitle || body.title,
      description: body.seoDescription || body.excerpt,
      keywords: body.seoKeywords || body.tags
    }
  }
  
  // In production, this would:
  // 1. Save to database
  // 2. Generate unique ID
  // 3. Process and optimize images
  // 4. Update search index
  // 5. Schedule publication if needed
  // 6. Send notifications to subscribers
  
  // Log activity
  const activity = {
    action: 'post_created',
    postId: newPost.id,
    userId,
    timestamp: new Date().toISOString(),
    details: {
      title: newPost.title,
      status: newPost.status
    }
  }
  
  return {
    success: true,
    message: `Post ${body.status === 'published' ? 'published' : 'created'} successfully`,
    post: newPost,
    activity
  }
})