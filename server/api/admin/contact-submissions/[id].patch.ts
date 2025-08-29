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
    const body = await readBody(event)

    // Update the submission
    const updateData: any = {}
    
    if (body.status !== undefined) {
      updateData.status = body.status
    }
    
    if (body.adminNotes !== undefined) {
      updateData.adminNotes = body.adminNotes
    }
    
    if (body.responseMessage !== undefined) {
      updateData.responseMessage = body.responseMessage
      updateData.respondedAt = new Date()
      updateData.respondedBy = user.email
      updateData.status = 'responded'
    }

    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: updateData
    })

    // If sending a response, send email to the user
    if (body.responseMessage && body.sendEmail) {
      // TODO: Implement email sending
      console.log('Sending response email to:', submission.email)
      console.log('Response message:', body.responseMessage)
    }

    return submission
  } catch (error) {
    console.error('Error updating contact submission:', error)
    
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
      statusMessage: 'Failed to update contact submission'
    })
  }
})