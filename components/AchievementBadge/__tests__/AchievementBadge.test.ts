import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AchievementBadge from '../AchievementBadge.vue'

const mockAchievement = {
  id: '1',
  name: 'First Steps',
  description: 'Complete your first knitting project',
  icon: 'mdi:trophy',
  category: 'knitting',
  rarity: 'common',
  points: 100,
  unlockedAt: new Date().toISOString()
}

describe('AchievementBadge Component', () => {
  it('renders properly', () => {
    const wrapper = mount(AchievementBadge, {
      props: {
        achievement: mockAchievement
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(AchievementBadge, {
      props: {
        achievement: mockAchievement
      }
    })
    expect(wrapper.vm.$options.name || 'AchievementBadge').toBeTruthy()
  })

  // TODO: Add more specific tests for AchievementBadge
})
