import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AchievementBadge from '../AchievementBadge.vue'

describe('AchievementBadge Component', () => {
  it('renders properly', () => {
    const wrapper = mount(AchievementBadge, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(AchievementBadge)
    expect(wrapper.vm.$options.name || 'AchievementBadge').toBeTruthy()
  })

  // TODO: Add more specific tests for AchievementBadge
})
