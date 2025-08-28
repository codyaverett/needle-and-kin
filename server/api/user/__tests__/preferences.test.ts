import { describe, it, expect, beforeEach, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import preferencesGetHandler from '../preferences.get'
import preferencesPutHandler from '../preferences.put'

// Mock JWT
vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn()
  }
}))

describe('User Preferences Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset global mocks
    vi.mocked(global.getCookie).mockReturnValue(null)
    vi.mocked(global.getHeader).mockReturnValue(null)
    vi.mocked(global.readBody).mockResolvedValue({})
  })

  describe('GET /api/user/preferences', () => {
    it('should return user preferences for authenticated user', async () => {
      const mockDecoded = {
        id: '1',
        email: 'admin@needleandkin.com',
        role: 'admin'
      }
      
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      
      const event = {} as any

      const result = await preferencesGetHandler(event)
      
      expect(result.success).toBe(true)
      expect(result.preferences).toBeDefined()
      expect(result.preferences.newsletter).toBeDefined()
      expect(result.preferences.emailNotifications).toBeDefined()
      expect(Array.isArray(result.preferences.favoriteCategories)).toBe(true)
    })

    it('should return default preferences for new user', async () => {
      const mockDecoded = {
        id: 'new-user',
        email: 'new@example.com',
        role: 'user'
      }
      
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      
      const event = {} as any

      const result = await preferencesGetHandler(event)
      
      expect(result.success).toBe(true)
      expect(result.preferences.newsletter).toBe(false)
      expect(result.preferences.emailNotifications).toBe(true)
      expect(result.preferences.favoriteCategories).toEqual([])
    })

    it('should return 401 without authentication', async () => {
      const event = {} as any

      await expect(preferencesGetHandler(event)).rejects.toThrow('Authentication required')
    })
  })

  describe('PUT /api/user/preferences', () => {
    it('should update preferences successfully', async () => {
      const mockDecoded = {
        id: '1',
        email: 'admin@needleandkin.com',
        role: 'admin'
      }
      
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      vi.mocked(global.readBody).mockResolvedValue({
        newsletter: true,
        emailNotifications: false,
        favoriteCategories: ['knitting', 'crochet']
      })
      
      const event = {} as any

      const result = await preferencesPutHandler(event)
      
      expect(result.success).toBe(true)
      expect(result.message).toBe('Preferences updated successfully')
      expect(result.preferences.newsletter).toBe(true)
      expect(result.preferences.emailNotifications).toBe(false)
      expect(result.preferences.favoriteCategories).toEqual(['knitting', 'crochet'])
    })

    it('should validate favorite categories', async () => {
      const mockDecoded = {
        id: '1',
        email: 'admin@needleandkin.com',
        role: 'admin'
      }
      
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      vi.mocked(global.readBody).mockResolvedValue({
        favoriteCategories: ['knitting', 'invalid-category']
      })
      
      const event = {} as any

      await expect(preferencesPutHandler(event)).rejects.toThrow('Invalid categories: invalid-category')
    })

    it('should handle partial updates', async () => {
      const mockDecoded = {
        id: '1',
        email: 'admin@needleandkin.com',
        role: 'admin'
      }
      
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      vi.mocked(global.readBody).mockResolvedValue({
        newsletter: false
      })
      
      const event = {} as any

      const result = await preferencesPutHandler(event)
      
      expect(result.success).toBe(true)
      expect(result.preferences.newsletter).toBe(false)
      expect(result.preferences.emailNotifications).toBe(true) // Default value
      expect(result.preferences.favoriteCategories).toEqual([]) // Default value
    })

    it('should handle empty favorite categories', async () => {
      const mockDecoded = {
        id: '1',
        email: 'admin@needleandkin.com',
        role: 'admin'
      }
      
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      vi.mocked(global.readBody).mockResolvedValue({
        favoriteCategories: []
      })
      
      const event = {} as any

      const result = await preferencesPutHandler(event)
      
      expect(result.success).toBe(true)
      expect(result.preferences.favoriteCategories).toEqual([])
    })
  })
})