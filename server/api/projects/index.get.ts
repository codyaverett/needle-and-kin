import prisma from '~/server/utils/prisma'
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  try {
    // Build where clause
    const where: any = {}
    
    if (query.category) {
      where.category = query.category
    }
    
    if (query.difficulty) {
      where.difficulty = query.difficulty
    }
    
    if (query.status) {
      where.status = query.status
    }
    
    if (query.userId) {
      where.userId = query.userId
    }
    
    if (query.search) {
      const searchTerm = (query.search as string).toLowerCase()
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } }
      ]
    }
    
    // Determine sort order
    const orderBy: any = {}
    switch (query.sortBy || 'recent') {
      case 'popular':
        orderBy._count = { likes: 'desc' }
        break
      case 'views':
        orderBy.views = 'desc'
        break
      case 'recent':
      default:
        orderBy.createdAt = 'desc'
        break
    }
    
    // Pagination
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 12
    const skip = (page - 1) * limit
    
    // Get total count
    const total = await prisma.project.count({ where })
    
    // Get projects
    const projects = await prisma.project.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      },
      orderBy,
      skip,
      take: limit
    })
    
    // Transform projects to match expected format
    const transformedProjects = projects.map(project => ({
      id: project.id,
      userId: project.userId,
      username: project.user.username,
      userAvatar: project.user.avatar,
      title: project.title,
      description: project.description,
      coverImage: project.coverImage,
      images: project.images ? JSON.parse(project.images) : [],
      category: project.category,
      difficulty: project.difficulty,
      tags: JSON.parse(project.tags),
      materials: JSON.parse(project.materials),
      steps: JSON.parse(project.steps),
      progress: project.progress,
      status: project.status,
      estimatedTime: project.estimatedTime,
      views: project.views,
      likes: project._count.likes,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString()
    }))
    
    return {
      projects: transformedProjects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch projects'
    })
  }
})