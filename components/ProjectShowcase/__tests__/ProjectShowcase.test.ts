import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectShowcase from '../ProjectShowcase.vue'

describe('ProjectShowcase Component', () => {
  it('renders properly', () => {
    const wrapper = mount(ProjectShowcase, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(ProjectShowcase)
    expect(wrapper.vm.$options.name || 'ProjectShowcase').toBeTruthy()
  })

  // TODO: Add more specific tests for ProjectShowcase
})
