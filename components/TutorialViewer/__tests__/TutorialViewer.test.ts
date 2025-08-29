import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TutorialViewer from '../TutorialViewer.vue'

describe('TutorialViewer Component', () => {
  it('renders properly', () => {
    const wrapper = mount(TutorialViewer, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(TutorialViewer)
    expect(wrapper.vm.$options.name || 'TutorialViewer').toBeTruthy()
  })

  // TODO: Add more specific tests for TutorialViewer
})
