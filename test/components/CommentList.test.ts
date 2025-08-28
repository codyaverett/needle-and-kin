import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import CommentList from '~/components/CommentList.vue'
import CommentItem from '~/components/CommentItem.vue'

// Mock $fetch
global.$fetch = vi.fn()

describe('CommentList Component', () => {
  const mockComments = [
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      userAvatar: '/avatars/john.jpg',
      content: 'First comment',
      createdAt: new Date().toISOString(),
      isEdited: false,
      isLiked: false,
      likes: 5,
      replies: []
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Jane Smith',
      userAvatar: '/avatars/jane.jpg',
      content: 'Second comment',
      createdAt: new Date().toISOString(),
      isEdited: false,
      isLiked: true,
      likes: 10,
      replies: []
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders comments list correctly', () => {
    const wrapper = mount(CommentList, {
      props: {
        comments: mockComments,
        totalComments: 2,
        hasMore: false,
        isLoadingMore: false,
        postId: '123'
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          CommentItem: true,
          NuxtLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })

    expect(wrapper.text()).toContain('Comments (2)')
    expect(wrapper.findAllComponents(CommentItem)).toHaveLength(2)
  })

  it('shows empty state when no comments', () => {
    const wrapper = mount(CommentList, {
      props: {
        comments: [],
        totalComments: 0,
        hasMore: false,
        isLoadingMore: false,
        postId: '123'
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          NuxtLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })

    expect(wrapper.text()).toContain('No comments yet')
    expect(wrapper.text()).toContain('Be the first to share your thoughts!')
  })

  it('shows comment form for authenticated users', () => {
    const wrapper = mount(CommentList, {
      props: {
        comments: [],
        totalComments: 0,
        hasMore: false,
        isLoadingMore: false,
        postId: '123'
      },
      global: {
        plugins: [createTestingPinia({
          initialState: {
            user: {
              isAuthenticated: true,
              currentUser: {
                id: 'user1',
                name: 'John Doe',
                avatar: '/avatars/john.jpg'
              }
            }
          }
        })],
        stubs: {
          NuxtLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })

    expect(wrapper.find('textarea[placeholder*="Add a comment"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').text()).toContain('Post Comment')
  })

  it('shows login prompt for non-authenticated users', () => {
    const wrapper = mount(CommentList, {
      props: {
        comments: [],
        totalComments: 0,
        hasMore: false,
        isLoadingMore: false,
        postId: '123'
      },
      global: {
        plugins: [createTestingPinia({
          initialState: {
            user: {
              isAuthenticated: false,
              currentUser: null
            }
          }
        })],
        stubs: {
          NuxtLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })

    expect(wrapper.text()).toContain('Join the conversation!')
    expect(wrapper.text()).toContain('Login to Comment')
    expect(wrapper.find('textarea').exists()).toBe(false)
  })

  it('emits sort-change event when sort option changes', async () => {
    const wrapper = mount(CommentList, {
      props: {
        comments: mockComments,
        totalComments: 2,
        hasMore: false,
        isLoadingMore: false,
        postId: '123'
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          CommentItem: true,
          NuxtLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })

    const select = wrapper.find('select#sort')
    await select.setValue('popular')

    expect(wrapper.emitted('sort-change')).toBeTruthy()
    expect(wrapper.emitted('sort-change')?.[0]).toEqual(['popular'])
  })

  it('shows load more button when hasMore is true', () => {
    const wrapper = mount(CommentList, {
      props: {
        comments: mockComments,
        totalComments: 10,
        hasMore: true,
        isLoadingMore: false,
        postId: '123'
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          CommentItem: true,
          NuxtLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })

    const loadMoreButton = wrapper.find('button[disabled=false]')
    expect(loadMoreButton.text()).toContain('Load More Comments')
  })

  it('shows loading state for load more button', () => {
    const wrapper = mount(CommentList, {
      props: {
        comments: mockComments,
        totalComments: 10,
        hasMore: true,
        isLoadingMore: true,
        postId: '123'
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          CommentItem: true,
          NuxtLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })

    const loadMoreButton = wrapper.find('button[disabled=true]')
    expect(loadMoreButton.text()).toContain('Loading...')
  })

  it('emits load-more event when button clicked', async () => {
    const wrapper = mount(CommentList, {
      props: {
        comments: mockComments,
        totalComments: 10,
        hasMore: true,
        isLoadingMore: false,
        postId: '123'
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          CommentItem: true,
          NuxtLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })

    const loadMoreButton = wrapper.find('button[disabled=false]')
    await loadMoreButton.trigger('click')

    expect(wrapper.emitted('load-more')).toBeTruthy()
  })

  it('displays character count for comment input', async () => {
    const wrapper = mount(CommentList, {
      props: {
        comments: [],
        totalComments: 0,
        hasMore: false,
        isLoadingMore: false,
        postId: '123'
      },
      global: {
        plugins: [createTestingPinia({
          initialState: {
            user: {
              isAuthenticated: true,
              currentUser: {
                id: 'user1',
                name: 'John Doe',
                avatar: '/avatars/john.jpg'
              }
            }
          }
        })],
        stubs: {
          NuxtLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })

    const textarea = wrapper.find('textarea')
    await textarea.setValue('This is a test comment')

    expect(wrapper.text()).toContain('22/2000 characters')
  })

  it('submits comment successfully', async () => {
    global.$fetch = vi.fn().mockResolvedValue({
      success: true,
      comment: {
        id: '3',
        content: 'New comment',
        userId: 'user1'
      }
    })

    const wrapper = mount(CommentList, {
      props: {
        comments: [],
        totalComments: 0,
        hasMore: false,
        isLoadingMore: false,
        postId: '123'
      },
      global: {
        plugins: [createTestingPinia({
          initialState: {
            user: {
              isAuthenticated: true,
              currentUser: {
                id: 'user1',
                name: 'John Doe',
                avatar: '/avatars/john.jpg'
              }
            }
          }
        })],
        stubs: {
          NuxtLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })

    const textarea = wrapper.find('textarea')
    await textarea.setValue('New comment')
    
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    expect(global.$fetch).toHaveBeenCalledWith('/api/posts/123/comments', {
      method: 'POST',
      body: {
        content: 'New comment'
      }
    })

    expect(wrapper.emitted('submit-comment')).toBeTruthy()
  })
})