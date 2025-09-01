import { describe, it, expect, beforeEach, vi } from 'vitest'
import contactHandler from '../contact.post'

// Mock Prisma Client
vi.mock('@prisma/client', () => {
  const mockPrismaClient = {
    contactSubmission: {
      create: vi.fn()
    },
    newsletterSubscription: {
      upsert: vi.fn()
    }
  }
  return {
    PrismaClient: vi.fn(() => mockPrismaClient)
  }
})

describe('POST /api/contact', () => {
  const mockEvent = {
    node: {
      req: {
        url: '/api/contact',
        method: 'POST'
      }
    }
  }

  let mockPrisma: any

  beforeEach(async () => {
    vi.clearAllMocks()
    global.readBody = vi.fn()
    global.createError = vi.fn((error) => {
      const err = new Error(error.statusMessage)
      err.statusCode = error.statusCode
      return err
    })
    // Mock console.log and console.error to avoid test output noise
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})

    // Get the mocked Prisma instance
    const { PrismaClient } = await import('@prisma/client')
    mockPrisma = new PrismaClient()
  })

  it('should successfully submit valid contact form', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a test message',
      newsletter: true
    }

    const mockSubmission = {
      id: 'test-id',
      ...validData,
      createdAt: new Date()
    }

    global.readBody.mockResolvedValue(validData)
    mockPrisma.contactSubmission.create.mockResolvedValue(mockSubmission)
    mockPrisma.newsletterSubscription.upsert.mockResolvedValue({})

    const result = await contactHandler(mockEvent)

    expect(result).toEqual({
      success: true,
      message: 'Contact form submitted successfully',
      submissionId: 'test-id',
      timestamp: mockSubmission.createdAt.toISOString()
    })

    expect(mockPrisma.contactSubmission.create).toHaveBeenCalledWith({
      data: {
        name: validData.name,
        email: validData.email,
        subject: validData.subject,
        message: validData.message,
        newsletter: validData.newsletter
      }
    })
    expect(mockPrisma.newsletterSubscription.upsert).toHaveBeenCalled()
  })

  it('should throw 400 error when name is missing', async () => {
    global.readBody.mockResolvedValue({
      email: 'john@example.com',
      subject: 'Test',
      message: 'Message'
    })

    await expect(contactHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Missing required fields: name'
    })
  })

  it('should throw 400 error when email is missing', async () => {
    global.readBody.mockResolvedValue({
      name: 'John',
      subject: 'Test',
      message: 'Message'
    })

    await expect(contactHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Missing required fields: email'
    })
  })

  it('should throw 400 error when subject is missing', async () => {
    global.readBody.mockResolvedValue({
      name: 'John',
      email: 'john@example.com',
      message: 'Message'
    })

    await expect(contactHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Missing required fields: subject'
    })
  })

  it('should throw 400 error when message is missing', async () => {
    global.readBody.mockResolvedValue({
      name: 'John',
      email: 'john@example.com',
      subject: 'Test'
    })

    await expect(contactHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Missing required fields: message'
    })
  })

  it('should throw 400 error when multiple fields are missing', async () => {
    global.readBody.mockResolvedValue({
      name: 'John'
    })

    await expect(contactHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Missing required fields: email, subject, message'
    })
  })

  it('should throw 400 error for invalid email format', async () => {
    global.readBody.mockResolvedValue({
      name: 'John',
      email: 'invalid-email',
      subject: 'Test',
      message: 'Message'
    })

    await expect(contactHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Invalid email format'
    })
  })

  it('should validate various invalid email formats', async () => {
    const invalidEmails = [
      'notanemail',
      '@nodomain.com',
      'missing@domain',
      'spaces in@email.com',
      'double@@domain.com'
    ]

    for (const email of invalidEmails) {
      global.readBody.mockResolvedValue({
        name: 'John',
        email,
        subject: 'Test',
        message: 'Message'
      })

      await expect(contactHandler(mockEvent)).rejects.toMatchObject({
        statusCode: 400,
        message: 'Invalid email format'
      })
    }
  })

  it('should accept various valid email formats', async () => {
    const validEmails = [
      'user@example.com',
      'user.name@example.com',
      'user+tag@example.co.uk',
      'user_name@sub.domain.com'
    ]

    for (const email of validEmails) {
      const mockSubmission = {
        id: `test-id-${email}`,
        name: 'John',
        email,
        subject: 'Test',
        message: 'Message',
        newsletter: false,
        createdAt: new Date()
      }

      global.readBody.mockResolvedValue({
        name: 'John',
        email,
        subject: 'Test',
        message: 'Message'
      })

      mockPrisma.contactSubmission.create.mockResolvedValue(mockSubmission)

      const result = await contactHandler(mockEvent)
      expect(result.success).toBe(true)
    }
  })

  it('should handle newsletter opt-in as false by default', async () => {
    const mockSubmission = {
      id: 'test-id',
      name: 'John',
      email: 'john@example.com',
      subject: 'Test',
      message: 'Message',
      newsletter: false,
      createdAt: new Date()
    }

    global.readBody.mockResolvedValue({
      name: 'John',
      email: 'john@example.com',
      subject: 'Test',
      message: 'Message'
      // newsletter not provided
    })

    mockPrisma.contactSubmission.create.mockResolvedValue(mockSubmission)

    const result = await contactHandler(mockEvent)

    expect(result.success).toBe(true)
    expect(mockPrisma.contactSubmission.create).toHaveBeenCalledWith({
      data: {
        name: 'John',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Message',
        newsletter: false
      }
    })
    // Newsletter subscription should not be called when not opted in
    expect(mockPrisma.newsletterSubscription.upsert).not.toHaveBeenCalled()
  })

  it('should handle empty strings as missing fields', async () => {
    global.readBody.mockResolvedValue({
      name: '',
      email: 'john@example.com',
      subject: 'Test',
      message: 'Message'
    })

    await expect(contactHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Missing required fields: name'
    })
  })

  it('should handle fields with extra whitespace', async () => {
    const mockSubmission = {
      id: 'test-id',
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Test Message',
      newsletter: false,
      createdAt: new Date()
    }

    global.readBody.mockResolvedValue({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Test Message'
    })

    mockPrisma.contactSubmission.create.mockResolvedValue(mockSubmission)

    const result = await contactHandler(mockEvent)
    expect(result.success).toBe(true)
  })

  it('should handle very long messages', async () => {
    const longMessage = 'A'.repeat(10000)
    const mockSubmission = {
      id: 'test-id',
      name: 'John',
      email: 'john@example.com',
      subject: 'Test',
      message: longMessage,
      newsletter: false,
      createdAt: new Date()
    }
    
    global.readBody.mockResolvedValue({
      name: 'John',
      email: 'john@example.com',
      subject: 'Test',
      message: longMessage
    })

    mockPrisma.contactSubmission.create.mockResolvedValue(mockSubmission)

    const result = await contactHandler(mockEvent)
    expect(result.success).toBe(true)
  })

  it('should include timestamp in response', async () => {
    const mockSubmission = {
      id: 'test-id',
      name: 'John',
      email: 'john@example.com',
      subject: 'Test',
      message: 'Message',
      newsletter: false,
      createdAt: new Date()
    }

    global.readBody.mockResolvedValue({
      name: 'John',
      email: 'john@example.com',
      subject: 'Test',
      message: 'Message'
    })

    mockPrisma.contactSubmission.create.mockResolvedValue(mockSubmission)

    const result = await contactHandler(mockEvent)

    expect(result.timestamp).toBeDefined()
    expect(result.timestamp).toBe(mockSubmission.createdAt.toISOString())
  })
})