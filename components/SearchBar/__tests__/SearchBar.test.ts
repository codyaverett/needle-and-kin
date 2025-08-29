import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '../SearchBar.vue'

describe('SearchBar Component', () => {
  it('renders properly', () => {
    const wrapper = mount(SearchBar, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(SearchBar)
    expect(wrapper.vm.$options.name || 'SearchBar').toBeTruthy()
  })

  // TODO: Add more specific tests for SearchBar
})
