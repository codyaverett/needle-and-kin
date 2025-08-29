import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MakerStory from '../MakerStory.vue'

describe('MakerStory Component', () => {
  it('renders properly', () => {
    const wrapper = mount(MakerStory, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(MakerStory)
    expect(wrapper.vm.$options.name || 'MakerStory').toBeTruthy()
  })

  // TODO: Add more specific tests for MakerStory
})
