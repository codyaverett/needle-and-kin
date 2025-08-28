/// <reference types="vitest/globals" />

import type { H3Event } from 'h3'
import type { FetchOptions } from 'ofetch'

// Nuxt/H3 global utilities
declare global {
  // H3 utilities - these are available in server context
  const defineEventHandler: <T = any>(handler: (event: H3Event) => T | Promise<T>) => (event: H3Event) => T | Promise<T>
  const readBody: <T = any>(event: H3Event) => Promise<T>
  const getQuery: (event: H3Event) => Record<string, any>
  const getRouterParams: (event: H3Event) => Record<string, any>
  const getCookie: (event: H3Event, name: string) => string | undefined
  const setCookie: (event: H3Event, name: string, value: string, options?: any) => void
  const deleteCookie: (event: H3Event, name: string, options?: any) => void
  const getHeader: (event: H3Event, name: string) => string | undefined
  const getHeaders: (event: H3Event) => Record<string, string>
  const setHeader: (event: H3Event, name: string, value: string) => void
  const createError: (error: { statusCode: number; statusMessage: string; data?: any }) => Error & { statusCode: number; statusMessage: string; data?: any }
  const sendRedirect: (event: H3Event, location: string, code?: number) => void
  
  // Nuxt utilities  
  const useFetch: <T = any>(url: string, options?: FetchOptions) => Promise<{ data: Ref<T | null>; pending: Ref<boolean>; error: Ref<Error | null> }>
  const $fetch: <T = any>(url: string, options?: FetchOptions) => Promise<T>
}

export {}