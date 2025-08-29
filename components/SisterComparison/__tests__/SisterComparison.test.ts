import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SisterComparison from '../SisterComparison.vue'

describe('SisterComparison Component', () => {
  it('renders properly', () => {
    const wrapper = mount(SisterComparison, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(SisterComparison)
    expect(wrapper.vm.$options.name || 'SisterComparison').toBeTruthy()
  })

  // TODO: Add more specific tests for SisterComparison
})
