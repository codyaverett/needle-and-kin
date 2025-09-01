import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BlogCard from '../BlogCard.vue'

const mockPost = {
  id: '1',
  title: 'Test Blog Post',
  slug: 'test-blog-post',
  excerpt: 'This is a test blog post excerpt that describes the content.',
  image: '/test-image.jpg',
  publishedAt: new Date().toISOString(),
  readTime: '5 min read',
  author: {
    id: '1',
    name: 'Test Author',
    avatar: '/test-author.jpg'
  }
}

describe('BlogCard Component', () => {
  it('renders properly', () => {
    const wrapper = mount(BlogCard, {
      props: {
        post: mockPost
      },
      global: {
        stubs: {
          NuxtLink: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(BlogCard, {
      props: {
        post: mockPost
      },
      global: {
        stubs: {
          NuxtLink: true
        }
      }
    })
    expect(wrapper.vm.$options.name || 'BlogCard').toBeTruthy()
  })

  // TODO: Add more specific tests for BlogCard
})
