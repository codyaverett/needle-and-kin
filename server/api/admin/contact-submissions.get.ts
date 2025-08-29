import { PrismaClient } from '@prisma/client'
import { auth } from '../../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Check authentication using existing auth system
  const user = await auth.getCurrentUser(event)
  
  // Debug logging
  console.log('Contact submissions API - User:', user ? { id: user.id, email: user.email, role: user.role } : 'No user')
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  if (!auth.hasRole(user, 'admin')) {
    console.log('User role check failed:', user.role, 'Required: admin')
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required'
    })
  }

  try {

    // Get query parameters for filtering
    const query = getQuery(event)
    const status = query.status as string | undefined
    const search = query.search as string | undefined
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const offset = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get submissions with pagination
    const [submissions, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.contactSubmission.count({ where })
    ])

    // Get status counts
    const statusCounts = await prisma.contactSubmission.groupBy({
      by: ['status'],
      _count: true
    })

    const counts = {
      all: total,
      unread: 0,
      read: 0,
      responded: 0,
      archived: 0
    }

    statusCounts.forEach(item => {
      counts[item.status as keyof typeof counts] = item._count
    })

    return {
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      counts
    }
  } catch (error) {
    console.error('Error fetching contact submissions:', error)
    
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid authentication token'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch contact submissions'
    })
  }
})