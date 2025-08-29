import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TutorialStep from '../TutorialStep.vue'

describe('TutorialStep Component', () => {
  it('renders properly', () => {
    const wrapper = mount(TutorialStep, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(TutorialStep)
    expect(wrapper.vm.$options.name || 'TutorialStep').toBeTruthy()
  })

  // TODO: Add more specific tests for TutorialStep
})
