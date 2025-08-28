import { describe, it, expect, beforeEach, vi } from 'vitest'
import statsHandler from '../stats.get'

// Mock dependencies
vi.mock('~/server/utils/auth', () => ({
  auth: {
    requireRole: vi.fn()
  }
}))

vi.mock('~/server/utils/database', () => ({
  db: {
    users: {
      list: vi.fn()
    }
  }
}))

import { auth } from '~/server/utils/auth'
import { db } from '~/server/utils/database'

describe('GET /api/admin/stats', () => {
  const mockEvent = {
    node: {
      req: {
        url: '/api/admin/stats',
        method: 'GET'
      }
    },
    context: {}
  }

  const mockUsers = [
    {
      id: 'user-1',
      email: 'user1@example.com',
      firstName: 'User',
      lastName: 'One',
      role: 'user',
      avatar: 'avatar1.jpg',
      joinedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'user-2',
      email: 'user2@example.com',
      firstName: 'User',
      lastName: 'Two',
      role: 'author',
      avatar: 'avatar2.jpg',
      joinedAt: '2024-01-20T10:00:00Z'
    },
    {
      id: 'user-3',
      email: 'user3@example.com',
      firstName: 'User',
      lastName: 'Three',
      role: 'admin',
      avatar: 'avatar3.jpg',
      joinedAt: '2024-01-25T10:00:00Z'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock requireRole to return a function that returns a promise
    auth.requireRole.mockReturnValue(vi.fn().mockResolvedValue(true))
  })

  it('should require admin role', async () => {
    db.users.list.mockReturnValue(mockUsers)
    
    await statsHandler(mockEvent)
    
    expect(auth.requireRole).toHaveBeenCalledWith('admin')
  })

  it('should return stats summary', async () => {
    db.users.list.mockReturnValue(mockUsers)
    
    const result = await statsHandler(mockEvent)
    
    expect(result.stats).toBeDefined()
    expect(result.stats.totalUsers).toBe(3)
    expect(result.stats.totalPosts).toBe(5) // Based on hardcoded posts
    expect(result.stats.totalViews).toBeGreaterThan(0)
    expect(result.stats.totalComments).toBe(42) // Mocked value
  })

  it('should return recent posts', async () => {
    db.users.list.mockReturnValue(mockUsers)
    
    const result = await statsHandler(mockEvent)
    
    expect(result.recentPosts).toBeDefined()
    expect(Array.isArray(result.recentPosts)).toBe(true)
    expect(result.recentPosts.length).toBe(5)
    
    // Check posts are sorted by date (most recent first)
    for (let i = 1; i < result.recentPosts.length; i++) {
      const prevDate = new Date(result.recentPosts[i - 1].publishedAt)
      const currDate = new Date(result.recentPosts[i].publishedAt)
      expect(prevDate >= currDate).toBe(true)
    }
  })

  it('should return recent users', async () => {
    db.users.list.mockReturnValue(mockUsers)
    
    const result = await statsHandler(mockEvent)
    
    expect(result.recentUsers).toBeDefined()
    expect(Array.isArray(result.recentUsers)).toBe(true)
    expect(result.recentUsers.length).toBeLessThanOrEqual(5)
    
    // Check users are sorted by join date (most recent first)
    for (let i = 1; i < result.recentUsers.length; i++) {
      const prevDate = new Date(result.recentUsers[i - 1].joinedAt)
      const currDate = new Date(result.recentUsers[i].joinedAt)
      expect(prevDate >= currDate).toBe(true)
    }
  })

  it('should include correct user fields in recent users', async () => {
    db.users.list.mockReturnValue(mockUsers)
    
    const result = await statsHandler(mockEvent)
    
    const firstUser = result.recentUsers[0]
    expect(firstUser).toHaveProperty('id')
    expect(firstUser).toHaveProperty('email')
    expect(firstUser).toHaveProperty('firstName')
    expect(firstUser).toHaveProperty('lastName')
    expect(firstUser).toHaveProperty('avatar')
    expect(firstUser).toHaveProperty('role')
    expect(firstUser).toHaveProperty('joinedAt')
    
    // Should not include sensitive data
    expect(firstUser).not.toHaveProperty('password')
  })

  it('should include post metadata in recent posts', async () => {
    db.users.list.mockReturnValue(mockUsers)
    
    const result = await statsHandler(mockEvent)
    
    const firstPost = result.recentPosts[0]
    expect(firstPost).toHaveProperty('id')
    expect(firstPost).toHaveProperty('slug')
    expect(firstPost).toHaveProperty('title')
    expect(firstPost).toHaveProperty('publishedAt')
    expect(firstPost).toHaveProperty('author')
    expect(firstPost).toHaveProperty('views')
  })

  it('should calculate total views correctly', async () => {
    db.users.list.mockReturnValue(mockUsers)
    
    const result = await statsHandler(mockEvent)
    
    // Calculate expected total from hardcoded posts
    const expectedTotal = 1234 + 892 + 1567 + 2134 + 945
    expect(result.stats.totalViews).toBe(expectedTotal)
  })

  it('should handle empty users list', async () => {
    db.users.list.mockReturnValue([])
    
    const result = await statsHandler(mockEvent)
    
    expect(result.stats.totalUsers).toBe(0)
    expect(result.recentUsers).toEqual([])
    // Posts are hardcoded so should still exist
    expect(result.stats.totalPosts).toBe(5)
    expect(result.recentPosts.length).toBe(5)
  })

  it('should limit recent users to 5', async () => {
    const manyUsers = Array.from({ length: 10 }, (_, i) => ({
      id: `user-${i}`,
      email: `user${i}@example.com`,
      firstName: `User`,
      lastName: `${i}`,
      role: 'user',
      avatar: null,
      joinedAt: new Date(Date.now() - i * 86400000).toISOString()
    }))
    
    db.users.list.mockReturnValue(manyUsers)
    
    const result = await statsHandler(mockEvent)
    
    expect(result.recentUsers.length).toBe(5)
  })

  it('should throw error if not admin', async () => {
    const requireRoleFn = vi.fn().mockRejectedValue(
      Object.assign(new Error('Insufficient permissions'), {
        statusCode: 403
      })
    )
    auth.requireRole.mockReturnValue(requireRoleFn)
    
    await expect(statsHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 403,
      message: 'Insufficient permissions'
    })
  })
})