import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock Nuxt composables
vi.mock('#app', () => ({
  defineNuxtPlugin: vi.fn(),
  navigateTo: vi.fn(),
  useNuxtData: vi.fn(),
  useRuntimeConfig: vi.fn(() => ({
    public: {
      apiBase: 'http://localhost:3000'
    }
  })),
  useState: vi.fn((key, init) => {
    const state = init ? init() : null
    return {
      value: state
    }
  }),
  useFetch: vi.fn(),
  useAsyncData: vi.fn(),
  useRoute: vi.fn(() => ({
    params: {},
    query: {}
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn()
  })),
  useCookie: vi.fn(),
  useHead: vi.fn(),
  createError: vi.fn((error) => error),
  defineEventHandler: vi.fn((handler) => handler),
  getCookie: vi.fn(),
  setCookie: vi.fn(),
  deleteCookie: vi.fn(),
  readBody: vi.fn(),
  getQuery: vi.fn()
}))

// Mock server utils
vi.mock('~/server/utils/auth', () => ({
  auth: {
    generateTokens: vi.fn(),
    verifyAccessToken: vi.fn(),
    verifyRefreshToken: vi.fn(),
    getCurrentUser: vi.fn(),
    requireAuth: vi.fn(),
    requireRole: vi.fn()
  }
}))

vi.mock('~/server/utils/database', () => ({
  db: {
    users: {
      create: vi.fn(),
      findByEmail: vi.fn(),
      findById: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    },
    posts: {
      create: vi.fn(),
      findBySlug: vi.fn(),
      findById: vi.fn(),
      list: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    },
    sessions: {
      create: vi.fn(),
      findByToken: vi.fn(),
      deleteByToken: vi.fn(),
      deleteExpired: vi.fn()
    }
  }
}))

// Setup global test config
config.global.stubs = {
  NuxtLink: {
    template: '<a><slot /></a>'
  },
  ClientOnly: {
    template: '<div><slot /></div>'
  }
}