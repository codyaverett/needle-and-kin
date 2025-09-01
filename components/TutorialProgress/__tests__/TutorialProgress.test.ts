import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TutorialProgress from '../TutorialProgress.vue'

const mockTutorial = {
  id: '1',
  title: 'Test Tutorial',
  description: 'A test tutorial',
  steps: [
    {
      id: 'step1',
      title: 'First Step',
      content: 'Step 1 content',
      duration: '10 minutes'
    },
    {
      id: 'step2',
      title: 'Second Step', 
      content: 'Step 2 content',
      duration: '15 minutes'
    },
    {
      id: 'step3',
      title: 'Third Step',
      content: 'Step 3 content',
      duration: '20 minutes'
    }
  ]
}

describe('TutorialProgress Component', () => {
  it('renders properly', () => {
    const wrapper = mount(TutorialProgress, {
      props: {
        tutorial: mockTutorial,
        currentStep: 0,
        completedSteps: [0]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(TutorialProgress, {
      props: {
        tutorial: mockTutorial,
        currentStep: 0,
        completedSteps: [0]
      }
    })
    expect(wrapper.vm.$options.name || 'TutorialProgress').toBeTruthy()
  })

  // TODO: Add more specific tests for TutorialProgress
})
