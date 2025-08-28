import { describe, it, expect, beforeEach, vi } from 'vitest'
import postsHandler from '../index.get'

describe('GET /api/posts - Simple Tests', () => {
  beforeEach(() => {
    global.getQuery = vi.fn().mockReturnValue({})
  })

  it('should return posts list', async () => {
    const result = await postsHandler({})
    
    expect(result).toBeDefined()
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
  })

  it('should include pagination info', async () => {
    const result = await postsHandler({})
    
    expect(result).toHaveProperty('total')
    expect(result).toHaveProperty('page')
    expect(result).toHaveProperty('limit')
    expect(result).toHaveProperty('totalPages')
  })

  it('should filter by category', async () => {
    global.getQuery.mockReturnValue({ category: 'knitting' })
    
    const result = await postsHandler({})
    
    const knittingPosts = result.data.filter(p => p.category === 'knitting')
    expect(knittingPosts.length).toBe(result.data.length)
  })
})