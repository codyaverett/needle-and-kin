import { describe, it, expect } from 'vitest'

// String utility functions
export const capitalize = (str: string): string => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)  }...`
}

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

describe('String Utils', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
    })

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('')
    })

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A')
    })

    it('should not change already capitalized string', () => {
      expect(capitalize('Hello')).toBe('Hello')
    })
  })

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('This is a very long string', 10)).toBe('This is a ...')
    })

    it('should not truncate short strings', () => {
      expect(truncate('Short', 10)).toBe('Short')
    })

    it('should handle exact length', () => {
      expect(truncate('Exactly10!', 10)).toBe('Exactly10!')
    })
  })

  describe('slugify', () => {
    it('should convert to lowercase and replace spaces', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    it('should remove special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world')
    })

    it('should handle multiple spaces', () => {
      expect(slugify('Hello   World')).toBe('hello-world')
    })

    it('should trim hyphens', () => {
      expect(slugify('--Hello World--')).toBe('hello-world')
    })
  })
})