import { describe, it, expect } from 'vitest'
import contactInfoHandler from '../contact-info.get'

describe('GET /api/contact-info', () => {
  const mockEvent = {
    node: {
      req: {
        method: 'GET',
        headers: {}
      }
    }
  }

  it('should return contact information structure', async () => {
    const result = await contactInfoHandler(mockEvent)

    expect(result).toBeDefined()
    expect(result).toHaveProperty('hero')
    expect(result).toHaveProperty('form')
    expect(result).toHaveProperty('contactMethods')
    expect(result).toHaveProperty('faq')
  })

  it('should include hero section', async () => {
    const result = await contactInfoHandler(mockEvent)

    expect(result.hero).toHaveProperty('title')
    expect(result.hero).toHaveProperty('description')
    expect(typeof result.hero.title).toBe('string')
    expect(typeof result.hero.description).toBe('string')
  })

  it('should include form configuration', async () => {
    const result = await contactInfoHandler(mockEvent)

    expect(result.form).toHaveProperty('title')
    expect(result.form).toHaveProperty('subjects')
    expect(Array.isArray(result.form.subjects)).toBe(true)
    
    if (result.form.subjects.length > 0) {
      const subject = result.form.subjects[0]
      expect(subject).toHaveProperty('value')
      expect(subject).toHaveProperty('label')
    }
  })

  it('should include contact methods', async () => {
    const result = await contactInfoHandler(mockEvent)

    expect(result.contactMethods).toHaveProperty('title')
    expect(result.contactMethods).toHaveProperty('methods')
    expect(Array.isArray(result.contactMethods.methods)).toBe(true)
    
    if (result.contactMethods.methods.length > 0) {
      const method = result.contactMethods.methods[0]
      expect(method).toHaveProperty('icon')
      expect(method).toHaveProperty('title')
      expect(method).toHaveProperty('description')
      expect(method).toHaveProperty('contact')
      expect(method).toHaveProperty('url')
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

  it('should include valid email in contact methods', async () => {
    const result = await contactInfoHandler(mockEvent)

    const emailMethod = result.contactMethods.methods.find(m => m.icon === 'email')
    expect(emailMethod).toBeDefined()
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    expect(emailRegex.test(emailMethod.contact)).toBe(true)
    expect(emailMethod.contact).toBe('hello@needleandkin.com')
  })

  it('should include social media methods', async () => {
    const result = await contactInfoHandler(mockEvent)

    const socialMethods = result.contactMethods.methods.filter(m => 
      m.icon === 'instagram' || m.icon === 'pinterest'
    )
    expect(socialMethods.length).toBeGreaterThan(0)
    
    socialMethods.forEach(method => {
      expect(method.contact).toContain('@needleandkin')
    })
  })
})