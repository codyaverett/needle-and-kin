import { describe, it, expect } from 'vitest'

// Simple utility functions for testing
export const add = (a: number, b: number) => a + b
export const multiply = (a: number, b: number) => a * b

describe('Math Utils', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5)
    })

    it('should add negative numbers', () => {
      expect(add(-2, -3)).toBe(-5)
    })

    it('should add positive and negative numbers', () => {
      expect(add(5, -3)).toBe(2)
    })
  })

  describe('multiply', () => {
    it('should multiply two positive numbers', () => {
      expect(multiply(2, 3)).toBe(6)
    })

    it('should multiply with zero', () => {
      expect(multiply(5, 0)).toBe(0)
    })

    it('should multiply negative numbers', () => {
      expect(multiply(-2, -3)).toBe(6)
    })
  })
})