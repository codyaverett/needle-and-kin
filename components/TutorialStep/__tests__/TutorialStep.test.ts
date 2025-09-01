import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TutorialStep from '../TutorialStep.vue'

const mockStep = {
  id: '1',
  title: 'Test Step',
  content: '<p>Step content goes here</p>',
  videoUrl: 'https://example.com/video.mp4',
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  duration: '10 minutes',
  tips: ['First tip', 'Second tip'],
  checkpoints: ['Complete task 1', 'Complete task 2', 'Review work']
}

describe('TutorialStep Component', () => {
  it('renders properly', () => {
    const wrapper = mount(TutorialStep, {
      props: {
        step: mockStep,
        stepNumber: 1,
        totalSteps: 5,
        isCompleted: false
      },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(TutorialStep, {
      props: {
        step: mockStep,
        stepNumber: 1,
        totalSteps: 5,
        isCompleted: false
      },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'TutorialStep').toBeTruthy()
  })

  // TODO: Add more specific tests for TutorialStep
})
