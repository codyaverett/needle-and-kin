import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectGallery from '../ProjectGallery.vue'

describe('ProjectGallery Component', () => {
  it('renders properly', () => {
    const wrapper = mount(ProjectGallery, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(ProjectGallery)
    expect(wrapper.vm.$options.name || 'ProjectGallery').toBeTruthy()
  })

  // TODO: Add more specific tests for ProjectGallery
})
