export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { token, email } = body

    if (!token && !email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Unsubscribe token or email is required'
      })
    }

    const storage = useStorage('data')
    const subscriptions = await storage.getItem<any[]>('newsletter-subscriptions') || []
    
    let subscription
    if (token) {
      subscription = subscriptions.find(s => s.unsubscribeToken === token)
    } else if (email) {
      subscription = subscriptions.find(s => s.email === email)
    }

    if (!subscription) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Subscription not found'
      })
    }

    const filteredSubscriptions = subscriptions.filter(s => s.id !== subscription.id)
    await storage.setItem('newsletter-subscriptions', filteredSubscriptions)

    if (subscription.userId) {
      await storage.removeItem(`newsletter:${subscription.userId}`)
    }

    return {
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to unsubscribe from newsletter'
    })
  }
})