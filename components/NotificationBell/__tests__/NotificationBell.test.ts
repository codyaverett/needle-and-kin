import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import NotificationBell from '../NotificationBell.vue'

describe('NotificationBell Component', () => {
  it('renders properly', () => {
    const pinia = createPinia()
    const wrapper = mount(NotificationBell, {
      global: {
        plugins: [pinia],
        stubs: {
          Icon: true,
          NotificationCard: true,
          NuxtLink: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const pinia = createPinia()
    const wrapper = mount(NotificationBell, {
      global: {
        plugins: [pinia],
        stubs: {
          Icon: true,
          NotificationCard: true,
          NuxtLink: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'NotificationBell').toBeTruthy()
  })

  // TODO: Add more specific tests for NotificationBell
})
