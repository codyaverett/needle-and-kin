import jwt from 'jsonwebtoken'
import type { NewsletterPreferences } from '~/types/notification'

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'auth-token')
    
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const userId = decoded.userId

    const storage = useStorage('data')
    const newsletterPrefs = await storage.getItem(`newsletter:${userId}`)

    const defaultPreferences: NewsletterPreferences = {
      subscribed: false,
      frequency: 'weekly',
      categories: [],
      emailTypes: {
        newPosts: true,
        weeklyDigest: true,
        projectIdeas: false,
        communityUpdates: false
      }
    }

    return {
      success: true,
      data: newsletterPrefs || defaultPreferences
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch newsletter preferences'
    })
  }
})