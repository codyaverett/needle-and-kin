// Shared blog post data for consistency across endpoints
export const posts = [
  {
    id: 1,
    title: 'Getting Started with Knitting: A Beginner\'s Guide',
    slug: 'getting-started-with-knitting',
    excerpt: 'Learn the basics of knitting with this comprehensive guide for beginners. We\'ll cover everything from choosing your first needles to mastering basic stitches.',
    content: '<p>Full blog post content here...</p>',
    image: '/blog/knitting-1.jpg',
    publishedAt: new Date('2024-12-20').toISOString(),
    readTime: '8 min',
    author: {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      bio: 'Knitting enthusiast with 15 years of experience'
    },
    category: 'knitting',
    tags: ['beginner', 'tutorials', 'basics'],
    difficulty: 'beginner',
    views: 1234,
    likes: 89,
    featured: true
  },
  {
    id: 2,
    title: 'Beautiful Embroidery Patterns for Home Decor',
    slug: 'embroidery-patterns-home-decor',
    excerpt: 'Transform your living space with these stunning embroidery patterns perfect for pillows, wall art, and more.',
    content: '<p>Full blog post content here...</p>',
    image: '/blog/embroidery-1.jpg',
    publishedAt: new Date('2024-12-18').toISOString(),
    readTime: '12 min',
    author: {
      id: 2,
      name: 'Emily Chen',
      avatar: '/avatars/emily.jpg',
      bio: 'Professional embroiderer and pattern designer'
    },
    category: 'embroidery',
    tags: ['patterns', 'home-decor', 'intermediate'],
    difficulty: 'intermediate',
    views: 892,
    likes: 67,
    featured: false
  },
  {
    id: 3,
    title: 'Sustainable Crafting: Upcycling Old Clothes',
    slug: 'sustainable-crafting-upcycling',
    excerpt: 'Discover creative ways to give new life to old clothing through upcycling and sustainable crafting techniques.',
    content: '<p>Full blog post content here...</p>',
    image: '/blog/upcycling-1.jpg',
    publishedAt: new Date('2024-12-15').toISOString(),
    readTime: '10 min',
    author: {
      id: 3,
      name: 'Maria Garcia',
      avatar: '/avatars/maria.jpg',
      bio: 'Sustainable living advocate and DIY expert'
    },
    category: 'sewing',
    tags: ['sustainable', 'upcycling', 'eco-friendly'],
    difficulty: 'beginner',
    views: 2156,
    likes: 145,
    featured: true
  },
  {
    id: 4,
    title: 'Advanced Crochet Techniques: Lacework Mastery',
    slug: 'advanced-crochet-lacework',
    excerpt: 'Take your crochet skills to the next level with intricate lacework patterns and advanced techniques.',
    content: '<p>Full blog post content here...</p>',
    image: '/blog/crochet-1.jpg',
    publishedAt: new Date('2024-12-12').toISOString(),
    readTime: '15 min',
    author: {
      id: 4,
      name: 'Lisa Anderson',
      avatar: '/avatars/lisa.jpg',
      bio: 'Crochet artist and instructor'
    },
    category: 'crochet',
    tags: ['advanced', 'lacework', 'techniques'],
    difficulty: 'advanced',
    views: 567,
    likes: 43,
    featured: false
  },
  {
    id: 5,
    title: 'Macramé Wall Hangings: Modern Designs',
    slug: 'macrame-wall-hangings-modern',
    excerpt: 'Create stunning modern macramé wall hangings with these contemporary patterns and techniques.',
    content: '<p>Full blog post content here...</p>',
    image: '/blog/macrame-1.jpg',
    publishedAt: new Date('2024-12-10').toISOString(),
    readTime: '11 min',
    author: {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      bio: 'Knitting enthusiast with 15 years of experience'
    },
    category: 'weaving',
    tags: ['macrame', 'wall-decor', 'modern'],
    difficulty: 'intermediate',
    views: 1789,
    likes: 112,
    featured: false
  },
  {
    id: 6,
    title: 'Cross-Stitch for Beginners: First Projects',
    slug: 'cross-stitch-beginners-first-projects',
    excerpt: 'Start your cross-stitch journey with these simple and rewarding first projects perfect for beginners.',
    content: '<p>Full blog post content here...</p>',
    image: '/blog/cross-stitch-1.jpg',
    publishedAt: new Date('2024-12-08').toISOString(),
    readTime: '9 min',
    author: {
      id: 2,
      name: 'Emily Chen',
      avatar: '/avatars/emily.jpg',
      bio: 'Professional embroiderer and pattern designer'
    },
    category: 'embroidery',
    tags: ['cross-stitch', 'beginner', 'projects'],
    difficulty: 'beginner',
    views: 3421,
    likes: 256,
    featured: true
  }
]

// Helper function to get post by slug
export function getPostBySlug(slug) {
  return posts.find(post => post.slug === slug)
}

// Helper function to get posts by category
export function getPostsByCategory(category, limit = 10) {
  return posts
    .filter(post => post.category === category)
    .slice(0, limit)
}

// Helper function to get featured posts
export function getFeaturedPosts(limit = 3) {
  return posts
    .filter(post => post.featured)
    .slice(0, limit)
}

// Helper function to get latest posts
export function getLatestPosts(limit = 6) {
  return [...posts]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit)
}