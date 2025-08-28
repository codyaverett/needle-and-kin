import { describe, it, expect, beforeEach, vi } from 'vitest'

// Import all content endpoint handlers
import aboutHandler from '../about.get'
import blogConfigHandler from '../blog-config.get'
import siteContentHandler from '../site-content.get'
import contactInfoHandler from '../contact-info.get'

describe('Content Endpoints', () => {
  const mockEvent = {
    node: {
      req: {
        method: 'GET',
        headers: {}
      }
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/about', () => {
    it('should return about page content', async () => {
      const result = await aboutHandler(mockEvent)

      expect(result).toBeDefined()
      expect(result).toHaveProperty('hero')
      expect(result).toHaveProperty('story')
      expect(result).toHaveProperty('mission')
      expect(result).toHaveProperty('team')
      expect(result).toHaveProperty('cta')
      
      expect(result.hero).toHaveProperty('title')
      expect(result.hero).toHaveProperty('description')
      expect(result.team).toHaveProperty('members')
      expect(Array.isArray(result.team.members)).toBe(true)
      
      if (result.team.members.length > 0) {
        expect(result.team.members[0]).toHaveProperty('name')
        expect(result.team.members[0]).toHaveProperty('role')
        expect(result.team.members[0]).toHaveProperty('bio')
        expect(result.team.members[0]).toHaveProperty('avatar')
      }
    })

    it('should include team and mission information', async () => {
      const result = await aboutHandler(mockEvent)

      expect(result.mission).toHaveProperty('values')
      expect(Array.isArray(result.mission.values)).toBe(true)
      expect(result.team).toHaveProperty('title')
      expect(result.team).toHaveProperty('description')
    })

    it('should return consistent structure', async () => {
      const result = await aboutHandler(mockEvent)

      expect(typeof result.hero.title).toBe('string')
      expect(typeof result.hero.description).toBe('string')
      expect(typeof result.story.title).toBe('string')
      expect(Array.isArray(result.story.content)).toBe(true)
      expect(typeof result.mission.title).toBe('string')
    })
  })

  describe('GET /api/blog-config', () => {
    it('should return blog configuration', async () => {
      const result = await blogConfigHandler(mockEvent)

      expect(result).toBeDefined()
      expect(result).toHaveProperty('availableTags')
      expect(result).toHaveProperty('postsPerPage')
      expect(result).toHaveProperty('featuredCategories')

      expect(Array.isArray(result.availableTags)).toBe(true)
      expect(Array.isArray(result.featuredCategories)).toBe(true)
      expect(typeof result.postsPerPage).toBe('number')
    })

    it('should include featured category information', async () => {
      const result = await blogConfigHandler(mockEvent)

      if (result.featuredCategories.length > 0) {
        const category = result.featuredCategories[0]
        expect(category).toHaveProperty('name')
        expect(category).toHaveProperty('tag')
        expect(category).toHaveProperty('description')
      }
    })

    it('should include available tags', async () => {
      const result = await blogConfigHandler(mockEvent)

      expect(result.availableTags.length).toBeGreaterThan(0)
      expect(result.availableTags).toContain('tutorial')
      expect(result.availableTags).toContain('beginner')
    })

    it('should include pagination settings', async () => {
      const result = await blogConfigHandler(mockEvent)

      expect(result.postsPerPage).toBe(10)
      expect(typeof result.postsPerPage).toBe('number')
      expect(result.postsPerPage).toBeGreaterThan(0)
    })
  })

  describe('GET /api/site-content', () => {
    it('should return site-wide content', async () => {
      const result = await siteContentHandler(mockEvent)

      expect(result).toBeDefined()
      expect(result).toHaveProperty('hero')
      expect(result).toHaveProperty('aboutSection')
    })

    it('should include hero section', async () => {
      const result = await siteContentHandler(mockEvent)

      expect(result.hero).toHaveProperty('title')
      expect(result.hero).toHaveProperty('description')
      expect(result.hero).toHaveProperty('cta')
      expect(result.hero.cta).toHaveProperty('text')
      expect(result.hero.cta).toHaveProperty('url')
    })

    it('should include about section', async () => {
      const result = await siteContentHandler(mockEvent)

      expect(result.aboutSection).toHaveProperty('title')
      expect(result.aboutSection).toHaveProperty('description')
      expect(result.aboutSection).toHaveProperty('cta')
    })

    it('should return consistent structure', async () => {
      const result = await siteContentHandler(mockEvent)

      expect(typeof result.hero.title).toBe('string')
      expect(typeof result.hero.description).toBe('string')
      expect(typeof result.aboutSection.title).toBe('string')
      expect(typeof result.aboutSection.description).toBe('string')
    })
  })

  describe('GET /api/contact-info', () => {
    it('should return contact information', async () => {
      const result = await contactInfoHandler(mockEvent)

      expect(result).toBeDefined()
      expect(result).toHaveProperty('hero')
      expect(result).toHaveProperty('form')
      expect(result).toHaveProperty('contactMethods')
      expect(result).toHaveProperty('faq')
    })

    it('should include contact methods', async () => {
      const result = await contactInfoHandler(mockEvent)

      expect(result.contactMethods).toHaveProperty('methods')
      expect(Array.isArray(result.contactMethods.methods)).toBe(true)
        
      if (result.contactMethods.methods.length > 0) {
        const method = result.contactMethods.methods[0]
        expect(method).toHaveProperty('icon')
        expect(method).toHaveProperty('title')
        expect(method).toHaveProperty('contact')
        expect(method).toHaveProperty('url')
      }
    })

    it('should include form configuration', async () => {
      const result = await contactInfoHandler(mockEvent)

      expect(result.form).toHaveProperty('title')
      expect(result.form).toHaveProperty('subjects')
      expect(Array.isArray(result.form.subjects)).toBe(true)
    })

    it('should include valid email in contact methods', async () => {
      const result = await contactInfoHandler(mockEvent)

      const emailMethod = result.contactMethods.methods.find(m => m.icon === 'email')
      if (emailMethod) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        expect(emailRegex.test(emailMethod.contact)).toBe(true)
      }
    })

    it('should include FAQ section', async () => {
      const result = await contactInfoHandler(mockEvent)

      expect(result.faq).toHaveProperty('title')
      expect(result.faq).toHaveProperty('questions')
      expect(Array.isArray(result.faq.questions)).toBe(true)
      
      if (result.faq.questions.length > 0) {
        const question = result.faq.questions[0]
        expect(question).toHaveProperty('question')
        expect(question).toHaveProperty('answer')
      }
    })
  })
})