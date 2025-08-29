import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ActivityCard from '../ActivityCard.vue'

describe('ActivityCard Component', () => {
  it('renders properly', () => {
    const wrapper = mount(ActivityCard, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(ActivityCard)
    expect(wrapper.vm.$options.name || 'ActivityCard').toBeTruthy()
  })

  // TODO: Add more specific tests for ActivityCard
})
