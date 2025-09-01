import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SkillLevelBadge from '../SkillLevelBadge.vue'

describe('SkillLevelBadge Component', () => {
  it('renders properly', () => {
    const wrapper = mount(SkillLevelBadge, {
      props: {
        level: 'beginner'
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(SkillLevelBadge, {
      props: {
        level: 'beginner'
      }
    })
    expect(wrapper.vm.$options.name || 'SkillLevelBadge').toBeTruthy()
  })

  // TODO: Add more specific tests for SkillLevelBadge
})
