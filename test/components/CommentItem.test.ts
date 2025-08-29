import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CommentItem from '~/components/CommentItem/CommentItem.vue'

describe('CommentItem Component', () => {
  const mockComment = {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    userAvatar: '/avatars/john.jpg',
    content: 'This is a test comment',
    createdAt: new Date().toISOString(),
    isEdited: false,
    isLiked: false,
    likes: 5,
    replies: []
  }

  const mockCurrentUserId = 'user1'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders comment content correctly', () => {
    const wrapper = mount(CommentItem, {
      props: {
        comment: mockComment,
        currentUserId: null
      }
    })

    expect(wrapper.text()).toContain(mockComment.content)
    expect(wrapper.text()).toContain(mockComment.userName)
    expect(wrapper.find('img').attributes('src')).toBe(mockComment.userAvatar)
  })

  it('shows edit and delete buttons for comment author', () => {
    const wrapper = mount(CommentItem, {
      props: {
        comment: mockComment,
        currentUserId: mockCurrentUserId
      }
    })

    const menuButton = wrapper.find('button[title*="menu"]')
    expect(menuButton.exists()).toBe(false) // Menu button might not have title attribute
    
    // Check if the menu button exists (it's the button with three dots)
    const buttons = wrapper.findAll('button')
    const menuBtn = buttons.find(btn => btn.html().includes('M10 6a2 2'))
    expect(menuBtn).toBeDefined()
  })

  it('does not show edit/delete buttons for non-author', () => {
    const wrapper = mount(CommentItem, {
      props: {
        comment: mockComment,
        currentUserId: 'differentUser'
      }
    })

    const buttons = wrapper.findAll('button')
    const menuBtn = buttons.find(btn => btn.html().includes('M10 6a2 2'))
    expect(menuBtn).toBeUndefined()
  })

  it('emits like event when like button is clicked', async () => {
    const wrapper = mount(CommentItem, {
      props: {
        comment: mockComment,
        currentUserId: mockCurrentUserId
      }
    })

    const likeButton = wrapper.findAll('button').find(btn => btn.text().includes(mockComment.likes.toString()))
    await likeButton?.trigger('click')

    expect(wrapper.emitted('like')).toBeTruthy()
    expect(wrapper.emitted('like')?.[0]).toEqual([mockComment.id])
  })

  it('toggles reply form when reply button is clicked', async () => {
    const wrapper = mount(CommentItem, {
      props: {
        comment: mockComment,
        currentUserId: mockCurrentUserId
      }
    })

    const replyButton = wrapper.findAll('button').find(btn => btn.text().includes('Reply'))
    expect(wrapper.find('input[placeholder*="reply"]').exists()).toBe(false)
    
    await replyButton?.trigger('click')
    
    expect(wrapper.find('input[placeholder*="reply"]').exists()).toBe(true)
  })

  it('emits reply event with correct data', async () => {
    const wrapper = mount(CommentItem, {
      props: {
        comment: mockComment,
        currentUserId: mockCurrentUserId
      }
    })

    // Click the Reply button to show the reply form
    const replyButton = wrapper.findAll('button').find(btn => btn.text().includes('Reply'))
    expect(replyButton).toBeTruthy()
    await replyButton?.trigger('click')
    
    // Wait for the form to appear
    await wrapper.vm.$nextTick()
    
    // Find and fill the reply input
    const replyInput = wrapper.find('input[placeholder*="reply"]')
    expect(replyInput.exists()).toBe(true)
    await replyInput.setValue('This is a reply')
    
    // Wait for Vue to update after setting the value
    await wrapper.vm.$nextTick()
    
    // Find the submit button - it should not be disabled now
    const submitButtons = wrapper.findAll('button').filter(btn => btn.text() === 'Reply')
    // The second Reply button is the submit button (first is the original reply toggle)
    const submitButton = submitButtons[1]
    
    expect(submitButton).toBeTruthy()
    expect(submitButton.attributes('disabled')).toBeUndefined()
    
    await submitButton.trigger('click')
    
    // Wait for the event to be emitted
    await wrapper.vm.$nextTick()
    
    expect(wrapper.emitted('reply')).toBeTruthy()
    expect(wrapper.emitted('reply')?.[0]).toEqual([{
      commentId: mockComment.id,
      content: 'This is a reply'
    }])
  })

  it('displays edited indicator when comment is edited', () => {
    const editedComment = { ...mockComment, isEdited: true }
    const wrapper = mount(CommentItem, {
      props: {
        comment: editedComment,
        currentUserId: null
      }
    })

    expect(wrapper.text()).toContain('(edited)')
  })

  it('applies correct styles for liked comments', () => {
    const likedComment = { ...mockComment, isLiked: true }
    const wrapper = mount(CommentItem, {
      props: {
        comment: likedComment,
        currentUserId: null
      }
    })

    const likeButton = wrapper.findAll('button').find(btn => btn.text().includes(likedComment.likes.toString()))
    expect(likeButton?.classes()).toContain('text-purple-600')
  })

  it('renders replies recursively', () => {
    const commentWithReplies = {
      ...mockComment,
      replies: [
        {
          id: '2',
          userId: 'user2',
          userName: 'Jane Doe',
          userAvatar: '/avatars/jane.jpg',
          content: 'This is a reply',
          createdAt: new Date().toISOString(),
          isEdited: false,
          isLiked: false,
          likes: 2,
          replies: []
        }
      ]
    }

    const wrapper = mount(CommentItem, {
      props: {
        comment: commentWithReplies,
        currentUserId: null
      },
      global: {
        stubs: {
          CommentItem: {
            template: '<div class="comment-stub">{{ comment.content }}</div>',
            props: ['comment', 'currentUserId', 'isReply']
          }
        }
      }
    })

    expect(wrapper.find('.comment-stub').exists()).toBe(true)
  })

  it('formats dates correctly', () => {
    const recentComment = {
      ...mockComment,
      createdAt: new Date(Date.now() - 30000).toISOString() // 30 seconds ago
    }
    
    const wrapper = mount(CommentItem, {
      props: {
        comment: recentComment,
        currentUserId: null
      }
    })

    expect(wrapper.text()).toMatch(/just now|\d+ (second|minute)s? ago/)
  })
})