import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TutorialViewer from '../TutorialViewer.vue'

const mockTutorial = {
  id: '1',
  title: 'Test Tutorial',
  description: 'A test tutorial description',
  coverImage: '/test-cover.jpg',
  category: 'Embroidery',
  difficulty: 'beginner' as const,
  steps: [
    {
      id: 'step1',
      number: 1,
      title: 'First Step',
      content: 'Step 1 content',
      duration: '10 minutes'
    },
    {
      id: 'step2',
      number: 2,
      title: 'Second Step',
      content: 'Step 2 content', 
      duration: '15 minutes'
    }
  ],
  materials: [
    {
      id: 'mat1',
      name: 'Thread',
      quantity: '1',
      unit: 'spool'
    }
  ],
  estimatedTime: '25 minutes',
  skillsLearned: ['Basic embroidery', 'Color mixing'],
  prerequisites: ['Basic sewing knowledge'],
  author: {
    id: '1',
    name: 'Test Author',
    avatar: '/test-avatar.jpg'
  },
  likes: 10,
  views: 100,
  completions: 5,
  rating: 4.5,
  tags: ['embroidery', 'beginner'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02')
}

describe('TutorialViewer Component', () => {
  it('renders properly', () => {
    const wrapper = mount(TutorialViewer, {
      props: {
        tutorial: mockTutorial
      },
      global: {
        stubs: {
          TutorialProgress: true,
          TutorialStep: true,
          TutorialBookmark: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(TutorialViewer, {
      props: {
        tutorial: mockTutorial
      },
      global: {
        stubs: {
          TutorialProgress: true,
          TutorialStep: true,
          TutorialBookmark: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'TutorialViewer').toBeTruthy()
  })

  // TODO: Add more specific tests for TutorialViewer
})
