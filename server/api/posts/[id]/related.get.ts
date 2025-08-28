interface RelatedPost {
  id: number
  title: string
  slug: string
  excerpt: string
  image: string
  category: string
  tags: string[]
  publishedAt: string
  readTime: string
  author: {
    name: string
    avatar: string
  }
  views: number
  likes: number
  difficulty?: string
}

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'id')
  
  if (!postId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID is required'
    })
  }
  
  // In production, this would:
  // 1. Fetch the current post to get its category and tags
  // 2. Find posts with similar tags or in the same category
  // 3. Use a relevance algorithm (tag matches, category, popularity, recency)
  // 4. Exclude the current post from results
  
  // Mock related posts based on category/tags
  const relatedPosts: RelatedPost[] = [
    {
      id: 101,
      title: 'Advanced Cable Knitting Techniques',
      slug: 'advanced-cable-knitting',
      excerpt: 'Master the art of cable knitting with these advanced patterns and techniques.',
      image: '/blog/knitting-1.jpg',
      category: 'knitting',
      tags: ['cables', 'advanced', 'patterns'],
      publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      readTime: '12 min',
      author: {
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg'
      },
      views: 2847,
      likes: 189,
      difficulty: 'advanced'
    },
    {
      id: 102,
      title: 'Color Theory for Knitters',
      slug: 'color-theory-knitters',
      excerpt: 'Learn how to combine colors effectively in your knitting projects.',
      image: '/blog/knitting-1.jpg',
      category: 'knitting',
      tags: ['color', 'design', 'beginner'],
      publishedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      readTime: '8 min',
      author: {
        name: 'Maria Garcia',
        avatar: '/avatars/maria.jpg'
      },
      views: 1523,
      likes: 97,
      difficulty: 'beginner'
    },
    {
      id: 103,
      title: 'Fair Isle Knitting: A Complete Guide',
      slug: 'fair-isle-knitting-guide',
      excerpt: 'Everything you need to know about Fair Isle knitting, from basics to advanced patterns.',
      image: '/blog/knitting-1.jpg',
      category: 'knitting',
      tags: ['fair-isle', 'colorwork', 'intermediate'],
      publishedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      readTime: '15 min',
      author: {
        name: 'Emily Chen',
        avatar: '/avatars/emily.jpg'
      },
      views: 3156,
      likes: 234,
      difficulty: 'intermediate'
    },
    {
      id: 104,
      title: 'Blocking Techniques for Perfect Knits',
      slug: 'blocking-techniques-knits',
      excerpt: 'Professional blocking techniques to give your knitted projects a polished finish.',
      image: '/blog/knitting-1.jpg',
      category: 'knitting',
      tags: ['blocking', 'finishing', 'techniques'],
      publishedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      readTime: '10 min',
      author: {
        name: 'Lisa Anderson',
        avatar: '/avatars/lisa.jpg'
      },
      views: 892,
      likes: 67,
      difficulty: 'beginner'
    }
  ]
  
  // Query parameters for customization
  const limit = parseInt(getQuery(event).limit as string) || 4
  const excludeCurrent = getQuery(event).excludeCurrent !== 'false'
  
  // Filter out current post if needed
  let filteredPosts = relatedPosts
  if (excludeCurrent) {
    filteredPosts = relatedPosts.filter(post => post.id.toString() !== postId)
  }
  
  // Limit results
  const limitedPosts = filteredPosts.slice(0, limit)
  
  return {
    success: true,
    postId,
    relatedPosts: limitedPosts,
    totalRelated: limitedPosts.length,
    algorithm: 'category-tags-popularity' // Indicate which algorithm was used
  }
})