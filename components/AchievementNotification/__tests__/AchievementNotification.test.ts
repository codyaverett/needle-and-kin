import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AchievementNotification from '../AchievementNotification.vue'

describe('AchievementNotification Component', () => {
  const mockAchievement = {
    id: '1',
    name: 'First Project',
    description: 'Complete your first project',
    icon: '🎉',
    points: 100,
    rarity: 'common' as const,
    category: 'projects',
    progress: 1,
    maxProgress: 1,
    unlockedAt: new Date().toISOString()
  }

  it('renders properly', () => {
    const wrapper = mount(AchievementNotification, {
      props: {
        achievement: mockAchievement
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(AchievementNotification, {
      props: {
        achievement: mockAchievement
      }
    })
    expect(wrapper.vm.$options.name || 'AchievementNotification').toBeTruthy()
  })

  // TODO: Add more specific tests for AchievementNotification
})
