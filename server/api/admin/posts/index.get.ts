import jwt from 'jsonwebtoken'
import type { JWTPayload } from '~/server/types/auth'
import { posts } from '~/server/utils/blog-data'

interface AdminPostsQuery {
  page?: string
  limit?: string
  status?: 'published' | 'draft' | 'archived'
  search?: string
  category?: string
  author?: string
  sortBy?: string
  order?: 'asc' | 'desc'
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
  
  let userRole: string
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload
    userRole = decoded.role
    
    // Check admin role
    if (userRole !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required'
      })
    }
  } catch (error: any) {
    if (error.statusCode === 403) throw error
    
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token'
    })
  }
  
  const query = getQuery(event) as AdminPostsQuery
  
  // Pagination
  const page = parseInt(query.page || '1')
  const limit = parseInt(query.limit || '20')
  const offset = (page - 1) * limit
  
  // Get all posts with additional admin data
  const adminPosts = posts.map(post => ({
    ...post,
    status: 'published' as const,
    views: Math.floor(Math.random() * 5000),
    likes: Math.floor(Math.random() * 500),
    comments: Math.floor(Math.random() * 100),
    lastModified: post.publishedAt,
    isDraft: false,
    isArchived: false,
    scheduledFor: null,
    seoScore: Math.floor(Math.random() * 100),
    readingTime: parseInt(post.readTime),
    wordCount: Math.floor(Math.random() * 2000) + 500
  }))
  
  // Add some draft posts
  const draftPosts = [
    {
      id: 101,
      title: '[DRAFT] Advanced Quilting Techniques',
      slug: 'advanced-quilting-techniques',
      excerpt: 'Master the art of quilting with these advanced patterns...',
      content: '<p>Draft content...</p>',
      image: '/blog/quilting-1.jpg',
      publishedAt: null,
      createdAt: new Date('2024-12-26').toISOString(),
      lastModified: new Date('2024-12-27').toISOString(),
      readTime: '15 min',
      readingTime: 15,
      wordCount: 1800,
      author: {
        id: 1,
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
        bio: 'Quilting expert'
      },
      category: 'quilting',
      tags: ['advanced', 'patterns', 'techniques'],
      difficulty: 'advanced',
      status: 'draft' as const,
      views: 0,
      likes: 0,
      comments: 0,
      featured: false,
      isDraft: true,
      isArchived: false,
      scheduledFor: null,
      seoScore: 45
    },
    {
      id: 102,
      title: '[DRAFT] Beginner\'s Guide to Weaving',
      slug: 'beginners-guide-weaving',
      excerpt: 'Start your weaving journey with this comprehensive guide...',
      content: '<p>Draft content...</p>',
      image: '/blog/weaving-1.jpg',
      publishedAt: null,
      createdAt: new Date('2024-12-25').toISOString(),
      lastModified: new Date('2024-12-28').toISOString(),
      readTime: '10 min',
      readingTime: 10,
      wordCount: 1200,
      author: {
        id: 2,
        name: 'Emily Chen',
        avatar: '/avatars/emily.jpg',
        bio: 'Weaving instructor'
      },
      category: 'weaving',
      tags: ['beginner', 'basics', 'tutorial'],
      difficulty: 'beginner',
      status: 'draft' as const,
      views: 0,
      likes: 0,
      comments: 0,
      featured: false,
      isDraft: true,
      isArchived: false,
      scheduledFor: new Date('2024-12-30').toISOString(),
      seoScore: 72
    }
  ]
  
  // Combine all posts
  let allPosts = [...adminPosts, ...draftPosts]
  
  // Filter by status
  if (query.status) {
    allPosts = allPosts.filter(post => post.status === query.status)
  }
  
  // Search filter
  if (query.search) {
    const searchLower = query.search.toLowerCase()
    allPosts = allPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.author.name.toLowerCase().includes(searchLower)
    )
  }
  
  // Category filter
  if (query.category) {
    allPosts = allPosts.filter(post => post.category === query.category)
  }
  
  // Author filter
  if (query.author) {
    allPosts = allPosts.filter(post => 
      post.author.name.toLowerCase().includes(query.author!.toLowerCase())
    )
  }
  
  // Sorting
  const sortBy = query.sortBy || 'lastModified'
  const order = query.order || 'desc'
  
  allPosts.sort((a, b) => {
    let aVal: any
    let bVal: any
    
    switch (sortBy) {
      case 'title':
        aVal = a.title
        bVal = b.title
        break
      case 'views':
        aVal = a.views
        bVal = b.views
        break
      case 'likes':
        aVal = a.likes
        bVal = b.likes
        break
      case 'comments':
        aVal = a.comments
        bVal = b.comments
        break
      case 'seoScore':
        aVal = a.seoScore
        bVal = b.seoScore
        break
      case 'lastModified':
      default:
        aVal = new Date(a.lastModified).getTime()
        bVal = new Date(b.lastModified).getTime()
        break
    }
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
  
  // Paginate
  const paginatedPosts = allPosts.slice(offset, offset + limit)
  
  // Calculate stats
  const stats = {
    total: allPosts.length,
    published: allPosts.filter(p => p.status === 'published').length,
    draft: allPosts.filter(p => p.status === 'draft').length,
    archived: allPosts.filter(p => p.status === 'archived').length,
    scheduled: allPosts.filter(p => p.scheduledFor).length
  }
  
  return {
    success: true,
    posts: paginatedPosts,
    pagination: {
      page,
      limit,
      total: allPosts.length,
      totalPages: Math.ceil(allPosts.length / limit),
      hasMore: offset + limit < allPosts.length
    },
    stats,
    filters: {
      status: query.status,
      search: query.search,
      category: query.category,
      author: query.author
    }
  }
})