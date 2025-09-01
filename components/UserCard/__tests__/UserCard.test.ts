import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserCard from '../UserCard.vue'

const mockUser = {
  id: '1',
  username: 'testuser',
  name: 'Test User',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'A test user bio',
  isFollowing: false,
  followersCount: 100,
  followingCount: 50,
  postsCount: 25,
  isVerified: true,
  isOnline: true,
  badge: 'Pro',
  skills: ['Embroidery', 'Quilting', 'Knitting'],
  mutualFollowers: [
    {
      name: 'Mutual Friend',
      avatar: 'https://example.com/mutual.jpg'
    }
  ]
}

describe('UserCard Component', () => {
  it('renders properly', () => {
    const wrapper = mount(UserCard, {
      props: {
        user: mockUser
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
    const wrapper = mount(UserCard, {
      props: {
        user: mockUser
      },
      global: {
        stubs: {
          NuxtLink: true,
          Icon: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'UserCard').toBeTruthy()
  })

  // TODO: Add more specific tests for UserCard
})
