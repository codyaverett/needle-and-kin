import { describe, it, expect, beforeEach, vi } from 'vitest'
import postsHandler from '../index.get'

describe('GET /api/posts', () => {
  const mockEvent = {
    node: {
      req: {
        url: '/api/posts',
        method: 'GET'
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    global.getQuery = vi.fn()
  })

  it('should return paginated posts with default parameters', async () => {
    global.getQuery.mockReturnValue({})
    
    const result = await postsHandler(mockEvent)
    
    expect(result).toBeDefined()
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
    expect(result.page).toBe(1)
    expect(result.limit).toBe(9)
    expect(result.total).toBeGreaterThan(0)
    expect(result.totalPages).toBeDefined()
  })

  it('should respect page and limit parameters', async () => {
    global.getQuery.mockReturnValue({
      page: '2',
      limit: '5'
    })
    
    const result = await postsHandler(mockEvent)
    
    expect(result.page).toBe(2)
    expect(result.limit).toBe(5)
    expect(result.data.length).toBeLessThanOrEqual(5)
  })

  it('should filter posts by category', async () => {
    global.getQuery.mockReturnValue({
      category: 'knitting'
    })
    
    const result = await postsHandler(mockEvent)
    
    expect(result.data.every(post => post.category === 'knitting')).toBe(true)
  })

  it('should return all posts when category is "all"', async () => {
    global.getQuery.mockReturnValue({
      category: 'all'
    })
    
    const result = await postsHandler(mockEvent)
    
    // Should include posts from different categories
    const categories = [...new Set(result.data.map(p => p.category))]
    expect(categories.length).toBeGreaterThanOrEqual(1)
  })

  it('should handle invalid page number gracefully', async () => {
    global.getQuery.mockReturnValue({
      page: 'invalid'
    })
    
    const result = await postsHandler(mockEvent)
    
    expect(result.page).toBe(1) // Should default to page 1
  })

  it('should handle invalid limit gracefully', async () => {
    global.getQuery.mockReturnValue({
      limit: 'invalid'
    })
    
    const result = await postsHandler(mockEvent)
    
    expect(result.limit).toBe(9) // Should default to limit 9
  })

  it('should return empty data for page beyond total pages', async () => {
    global.getQuery.mockReturnValue({
      page: '999'
    })
    
    const result = await postsHandler(mockEvent)
    
    expect(result.data).toEqual([])
    expect(result.page).toBe(999)
  })

  it('should include post metadata in response', async () => {
    global.getQuery.mockReturnValue({})
    
    const result = await postsHandler(mockEvent)
    
    // Check first post has all expected fields
    const firstPost = result.data[0]
    expect(firstPost).toHaveProperty('id')
    expect(firstPost).toHaveProperty('slug')
    expect(firstPost).toHaveProperty('title')
    expect(firstPost).toHaveProperty('excerpt')
    expect(firstPost).toHaveProperty('image')
    expect(firstPost).toHaveProperty('publishedAt')
    expect(firstPost).toHaveProperty('readTime')
    expect(firstPost).toHaveProperty('author')
    expect(firstPost).toHaveProperty('category')
    expect(firstPost).toHaveProperty('tags')
    expect(firstPost).toHaveProperty('difficulty')
    expect(firstPost).toHaveProperty('views')
    expect(firstPost).toHaveProperty('likes')
  })

  it('should include author information in posts', async () => {
    global.getQuery.mockReturnValue({})
    
    const result = await postsHandler(mockEvent)
    
    const firstPost = result.data[0]
    expect(firstPost.author).toHaveProperty('id')
    expect(firstPost.author).toHaveProperty('name')
    expect(firstPost.author).toHaveProperty('avatar')
    expect(firstPost.author).toHaveProperty('bio')
  })

  it('should calculate correct pagination info', async () => {
    global.getQuery.mockReturnValue({
      page: '1',
      limit: '3'
    })
    
    const result = await postsHandler(mockEvent)
    
    expect(result.totalPages).toBe(Math.ceil(result.total / 3))
    expect(result.data.length).toBeLessThanOrEqual(3)
  })

  it('should filter by non-existent category', async () => {
    global.getQuery.mockReturnValue({
      category: 'nonexistent'
    })
    
    const result = await postsHandler(mockEvent)
    
    expect(result.data).toEqual([])
    expect(result.total).toBe(0)
    expect(result.totalPages).toBe(0)
  })

  it('should handle combination of filters and pagination', async () => {
    global.getQuery.mockReturnValue({
      category: 'crochet',
      page: '1',
      limit: '2'
    })
    
    const result = await postsHandler(mockEvent)
    
    expect(result.data.every(post => post.category === 'crochet')).toBe(true)
    expect(result.data.length).toBeLessThanOrEqual(2)
    expect(result.page).toBe(1)
    expect(result.limit).toBe(2)
  })
})