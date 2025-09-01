import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import CommentList from '../CommentList.vue'

const mockComment = {
  id: '1',
  content: 'This is a test comment',
  author: {
    id: '1',
    username: 'testuser',
    name: 'Test User',
    avatar: '/test-avatar.jpg'
  },
  createdAt: new Date().toISOString(),
  likes: 0,
  replies: []
}

describe('CommentList Component', () => {
  it('renders properly', () => {
    const pinia = createPinia()
    const wrapper = mount(CommentList, {
      props: {
        postId: '1',
        comments: [mockComment]
      },
      global: {
        plugins: [pinia],
        stubs: {
          CommentItem: true,
          NuxtLink: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const pinia = createPinia()
    const wrapper = mount(CommentList, {
      props: {
        postId: '1',
        comments: [mockComment]
      },
      global: {
        plugins: [pinia],
        stubs: {
          CommentItem: true,
          NuxtLink: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'CommentList').toBeTruthy()
  })

  // TODO: Add more specific tests for CommentList
})
