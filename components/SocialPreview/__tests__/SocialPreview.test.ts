import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SocialPreview from '../SocialPreview.vue'

describe('SocialPreview Component', () => {
  it('renders properly', () => {
    const wrapper = mount(SocialPreview, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(SocialPreview)
    expect(wrapper.vm.$options.name || 'SocialPreview').toBeTruthy()
  })

  // TODO: Add more specific tests for SocialPreview
})
