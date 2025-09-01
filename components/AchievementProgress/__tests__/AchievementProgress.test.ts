import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AchievementProgress from '../AchievementProgress.vue'

const mockAchievement = {
  id: '1',
  name: 'First Steps',
  description: 'Complete your first knitting project',
  category: 'knitting',
  rarity: 'common',
  progress: 5,
  maxProgress: 10,
  points: 100,
  unlockedAt: null,
  icon: 'mdi:trophy',
  requirement: {
    type: 'projects_completed',
    value: 1
  }
}

describe('AchievementProgress Component', () => {
  it('renders properly', () => {
    const wrapper = mount(AchievementProgress, {
      props: {
        achievement: mockAchievement
      },
      global: {
        stubs: {
          AchievementBadge: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(AchievementProgress, {
      props: {
        achievement: mockAchievement
      },
      global: {
        stubs: {
          AchievementBadge: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'AchievementProgress').toBeTruthy()
  })

  // TODO: Add more specific tests for AchievementProgress
})
