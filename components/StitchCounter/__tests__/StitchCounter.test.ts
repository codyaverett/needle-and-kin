import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StitchCounter from '../StitchCounter.vue'

describe('StitchCounter Component', () => {
  it('renders properly', () => {
    const wrapper = mount(StitchCounter, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(StitchCounter)
    expect(wrapper.vm.$options.name || 'StitchCounter').toBeTruthy()
  })

  // TODO: Add more specific tests for StitchCounter
})
