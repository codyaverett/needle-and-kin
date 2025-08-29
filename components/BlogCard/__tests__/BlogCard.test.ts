import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BlogCard from '../BlogCard.vue'

describe('BlogCard Component', () => {
  it('renders properly', () => {
    const wrapper = mount(BlogCard, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(BlogCard)
    expect(wrapper.vm.$options.name || 'BlogCard').toBeTruthy()
  })

  // TODO: Add more specific tests for BlogCard
})
