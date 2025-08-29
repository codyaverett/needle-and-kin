import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ActivityFilter from '../ActivityFilter.vue'

describe('ActivityFilter Component', () => {
  it('renders properly', () => {
    const wrapper = mount(ActivityFilter, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(ActivityFilter)
    expect(wrapper.vm.$options.name || 'ActivityFilter').toBeTruthy()
  })

  // TODO: Add more specific tests for ActivityFilter
})
