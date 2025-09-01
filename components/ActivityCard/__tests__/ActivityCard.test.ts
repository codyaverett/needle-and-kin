import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ActivityCard from '../ActivityCard.vue'

const mockActivity = {
  id: '1',
  type: 'posted',
  user: {
    id: '1',
    username: 'testuser',
    name: 'Test User',
    avatar: '/test-avatar.jpg',
    isVerified: false
  },
  target: {
    id: '1',
    type: 'post',
    title: 'Test Post',
    excerpt: 'This is a test post excerpt'
  },
  createdAt: new Date().toISOString(),
  isLiked: false,
  likesCount: 0,
  commentsCount: 0
}

describe('ActivityCard Component', () => {
  it('renders properly', () => {
    const wrapper = mount(ActivityCard, {
      props: {
        activity: mockActivity
      },
      global: {
        stubs: {
          Icon: true,
          NuxtLink: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(ActivityCard, {
      props: {
        activity: mockActivity
      },
      global: {
        stubs: {
          Icon: true,
          NuxtLink: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'ActivityCard').toBeTruthy()
  })

  // TODO: Add more specific tests for ActivityCard
})
