import { describe, it, expect } from 'vitest'
import blogConfigHandler from '../blog-config.get'

describe('GET /api/blog-config', () => {
  const mockEvent = {
    node: {
      req: {
        method: 'GET',
        headers: {}
      }
    }
  }

  it('should return blog configuration', async () => {
    const result = await blogConfigHandler(mockEvent)

    expect(result).toBeDefined()
    expect(result).toHaveProperty('availableTags')
    expect(result).toHaveProperty('postsPerPage')
    expect(result).toHaveProperty('featuredCategories')
  })

  it('should include available tags array', async () => {
    const result = await blogConfigHandler(mockEvent)

    expect(Array.isArray(result.availableTags)).toBe(true)
    expect(result.availableTags.length).toBeGreaterThan(0)
    expect(result.availableTags).toContain('embroidery')
    expect(result.availableTags).toContain('knitting')
    expect(result.availableTags).toContain('tutorial')
    expect(result.availableTags).toContain('beginner')
  })

  it('should include posts per page configuration', async () => {
    const result = await blogConfigHandler(mockEvent)

    expect(result.postsPerPage).toBe(10)
    expect(typeof result.postsPerPage).toBe('number')
    expect(result.postsPerPage).toBeGreaterThan(0)
  })

  it('should include featured categories', async () => {
    const result = await blogConfigHandler(mockEvent)

    expect(Array.isArray(result.featuredCategories)).toBe(true)
    expect(result.featuredCategories.length).toBeGreaterThan(0)
    
    const category = result.featuredCategories[0]
    expect(category).toHaveProperty('name')
    expect(category).toHaveProperty('tag')
    expect(category).toHaveProperty('description')
  })

  it('should include specific featured categories', async () => {
    const result = await blogConfigHandler(mockEvent)

    const categoryNames = result.featuredCategories.map(c => c.name)
    expect(categoryNames).toContain('Tutorial')
    expect(categoryNames).toContain('Beginner Friendly')
    expect(categoryNames).toContain('Sustainable Crafting')
  })
})