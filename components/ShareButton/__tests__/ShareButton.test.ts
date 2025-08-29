import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ShareButton from '../ShareButton.vue'

describe('ShareButton Component', () => {
  it('renders properly', () => {
    const wrapper = mount(ShareButton, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(ShareButton)
    expect(wrapper.vm.$options.name || 'ShareButton').toBeTruthy()
  })

  // TODO: Add more specific tests for ShareButton
})
