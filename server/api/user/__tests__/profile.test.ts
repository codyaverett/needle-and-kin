import { describe, it, expect, beforeEach, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import profileGetHandler from '../profile.get'
import profilePutHandler from '../profile.put'

// Mock JWT
vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn(),
    sign: vi.fn()
  }
}))

describe('User Profile Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset global mocks
    vi.mocked(global.getCookie).mockReturnValue(null)
    vi.mocked(global.getHeader).mockReturnValue(null)
    vi.mocked(global.readBody).mockResolvedValue({})
  })

  describe('GET /api/user/profile', () => {
    it('should return user profile for authenticated user', async () => {
      const mockToken = 'valid-token'
      const mockDecoded = {
        id: '1',
        email: 'admin@needleandkin.com',
        role: 'admin',
        username: 'admin'
      }
      
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue(mockToken)
      
      const event = {} as any

      const result = await profileGetHandler(event)
      
      expect(result.success).toBe(true)
      expect(result.user).toBeDefined()
      expect(result.user.email).toBe('admin@needleandkin.com')
      expect(result.user.password).toBeUndefined()
    })

    it('should return 401 without authentication token', async () => {
      const event = {} as any

      await expect(profileGetHandler(event)).rejects.toThrow('Authentication required')
    })

    it('should return 401 with invalid token', async () => {
      vi.mocked(global.getCookie).mockReturnValue('invalid-token')
      vi.mocked(jwt.verify).mockImplementation(() => {
        const error = new Error('Invalid token')
        error.name = 'JsonWebTokenError'
        throw error
      })
      
      const event = {} as any

      await expect(profileGetHandler(event)).rejects.toThrow('Invalid or expired token')
    })

    it('should handle authorization header', async () => {
      const mockDecoded = {
        id: '2',
        email: 'jane.doe@example.com',
        role: 'user',
        username: 'janedoe'
      }
      
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getHeader).mockReturnValue('Bearer valid-token')
      
      const event = {} as any

      const result = await profileGetHandler(event)
      
      expect(result.success).toBe(true)
      expect(result.user.email).toBe('jane.doe@example.com')
    })
  })

  describe('PUT /api/user/profile', () => {
    it('should update user profile successfully', async () => {
      const mockDecoded = {
        id: '1',
        email: 'admin@needleandkin.com',
        role: 'admin',
        username: 'admin'
      }
      
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      vi.mocked(global.readBody).mockResolvedValue({
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Updated bio'
      })
      
      const event = {} as any

      const result = await profilePutHandler(event)
      
      expect(result.success).toBe(true)
      expect(result.message).toBe('Profile updated successfully')
      expect(result.user.firstName).toBe('John')
      expect(result.user.lastName).toBe('Doe')
    })

    it('should validate username length', async () => {
      const mockDecoded = {
        id: '1',
        email: 'admin@needleandkin.com',
        role: 'admin'
      }
      
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      vi.mocked(global.readBody).mockResolvedValue({
        username: 'ab' // Too short
      })
      
      const event = {} as any

      await expect(profilePutHandler(event)).rejects.toThrow('Username must be between 3 and 20 characters')
    })

    it('should validate bio length', async () => {
      const mockDecoded = {
        id: '1',
        email: 'admin@needleandkin.com',
        role: 'admin'
      }
      
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      vi.mocked(global.readBody).mockResolvedValue({
        bio: 'a'.repeat(501) // Too long
      })
      
      const event = {} as any

      await expect(profilePutHandler(event)).rejects.toThrow('Bio must be 500 characters or less')
    })

    it('should sanitize input data', async () => {
      const mockDecoded = {
        id: '1',
        email: 'admin@needleandkin.com',
        role: 'admin'
      }
      
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      vi.mocked(global.readBody).mockResolvedValue({
        firstName: '  John  ',
        lastName: '  Doe  ',
        username: '  JohnDoe  ',
        bio: '  My bio  '
      })
      
      const event = {} as any

      const result = await profilePutHandler(event)
      
      expect(result.user.firstName).toBe('John')
      expect(result.user.lastName).toBe('Doe')
      expect(result.user.username).toBe('johndoe')
      expect(result.user.bio).toBe('My bio')
    })

    it('should handle partial updates', async () => {
      const mockDecoded = {
        id: '1',
        email: 'admin@needleandkin.com',
        role: 'admin',
        username: 'admin'
      }
      
      vi.mocked(jwt.verify).mockReturnValue(mockDecoded as any)
      vi.mocked(global.getCookie).mockReturnValue('valid-token')
      vi.mocked(global.readBody).mockResolvedValue({
        bio: 'Only updating bio'
      })
      
      const event = {} as any

      const result = await profilePutHandler(event)
      
      expect(result.success).toBe(true)
      expect(result.user.bio).toBe('Only updating bio')
      expect(result.user.username).toBe('admin') // Should keep existing username
    })
  })
})