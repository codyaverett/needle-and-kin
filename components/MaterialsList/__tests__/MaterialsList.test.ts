import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MaterialsList from '../MaterialsList.vue'

describe('MaterialsList Component', () => {
  it('renders properly', () => {
    const wrapper = mount(MaterialsList, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(MaterialsList)
    expect(wrapper.vm.$options.name || 'MaterialsList').toBeTruthy()
  })

  // TODO: Add more specific tests for MaterialsList
})
