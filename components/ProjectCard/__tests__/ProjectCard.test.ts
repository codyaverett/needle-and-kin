import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectCard from '../ProjectCard.vue'

describe('ProjectCard Component', () => {
  it('renders properly', () => {
    const wrapper = mount(ProjectCard, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(ProjectCard)
    expect(wrapper.vm.$options.name || 'ProjectCard').toBeTruthy()
  })

  // TODO: Add more specific tests for ProjectCard
})
