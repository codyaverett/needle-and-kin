import { describe, it, expect, beforeEach, vi } from 'vitest'
import postHandler from '../[slug]'

// Mock Prisma
vi.mock('~/server/utils/prisma', () => ({
  default: {
    post: {
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn()
    }
  }
}))

describe('GET /api/posts/[slug]', () => {
  const mockEvent = {
    node: {
      req: {
        url: '/api/posts/getting-started-with-knitting',
        method: 'GET'
      }
    }
  }

  let mockPrisma: any

  beforeEach(async () => {
    vi.clearAllMocks()
    global.getRouterParam = vi.fn()
    global.createError = vi.fn((error) => {
      const err = new Error(error.statusMessage)
      err.statusCode = error.statusCode
      return err
    })

    // Get the mocked Prisma instance
    mockPrisma = (await import('~/server/utils/prisma')).default
  })

  it('should return post data for valid slug', async () => {
    const mockPost = {
      id: 1,
      slug: 'getting-started-with-knitting',
      title: 'Getting Started with Knitting: A Beginner\'s Guide',
      excerpt: 'Learn the basics of knitting with this comprehensive guide.',
      content: '<h2>Welcome to the World of Knitting!</h2><p>This guide will teach you everything...</p>',
      image: '/images/knitting-guide.jpg',
      category: 'knitting',
      tags: '["beginner", "tutorial", "knitting"]',
      difficulty: 'beginner',
      readTime: 10,
      views: 150,
      publishedAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      featured: true,
      author: {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Mitchell',
        username: 'sarah_knits',
        avatar: '/avatars/sarah.jpg',
        bio: 'Knitting enthusiast with 15 years of experience'
      },
      _count: {
        likes: 25,
        comments: 10
      }
    }

    const mockRelatedPosts = [
      {
        id: 2,
        slug: 'knitting-needles-guide',
        title: 'Choosing the Right Knitting Needles',
        excerpt: 'Learn about different types of knitting needles.',
        image: '/images/needles.jpg',
        readTime: 5,
        publishedAt: new Date('2024-01-15'),
        author: {
          id: 1,
          firstName: 'Sarah',
          lastName: 'Mitchell',
          username: 'sarah_knits',
          avatar: '/avatars/sarah.jpg'
        }
      }
    ]

    global.getRouterParam.mockReturnValue('getting-started-with-knitting')
    mockPrisma.post.findUnique.mockResolvedValue(mockPost)
    mockPrisma.post.update.mockResolvedValue({ views: 151 })
    mockPrisma.post.findMany.mockResolvedValue(mockRelatedPosts)

    const result = await postHandler(mockEvent)

    expect(global.getRouterParam).toHaveBeenCalledWith(mockEvent, 'slug')
    expect(result).toBeDefined()
    expect(result.id).toBe(1)
    expect(result.slug).toBe('getting-started-with-knitting')
    expect(result.title).toBe('Getting Started with Knitting: A Beginner\'s Guide')
    expect(result.content).toContain('<h2>Welcome to the World of Knitting!</h2>')
    expect(result.views).toBe(151)
    expect(result.relatedPosts).toHaveLength(1)
  })

  it('should include full post metadata', async () => {
    const mockPost = {
      id: 1,
      slug: 'getting-started-with-knitting',
      title: 'Getting Started with Knitting: A Beginner\'s Guide',
      excerpt: 'Learn the basics of knitting with this comprehensive guide.',
      content: '<h2>Welcome to the World of Knitting!</h2><p>This guide will teach you everything...</p>',
      image: '/images/knitting-guide.jpg',
      category: 'knitting',
      tags: '["beginner", "tutorial", "knitting"]',
      difficulty: 'beginner',
      readTime: 10,
      views: 150,
      publishedAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      featured: true,
      author: {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Mitchell',
        username: 'sarah_knits',
        avatar: '/avatars/sarah.jpg',
        bio: 'Knitting enthusiast with 15 years of experience'
      },
      _count: {
        likes: 25,
        comments: 10
      }
    }

    global.getRouterParam.mockReturnValue('getting-started-with-knitting')
    mockPrisma.post.findUnique.mockResolvedValue(mockPost)
    mockPrisma.post.update.mockResolvedValue({ views: 151 })
    mockPrisma.post.findMany.mockResolvedValue([])

    const result = await postHandler(mockEvent)

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('slug')
    expect(result).toHaveProperty('title')
    expect(result).toHaveProperty('excerpt')
    expect(result).toHaveProperty('content')
    expect(result).toHaveProperty('image')
    expect(result).toHaveProperty('author')
    expect(result).toHaveProperty('category')
    expect(result).toHaveProperty('tags')
    expect(result).toHaveProperty('difficulty')
    expect(result).toHaveProperty('readTime')
    expect(result).toHaveProperty('publishedAt')
    expect(result).toHaveProperty('views')
    expect(result).toHaveProperty('likes')
  })

  it('should include author information', async () => {
    const mockPost = {
      id: 1,
      slug: 'getting-started-with-knitting',
      title: 'Getting Started with Knitting: A Beginner\'s Guide',
      excerpt: 'Learn the basics of knitting with this comprehensive guide.',
      content: '<h2>Welcome to the World of Knitting!</h2><p>This guide will teach you everything...</p>',
      image: '/images/knitting-guide.jpg',
      category: 'knitting',
      tags: '["beginner", "tutorial", "knitting"]',
      difficulty: 'beginner',
      readTime: 10,
      views: 150,
      publishedAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      featured: true,
      author: {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Mitchell',
        username: 'sarah_knits',
        avatar: '/avatars/sarah.jpg',
        bio: 'Knitting enthusiast with 15 years of experience'
      },
      _count: {
        likes: 25,
        comments: 10
      }
    }

    global.getRouterParam.mockReturnValue('getting-started-with-knitting')
    mockPrisma.post.findUnique.mockResolvedValue(mockPost)
    mockPrisma.post.update.mockResolvedValue({ views: 151 })
    mockPrisma.post.findMany.mockResolvedValue([])

    const result = await postHandler(mockEvent)

    expect(result.author).toBeDefined()
    expect(result.author.id).toBe(1)
    expect(result.author.name).toBe('Sarah Mitchell')
    expect(result.author.avatar).toBeDefined()
    expect(result.author.bio).toBe('Knitting enthusiast with 15 years of experience')
  })

  it('should include related posts', async () => {
    const mockPost = {
      id: 1,
      slug: 'getting-started-with-knitting',
      title: 'Getting Started with Knitting: A Beginner\'s Guide',
      excerpt: 'Learn the basics of knitting with this comprehensive guide.',
      content: '<h2>Welcome to the World of Knitting!</h2><p>This guide will teach you everything...</p>',
      image: '/images/knitting-guide.jpg',
      category: 'knitting',
      tags: '["beginner", "tutorial", "knitting"]',
      difficulty: 'beginner',
      readTime: 10,
      views: 150,
      publishedAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      featured: true,
      author: {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Mitchell',
        username: 'sarah_knits',
        avatar: '/avatars/sarah.jpg',
        bio: 'Knitting enthusiast with 15 years of experience'
      },
      _count: {
        likes: 25,
        comments: 10
      }
    }

    const mockRelatedPosts = [
      {
        id: 2,
        slug: 'knitting-needles-guide',
        title: 'Choosing the Right Knitting Needles',
        excerpt: 'Learn about different types of knitting needles.',
        image: '/images/needles.jpg',
        readTime: 5,
        publishedAt: new Date('2024-01-15'),
        author: {
          id: 1,
          firstName: 'Sarah',
          lastName: 'Mitchell',
          username: 'sarah_knits',
          avatar: '/avatars/sarah.jpg'
        }
      },
      {
        id: 3,
        slug: 'yarn-selection-tips',
        title: 'How to Choose the Perfect Yarn',
        excerpt: 'Tips for selecting the right yarn for your project.',
        image: '/images/yarn.jpg',
        readTime: 7,
        publishedAt: new Date('2024-01-20'),
        author: {
          id: 1,
          firstName: 'Sarah',
          lastName: 'Mitchell',
          username: 'sarah_knits',
          avatar: '/avatars/sarah.jpg'
        }
      }
    ]

    global.getRouterParam.mockReturnValue('getting-started-with-knitting')
    mockPrisma.post.findUnique.mockResolvedValue(mockPost)
    mockPrisma.post.update.mockResolvedValue({ views: 151 })
    mockPrisma.post.findMany.mockResolvedValue(mockRelatedPosts)

    const result = await postHandler(mockEvent)

    expect(result.relatedPosts).toBeDefined()
    expect(Array.isArray(result.relatedPosts)).toBe(true)
    expect(result.relatedPosts.length).toBeGreaterThan(0)
    
    // Should not include the current post
    expect(result.relatedPosts.every(p => p.id !== result.id)).toBe(true)
  })

  it('should limit related posts to 3', async () => {
    const mockPost = {
      id: 1,
      slug: 'getting-started-with-knitting',
      title: 'Getting Started with Knitting: A Beginner\'s Guide',
      excerpt: 'Learn the basics of knitting with this comprehensive guide.',
      content: '<h2>Welcome to the World of Knitting!</h2><p>This guide will teach you everything...</p>',
      image: '/images/knitting-guide.jpg',
      category: 'knitting',
      tags: '["beginner", "tutorial", "knitting"]',
      difficulty: 'beginner',
      readTime: 10,
      views: 150,
      publishedAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      featured: true,
      author: {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Mitchell',
        username: 'sarah_knits',
        avatar: '/avatars/sarah.jpg',
        bio: 'Knitting enthusiast with 15 years of experience'
      },
      _count: {
        likes: 25,
        comments: 10
      }
    }

    // Mock exactly 3 related posts to test the limit
    const mockRelatedPosts = [
      {
        id: 2,
        slug: 'knitting-needles-guide',
        title: 'Choosing the Right Knitting Needles',
        excerpt: 'Learn about different types of knitting needles.',
        image: '/images/needles.jpg',
        readTime: 5,
        publishedAt: new Date('2024-01-15'),
        author: {
          id: 1,
          firstName: 'Sarah',
          lastName: 'Mitchell',
          username: 'sarah_knits',
          avatar: '/avatars/sarah.jpg'
        }
      },
      {
        id: 3,
        slug: 'yarn-selection-tips',
        title: 'How to Choose the Perfect Yarn',
        excerpt: 'Tips for selecting the right yarn for your project.',
        image: '/images/yarn.jpg',
        readTime: 7,
        publishedAt: new Date('2024-01-20'),
        author: {
          id: 1,
          firstName: 'Sarah',
          lastName: 'Mitchell',
          username: 'sarah_knits',
          avatar: '/avatars/sarah.jpg'
        }
      },
      {
        id: 4,
        slug: 'knitting-stitches-basics',
        title: 'Basic Knitting Stitches',
        excerpt: 'Master the fundamental knitting stitches.',
        image: '/images/stitches.jpg',
        readTime: 12,
        publishedAt: new Date('2024-01-25'),
        author: {
          id: 1,
          firstName: 'Sarah',
          lastName: 'Mitchell',
          username: 'sarah_knits',
          avatar: '/avatars/sarah.jpg'
        }
      }
    ]

    global.getRouterParam.mockReturnValue('getting-started-with-knitting')
    mockPrisma.post.findUnique.mockResolvedValue(mockPost)
    mockPrisma.post.update.mockResolvedValue({ views: 151 })
    mockPrisma.post.findMany.mockResolvedValue(mockRelatedPosts)

    const result = await postHandler(mockEvent)

    expect(result.relatedPosts.length).toBeLessThanOrEqual(3)
    expect(result.relatedPosts.length).toBe(3) // Exactly 3 in our mock
  })

  it('should include minimal data for related posts', async () => {
    const mockPost = {
      id: 1,
      slug: 'getting-started-with-knitting',
      title: 'Getting Started with Knitting: A Beginner\'s Guide',
      excerpt: 'Learn the basics of knitting with this comprehensive guide.',
      content: '<h2>Welcome to the World of Knitting!</h2><p>This guide will teach you everything...</p>',
      image: '/images/knitting-guide.jpg',
      category: 'knitting',
      tags: '["beginner", "tutorial", "knitting"]',
      difficulty: 'beginner',
      readTime: 10,
      views: 150,
      publishedAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      featured: true,
      author: {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Mitchell',
        username: 'sarah_knits',
        avatar: '/avatars/sarah.jpg',
        bio: 'Knitting enthusiast with 15 years of experience'
      },
      _count: {
        likes: 25,
        comments: 10
      }
    }

    const mockRelatedPosts = [
      {
        id: 2,
        slug: 'knitting-needles-guide',
        title: 'Choosing the Right Knitting Needles',
        excerpt: 'Learn about different types of knitting needles.',
        image: '/images/needles.jpg',
        readTime: 5,
        publishedAt: new Date('2024-01-15'),
        author: {
          id: 1,
          firstName: 'Sarah',
          lastName: 'Mitchell',
          username: 'sarah_knits',
          avatar: '/avatars/sarah.jpg'
        }
      }
    ]

    global.getRouterParam.mockReturnValue('getting-started-with-knitting')
    mockPrisma.post.findUnique.mockResolvedValue(mockPost)
    mockPrisma.post.update.mockResolvedValue({ views: 151 })
    mockPrisma.post.findMany.mockResolvedValue(mockRelatedPosts)

    const result = await postHandler(mockEvent)

    if (result.relatedPosts.length > 0) {
      const relatedPost = result.relatedPosts[0]
      expect(relatedPost).toHaveProperty('id')
      expect(relatedPost).toHaveProperty('slug')
      expect(relatedPost).toHaveProperty('title')
      expect(relatedPost).toHaveProperty('excerpt')
      expect(relatedPost).toHaveProperty('image')
      expect(relatedPost).toHaveProperty('author')
      expect(relatedPost).toHaveProperty('readTime')
      expect(relatedPost).toHaveProperty('publishedAt')
      
      // Should not include full content
      expect(relatedPost.content).toBeUndefined()
    }
  })

  it('should throw 404 error for non-existent slug', async () => {
    global.getRouterParam.mockReturnValue('non-existent-post')
    mockPrisma.post.findUnique.mockResolvedValue(null)

    await expect(postHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 404,
      message: 'Post not found: non-existent-post'
    })

    expect(mockPrisma.post.findUnique).toHaveBeenCalledWith({
      where: { 
        slug: 'non-existent-post',
        published: true 
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatar: true,
            bio: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    })
  })

  it('should handle different post categories correctly', async () => {
    const mockCrochetPost = {
      id: 2,
      slug: 'crochet-granny-squares',
      title: 'Crochet Granny Squares Tutorial',
      excerpt: 'Learn to make beautiful granny squares.',
      content: '<p>Granny squares are a classic crochet technique...</p>',
      image: '/images/granny-squares.jpg',
      category: 'crochet',
      tags: '["crochet", "granny squares", "beginner"]',
      difficulty: 'beginner',
      readTime: 8,
      views: 75,
      publishedAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16'),
      featured: false,
      author: {
        id: 2,
        firstName: 'Emily',
        lastName: 'Chen',
        username: 'emily_crochet',
        avatar: '/avatars/emily.jpg',
        bio: 'Crochet enthusiast and instructor'
      },
      _count: {
        likes: 15,
        comments: 5
      }
    }

    global.getRouterParam.mockReturnValue('crochet-granny-squares')
    mockPrisma.post.findUnique.mockResolvedValue(mockCrochetPost)
    mockPrisma.post.update.mockResolvedValue({ views: 76 })
    mockPrisma.post.findMany.mockResolvedValue([])

    const result = await postHandler(mockEvent)

    expect(result.category).toBe('crochet')
    expect(result.author.name).toBe('Emily Chen')
  })

  it('should handle posts with different difficulty levels', async () => {
    const mockAdvancedPost = {
      id: 3,
      slug: 'advanced-cable-patterns',
      title: 'Advanced Cable Knitting Patterns',
      excerpt: 'Master complex cable patterns.',
      content: '<p>Advanced cable patterns require skill...</p>',
      image: '/images/cable-patterns.jpg',
      category: 'knitting',
      tags: '["knitting", "cables", "advanced"]',
      difficulty: 'advanced',
      readTime: 20,
      views: 200,
      publishedAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-02'),
      featured: true,
      author: {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Mitchell',
        username: 'sarah_knits',
        avatar: '/avatars/sarah.jpg',
        bio: 'Knitting enthusiast with 15 years of experience'
      },
      _count: {
        likes: 40,
        comments: 15
      }
    }

    global.getRouterParam.mockReturnValue('advanced-cable-patterns')
    mockPrisma.post.findUnique.mockResolvedValue(mockAdvancedPost)
    mockPrisma.post.update.mockResolvedValue({ views: 201 })
    mockPrisma.post.findMany.mockResolvedValue([])

    const result = await postHandler(mockEvent)

    expect(result.difficulty).toBe('advanced')
    expect(result.title).toContain('Advanced Cable')
  })

  it('should handle posts without all optional fields', async () => {
    const mockPostWithoutOptionals = {
      id: 4,
      slug: 'basic-knitting-tutorial',
      title: 'Basic Knitting Tutorial',
      excerpt: 'Learn basic knitting.',
      content: '<p>Basic knitting tutorial...</p>',
      image: '/images/basic-knitting.jpg',
      category: 'knitting',
      tags: '["knitting", "basic"]',
      difficulty: 'beginner',
      readTime: 5,
      views: 50,
      publishedAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-11'),
      featured: null, // No featured field
      author: {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Mitchell',
        username: 'sarah_knits',
        avatar: '/avatars/sarah.jpg',
        bio: 'Knitting enthusiast with 15 years of experience'
      },
      _count: {
        likes: 8,
        comments: 2
      }
    }

    global.getRouterParam.mockReturnValue('basic-knitting-tutorial')
    mockPrisma.post.findUnique.mockResolvedValue(mockPostWithoutOptionals)
    mockPrisma.post.update.mockResolvedValue({ views: 51 })
    mockPrisma.post.findMany.mockResolvedValue([])

    const result = await postHandler(mockEvent)

    // This post doesn't have featured field, should handle gracefully
    expect(result.featured).toBeNull()
  })

  it('should handle empty slug gracefully', async () => {
    global.getRouterParam.mockReturnValue('')

    await expect(postHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Slug parameter is required'
    })
  })

  it('should handle null slug', async () => {
    global.getRouterParam.mockReturnValue(null)

    await expect(postHandler(mockEvent)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Slug parameter is required'
    })
  })

  it('should return posts with different read times', async () => {
    const mockQuiltingPost = {
      id: 5,
      slug: 'quilting-basics',
      title: 'Quilting Basics for Beginners',
      excerpt: 'Learn the fundamentals of quilting.',
      content: '<p>Quilting is a wonderful craft...</p>',
      image: '/images/quilting-basics.jpg',
      category: 'quilting',
      tags: '["quilting", "basics", "beginner"]',
      difficulty: 'beginner',
      readTime: 15,
      views: 100,
      publishedAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-21'),
      featured: true,
      author: {
        id: 3,
        firstName: 'Maria',
        lastName: 'Rodriguez',
        username: 'maria_quilts',
        avatar: '/avatars/maria.jpg',
        bio: 'Quilting expert and teacher'
      },
      _count: {
        likes: 30,
        comments: 8
      }
    }

    global.getRouterParam.mockReturnValue('quilting-basics')
    mockPrisma.post.findUnique.mockResolvedValue(mockQuiltingPost)
    mockPrisma.post.update.mockResolvedValue({ views: 101 })
    mockPrisma.post.findMany.mockResolvedValue([])

    const result = await postHandler(mockEvent)

    expect(result.readTime).toBe(15) // Longest read time
    expect(typeof result.readTime).toBe('number')
  })

  it('should include view and like counts', async () => {
    const mockPost = {
      id: 1,
      slug: 'getting-started-with-knitting',
      title: 'Getting Started with Knitting: A Beginner\'s Guide',
      excerpt: 'Learn the basics of knitting with this comprehensive guide.',
      content: '<h2>Welcome to the World of Knitting!</h2><p>This guide will teach you everything...</p>',
      image: '/images/knitting-guide.jpg',
      category: 'knitting',
      tags: '["beginner", "tutorial", "knitting"]',
      difficulty: 'beginner',
      readTime: 10,
      views: 150,
      publishedAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      featured: true,
      author: {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Mitchell',
        username: 'sarah_knits',
        avatar: '/avatars/sarah.jpg',
        bio: 'Knitting enthusiast with 15 years of experience'
      },
      _count: {
        likes: 25,
        comments: 10
      }
    }

    global.getRouterParam.mockReturnValue('getting-started-with-knitting')
    mockPrisma.post.findUnique.mockResolvedValue(mockPost)
    mockPrisma.post.update.mockResolvedValue({ views: 151 })
    mockPrisma.post.findMany.mockResolvedValue([])

    const result = await postHandler(mockEvent)

    expect(typeof result.views).toBe('number')
    expect(typeof result.likes).toBe('number')
    expect(result.views).toBeGreaterThan(0)
    expect(result.likes).toBeGreaterThan(0)
  })
})