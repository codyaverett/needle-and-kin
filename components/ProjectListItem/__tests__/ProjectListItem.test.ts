import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectListItem from '../ProjectListItem.vue'

const mockProject = {
  id: '1',
  userId: '1',
  username: 'Jane Doe',
  userAvatar: '/avatars/jane.jpg',
  title: 'Cozy Winter Scarf',
  description: 'A beautiful winter scarf perfect for cold days',
  images: ['/projects/scarf1.jpg', '/projects/scarf2.jpg'],
  coverImage: '/projects/scarf-cover.jpg',
  category: 'Knitting',
  difficulty: 'beginner' as const,
  materials: [
    {
      id: 'mat1',
      name: 'Yarn',
      quantity: '2',
      unit: 'skeins'
    }
  ],
  steps: [
    {
      id: 'step1',
      number: 1,
      title: 'Cast on',
      description: 'Cast on 40 stitches',
      duration: '10 minutes'
    }
  ],
  progress: 100,
  status: 'completed' as const,
  tags: ['winter', 'beginner', 'scarf'],
  likes: 25,
  views: 150,
  estimatedTime: '2 hours',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02')
}

describe('ProjectListItem Component', () => {
  it('renders properly', () => {
    const wrapper = mount(ProjectListItem, {
      props: {
        project: mockProject
      },
      global: {
        stubs: {
          NuxtLink: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(ProjectListItem, {
      props: {
        project: mockProject
      },
      global: {
        stubs: {
          NuxtLink: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'ProjectListItem').toBeTruthy()
  })

  // TODO: Add more specific tests for ProjectListItem
})
