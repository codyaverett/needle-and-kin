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

    const body = await readBody(event) as NewsletterPreferences

    if (!body || typeof body.subscribed !== 'boolean') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid preferences data'
      })
    }

    const storage = useStorage('data')
    const users = await storage.getItem<any[]>('users') || []
    const user = users.find(u => u.id === userId)

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    const preferences: NewsletterPreferences = {
      subscribed: body.subscribed,
      frequency: body.frequency || 'weekly',
      categories: body.categories || [],
      emailTypes: body.emailTypes || {
        newPosts: true,
        weeklyDigest: true,
        projectIdeas: false,
        communityUpdates: false
      }
    }

    await storage.setItem(`newsletter:${userId}`, preferences)

    if (preferences.subscribed) {
      const subscriptions = await storage.getItem<any[]>('newsletter-subscriptions') || []
      const existingIndex = subscriptions.findIndex(s => s.userId === userId || s.email === user.email)
      
      const subscription = {
        id: existingIndex >= 0 ? subscriptions[existingIndex].id : `sub-${Date.now()}`,
        userId,
        email: user.email,
        categories: preferences.categories,
        frequency: preferences.frequency,
        verified: true,
        unsubscribeToken: `unsub-${userId}-${Date.now()}`,
        createdAt: existingIndex >= 0 ? subscriptions[existingIndex].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      if (existingIndex >= 0) {
        subscriptions[existingIndex] = subscription
      } else {
        subscriptions.push(subscription)
      }

      await storage.setItem('newsletter-subscriptions', subscriptions)
    } else {
      const subscriptions = await storage.getItem<any[]>('newsletter-subscriptions') || []
      const filteredSubscriptions = subscriptions.filter(s => s.userId !== userId)
      await storage.setItem('newsletter-subscriptions', filteredSubscriptions)
    }

    return {
      success: true,
      data: preferences
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to update newsletter preferences'
    })
  }
})