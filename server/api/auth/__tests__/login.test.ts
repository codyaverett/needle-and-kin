import { describe, it, expect, beforeEach, vi } from 'vitest'
import loginHandler from '../login.post'
import { createMockEvent, setupGlobalMocks } from './test-utils'

// Mock dependencies
vi.mock('~/server/utils/database', () => ({
  db: {
    users: {
      findByEmail: vi.fn(),
      verifyPassword: vi.fn(),
      updateLoginStats: vi.fn()
    },
    sessions: {
      create: vi.fn()
    }
  }
}))

vi.mock('~/server/utils/auth', () => ({
  auth: {
    generateAccessToken: vi.fn(),
    generateRefreshToken: vi.fn(),
    setAuthCookies: vi.fn()
  }
}))

import { db } from '../../../utils/database'
import { auth } from '../../../utils/auth'

// Use vi.mocked to get properly typed mocks
const mockDb = vi.mocked(db, true)
const mockAuth = vi.mocked(auth, true)

describe('POST /api/auth/login', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashed-password',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
    isActive: true,
    mustChangePassword: false,
    emailVerified: true,
    joinedAt: '2024-01-01T00:00:00Z'
  }

  const mockEvent = createMockEvent()

  beforeEach(() => {
    vi.clearAllMocks()
    setupGlobalMocks()
  })

  it('should successfully login with valid credentials', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    }

    global.readBody.mockResolvedValue(loginData)
    mockDb.users.findByEmail.mockReturnValue(mockUser)
    mockDb.users.verifyPassword.mockResolvedValue(true)
    mockAuth.generateAccessToken.mockReturnValue('access-token')
    mockAuth.generateRefreshToken.mockReturnValue('refresh-token')
    mockDb.sessions.create.mockReturnValue({ id: 'session-123' })

    const result = await loginHandler(mockEvent)

    expect(mockDb.users.findByEmail).toHaveBeenCalledWith('test@example.com')
    expect(mockDb.users.verifyPassword).toHaveBeenCalledWith('test@example.com', 'password123')
    expect(mockAuth.generateAccessToken).toHaveBeenCalledWith(mockUser)
    expect(mockAuth.generateRefreshToken).toHaveBeenCalledWith(mockUser)
    expect(mockAuth.setAuthCookies).toHaveBeenCalledWith(mockEvent, 'access-token', 'refresh-token')
    expect(mockDb.users.updateLoginStats).toHaveBeenCalledWith('test@example.com')

    expect(result).toEqual({
      success: true,
      user: expect.objectContaining({
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role
      }),
      token: 'access-token',
      mustChangePassword: false
    })

    // Ensure password is not in response
    expect(result.user.password).toBeUndefined()
  })

  it('should throw 400 error when email is missing', async () => {
    global.readBody.mockResolvedValue({
      password: 'password123'
    })

    await expect(loginHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Email and password are required'
    })
  })

  it('should throw 400 error when password is missing', async () => {
    global.readBody.mockResolvedValue({
      email: 'test@example.com'
    })

    await expect(loginHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Email and password are required'
    })
  })

  it('should throw 401 error for non-existent email', async () => {
    global.readBody.mockResolvedValue({
      email: 'nonexistent@example.com',
      password: 'password123'
    })

    mockDb.users.findByEmail.mockReturnValue(null)

    await expect(loginHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 401,
      message: 'Invalid email or password'
    })
  })

  it('should throw 403 error for inactive account', async () => {
    const inactiveUser = { ...mockUser, isActive: false }

    global.readBody.mockResolvedValue({
      email: 'test@example.com',
      password: 'password123'
    })

    mockDb.users.findByEmail.mockReturnValue(inactiveUser)

    await expect(loginHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 403,
      message: 'Account has been deactivated'
    })
  })

  it('should throw 401 error for wrong password', async () => {
    global.readBody.mockResolvedValue({
      email: 'test@example.com',
      password: 'wrongpassword'
    })

    mockDb.users.findByEmail.mockReturnValue(mockUser)
    mockDb.users.verifyPassword.mockResolvedValue(false)

    await expect(loginHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 401,
      message: 'Invalid email or password'
    })
  })

  it('should handle remember me option', async () => {
    global.readBody.mockResolvedValue({
      email: 'test@example.com',
      password: 'password123',
      remember: true
    })

    mockDb.users.findByEmail.mockReturnValue(mockUser)
    mockDb.users.verifyPassword.mockResolvedValue(true)
    mockAuth.generateAccessToken.mockReturnValue('access-token')
    mockAuth.generateRefreshToken.mockReturnValue('refresh-token')

    await loginHandler(mockEvent)

    expect(mockDb.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: mockUser.id,
        userEmail: mockUser.email,
        remember: true
      })
    )
  })

  it('should normalize email to lowercase', async () => {
    global.readBody.mockResolvedValue({
      email: 'TEST@EXAMPLE.COM',
      password: 'password123'
    })

    mockDb.users.findByEmail.mockReturnValue(mockUser)
    mockDb.users.verifyPassword.mockResolvedValue(true)
    mockAuth.generateAccessToken.mockReturnValue('access-token')
    mockAuth.generateRefreshToken.mockReturnValue('refresh-token')

    await loginHandler(mockEvent)

    expect(mockDb.users.findByEmail).toHaveBeenCalledWith('test@example.com')
  })

  it('should include mustChangePassword flag in response', async () => {
    const userWithPasswordChange = { ...mockUser, mustChangePassword: true }

    global.readBody.mockResolvedValue({
      email: 'test@example.com',
      password: 'password123'
    })

    mockDb.users.findByEmail.mockReturnValue(userWithPasswordChange)
    mockDb.users.verifyPassword.mockResolvedValue(true)
    mockAuth.generateAccessToken.mockReturnValue('access-token')
    mockAuth.generateRefreshToken.mockReturnValue('refresh-token')

    const result = await loginHandler(mockEvent)

    expect(result.mustChangePassword).toBe(true)
  })
})