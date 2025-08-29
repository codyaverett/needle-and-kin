import { describe, it, expect, beforeEach, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import commentsGetHandler from '../[id]/comments.get'
import commentsPostHandler from '../[id]/comments.post'
import viewsHandler from '../[id]/views.post'
import likesHandler from '../[id]/likes.post'
import relatedHandler from '../[id]/related.get'
import searchHandler from '../search.get'

// Mock JWT
vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn(),
    sign: vi.fn()
  }
}))

describe('Blog Interaction Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(global.getCookie).mockReturnValue(null)
    vi.mocked(global.getHeader).mockReturnValue(null)
    vi.mocked(global.readBody).mockResolvedValue({})
    vi.mocked(global.getRouterParam).mockReturnValue('1')
    vi.mocked(global.getQuery).mockReturnValue({})
  })

  describe('GET /api/posts/[id]/comments', () => {
    it('should return comments for a post', async () => {
      vi.mocked(global.getRouterParam).mockReturnValue('1')
      
      const event = {} as any
      const result = await commentsGetHandler(event)
      
      expect(result.success).toBe(true)
      expect(result.postId).toBe('1')
      expect(result.comments).toBeDefined()
      expect(Array.isArray(result.comments)).toBe(true)
      expect(result.totalComments).toBeGreaterThanOrEqual(0)
    })

    it('should return 400 without post ID', async () => {
      vi.mocked(global.getRouterParam).mockReturnValue(undefined)
      
      const event = {} as any
      await expect(commentsGetHandler(event)).rejects.toThrow('Post ID is required')
    })

    it('should sort comments by newest by default', async () => {
      const event = {} as any
      const result = await commentsGetHandler(event)
      
      expect(result.comments.length).toBeGreaterThan(0)
      if (result.comments.length > 1) {
        const firstDate = new Date(result.comments[0].createdAt)
        const lastDate = new Date(result.comments[result.comments.length - 1].createdAt)
        expect(firstDate.getTime()).toBeGreaterThanOrEqual(lastDate.getTime())
      }
    })

    it('should include user authentication status in comments', async () => {
      const mockDecoded = { id: '1', email: 'test@example.com' }
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      
      const event = {} as any
      const result = await commentsGetHandler(event)
      
      expect(result.comments.some(c => c.isAuthor !== undefined)).toBe(true)
    })
  })

  describe('POST /api/posts/[id]/comments', () => {
    it('should create a new comment with authentication', async () => {
      const mockDecoded = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser'
      }
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      vi.mocked(global.readBody).mockResolvedValue({
        content: 'This is a test comment'
      })
      
      const event = {} as any
      const result = await commentsPostHandler(event)
      
      expect(result.success).toBe(true)
      expect(result.message).toBe('Comment posted successfully')
      expect(result.comment).toBeDefined()
      expect(result.comment.content).toBe('This is a test comment')
      expect(result.comment.userId).toBe('1')
    })

    it('should require authentication', async () => {
      const event = {} as any
      await expect(commentsPostHandler(event)).rejects.toThrow('Authentication required to post comments')
    })

    it('should validate comment content', async () => {
      const mockDecoded = { id: '1', email: 'test@example.com' }
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      vi.mocked(global.readBody).mockResolvedValue({
        content: ''
      })
      
      const event = {} as any
      await expect(commentsPostHandler(event)).rejects.toThrow('Comment content is required')
    })

    it('should limit comment length', async () => {
      const mockDecoded = { id: '1', email: 'test@example.com' }
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      vi.mocked(global.readBody).mockResolvedValue({
        content: 'a'.repeat(2001)
      })
      
      const event = {} as any
      await expect(commentsPostHandler(event)).rejects.toThrow('Comment must be 2000 characters or less')
    })
  })

  describe('POST /api/posts/[id]/views', () => {
    it('should track view for anonymous user', async () => {
      vi.mocked(global.getHeader).mockImplementation((_, header) => {
        if (header === 'x-forwarded-for') return '192.168.1.1'
        return null
      })
      
      const event = { node: { req: { socket: { remoteAddress: '192.168.1.1' } } } } as any
      const result = await viewsHandler(event)
      
      expect(result.success).toBe(true)
      expect(result.message).toBe('View recorded')
      expect(result.viewCount).toBeGreaterThan(0)
      expect(result.isNewView).toBe(true)
    })

    it('should track view for authenticated user', async () => {
      const mockDecoded = { id: '1', email: 'test@example.com' }
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      
      const event = { node: { req: { socket: { remoteAddress: '192.168.1.1' } } } } as any
      const result = await viewsHandler(event)
      
      expect(result.success).toBe(true)
      expect(result.viewerId).toBe('authenticated')
    })

    it('should not count duplicate views', async () => {
      // Use a unique IP for this test to avoid conflicts with other tests
      const testIp = '192.168.99.99'
      const event = { node: { req: { socket: { remoteAddress: testIp } } } } as any
      
      // First view
      const result1 = await viewsHandler(event)
      expect(result1.isNewView).toBe(true)
      const initialCount = result1.viewCount
      
      // Second view from same IP - should not increase count
      const result2 = await viewsHandler(event)
      expect(result2.isNewView).toBe(false)
      expect(result2.viewCount).toBe(initialCount)
    })
  })

  describe('POST /api/posts/[id]/likes', () => {
    it('should toggle like status', async () => {
      const mockDecoded = { id: '1', email: 'test@example.com' }
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      
      const event = {} as any
      
      // First like
      const result1 = await likesHandler(event)
      expect(result1.success).toBe(true)
      expect(result1.action).toBe('liked')
      expect(result1.isLiked).toBe(true)
      
      // Unlike
      const result2 = await likesHandler(event)
      expect(result2.success).toBe(true)
      expect(result2.action).toBe('unliked')
      expect(result2.isLiked).toBe(false)
    })

    it('should require authentication', async () => {
      const event = {} as any
      await expect(likesHandler(event)).rejects.toThrow('Authentication required to like posts')
    })

    it('should track like count', async () => {
      const mockDecoded = { id: '2', email: 'user2@example.com' }
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      
      const event = {} as any
      const result = await likesHandler(event)
      
      expect(result.likeCount).toBeDefined()
      expect(result.likeCount).toBeGreaterThanOrEqual(0)
    })
  })

  describe('GET /api/posts/[id]/related', () => {
    it('should return related posts', async () => {
      const event = {} as any
      const result = await relatedHandler(event)
      
      expect(result.success).toBe(true)
      expect(result.relatedPosts).toBeDefined()
      expect(Array.isArray(result.relatedPosts)).toBe(true)
      expect(result.totalRelated).toBe(result.relatedPosts.length)
    })

    it('should respect limit parameter', async () => {
      vi.mocked(global.getQuery).mockReturnValue({ limit: '2' })
      
      const event = {} as any
      const result = await relatedHandler(event)
      
      expect(result.relatedPosts.length).toBeLessThanOrEqual(2)
    })

    it('should exclude current post by default', async () => {
      vi.mocked(global.getRouterParam).mockReturnValue('1')
      
      const event = {} as any
      const result = await relatedHandler(event)
      
      const hasCurrentPost = result.relatedPosts.some(post => post.id === 1)
      expect(hasCurrentPost).toBe(false)
    })
  })

  describe('GET /api/posts/search', () => {
    it('should search posts by query', async () => {
      vi.mocked(global.getQuery).mockReturnValue({ q: 'knitting' })
      
      const event = {} as any
      const result = await searchHandler(event)
      
      expect(result.success).toBe(true)
      expect(result.query).toBe('knitting')
      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
    })

    it('should require minimum query length', async () => {
      vi.mocked(global.getQuery).mockReturnValue({ q: 'a' })
      
      const event = {} as any
      await expect(searchHandler(event)).rejects.toThrow('Search query must be at least 2 characters')
    })

    it('should support filtering by category', async () => {
      vi.mocked(global.getQuery).mockReturnValue({ 
        q: 'craft',
        category: 'knitting'
      })
      
      const event = {} as any
      const result = await searchHandler(event)
      
      result.results.forEach(post => {
        expect(post.category).toBe('knitting')
      })
    })

    it('should include pagination info', async () => {
      vi.mocked(global.getQuery).mockReturnValue({ 
        q: 'craft',
        limit: '5',
        offset: '0'
      })
      
      const event = {} as any
      const result = await searchHandler(event)
      
      expect(result.pagination).toBeDefined()
      expect(result.pagination.limit).toBe(5)
      expect(result.pagination.offset).toBe(0)
      expect(result.pagination.totalPages).toBeGreaterThanOrEqual(1)
    })

    it('should provide search suggestions', async () => {
      vi.mocked(global.getQuery).mockReturnValue({ q: 'knitting' })
      
      const event = {} as any
      const result = await searchHandler(event)
      
      expect(result.suggestions).toBeDefined()
      expect(Array.isArray(result.suggestions)).toBe(true)
    })
  })
})