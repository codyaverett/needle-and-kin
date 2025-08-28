// Auth type definitions
export interface User {
  id: string
  email: string
  username: string
  password?: string
  firstName: string
  lastName: string
  role: 'user' | 'author' | 'admin'
  avatar: string
  bio: string
  joinedAt: string
  mustChangePassword: boolean
  isActive: boolean
  emailVerified: boolean
  preferences?: UserPreferences
  stats?: UserStats
}

export interface UserPreferences {
  newsletter: boolean
  emailNotifications: boolean
  favoriteCategories: string[]
}

export interface UserStats {
  postsRead: number
  commentsWritten: number
  lastLogin: string | null
}

export interface Session {
  id: string
  userId: string
  userEmail: string
  ip: string
  userAgent: string
  remember: boolean
  createdAt: string
  expiresAt: string
}

export interface JWTPayload {
  id: string
  email: string
  role: string
  username: string
  iat?: number
  exp?: number
}

export interface RefreshTokenPayload {
  id: string
  email: string
  type: 'refresh'
  iat?: number
  exp?: number
}

export interface LoginBody {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterBody {
  email: string
  password: string
  firstName: string
  lastName: string
  username?: string
  bio?: string
}