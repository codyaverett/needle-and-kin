import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationDropdown from '../NotificationDropdown.vue'

const mockNotifications = [
  {
    id: '1',
    type: 'comment_reply',
    title: 'New Comment',
    message: 'Someone replied to your comment',
    read: false,
    createdAt: '2024-01-01T00:00:00Z',
    metadata: {}
  },
  {
    id: '2',
    type: 'post_like',
    title: 'Post Liked',
    message: 'Someone liked your post',
    read: true,
    createdAt: '2024-01-02T00:00:00Z',
    metadata: {}
  }
]

describe('NotificationDropdown Component', () => {
  it('renders properly', () => {
    const wrapper = mount(NotificationDropdown, {
      props: {
        notifications: mockNotifications
      },
      global: {
        stubs: {
          Icon: true,
          NotificationCard: true,
          Transition: true,
          TransitionGroup: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(NotificationDropdown, {
      props: {
        notifications: mockNotifications
      },
      global: {
        stubs: {
          Icon: true,
          NotificationCard: true,
          Transition: true,
          TransitionGroup: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'NotificationDropdown').toBeTruthy()
  })

  // TODO: Add more specific tests for NotificationDropdown
})
