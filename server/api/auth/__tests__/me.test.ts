import { describe, it, expect, beforeEach, vi } from 'vitest'
import meHandler from '../me.get'
import { createMockEvent, setupGlobalMocks } from './test-utils'

// Mock dependencies
vi.mock('~/server/utils/auth', () => ({
  auth: {
    getCurrentUser: vi.fn()
  }
}))

import { auth } from '~/server/utils/auth'

// Use vi.mocked to get properly typed mocks
const mockAuth = vi.mocked(auth, true)

describe('GET /api/auth/me', () => {
  const mockEvent = createMockEvent()

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
    avatar: 'https://example.com/avatar.jpg',
    bio: 'Test bio',
    isActive: true,
    emailVerified: true,
    joinedAt: '2024-01-01T00:00:00Z'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    setupGlobalMocks()
  })

  it('should return current user data when authenticated', async () => {
    mockAuth.getCurrentUser.mockResolvedValue(mockUser)

    const result = await meHandler(mockEvent)

    expect(mockAuth.getCurrentUser).toHaveBeenCalledWith(mockEvent)
    expect(result).toEqual(mockUser)
  })

  it('should throw 401 error when not authenticated', async () => {
    mockAuth.getCurrentUser.mockResolvedValue(null)

    await expect(meHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 401,
      message: 'Not authenticated'
    })
  })

  it('should throw 401 error when user is undefined', async () => {
    mockAuth.getCurrentUser.mockResolvedValue(undefined)

    await expect(meHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 401,
      message: 'Not authenticated'
    })
  })

  it('should handle different user roles', async () => {
    const adminUser = { ...mockUser, role: 'admin' }
    mockAuth.getCurrentUser.mockResolvedValue(adminUser)

    const result = await meHandler(mockEvent)

    expect(result.role).toBe('admin')
    expect(result.id).toBe(adminUser.id)
  })

  it('should handle user with minimal data', async () => {
    const minimalUser = {
      id: 'user-minimal',
      email: 'minimal@example.com',
      username: 'minimal',
      role: 'user'
    }
    
    mockAuth.getCurrentUser.mockResolvedValue(minimalUser)

    const result = await meHandler(mockEvent)

    expect(result).toEqual(minimalUser)
    expect(result.avatar).toBeUndefined()
    expect(result.bio).toBeUndefined()
  })

  it('should handle auth service errors', async () => {
    mockAuth.getCurrentUser.mockRejectedValue(new Error('Token verification failed'))

    await expect(meHandler(mockEvent)).rejects.toThrow('Token verification failed')
  })

  it('should not include sensitive data in response', async () => {
    // Mock user data that might include sensitive fields
    const userWithSensitiveData = {
      ...mockUser,
      password: 'hashed-password', // This should not be included
      sessionToken: 'secret-token'
    }
    
    mockAuth.getCurrentUser.mockResolvedValue(userWithSensitiveData)

    const result = await meHandler(mockEvent)

    // auth.getCurrentUser should already sanitize, but let's verify
    expect(result.password).toBeUndefined()
    expect(result.sessionToken).toBeUndefined()
  })

  it('should handle inactive user appropriately', async () => {
    // getCurrentUser should already handle this, but test the flow
    mockAuth.getCurrentUser.mockResolvedValue(null) // Inactive users return null

    await expect(meHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 401,
      message: 'Not authenticated'
    })
  })
})