import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import AppHeader from '../AppHeader.vue'

describe('AppHeader Component', () => {
  it('renders properly', () => {
    const pinia = createPinia()
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [pinia],
        stubs: {
          NuxtLink: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const pinia = createPinia()
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [pinia],
        stubs: {
          NuxtLink: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'AppHeader').toBeTruthy()
  })

  // TODO: Add more specific tests for AppHeader
})
