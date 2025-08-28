import jwt from 'jsonwebtoken'
import type { JWTPayload } from '~/server/types/auth'

interface SubscribeBody {
  email?: string // Optional if user is authenticated
  categories?: string[]
  frequency?: 'daily' | 'weekly' | 'monthly'
  preferences?: {
    newPosts?: boolean
    weeklyDigest?: boolean
    authorUpdates?: boolean
    craftingTips?: boolean
    specialOffers?: boolean
  }
}

// Simple in-memory storage (in production, use database)
const newsletterSubscribers: Map<string, {
  email: string
  categories: string[]
  frequency: string
  preferences: Record<string, boolean>
  subscribedAt: string
  verified: boolean
  userId?: string
}> = new Map()

export default defineEventHandler(async (event) => {
  const body = await readBody<SubscribeBody>(event)
  
  // Check if user is authenticated
  let userId: string | null = null
  let userEmail: string | null = null
  
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload
      userId = decoded.id
      userEmail = decoded.email
    } catch {
      // Not authenticated, continue with email from body
    }
  }
  
  // Determine email to use
  const email = userEmail || body.email
  
  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email address is required for newsletter subscription'
    })
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email address format'
    })
  }
  
  // Check if already subscribed
  if (newsletterSubscribers.has(email)) {
    const existing = newsletterSubscribers.get(email)!
    
    // Update preferences if already subscribed
    if (body.categories) {
      existing.categories = body.categories
    }
    if (body.frequency) {
      existing.frequency = body.frequency
    }
    if (body.preferences) {
      existing.preferences = { ...existing.preferences, ...body.preferences }
    }
    
    return {
      success: true,
      message: 'Subscription preferences updated',
      subscription: {
        email: existing.email,
        categories: existing.categories,
        frequency: existing.frequency,
        preferences: existing.preferences,
        isUpdate: true
      }
    }
  }
  
  // Validate categories
  const validCategories = ['knitting', 'crochet', 'embroidery', 'quilting', 'sewing', 'weaving', 'all']
  const categories = body.categories || ['all']
  
  for (const category of categories) {
    if (!validCategories.includes(category)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid category: ${category}`
      })
    }
  }
  
  // Create new subscription
  const subscription = {
    email,
    categories,
    frequency: body.frequency || 'weekly',
    preferences: {
      newPosts: body.preferences?.newPosts ?? true,
      weeklyDigest: body.preferences?.weeklyDigest ?? true,
      authorUpdates: body.preferences?.authorUpdates ?? false,
      craftingTips: body.preferences?.craftingTips ?? true,
      specialOffers: body.preferences?.specialOffers ?? false
    },
    subscribedAt: new Date().toISOString(),
    verified: !!userId, // Auto-verify if user is authenticated
    userId: userId || undefined
  }
  
  newsletterSubscribers.set(email, subscription)
  
  // In production, this would:
  // 1. Save to database
  // 2. Send confirmation email (if not authenticated)
  // 3. Add to email service (Mailchimp, SendGrid, etc.)
  // 4. Track analytics
  // 5. Update user preferences if authenticated
  
  const confirmationToken = userId ? null : Buffer.from(email).toString('base64')
  
  return {
    success: true,
    message: userId 
      ? 'Successfully subscribed to newsletter' 
      : 'Please check your email to confirm subscription',
    subscription: {
      email: subscription.email,
      categories: subscription.categories,
      frequency: subscription.frequency,
      preferences: subscription.preferences,
      isUpdate: false
    },
    confirmationRequired: !userId,
    confirmationToken
  }
})