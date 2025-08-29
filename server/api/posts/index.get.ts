import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 9
  const category = query.category as string
  
  try {
    // Build where clause
    const where: any = {
      published: true
    }
    
    if (category && category !== 'all') {
      where.category = category
    }
    
    // Get total count
    const total = await prisma.post.count({ where })
    
    // Get paginated posts
    const posts = await prisma.post.findMany({
      where,
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
      },
      orderBy: {
        publishedAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })
    
    // Transform posts to match expected format
    const transformedPosts = posts.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      publishedAt: post.publishedAt?.toISOString(),
      readTime: post.readTime,
      author: {
        id: post.author.id,
        name: `${post.author.firstName} ${post.author.lastName}`,
        username: post.author.username,
        avatar: post.author.avatar,
        bio: post.author.bio
      },
      category: post.category,
      tags: JSON.parse(post.tags),
      difficulty: post.difficulty,
      views: post.views,
      likes: post._count.likes,
      commentsCount: post._count.comments
    }))
    
    return {
      data: transformedPosts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch posts'
    })
  }
})