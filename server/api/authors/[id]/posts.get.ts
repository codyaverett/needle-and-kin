import { posts } from '~/server/utils/blog-data'

interface AuthorPostsQuery {
  page?: string
  limit?: string
  category?: string
  difficulty?: string
  sortBy?: 'date' | 'popular' | 'views' | 'likes'
  order?: 'asc' | 'desc'
}

export default defineEventHandler(async (event) => {
  const authorId = getRouterParam(event, 'id')
  
  if (!authorId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Author ID is required'
    })
  }
  
  // Map author IDs to names (in production, this would be from database)
  const authorNames: Record<string, string> = {
    '1': 'Sarah Johnson',
    '2': 'Emily Chen',
    '3': 'Maria Garcia',
    '4': 'Lisa Anderson'
  }
  
  const authorName = authorNames[authorId]
  
  if (!authorName) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Author not found'
    })
  }
  
  const query = getQuery(event) as AuthorPostsQuery
  
  // Get all posts by this author
  let authorPosts = posts.filter(post => 
    post.author.name === authorName
  )
  
  // Apply filters
  if (query.category) {
    authorPosts = authorPosts.filter(post => 
      post.category === query.category
    )
  }
  
  if (query.difficulty) {
    authorPosts = authorPosts.filter(post => 
      post.difficulty === query.difficulty
    )
  }
  
  // Sorting
  const sortBy = query.sortBy || 'date'
  const order = query.order || 'desc'
  
  authorPosts.sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'popular':
        comparison = (b.likes + b.views) - (a.likes + a.views)
        break
      case 'views':
        comparison = b.views - a.views
        break
      case 'likes':
        comparison = b.likes - a.likes
        break
      case 'date':
      default:
        comparison = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        break
    }
    
    return order === 'asc' ? -comparison : comparison
  })
  
  // Pagination
  const page = parseInt(query.page || '1')
  const limit = parseInt(query.limit || '12')
  const offset = (page - 1) * limit
  
  const paginatedPosts = authorPosts.slice(offset, offset + limit)
  
  // Calculate statistics
  const stats = {
    totalPosts: authorPosts.length,
    categories: [...new Set(authorPosts.map(p => p.category))],
    totalViews: authorPosts.reduce((sum, post) => sum + post.views, 0),
    totalLikes: authorPosts.reduce((sum, post) => sum + post.likes, 0),
    averageReadTime: Math.round(
      authorPosts.reduce((sum, post) => sum + parseInt(post.readTime), 0) / authorPosts.length
    ),
    postsPerCategory: authorPosts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }
  
  return {
    success: true,
    authorId,
    authorName,
    posts: paginatedPosts,
    pagination: {
      page,
      limit,
      total: authorPosts.length,
      totalPages: Math.ceil(authorPosts.length / limit),
      hasMore: offset + limit < authorPosts.length
    },
    stats,
    filters: {
      category: query.category,
      difficulty: query.difficulty,
      sortBy,
      order
    }
  }
})