import { vi } from 'vitest'

// Mock H3 utilities for server-side testing
global.defineEventHandler = vi.fn((handler) => handler)
global.readBody = vi.fn()
global.getQuery = vi.fn()
global.getHeader = vi.fn()
global.getCookie = vi.fn()
global.setCookie = vi.fn()
global.deleteCookie = vi.fn()
global.createError = vi.fn((error) => {
  const err = new Error(error.statusMessage || 'Error')
  err.statusCode = error.statusCode
  err.statusMessage = error.statusMessage
  err.data = error.data
  return err
})
global.sendRedirect = vi.fn()
global.setResponseStatus = vi.fn()
global.setHeader = vi.fn()

// Set test environment variables
process.env.JWT_SECRET = 'test-jwt-secret'
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret'
process.env.NODE_ENV = 'test'