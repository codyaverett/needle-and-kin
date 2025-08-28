import { db } from '~/server/utils/database'
import { auth } from '~/server/utils/auth'
import type { LoginBody, User } from '~/server/types/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)
  
  // Validate required fields
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
    })
  }
  
  // Find user by email
  const user = db.users.findByEmail(body.email.toLowerCase()) as User | null
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password'
    })
  }
  
  // Check if user is active
  if (!user.isActive) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Account has been deactivated'
    })
  }
  
  // Verify password
  const isValidPassword = await db.users.verifyPassword(user.email, body.password)
  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password'
    })
  }
  
  // Generate tokens
  const accessToken = auth.generateAccessToken(user)
  const refreshToken = auth.generateRefreshToken(user)
  
  // Set auth cookies
  auth.setAuthCookies(event, accessToken, refreshToken)
  
  // Update login stats
  db.users.updateLoginStats(user.email)
  
  // Create session
  db.sessions.create({
    userId: user.id,
    userEmail: user.email,
    ip: 'unknown', // getClientIP not available in Nuxt 3 by default
    userAgent: getHeader(event, 'user-agent') || 'unknown',
    remember: body.remember || false
  })
  
  // Remove sensitive data from response
  const { password: _password, ...safeUser } = user as any
  
  return {
    success: true,
    user: safeUser,
    token: accessToken,
    mustChangePassword: user.mustChangePassword || false
  }
})