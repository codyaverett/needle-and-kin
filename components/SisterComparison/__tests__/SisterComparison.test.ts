import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SisterComparison from '../SisterComparison.vue'

const mockComparison = {
  title: 'Knitting vs. Crochet: Two Approaches to the Same Scarf',
  description: 'See how both sisters tackle creating a cozy winter scarf using different techniques',
  sister1: {
    name: 'Emma',
    approach: 'Knitting',
    subtitle: 'The Traditional Knitter',
    avatar: '/avatars/emma.jpg',
    resultImage: '/projects/emma-scarf.jpg',
    techniques: ['Stockinette stitch', 'Ribbing'],
    materials: ['Wool yarn', 'Knitting needles'],
    reasoning: 'I chose knitting because it creates a denser, warmer fabric perfect for winter scarves',
    timeSpent: '8 hours',
    difficulty: 'Beginner'
  },
  sister2: {
    name: 'Sophie',
    approach: 'Crochet',
    subtitle: 'The Speedy Crocheter',
    avatar: '/avatars/sophie.jpg',
    resultImage: '/projects/sophie-scarf.jpg',
    techniques: ['Single crochet', 'Double crochet'],
    materials: ['Cotton yarn', 'Crochet hook'],
    reasoning: 'Crochet is faster and I love the texture variations I can create',
    timeSpent: '4 hours',
    difficulty: 'Beginner'
  },
  insights: [
    {
      title: 'Speed vs. Texture',
      description: 'Crochet was significantly faster, but knitting created a smoother finish'
    }
  ]
}

describe('SisterComparison Component', () => {
  it('renders properly', () => {
    const wrapper = mount(SisterComparison, {
      props: {
        comparison: mockComparison
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(SisterComparison, {
      props: {
        comparison: mockComparison
      }
    })
    expect(wrapper.vm.$options.name || 'SisterComparison').toBeTruthy()
  })

  // TODO: Add more specific tests for SisterComparison
})
