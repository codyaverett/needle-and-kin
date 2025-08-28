import { db } from '~/server/utils/database'
import { auth } from '~/server/utils/auth'
import type { RegisterBody, User } from '~/server/types/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<RegisterBody>(event)
  
  // Validate required fields
  if (!body.email || !body.password || !body.firstName || !body.lastName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    })
  }
  
  // Validate email format
  if (!auth.validateEmail(body.email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email format'
    })
  }
  
  // Validate password strength
  const passwordValidation = auth.validatePassword(body.password)
  if (!passwordValidation.valid) {
    throw createError({
      statusCode: 400,
      statusMessage: passwordValidation.errors.join(', ')
    })
  }
  
  // Check if user already exists
  const existingUser = db.users.findByEmail(body.email) as User | null
  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'User with this email already exists'
    })
  }
  
  try {
    // Create new user
    const user = await db.users.create({
      email: body.email.toLowerCase(),
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username || body.email.split('@')[0],
      bio: body.bio || '',
      role: 'user' // Default role
    })
    
    // Generate tokens
    const accessToken = auth.generateAccessToken(user)
    const refreshToken = auth.generateRefreshToken(user)
    
    // Set auth cookies
    auth.setAuthCookies(event, accessToken, refreshToken)
    
    // Update login stats
    db.users.updateLoginStats(user.email)
    
    // Remove sensitive data from response
    const { password: _password, ...safeUser } = user as any
    
    return {
      success: true,
      user: safeUser,
      token: accessToken
    }
  } catch (error) {
    console.error('Registration error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user account'
    })
  }
})