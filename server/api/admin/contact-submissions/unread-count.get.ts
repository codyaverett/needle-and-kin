import { PrismaClient } from '@prisma/client'
import { auth } from '../../../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Check authentication using existing auth system
  const user = await auth.getCurrentUser(event)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  if (!auth.hasRole(user, 'admin')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required'
    })
  }

  try {
    // Get count of unread submissions
    const unreadCount = await prisma.contactSubmission.count({
      where: { status: 'unread' }
    })

    return {
      count: unreadCount
    }
  } catch (error) {
    console.error('Error fetching unread count:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch unread count'
    })
  }
})