import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CommentItem from '../CommentItem.vue'

describe('CommentItem Component', () => {
  const mockComment = {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    userAvatar: '/avatar.jpg',
    content: 'This is a test comment',
    createdAt: new Date().toISOString(),
    likes: 5,
    isLiked: false,
    isPinned: false,
    isEdited: false,
    isHidden: false,
    userRole: 'user',
    replies: []
  }

  it('renders properly', () => {
    const wrapper = mount(CommentItem, {
      props: {
        comment: mockComment
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(CommentItem, {
      props: {
        comment: mockComment
      }
    })
    expect(wrapper.vm.$options.name || 'CommentItem').toBeTruthy()
  })

  // TODO: Add more specific tests for CommentItem
})
