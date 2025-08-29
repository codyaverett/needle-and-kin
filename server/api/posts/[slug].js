import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug parameter is required'
    })
  }
  
  try {
    // Get the post by slug
    const post = await prisma.post.findUnique({
      where: { 
        slug,
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
    
    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: `Post not found: ${slug}`
      })
    }
    
    // Increment view count
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    })
    
    // Get related posts from the same category
    const relatedPosts = await prisma.post.findMany({
      where: {
        published: true,
        category: post.category,
        id: { not: post.id }
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        image: true,
        readTime: true,
        publishedAt: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatar: true
          }
        }
      },
      take: 3,
      orderBy: { publishedAt: 'desc' }
    })
    
    // Transform the post data
    const transformedPost = {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
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
      readTime: post.readTime,
      publishedAt: post.publishedAt?.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      views: post.views + 1, // Include the incremented view
      likes: post._count.likes,
      commentsCount: post._count.comments,
      featured: post.featured,
      relatedPosts: relatedPosts.map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        image: p.image,
        author: {
          id: p.author.id,
          name: `${p.author.firstName} ${p.author.lastName}`,
          username: p.author.username,
          avatar: p.author.avatar
        },
        readTime: p.readTime,
        publishedAt: p.publishedAt?.toISOString()
      }))
    }
    
    return transformedPost
  } catch (error) {
    // Re-throw if it's already a Nuxt error
    if (error.statusCode) {
      throw error
    }
    
    console.error('Error fetching post:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch post'
    })
  }
})