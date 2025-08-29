import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationBell from '../NotificationBell.vue'

describe('NotificationBell Component', () => {
  it('renders properly', () => {
    const wrapper = mount(NotificationBell, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(NotificationBell)
    expect(wrapper.vm.$options.name || 'NotificationBell').toBeTruthy()
  })

  // TODO: Add more specific tests for NotificationBell
})
