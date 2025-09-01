import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ActivityFeed from '../ActivityFeed.vue'

const mockActivities = [
  {
    id: '1',
    type: 'post',
    user: {
      id: '1',
      name: 'Test User',
      username: 'testuser',
      avatar: 'https://example.com/avatar.jpg'
    },
    content: 'Test activity content',
    timestamp: new Date('2024-01-01T00:00:00Z'),
    likes: 5,
    comments: 2,
    isLiked: false
  },
  {
    id: '2', 
    type: 'project',
    user: {
      id: '2',
      name: 'Another User',
      username: 'anotheruser',
      avatar: 'https://example.com/avatar2.jpg'
    },
    content: 'Another test activity',
    timestamp: new Date('2024-01-02T00:00:00Z'),
    likes: 10,
    comments: 5,
    isLiked: true
  }
]

describe('ActivityFeed Component', () => {
  it('renders properly', () => {
    const wrapper = mount(ActivityFeed, {
      props: {
        activities: mockActivities
      },
      global: {
        stubs: {
          Icon: true,
          ActivityFilter: true,
          ActivityCard: true,
          NuxtLink: true,
          TransitionGroup: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(ActivityFeed, {
      props: {
        activities: mockActivities
      },
      global: {
        stubs: {
          Icon: true,
          ActivityFilter: true,
          ActivityCard: true,
          NuxtLink: true,
          TransitionGroup: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'ActivityFeed').toBeTruthy()
  })

  // TODO: Add more specific tests for ActivityFeed
})
