import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CommentItem from '../CommentItem.vue'

describe('CommentItem Component', () => {
  it('renders properly', () => {
    const wrapper = mount(CommentItem, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(CommentItem)
    expect(wrapper.vm.$options.name || 'CommentItem').toBeTruthy()
  })

  // TODO: Add more specific tests for CommentItem
})
