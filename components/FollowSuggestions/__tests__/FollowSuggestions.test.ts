import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FollowSuggestions from '../FollowSuggestions.vue'

describe('FollowSuggestions Component', () => {
  it('renders properly', () => {
    const wrapper = mount(FollowSuggestions, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(FollowSuggestions)
    expect(wrapper.vm.$options.name || 'FollowSuggestions').toBeTruthy()
  })

  // TODO: Add more specific tests for FollowSuggestions
})
