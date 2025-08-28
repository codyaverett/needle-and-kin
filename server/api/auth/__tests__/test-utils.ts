import { vi } from 'vitest'

// Extend global namespace for test utilities
declare global {
  let readBody: ReturnType<typeof vi.fn>
  let getHeader: ReturnType<typeof vi.fn>
  let getCookie: ReturnType<typeof vi.fn>
  let setCookie: ReturnType<typeof vi.fn>
  let deleteCookie: ReturnType<typeof vi.fn>
  let createError: ReturnType<typeof vi.fn>
}

// Create a mock event that satisfies H3Event type requirements
export const createMockEvent = (): any => ({
  node: {
    req: {
      headers: {
        'user-agent': 'Test Browser'
      }
    }
  },
  // Add minimal required properties for H3Event
  __is_event__: true,
  context: {},
  _handled: false,
  _onBeforeResponseCalled: false,
  _headers: {},
  handled: false,
  method: 'POST',
  path: '/api/auth/test',
  headers: {},
  body: null,
  query: {},
  params: {}
})

// Interface for HTTP errors
interface HttpError extends Error {
  statusCode: number
  statusMessage: string
}

// Helper to create error with statusCode
export const createMockError = (statusCode: number, statusMessage: string): HttpError => {
  const error = new Error(statusMessage) as HttpError
  error.statusCode = statusCode
  error.statusMessage = statusMessage
  return error
}

// Setup global mocks
export const setupGlobalMocks = () => {
  global.readBody = vi.fn()
  global.getHeader = vi.fn().mockReturnValue('Test Browser')
  global.getCookie = vi.fn()
  global.setCookie = vi.fn()
  global.deleteCookie = vi.fn()
  global.createError = vi.fn((error: any) => createMockError(error.statusCode, error.statusMessage))
}