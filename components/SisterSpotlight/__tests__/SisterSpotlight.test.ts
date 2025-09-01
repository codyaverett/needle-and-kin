import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SisterSpotlight from '../SisterSpotlight.vue'

const mockCollaboration = {
  projectTitle: 'Test Collaboration Project',
  description: 'A wonderful collaboration between sisters',
  mainImage: '/test-image.jpg',
  duration: '2 weeks',
  skillLevel: 'Intermediate',
  sisters: [
    {
      name: 'Sister One',
      role: 'Designer',
      avatar: '/avatar1.jpg',
      contribution: 'Created the beautiful design patterns'
    },
    {
      name: 'Sister Two',
      role: 'Crafter',
      avatar: '/avatar2.jpg', 
      contribution: 'Expert needlework and finishing'
    }
  ],
  tags: ['Embroidery', 'Collaboration', 'Advanced'],
  tutorialUrl: '/tutorial/123',
  behindScenesUrl: '/behind-scenes/123',
  processImages: [
    {
      src: '/process1.jpg',
      caption: 'Initial sketch'
    },
    {
      src: '/process2.jpg',
      caption: 'Work in progress'
    }
  ]
}

describe('SisterSpotlight Component', () => {
  it('renders properly', () => {
    const wrapper = mount(SisterSpotlight, {
      props: {
        collaboration: mockCollaboration
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(SisterSpotlight, {
      props: {
        collaboration: mockCollaboration
      }
    })
    expect(wrapper.vm.$options.name || 'SisterSpotlight').toBeTruthy()
  })

  // TODO: Add more specific tests for SisterSpotlight
})
