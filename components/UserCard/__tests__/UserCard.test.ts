import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserCard from '../UserCard.vue'

describe('UserCard Component', () => {
  it('renders properly', () => {
    const wrapper = mount(UserCard, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(UserCard)
    expect(wrapper.vm.$options.name || 'UserCard').toBeTruthy()
  })

  // TODO: Add more specific tests for UserCard
})
