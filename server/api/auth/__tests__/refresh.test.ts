import { describe, it, expect, beforeEach, vi } from 'vitest'
import refreshHandler from '../refresh.post'
import { createMockEvent, setupGlobalMocks } from './test-utils'

// Mock dependencies
vi.mock('~/server/utils/auth', () => ({
  auth: {
    verifyRefreshToken: vi.fn(),
    generateAccessToken: vi.fn(),
    generateRefreshToken: vi.fn(),
    setAuthCookies: vi.fn()
  }
}))

vi.mock('~/server/utils/database', () => ({
  db: {
    users: {
      findById: vi.fn()
    },
    sessions: {
      findByToken: vi.fn(),
      create: vi.fn(),
      deleteByToken: vi.fn()
    }
  }
}))

import { auth } from '~/server/utils/auth'
import { db } from '~/server/utils/database'

// Use vi.mocked to get properly typed mocks
const mockAuth = vi.mocked(auth, true)
const mockDb = vi.mocked(db, true)

describe('POST /api/auth/refresh', () => {
  const mockEvent = createMockEvent()

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    role: 'user',
    isActive: true
  }

  beforeEach(() => {
    vi.clearAllMocks()
    setupGlobalMocks()
  })

  it('should successfully refresh tokens', async () => {
    global.getCookie.mockReturnValue('valid-refresh-token')
    mockAuth.verifyRefreshToken.mockReturnValue({
      userId: 'user-123',
      email: 'test@example.com'
    })
    mockDb.users.findById.mockReturnValue(mockUser)
    mockAuth.generateAccessToken.mockReturnValue('new-access-token')
    mockAuth.generateRefreshToken.mockReturnValue('new-refresh-token')

    const result = await refreshHandler(mockEvent)

    expect(getCookie).toHaveBeenCalledWith(mockEvent, 'refresh-token')
    expect(mockAuth.verifyRefreshToken).toHaveBeenCalledWith('valid-refresh-token')
    expect(mockDb.users.findById).toHaveBeenCalledWith('user-123')
    expect(mockAuth.generateAccessToken).toHaveBeenCalledWith(mockUser)
    expect(mockAuth.generateRefreshToken).toHaveBeenCalledWith(mockUser)
    expect(mockAuth.setAuthCookies).toHaveBeenCalledWith(
      mockEvent,
      'new-access-token',
      'new-refresh-token'
    )
    
    expect(result).toEqual({
      success: true,
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token'
    })
  })

  it('should throw 401 error when no refresh token provided', async () => {
    global.getCookie.mockReturnValue(null)

    await expect(refreshHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 401,
      message: 'Refresh token required'
    })
  })

  it('should throw 401 error for invalid refresh token', async () => {
    global.getCookie.mockReturnValue('invalid-token')
    mockAuth.verifyRefreshToken.mockReturnValue(null)

    await expect(refreshHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 401,
      message: 'Invalid refresh token'
    })
  })

  it('should throw 401 error when user not found', async () => {
    global.getCookie.mockReturnValue('valid-refresh-token')
    mockAuth.verifyRefreshToken.mockReturnValue({
      userId: 'user-123',
      email: 'test@example.com'
    })
    mockDb.users.findById.mockReturnValue(null)

    await expect(refreshHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 401,
      message: 'User not found'
    })
  })

  it('should throw 403 error for inactive user', async () => {
    const inactiveUser = { ...mockUser, isActive: false }
    
    global.getCookie.mockReturnValue('valid-refresh-token')
    mockAuth.verifyRefreshToken.mockReturnValue({
      userId: 'user-123',
      email: 'test@example.com'
    })
    mockDb.users.findById.mockReturnValue(inactiveUser)

    await expect(refreshHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 403,
      message: 'Account has been deactivated'
    })
  })

  it('should handle token verification errors', async () => {
    global.getCookie.mockReturnValue('malformed-token')
    mockAuth.verifyRefreshToken.mockImplementation(() => {
      throw new Error('Invalid token signature')
    })

    await expect(refreshHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 401,
      message: 'Invalid refresh token'
    })
  })

  it('should create new session in database', async () => {
    global.getCookie.mockReturnValue('valid-refresh-token')
    mockAuth.verifyRefreshToken.mockReturnValue({
      userId: 'user-123',
      email: 'test@example.com'
    })
    mockDb.users.findById.mockReturnValue(mockUser)
    mockAuth.generateAccessToken.mockReturnValue('new-access-token')
    mockAuth.generateRefreshToken.mockReturnValue('new-refresh-token')
    mockDb.sessions.create.mockReturnValue({ id: 'session-123' })

    await refreshHandler(mockEvent)

    expect(mockDb.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: mockUser.id,
        userEmail: mockUser.email
      })
    )
  })

  it('should delete old refresh token session', async () => {
    global.getCookie.mockReturnValue('old-refresh-token')
    mockAuth.verifyRefreshToken.mockReturnValue({
      userId: 'user-123',
      email: 'test@example.com'
    })
    mockDb.users.findById.mockReturnValue(mockUser)
    mockAuth.generateAccessToken.mockReturnValue('new-access-token')
    mockAuth.generateRefreshToken.mockReturnValue('new-refresh-token')

    await refreshHandler(mockEvent)

    expect(mockDb.sessions.deleteByToken).toHaveBeenCalledWith('old-refresh-token')
  })
})