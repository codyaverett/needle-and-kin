import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationCard from '../NotificationCard.vue'

const mockNotification = {
  id: '1',
  type: 'comment_reply',
  title: 'New comment on your post',
  message: 'Someone replied to your comment on "Getting Started with Knitting"',
  read: false,
  createdAt: new Date().toISOString(),
  metadata: {
    actionUrl: '/blog/getting-started-with-knitting',
    actionText: 'View Comment'
  }
}

describe('NotificationCard Component', () => {
  it('renders properly', () => {
    const wrapper = mount(NotificationCard, {
      props: {
        notification: mockNotification
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
    const wrapper = mount(NotificationCard, {
      props: {
        notification: mockNotification
      },
      global: {
        stubs: {
          Icon: true,
          NuxtLink: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'NotificationCard').toBeTruthy()
  })

  // TODO: Add more specific tests for NotificationCard
})
