import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate required fields
  const requiredFields = ['name', 'email', 'subject', 'message']
  const missingFields = requiredFields.filter(field => !body[field])
  
  if (missingFields.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `Missing required fields: ${missingFields.join(', ')}`
    })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email format'
    })
  }

  try {
    // Store the contact submission in the database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
        newsletter: body.newsletter || false,
      }
    })

    // If they opted in for newsletter, add/update subscription
    if (body.newsletter) {
      await prisma.newsletterSubscription.upsert({
        where: { email: body.email },
        update: {
          name: body.name,
          status: 'active'
        },
        create: {
          email: body.email,
          name: body.name,
          status: 'active'
        }
      })
    }

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to user

    return {
      success: true,
      message: 'Contact form submitted successfully',
      submissionId: submission.id,
      timestamp: submission.createdAt.toISOString()
    }
  } catch (error) {
    console.error('Contact form submission error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to submit contact form'
    })
  }
})