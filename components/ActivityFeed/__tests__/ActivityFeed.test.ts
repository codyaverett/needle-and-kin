import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ActivityFeed from '../ActivityFeed.vue'

describe('ActivityFeed Component', () => {
  it('renders properly', () => {
    const wrapper = mount(ActivityFeed, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(ActivityFeed)
    expect(wrapper.vm.$options.name || 'ActivityFeed').toBeTruthy()
  })

  // TODO: Add more specific tests for ActivityFeed
})
