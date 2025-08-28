import { describe, it, expect, beforeEach, vi } from 'vitest'
import contactHandler from '../contact.post'

describe('POST /api/contact - Simple Tests', () => {
  beforeEach(() => {
    global.readBody = vi.fn()
    global.createError = vi.fn((error) => {
      const err = new Error(error.statusMessage)
      err.statusCode = error.statusCode
      return err
    })
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('should accept valid contact form', async () => {
    global.readBody.mockResolvedValue({
      name: 'John',
      email: 'john@example.com',
      subject: 'Test',
      message: 'Message'
    })

    const result = await contactHandler({})
    
    expect(result.success).toBe(true)
    expect(result.message).toBeDefined()
  })

  it('should reject missing fields', async () => {
    global.readBody.mockResolvedValue({
      name: 'John'
    })

    await expect(contactHandler({})).rejects.toThrow()
  })

  it('should validate email format', async () => {
    global.readBody.mockResolvedValue({
      name: 'John',
      email: 'not-an-email',
      subject: 'Test',
      message: 'Message'
    })

    await expect(contactHandler({})).rejects.toMatchObject({
      statusCode: 400
    })
  })
})