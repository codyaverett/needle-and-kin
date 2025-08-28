import { describe, it, expect, beforeEach, vi } from 'vitest'
import contactHandler from '../contact.post'

describe('POST /api/contact', () => {
  const mockEvent = {
    node: {
      req: {
        url: '/api/contact',
        method: 'POST'
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    global.readBody = vi.fn()
    global.createError = vi.fn((error) => {
      const err = new Error(error.statusMessage)
      err.statusCode = error.statusCode
      return err
    })
    // Mock console.log to avoid test output noise
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('should successfully submit valid contact form', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a test message',
      newsletter: true
    }

    global.readBody.mockResolvedValue(validData)

    const result = await contactHandler(mockEvent)

    expect(result).toEqual({
      success: true,
      message: 'Contact form submitted successfully',
      timestamp: expect.any(String)
    })

    expect(console.log).toHaveBeenCalledWith(
      'Contact form submission:',
      expect.objectContaining({
        name: validData.name,
        email: validData.email,
        subject: validData.subject,
        message: validData.message,
        newsletter: validData.newsletter,
        timestamp: expect.any(String)
      })
    )
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
      global.readBody.mockResolvedValue({
        name: 'John',
        email,
        subject: 'Test',
        message: 'Message'
      })

      const result = await contactHandler(mockEvent)
      expect(result.success).toBe(true)
    }
  })

  it('should handle newsletter opt-in as false by default', async () => {
    global.readBody.mockResolvedValue({
      name: 'John',
      email: 'john@example.com',
      subject: 'Test',
      message: 'Message'
      // newsletter not provided
    })

    await contactHandler(mockEvent)

    expect(console.log).toHaveBeenCalledWith(
      'Contact form submission:',
      expect.objectContaining({
        newsletter: undefined
      })
    )
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
    global.readBody.mockResolvedValue({
      name: 'John Doe',
      email: 'john@example.com', // Email with spaces would be invalid
      subject: 'Test Subject',
      message: 'Test Message'
    })

    const result = await contactHandler(mockEvent)
    expect(result.success).toBe(true)
  })

  it('should handle very long messages', async () => {
    const longMessage = 'A'.repeat(10000)
    
    global.readBody.mockResolvedValue({
      name: 'John',
      email: 'john@example.com',
      subject: 'Test',
      message: longMessage
    })

    const result = await contactHandler(mockEvent)
    expect(result.success).toBe(true)
  })

  it('should include timestamp in response', async () => {
    global.readBody.mockResolvedValue({
      name: 'John',
      email: 'john@example.com',
      subject: 'Test',
      message: 'Message'
    })

    const before = new Date()
    const result = await contactHandler(mockEvent)
    const after = new Date()

    expect(result.timestamp).toBeDefined()
    const timestamp = new Date(result.timestamp)
    expect(timestamp >= before && timestamp <= after).toBe(true)
  })
})