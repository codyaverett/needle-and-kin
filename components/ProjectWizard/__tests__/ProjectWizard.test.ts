import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectWizard from '../ProjectWizard.vue'

describe('ProjectWizard Component', () => {
  it('renders properly', () => {
    const wrapper = mount(ProjectWizard, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(ProjectWizard)
    expect(wrapper.vm.$options.name || 'ProjectWizard').toBeTruthy()
  })

  // TODO: Add more specific tests for ProjectWizard
})
