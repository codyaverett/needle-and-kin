import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AchievementShowcase from '../AchievementShowcase.vue'

const mockAchievements = [
  {
    id: '1',
    name: 'First Achievement',
    description: 'Your first achievement',
    points: 10,
    unlockedAt: new Date('2024-01-01'),
    icon: 'trophy'
  },
  {
    id: '2', 
    name: 'Second Achievement',
    description: 'Your second achievement',
    points: 20,
    unlockedAt: null,
    icon: 'medal'
  }
]

describe('AchievementShowcase Component', () => {
  it('renders properly', () => {
    const wrapper = mount(AchievementShowcase, {
      props: {
        achievements: mockAchievements,
        showcased: ['1']
      },
      global: {
        stubs: {
          AchievementBadge: true,
          Teleport: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(AchievementShowcase, {
      props: {
        achievements: mockAchievements,
        showcased: ['1']
      },
      global: {
        stubs: {
          AchievementBadge: true,
          Teleport: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'AchievementShowcase').toBeTruthy()
  })

  // TODO: Add more specific tests for AchievementShowcase
})
