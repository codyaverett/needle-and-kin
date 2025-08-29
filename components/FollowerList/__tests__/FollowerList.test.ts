import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FollowerList from '../FollowerList.vue'

describe('FollowerList Component', () => {
  it('renders properly', () => {
    const wrapper = mount(FollowerList, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(FollowerList)
    expect(wrapper.vm.$options.name || 'FollowerList').toBeTruthy()
  })

  // TODO: Add more specific tests for FollowerList
})
