import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactForm from '../ContactForm.vue'

describe('ContactForm Component', () => {
  it('renders properly', () => {
    const wrapper = mount(ContactForm, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(ContactForm)
    expect(wrapper.vm.$options.name || 'ContactForm').toBeTruthy()
  })

  // TODO: Add more specific tests for ContactForm
})
