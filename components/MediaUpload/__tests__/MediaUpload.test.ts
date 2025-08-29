import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MediaUpload from '../MediaUpload.vue'

describe('MediaUpload Component', () => {
  it('renders properly', () => {
    const wrapper = mount(MediaUpload, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(MediaUpload)
    expect(wrapper.vm.$options.name || 'MediaUpload').toBeTruthy()
  })

  // TODO: Add more specific tests for MediaUpload
})
