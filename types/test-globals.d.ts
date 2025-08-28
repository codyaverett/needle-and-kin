/// <reference types="vitest/globals" />

import type { MockedFunction } from 'vitest'

// Extend the global namespace for test files
declare global {
  // When these are mocked in tests, they become vi.fn() instances
  var readBody: MockedFunction<any>
  var getHeader: MockedFunction<any>
  var getCookie: MockedFunction<any>
  var setCookie: MockedFunction<any>
  var deleteCookie: MockedFunction<any>
  var createError: MockedFunction<any>
}

export {}