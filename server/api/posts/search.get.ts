import { posts } from '~/server/utils/blog-data'

interface SearchResult {
  id: number
  title: string
  slug: string
  excerpt: string
  category: string
  tags: string[]
  author: {
    name: string
  }
  publishedAt: string
  matchType: 'title' | 'content' | 'tag' | 'category' | 'author'
  relevanceScore: number
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchTerm = (query.q as string || '').toLowerCase().trim()
  
  if (!searchTerm || searchTerm.length < 2) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Search query must be at least 2 characters'
    })
  }
  
  // Search parameters
  const limit = parseInt(query.limit as string) || 20
  const offset = parseInt(query.offset as string) || 0
  const category = query.category as string
  const tags = query.tags ? (query.tags as string).split(',') : []
  const author = query.author as string
  const sortBy = query.sort as string || 'relevance' // relevance, date, popularity
  
  // Search through posts
  const searchResults: SearchResult[] = []
  
  posts.forEach(post => {
    let relevanceScore = 0
    let matchType: SearchResult['matchType'] | null = null
    
    // Title match (highest relevance)
    if (post.title.toLowerCase().includes(searchTerm)) {
      relevanceScore += 10
      matchType = 'title'
    }
    
    // Content/excerpt match
    if (post.excerpt.toLowerCase().includes(searchTerm)) {
      relevanceScore += 5
      if (!matchType) matchType = 'content'
    }
    
    // Tag match
    const hasTagMatch = post.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm)
    )
    if (hasTagMatch) {
      relevanceScore += 7
      if (!matchType) matchType = 'tag'
    }
    
    // Category match
    if (post.category.toLowerCase().includes(searchTerm)) {
      relevanceScore += 6
      if (!matchType) matchType = 'category'
    }
    
    // Author name match
    if (post.author.name.toLowerCase().includes(searchTerm)) {
      relevanceScore += 4
      if (!matchType) matchType = 'author'
    }
    
    // Apply filters
    if (category && post.category !== category) {
      relevanceScore = 0
    }
    
    if (tags.length > 0) {
      const hasRequiredTag = tags.some(tag => 
        post.tags.includes(tag)
      )
      if (!hasRequiredTag) {
        relevanceScore = 0
      }
    }
    
    if (author && !post.author.name.toLowerCase().includes(author.toLowerCase())) {
      relevanceScore = 0
    }
    
    // Add to results if there's a match
    if (relevanceScore > 0 && matchType) {
      searchResults.push({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags,
        author: {
          name: post.author.name
        },
        publishedAt: post.publishedAt,
        matchType,
        relevanceScore
      })
    }
  })
  
  // Sort results
  if (sortBy === 'relevance') {
    searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore)
  } else if (sortBy === 'date') {
    searchResults.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  } else if (sortBy === 'popularity') {
    // In production, sort by views/likes
    searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }
  
  // Apply pagination
  const paginatedResults = searchResults.slice(offset, offset + limit)
  
  // Generate search suggestions (for autocomplete)
  const suggestions: string[] = []
  if (searchResults.length > 0) {
    // Extract unique tags and categories from results
    const resultTags = new Set<string>()
    const resultCategories = new Set<string>()
    
    searchResults.forEach(result => {
      result.tags.forEach(tag => resultTags.add(tag))
      resultCategories.add(result.category)
    })
    
    suggestions.push(...Array.from(resultTags).slice(0, 5))
    suggestions.push(...Array.from(resultCategories))
  }
  
  return {
    success: true,
    query: searchTerm,
    results: paginatedResults,
    totalResults: searchResults.length,
    hasMore: offset + limit < searchResults.length,
    suggestions: suggestions.slice(0, 10),
    filters: {
      category,
      tags,
      author
    },
    pagination: {
      limit,
      offset,
      totalPages: Math.ceil(searchResults.length / limit),
      currentPage: Math.floor(offset / limit) + 1
    }
  }
})