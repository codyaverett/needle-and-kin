import { describe, it, expect } from 'vitest'
import siteContentHandler from '../site-content.get'

describe('GET /api/site-content', () => {
  const mockEvent = {
    node: {
      req: {
        method: 'GET',
        headers: {}
      }
    }
  }

  it('should return site-wide content', async () => {
    const result = await siteContentHandler(mockEvent)

    expect(result).toBeDefined()
    expect(result).toHaveProperty('hero')
    expect(result).toHaveProperty('aboutSection')
  })

  it('should include hero section with CTA', async () => {
    const result = await siteContentHandler(mockEvent)

    expect(result.hero).toHaveProperty('title')
    expect(result.hero).toHaveProperty('description')
    expect(result.hero).toHaveProperty('cta')
    
    expect(typeof result.hero.title).toBe('string')
    expect(typeof result.hero.description).toBe('string')
    expect(result.hero.cta).toHaveProperty('text')
    expect(result.hero.cta).toHaveProperty('url')
  })

  it('should include about section with CTA', async () => {
    const result = await siteContentHandler(mockEvent)

    expect(result.aboutSection).toHaveProperty('title')
    expect(result.aboutSection).toHaveProperty('description')
    expect(result.aboutSection).toHaveProperty('cta')
    
    expect(typeof result.aboutSection.title).toBe('string')
    expect(typeof result.aboutSection.description).toBe('string')
    expect(result.aboutSection.cta).toHaveProperty('text')
    expect(result.aboutSection.cta).toHaveProperty('url')
  })

  it('should have appropriate content for crafting site', async () => {
    const result = await siteContentHandler(mockEvent)

    expect(result.hero.title).toContain('Needle & Kin')
    expect(result.aboutSection.title).toContain('About Needle & Kin')
    expect(result.hero.cta.url).toBe('/blog')
    expect(result.aboutSection.cta.url).toBe('/about')
  })
})