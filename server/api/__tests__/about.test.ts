import { describe, it, expect } from 'vitest'
import aboutHandler from '../about.get'

describe('GET /api/about', () => {
  const mockEvent = {
    node: {
      req: {
        method: 'GET',
        headers: {}
      }
    }
  }

  it('should return about page content structure', async () => {
    const result = await aboutHandler(mockEvent)

    expect(result).toBeDefined()
    expect(result).toHaveProperty('hero')
    expect(result).toHaveProperty('story')
    expect(result).toHaveProperty('mission')
    expect(result).toHaveProperty('team')
    expect(result).toHaveProperty('cta')
  })

  it('should include hero section with title and description', async () => {
    const result = await aboutHandler(mockEvent)

    expect(result.hero).toHaveProperty('title')
    expect(result.hero).toHaveProperty('description')
    expect(typeof result.hero.title).toBe('string')
    expect(typeof result.hero.description).toBe('string')
  })

  it('should include story section with content array', async () => {
    const result = await aboutHandler(mockEvent)

    expect(result.story).toHaveProperty('title')
    expect(result.story).toHaveProperty('content')
    expect(Array.isArray(result.story.content)).toBe(true)
    expect(result.story.content.length).toBeGreaterThan(0)
  })

  it('should include mission with values array', async () => {
    const result = await aboutHandler(mockEvent)

    expect(result.mission).toHaveProperty('title')
    expect(result.mission).toHaveProperty('values')
    expect(Array.isArray(result.mission.values)).toBe(true)
    
    if (result.mission.values.length > 0) {
      const value = result.mission.values[0]
      expect(value).toHaveProperty('icon')
      expect(value).toHaveProperty('title')
      expect(value).toHaveProperty('description')
    }
  })

  it('should include team information', async () => {
    const result = await aboutHandler(mockEvent)

    expect(result.team).toHaveProperty('title')
    expect(result.team).toHaveProperty('description')
    expect(result.team).toHaveProperty('members')
    expect(Array.isArray(result.team.members)).toBe(true)
    
    if (result.team.members.length > 0) {
      const member = result.team.members[0]
      expect(member).toHaveProperty('name')
      expect(member).toHaveProperty('role')
      expect(member).toHaveProperty('bio')
      expect(member).toHaveProperty('avatar')
    }
  })

  it('should include call-to-action section', async () => {
    const result = await aboutHandler(mockEvent)

    expect(result.cta).toHaveProperty('title')
    expect(result.cta).toHaveProperty('description')
    expect(result.cta).toHaveProperty('buttons')
    expect(Array.isArray(result.cta.buttons)).toBe(true)
    
    if (result.cta.buttons.length > 0) {
      const button = result.cta.buttons[0]
      expect(button).toHaveProperty('text')
      expect(button).toHaveProperty('url')
      expect(button).toHaveProperty('type')
    }
  })
})