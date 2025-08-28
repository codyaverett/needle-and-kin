import { describe, it, expect, beforeEach, vi } from 'vitest'
import registerHandler from '../register.post'
import { createMockEvent, setupGlobalMocks } from './test-utils'

// Mock dependencies
vi.mock('~/server/utils/database', () => ({
  db: {
    users: {
      findByEmail: vi.fn(),
      create: vi.fn(),
      updateLoginStats: vi.fn()
    }
  }
}))

vi.mock('~/server/utils/auth', () => ({
  auth: {
    generateAccessToken: vi.fn(),
    generateRefreshToken: vi.fn(),
    setAuthCookies: vi.fn(),
    validateEmail: vi.fn(),
    validatePassword: vi.fn()
  }
}))

import { db } from '../../../utils/database'
import { auth } from '../../../utils/auth'

// Use vi.mocked to get properly typed mocks
const mockDb = vi.mocked(db, true)
const mockAuth = vi.mocked(auth, true)

describe('POST /api/auth/register', () => {
  const mockEvent = createMockEvent()

  beforeEach(() => {
    vi.clearAllMocks()
    setupGlobalMocks()
  })

  it('should successfully register a new user', async () => {
    const registerData = {
      email: 'newuser@example.com',
      username: 'newuser',
      password: 'StrongPass123!',
      firstName: 'New',
      lastName: 'User'
    }

    const newUser = {
      id: 'user-new',
      ...registerData,
      password: 'hashed-password',
      role: 'user',
      isActive: true,
      emailVerified: false
    }

    global.readBody.mockResolvedValue(registerData)
    mockDb.users.findByEmail.mockReturnValue(null)
    mockAuth.validateEmail.mockReturnValue(true)
    mockAuth.validatePassword.mockReturnValue({ valid: true, errors: [] })
    mockDb.users.create.mockResolvedValue(newUser)
    mockAuth.generateAccessToken.mockReturnValue('access-token')
    mockAuth.generateRefreshToken.mockReturnValue('refresh-token')

    const result = await registerHandler(mockEvent)

    expect(mockDb.users.findByEmail).toHaveBeenCalledWith('newuser@example.com')
    expect(mockAuth.validateEmail).toHaveBeenCalledWith('newuser@example.com')
    expect(mockAuth.validatePassword).toHaveBeenCalledWith('StrongPass123!')
    expect(mockDb.users.create).toHaveBeenCalled()
    expect(mockAuth.setAuthCookies).toHaveBeenCalledWith(mockEvent, 'access-token', 'refresh-token')
    
    expect(result).toEqual({
      success: true,
      user: expect.objectContaining({
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }),
      token: 'access-token'
    })
  })

  it('should throw 400 error for missing required fields', async () => {
    global.readBody.mockResolvedValue({
      email: 'test@example.com',
      password: 'password'
      // missing username, firstName, lastName
    })

    await expect(registerHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Missing required fields'
    })
  })

  it('should throw 400 error for invalid email format', async () => {
    const registerData = {
      email: 'invalid-email',
      username: 'newuser',
      password: 'StrongPass123!',
      firstName: 'New',
      lastName: 'User'
    }

    global.readBody.mockResolvedValue(registerData)
    mockAuth.validateEmail.mockReturnValue(false)

    await expect(registerHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Invalid email format'
    })
  })

  it('should throw 409 error if email already exists', async () => {
    const registerData = {
      email: 'existing@example.com',
      username: 'newuser',
      password: 'StrongPass123!',
      firstName: 'New',
      lastName: 'User'
    }

    global.readBody.mockResolvedValue(registerData)
    mockAuth.validateEmail.mockReturnValue(true)
    mockAuth.validatePassword.mockReturnValue({ valid: true, errors: [] })
    mockDb.users.findByEmail.mockReturnValue({ id: 'existing-user' })

    await expect(registerHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 409,
      message: 'User with this email already exists'
    })
  })

  it('should throw 400 error for weak password', async () => {
    const registerData = {
      email: 'test@example.com',
      username: 'newuser',
      password: 'weak',
      firstName: 'New',
      lastName: 'User'
    }

    global.readBody.mockResolvedValue(registerData)
    mockDb.users.findByEmail.mockReturnValue(null)
    mockAuth.validateEmail.mockReturnValue(true)
    mockAuth.validatePassword.mockReturnValue({
      valid: false,
      errors: ['Password must be at least 8 characters']
    })

    await expect(registerHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Password must be at least 8 characters'
    })
  })

  it('should handle multiple password validation errors', async () => {
    const registerData = {
      email: 'test@example.com',
      username: 'newuser',
      password: 'weak',
      firstName: 'New',
      lastName: 'User'
    }

    global.readBody.mockResolvedValue(registerData)
    mockDb.users.findByEmail.mockReturnValue(null)
    mockAuth.validateEmail.mockReturnValue(true)
    mockAuth.validatePassword.mockReturnValue({
      valid: false,
      errors: [
        'Password must be at least 8 characters',
        'Password must contain uppercase letter',
        'Password must contain a number'
      ]
    })

    await expect(registerHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Password must be at least 8 characters, Password must contain uppercase letter, Password must contain a number'
    })
  })

  it('should sanitize user input', async () => {
    const registerData = {
      email: '  Test@Example.COM  ',
      username: '  NewUser  ',
      password: 'StrongPass123!',
      firstName: '  New  ',
      lastName: '  User  '
    }

    global.readBody.mockResolvedValue(registerData)
    mockDb.users.findByEmail.mockReturnValue(null)
    mockAuth.validateEmail.mockReturnValue(true)
    mockAuth.validatePassword.mockReturnValue({ valid: true, errors: [] })
    mockDb.users.create.mockResolvedValue({
      id: 'user-new',
      email: 'test@example.com',
      username: 'newuser',
      role: 'user'
    })
    mockAuth.generateAccessToken.mockReturnValue('token')
    mockAuth.generateRefreshToken.mockReturnValue('refresh')

    await registerHandler(mockEvent)

    // Check that email was used as provided (trimmed spaces)
    expect(mockDb.users.findByEmail).toHaveBeenCalledWith('  Test@Example.COM  ')
  })

  it('should handle database errors gracefully', async () => {
    const registerData = {
      email: 'test@example.com',
      username: 'newuser',
      password: 'StrongPass123!',
      firstName: 'New',
      lastName: 'User'
    }

    global.readBody.mockResolvedValue(registerData)
    mockDb.users.findByEmail.mockReturnValue(null)
    mockAuth.validateEmail.mockReturnValue(true)
    mockAuth.validatePassword.mockReturnValue({ valid: true, errors: [] })
    mockDb.users.create.mockRejectedValue(new Error('Database error'))

    await expect(registerHandler(mockEvent)).rejects.toThrow('Failed to create user account')
  })

  it('should not include password in response', async () => {
    const registerData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'StrongPass123!',
      firstName: 'Test',
      lastName: 'User'
    }

    const newUser = {
      id: 'user-123',
      ...registerData,
      password: 'hashed-password',
      role: 'user'
    }

    global.readBody.mockResolvedValue(registerData)
    mockDb.users.findByEmail.mockReturnValue(null)
    mockAuth.validateEmail.mockReturnValue(true)
    mockAuth.validatePassword.mockReturnValue({ valid: true, errors: [] })
    mockDb.users.create.mockResolvedValue(newUser)
    mockAuth.generateAccessToken.mockReturnValue('token')
    mockAuth.generateRefreshToken.mockReturnValue('refresh')

    const result = await registerHandler(mockEvent)

    expect(result.user.password).toBeUndefined()
  })
})