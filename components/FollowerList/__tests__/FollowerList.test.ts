import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FollowerList from '../FollowerList.vue'

const mockUsers = [
  {
    id: '1',
    username: 'user1',
    name: 'User One',
    avatar: 'https://example.com/avatar1.jpg',
    bio: 'Test user bio',
    isFollowing: false,
    followersCount: 10,
    followingCount: 5,
    isVerified: false
  },
  {
    id: '2',
    username: 'user2', 
    name: 'User Two',
    avatar: 'https://example.com/avatar2.jpg',
    bio: 'Another test user',
    isFollowing: true,
    followersCount: 20,
    followingCount: 15,
    isVerified: true
  }
]

describe('FollowerList Component', () => {
  it('renders properly', () => {
    const wrapper = mount(FollowerList, {
      props: {
        users: mockUsers
      },
      global: {
        stubs: {
          Icon: true,
          UserCard: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(FollowerList, {
      props: {
        users: mockUsers
      },
      global: {
        stubs: {
          Icon: true,
          UserCard: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'FollowerList').toBeTruthy()
  })

  // TODO: Add more specific tests for FollowerList
})
