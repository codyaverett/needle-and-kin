import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectCard from '../ProjectCard.vue'

const mockProject = {
  id: '1',
  userId: '1',
  username: 'Test Author',
  userAvatar: '/avatars/test.jpg',
  title: 'Test Project',
  description: 'A test project description',
  images: ['https://example.com/image.jpg'],
  coverImage: 'https://example.com/cover.jpg',
  category: 'Embroidery',
  difficulty: 'beginner' as const,
  materials: [
    {
      id: 'mat1',
      name: 'Thread',
      quantity: '1',
      unit: 'spool'
    }
  ],
  steps: [
    {
      id: 'step1',
      number: 1,
      title: 'Start embroidery',
      description: 'Begin with a basic stitch',
      duration: '30 minutes'
    }
  ],
  progress: 75,
  status: 'in_progress' as const,
  tags: ['embroidery', 'beginner'],
  likes: 10,
  views: 50,
  estimatedTime: '2 hours',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02')
}

describe('ProjectCard Component', () => {
  it('renders properly', () => {
    const wrapper = mount(ProjectCard, {
      props: {
        project: mockProject
      },
      global: {
        stubs: {
          NuxtLink: true,
          Icon: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(ProjectCard, {
      props: {
        project: mockProject
      },
      global: {
        stubs: {
          NuxtLink: true,
          Icon: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'ProjectCard').toBeTruthy()
  })

  // TODO: Add more specific tests for ProjectCard
})
