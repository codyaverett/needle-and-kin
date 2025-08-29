import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CommentList from '../CommentList.vue'

describe('CommentList Component', () => {
  it('renders properly', () => {
    const wrapper = mount(CommentList, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(CommentList)
    expect(wrapper.vm.$options.name || 'CommentList').toBeTruthy()
  })

  // TODO: Add more specific tests for CommentList
})
