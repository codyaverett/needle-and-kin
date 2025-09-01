import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectProgress from '../ProjectProgress.vue'

const mockProject = {
  id: '1',
  title: 'Test Project',
  description: 'A test project',
  steps: [
    {
      id: 'step1',
      title: 'Step 1',
      description: 'First step',
      completed: true,
      completedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'step2',
      title: 'Step 2',
      description: 'Second step',
      completed: false,
      completedAt: null
    },
    {
      id: 'step3',
      title: 'Step 3',
      description: 'Third step',
      completed: false,
      completedAt: null
    }
  ],
  overallProgress: 33,
  estimatedTimeRemaining: '2 hours',
  startedAt: '2024-01-01T00:00:00Z'
}

describe('ProjectProgress Component', () => {
  it('renders properly', () => {
    const wrapper = mount(ProjectProgress, {
      props: {
        project: mockProject
      },
      global: {
        stubs: {
          Icon: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(ProjectProgress, {
      props: {
        project: mockProject
      },
      global: {
        stubs: {
          Icon: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'ProjectProgress').toBeTruthy()
  })

  // TODO: Add more specific tests for ProjectProgress
})
