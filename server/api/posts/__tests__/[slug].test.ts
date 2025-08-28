import { describe, it, expect, beforeEach, vi } from 'vitest'
import postHandler from '../[slug]'

describe('GET /api/posts/[slug]', () => {
  const mockEvent = {
    node: {
      req: {
        url: '/api/posts/getting-started-with-knitting',
        method: 'GET'
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    global.getRouterParam = vi.fn()
    global.createError = vi.fn((error) => {
      const err = new Error(error.statusMessage)
      err.statusCode = error.statusCode
      return err
    })
  })

  it('should return post data for valid slug', async () => {
    global.getRouterParam.mockReturnValue('getting-started-with-knitting')

    const result = await postHandler(mockEvent)

    expect(getRouterParam).toHaveBeenCalledWith(mockEvent, 'slug')
    expect(result).toBeDefined()
    expect(result.id).toBe(1)
    expect(result.slug).toBe('getting-started-with-knitting')
    expect(result.title).toBe('Getting Started with Knitting: A Beginner\'s Guide')
    expect(result.content).toContain('<h2>Welcome to the World of Knitting!</h2>')
  })

  it('should include full post metadata', async () => {
    global.getRouterParam.mockReturnValue('getting-started-with-knitting')

    const result = await postHandler(mockEvent)

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('slug')
    expect(result).toHaveProperty('title')
    expect(result).toHaveProperty('excerpt')
    expect(result).toHaveProperty('content')
    expect(result).toHaveProperty('image')
    expect(result).toHaveProperty('author')
    expect(result).toHaveProperty('category')
    expect(result).toHaveProperty('tags')
    expect(result).toHaveProperty('difficulty')
    expect(result).toHaveProperty('readTime')
    expect(result).toHaveProperty('publishedAt')
    expect(result).toHaveProperty('views')
    expect(result).toHaveProperty('likes')
  })

  it('should include author information', async () => {
    global.getRouterParam.mockReturnValue('getting-started-with-knitting')

    const result = await postHandler(mockEvent)

    expect(result.author).toBeDefined()
    expect(result.author.id).toBe(1)
    expect(result.author.name).toBe('Sarah Mitchell')
    expect(result.author.avatar).toBeDefined()
    expect(result.author.bio).toBe('Knitting enthusiast with 15 years of experience')
  })

  it('should include related posts', async () => {
    global.getRouterParam.mockReturnValue('getting-started-with-knitting')

    const result = await postHandler(mockEvent)

    expect(result.relatedPosts).toBeDefined()
    expect(Array.isArray(result.relatedPosts)).toBe(true)
    expect(result.relatedPosts.length).toBeGreaterThan(0)
    
    // Should not include the current post
    expect(result.relatedPosts.every(p => p.id !== result.id)).toBe(true)
    
    // Should be from same category
    expect(result.relatedPosts.every(p => p.category === result.category || p.category === undefined)).toBe(true)
  })

  it('should limit related posts to 3', async () => {
    global.getRouterParam.mockReturnValue('getting-started-with-knitting')

    const result = await postHandler(mockEvent)

    expect(result.relatedPosts.length).toBeLessThanOrEqual(3)
  })

  it('should include minimal data for related posts', async () => {
    global.getRouterParam.mockReturnValue('getting-started-with-knitting')

    const result = await postHandler(mockEvent)

    if (result.relatedPosts.length > 0) {
      const relatedPost = result.relatedPosts[0]
      expect(relatedPost).toHaveProperty('id')
      expect(relatedPost).toHaveProperty('slug')
      expect(relatedPost).toHaveProperty('title')
      expect(relatedPost).toHaveProperty('excerpt')
      expect(relatedPost).toHaveProperty('image')
      expect(relatedPost).toHaveProperty('author')
      expect(relatedPost).toHaveProperty('readTime')
      expect(relatedPost).toHaveProperty('publishedAt')
      
      // Should not include full content
      expect(relatedPost.content).toBeUndefined()
    }
  })

  it('should throw 404 error for non-existent slug', async () => {
    global.getRouterParam.mockReturnValue('non-existent-post')

    await expect(postHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 404,
      message: 'Post not found: non-existent-post'
    })
  })

  it('should handle different post categories correctly', async () => {
    // Test crochet post
    global.getRouterParam.mockReturnValue('crochet-granny-squares')

    const result = await postHandler(mockEvent)

    expect(result.category).toBe('crochet')
    expect(result.author.name).toBe('Emily Chen')
  })

  it('should handle posts with different difficulty levels', async () => {
    // Test advanced post
    global.getRouterParam.mockReturnValue('advanced-cable-patterns')

    const result = await postHandler(mockEvent)

    expect(result.difficulty).toBe('advanced')
    expect(result.title).toContain('Advanced Cable')
  })

  it('should handle posts without all optional fields', async () => {
    global.getRouterParam.mockReturnValue('advanced-cable-patterns')

    const result = await postHandler(mockEvent)

    // This post doesn't have featured field, should handle gracefully
    expect(result.featured).toBeUndefined()
  })

  it('should handle empty slug gracefully', async () => {
    global.getRouterParam.mockReturnValue('')

    await expect(postHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 404,
      message: 'Post not found: '
    })
  })

  it('should handle null slug', async () => {
    global.getRouterParam.mockReturnValue(null)

    await expect(postHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 404
    })
  })

  it('should return posts with different read times', async () => {
    global.getRouterParam.mockReturnValue('quilting-basics')

    const result = await postHandler(mockEvent)

    expect(result.readTime).toBe(15) // Longest read time
    expect(typeof result.readTime).toBe('number')
  })

  it('should include view and like counts', async () => {
    global.getRouterParam.mockReturnValue('getting-started-with-knitting')

    const result = await postHandler(mockEvent)

    expect(typeof result.views).toBe('number')
    expect(typeof result.likes).toBe('number')
    expect(result.views).toBeGreaterThan(0)
    expect(result.likes).toBeGreaterThan(0)
  })
})