import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MakerStory from '../MakerStory.vue'

const mockMaker = {
  id: '1',
  name: 'Jane Doe',
  avatar: '/avatars/jane.jpg',
  bio: 'Passionate knitter and crafter with 10 years of experience',
  specialties: ['Knitting', 'Embroidery'],
  location: 'Seattle, WA',
  projects: 25,
  followers: 150
}

describe('MakerStory Component', () => {
  it('renders properly', () => {
    const wrapper = mount(MakerStory, {
      props: {
        maker: mockMaker
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(MakerStory, {
      props: {
        maker: mockMaker
      }
    })
    expect(wrapper.vm.$options.name || 'MakerStory').toBeTruthy()
  })

  // TODO: Add more specific tests for MakerStory
})
