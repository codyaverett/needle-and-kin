import { describe, it, expect, beforeEach, vi } from 'vitest'
import logoutHandler from '../logout.post'
import { createMockEvent, setupGlobalMocks } from './test-utils'

// Mock dependencies
vi.mock('~/server/utils/auth', () => ({
  auth: {
    clearAuthCookies: vi.fn(),
    getCurrentUser: vi.fn()
  }
}))

vi.mock('~/server/utils/database', () => ({
  db: {
    sessions: {
      deleteByToken: vi.fn(),
      deleteAllForUser: vi.fn(),
      findByToken: vi.fn()
    }
  }
}))

import { auth } from '~/server/utils/auth'
import { db } from '~/server/utils/database'

// Use vi.mocked to get properly typed mocks
const mockAuth = vi.mocked(auth, true)
const mockDb = vi.mocked(db, true)

describe('POST /api/auth/logout', () => {
  const mockEvent = createMockEvent()

  beforeEach(() => {
    vi.clearAllMocks()
    setupGlobalMocks()
  })

  it('should successfully logout with refresh token', async () => {
    global.getCookie.mockReturnValue('refresh-token-123')
    global.readBody.mockResolvedValue({})
    mockDb.sessions.deleteByToken.mockReturnValue(true)

    const result = await logoutHandler(mockEvent)

    expect(getCookie).toHaveBeenCalledWith(mockEvent, 'refresh-token')
    expect(mockDb.sessions.deleteByToken).toHaveBeenCalledWith('refresh-token-123')
    expect(mockAuth.clearAuthCookies).toHaveBeenCalledWith(mockEvent)
    
    expect(result).toEqual({
      success: true,
      message: 'Logged out successfully'
    })
  })

  it('should successfully logout even without refresh token', async () => {
    global.getCookie.mockReturnValue(null)
    global.readBody.mockResolvedValue({})

    const result = await logoutHandler(mockEvent)

    expect(mockDb.sessions.deleteByToken).not.toHaveBeenCalled()
    expect(mockAuth.clearAuthCookies).toHaveBeenCalledWith(mockEvent)
    
    expect(result).toEqual({
      success: true,
      message: 'Logged out successfully'
    })
  })

  it('should handle logout from all devices', async () => {
    global.getCookie.mockReturnValue('refresh-token-123')
    global.readBody.mockResolvedValue({ allDevices: true })
    
    // Mock session to get userId
    const mockSession = {
      id: 'session-123',
      userId: 'user-123',
      refreshToken: 'refresh-token-123'
    }
    
    // Add findByToken mock to get session data
    mockDb.sessions.findByToken = vi.fn().mockReturnValue(mockSession)
    mockDb.sessions.deleteAllForUser.mockReturnValue(3) // deleted 3 sessions

    const result = await logoutHandler(mockEvent)

    expect(mockDb.sessions.findByToken).toHaveBeenCalledWith('refresh-token-123')
    expect(mockDb.sessions.deleteAllForUser).toHaveBeenCalledWith('user-123')
    expect(mockAuth.clearAuthCookies).toHaveBeenCalledWith(mockEvent)
    
    expect(result).toEqual({
      success: true,
      message: 'Logged out from all devices successfully'
    })
  })

  it('should handle database errors gracefully', async () => {
    global.getCookie.mockReturnValue('refresh-token-123')
    global.readBody.mockResolvedValue({})
    mockDb.sessions.deleteByToken.mockImplementation(() => {
      throw new Error('Database error')
    })

    // Should still clear cookies and return success
    const result = await logoutHandler(mockEvent)

    expect(mockAuth.clearAuthCookies).toHaveBeenCalledWith(mockEvent)
    expect(result.success).toBe(true)
  })

  it('should handle missing session gracefully', async () => {
    global.getCookie.mockReturnValue('non-existent-token')
    global.readBody.mockResolvedValue({})
    mockDb.sessions.deleteByToken.mockReturnValue(false) // Session not found

    const result = await logoutHandler(mockEvent)

    expect(mockDb.sessions.deleteByToken).toHaveBeenCalledWith('non-existent-token')
    expect(mockAuth.clearAuthCookies).toHaveBeenCalledWith(mockEvent)
    
    expect(result).toEqual({
      success: true,
      message: 'Logged out successfully'
    })
  })

  it('should clear cookies even if session deletion fails', async () => {
    global.getCookie.mockReturnValue('refresh-token-123')
    global.readBody.mockResolvedValue({})
    mockDb.sessions.deleteByToken.mockImplementation(() => {
      throw new Error('Failed to delete session')
    })

    const result = await logoutHandler(mockEvent)

    expect(mockAuth.clearAuthCookies).toHaveBeenCalledWith(mockEvent)
    expect(result.success).toBe(true)
  })
})