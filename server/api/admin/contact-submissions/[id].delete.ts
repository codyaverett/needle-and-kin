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

    const id = getRouterParam(event, 'id')

    // Delete the submission
    await prisma.contactSubmission.delete({
      where: { id }
    })

    return {
      success: true,
      message: 'Contact submission deleted successfully'
    }
  } catch (error) {
    console.error('Error deleting contact submission:', error)
    
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid authentication token'
      })
    }
    
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Contact submission not found'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete contact submission'
    })
  }
})