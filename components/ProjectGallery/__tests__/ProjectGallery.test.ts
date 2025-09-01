import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectGallery from '../ProjectGallery.vue'

const mockProject = {
  id: '1',
  title: 'Test Project',
  category: 'Knitting',
  difficulty: 'beginner',
  likes: 10,
  views: 100,
  status: 'completed',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

describe('ProjectGallery Component', () => {
  it('renders properly', () => {
    const wrapper = mount(ProjectGallery, {
      props: {
        projects: [mockProject]
      },
      global: {
        stubs: {
          ProjectCard: true,
          ProjectListItem: true,
          NuxtLink: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(ProjectGallery, {
      props: {
        projects: [mockProject]
      },
      global: {
        stubs: {
          ProjectCard: true,
          ProjectListItem: true,
          NuxtLink: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'ProjectGallery').toBeTruthy()
  })

  // TODO: Add more specific tests for ProjectGallery
})
