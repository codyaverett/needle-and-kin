import jwt from 'jsonwebtoken'
import { db } from './database'

// JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production-needle-and-kin-2024'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production-needle-and-kin-2024'

// Token expiry times
const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY = '7d'

export const auth = {
  // Generate access token
  generateAccessToken: (user) => {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username
    }
    
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY
    })
  },
  
  // Generate refresh token
  generateRefreshToken: (user) => {
    const payload = {
      id: user.id,
      email: user.email,
      type: 'refresh'
    }
    
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY
    })
  },
  
  // Verify access token
  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return null
    }
  },
  
  // Verify refresh token
  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET)
    } catch (error) {
      return null
    }
  },
  
  // Extract token from request
  extractToken: (event) => {
    // Check Authorization header
    const authHeader = getHeader(event, 'authorization')
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }
    
    // Check cookies
    const token = getCookie(event, 'auth-token')
    return token || null
  },
  
  // Get current user from request
  getCurrentUser: async (event) => {
    const token = auth.extractToken(event)
    if (!token) return null
    
    const decoded = auth.verifyAccessToken(token)
    if (!decoded) return null
    
    const user = db.users.findById(decoded.id)
    if (!user || !user.isActive) return null
    
    // Remove sensitive data
    const { password: _password, ...safeUser } = user
    return safeUser
  },
  
  // Check if user has required role
  hasRole: (user, requiredRole) => {
    if (!user) return false
    
    const roleHierarchy = {
      'user': 1,
      'author': 2,
      'admin': 3
    }
    
    const userLevel = roleHierarchy[user.role] || 0
    const requiredLevel = roleHierarchy[requiredRole] || 0
    
    return userLevel >= requiredLevel
  },
  
  // Require authentication middleware
  requireAuth: async (event) => {
    const user = await auth.getCurrentUser(event)
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }
    
    // Attach user to event context
    event.context.user = user
    return user
  },
  
  // Require specific role middleware
  requireRole: (requiredRole) => {
    return async (event) => {
      const user = await auth.requireAuth(event)
      
      if (!auth.hasRole(user, requiredRole)) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Insufficient permissions'
        })
      }
      
      return user
    }
  },
  
  // Validate password strength
  validatePassword: (password) => {
    const errors = []
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*)')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  },
  
  // Validate email format
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  // Generate password reset token
  generatePasswordResetToken: (user) => {
    const payload = {
      id: user.id,
      email: user.email,
      type: 'password-reset'
    }
    
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1h'
    })
  },
  
  // Verify password reset token
  verifyPasswordResetToken: (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      if (decoded.type !== 'password-reset') return null
      return decoded
    } catch (error) {
      return null
    }
  },
  
  // Set auth cookies
  setAuthCookies: (event, accessToken, refreshToken) => {
    // Set access token cookie
    setCookie(event, 'auth-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 // 15 minutes
    })
    
    // Set refresh token cookie
    setCookie(event, 'refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
  },
  
  // Clear auth cookies
  clearAuthCookies: (event) => {
    deleteCookie(event, 'auth-token')
    deleteCookie(event, 'refresh-token')
  }
}