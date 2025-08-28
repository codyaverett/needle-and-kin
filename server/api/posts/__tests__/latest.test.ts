import { describe, it, expect, beforeEach, vi } from 'vitest'
import latestHandler from '../latest.get'

describe('GET /api/posts/latest', () => {
  const mockEvent = {
    node: {
      req: {
        url: '/api/posts/latest',
        method: 'GET'
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    global.getQuery = vi.fn()
  })

  it('should return latest posts with default limit', async () => {
    global.getQuery.mockReturnValue({})

    const result = await latestHandler(mockEvent)

    expect(result).toBeDefined()
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
    expect(result.data.length).toBeLessThanOrEqual(5) // Default limit
  })

  it('should respect custom limit parameter', async () => {
    global.getQuery.mockReturnValue({ limit: '3' })

    const result = await latestHandler(mockEvent)

    expect(result.data.length).toBeLessThanOrEqual(3)
    expect(result.limit).toBe(3)
  })

  it('should sort posts by publication date (newest first)', async () => {
    global.getQuery.mockReturnValue({})

    const result = await latestHandler(mockEvent)

    if (result.data.length > 1) {
      for (let i = 1; i < result.data.length; i++) {
        const prevDate = new Date(result.data[i - 1].publishedAt)
        const currDate = new Date(result.data[i].publishedAt)
        expect(prevDate >= currDate).toBe(true)
      }
    }
  })

  it('should include essential post metadata', async () => {
    global.getQuery.mockReturnValue({})

    const result = await latestHandler(mockEvent)

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
    expect(firstPost).toHaveProperty('difficulty')
    expect(firstPost).toHaveProperty('views')
    expect(firstPost).toHaveProperty('likes')
  })

  it('should not include full content in latest posts', async () => {
    global.getQuery.mockReturnValue({})

    const result = await latestHandler(mockEvent)

    result.data.forEach(post => {
      // Should not include full content for performance
      if (post.content) {
        expect(post.content.length).toBeLessThan(500) // Should be excerpt, not full content
      }
    })
  })

  it('should include author information', async () => {
    global.getQuery.mockReturnValue({})

    const result = await latestHandler(mockEvent)

    const firstPost = result.data[0]
    expect(firstPost.author).toBeDefined()
    expect(firstPost.author.id).toBeDefined()
    expect(firstPost.author.name).toBeDefined()
    expect(firstPost.author.avatar).toBeDefined()
  })

  it('should handle large limit values gracefully', async () => {
    global.getQuery.mockReturnValue({ limit: '100' })

    const result = await latestHandler(mockEvent)

    // Should return all available posts, not fail
    expect(Array.isArray(result.data)).toBe(true)
    expect(result.limit).toBe(100)
  })

  it('should handle invalid limit values', async () => {
    global.getQuery.mockReturnValue({ limit: 'invalid' })

    const result = await latestHandler(mockEvent)

    // Should default to 5 for invalid limit
    expect(result.limit).toBe(5)
    expect(result.data.length).toBeLessThanOrEqual(5)
  })

  it('should handle zero limit', async () => {
    global.getQuery.mockReturnValue({ limit: '0' })

    const result = await latestHandler(mockEvent)

    expect(result.data).toEqual([])
    expect(result.limit).toBe(0)
  })

  it('should handle negative limit', async () => {
    global.getQuery.mockReturnValue({ limit: '-5' })

    const result = await latestHandler(mockEvent)

    // Should default to 5 for negative limit
    expect(result.limit).toBe(5)
    expect(result.data.length).toBeLessThanOrEqual(5)
  })

  it('should return posts from different categories', async () => {
    global.getQuery.mockReturnValue({ limit: '10' })

    const result = await latestHandler(mockEvent)

    const categories = [...new Set(result.data.map(p => p.category))]
    expect(categories.length).toBeGreaterThan(1) // Should include multiple categories
  })

  it('should include posts with different difficulty levels', async () => {
    global.getQuery.mockReturnValue({ limit: '10' })

    const result = await latestHandler(mockEvent)

    const difficulties = [...new Set(result.data.map(p => p.difficulty))]
    expect(difficulties.length).toBeGreaterThan(1) // Should include different difficulty levels
  })

  it('should return consistent structure', async () => {
    global.getQuery.mockReturnValue({})

    const result = await latestHandler(mockEvent)

    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('limit')
    expect(result).toHaveProperty('total')
    expect(typeof result.total).toBe('number')
    expect(typeof result.limit).toBe('number')
  })

  it('should include view and like counts', async () => {
    global.getQuery.mockReturnValue({})

    const result = await latestHandler(mockEvent)

    result.data.forEach(post => {
      expect(typeof post.views).toBe('number')
      expect(typeof post.likes).toBe('number')
      expect(post.views).toBeGreaterThanOrEqual(0)
      expect(post.likes).toBeGreaterThanOrEqual(0)
    })
  })

  it('should handle empty posts gracefully', async () => {
    // This test assumes the endpoint would handle an empty state
    // In the current implementation, there are always mock posts
    global.getQuery.mockReturnValue({ limit: '0' })

    const result = await latestHandler(mockEvent)

    expect(result.data).toEqual([])
    expect(result.total).toBeGreaterThanOrEqual(0)
  })
})