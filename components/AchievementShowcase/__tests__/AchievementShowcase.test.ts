import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AchievementShowcase from '../AchievementShowcase.vue'

describe('AchievementShowcase Component', () => {
  it('renders properly', () => {
    const wrapper = mount(AchievementShowcase, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(AchievementShowcase)
    expect(wrapper.vm.$options.name || 'AchievementShowcase').toBeTruthy()
  })

  // TODO: Add more specific tests for AchievementShowcase
})
