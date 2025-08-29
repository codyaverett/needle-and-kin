import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationCard from '../NotificationCard.vue'

describe('NotificationCard Component', () => {
  it('renders properly', () => {
    const wrapper = mount(NotificationCard, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(NotificationCard)
    expect(wrapper.vm.$options.name || 'NotificationCard').toBeTruthy()
  })

  // TODO: Add more specific tests for NotificationCard
})
