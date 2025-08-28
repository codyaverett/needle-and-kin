import jwt from 'jsonwebtoken'
import type { JWTPayload, UserStats } from '~/server/types/auth'

interface ExtendedUserStats extends UserStats {
  projectsCompleted: number
  tutorialsCompleted: number
  totalCraftingTime: number
  achievements: Array<{
    id: string
    type: string
    name: string
    description: string
    unlockedAt: string
    icon?: string
  }>
  favoriteCategory?: string
  totalLikes: number
  totalComments: number
}

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload
    
    // In production, this would fetch from database
    const mockStats: Record<string, ExtendedUserStats> = {
      '1': {
        postsRead: 247,
        commentsWritten: 89,
        lastLogin: new Date().toISOString(),
        projectsCompleted: 47,
        tutorialsCompleted: 23,
        totalCraftingTime: 1250, // hours
        achievements: [
          {
            id: 'ach-1',
            type: 'milestone',
            name: 'First Project',
            description: 'Completed your first crafting project',
            unlockedAt: '2024-01-15T00:00:00Z',
            icon: '🎉'
          },
          {
            id: 'ach-2',
            type: 'skill',
            name: 'Knitting Master',
            description: 'Completed 10 knitting projects',
            unlockedAt: '2024-06-20T00:00:00Z',
            icon: '🧶'
          },
          {
            id: 'ach-3',
            type: 'community',
            name: 'Helpful Crafter',
            description: 'Received 50 likes on your comments',
            unlockedAt: '2024-09-10T00:00:00Z',
            icon: '💝'
          }
        ],
        favoriteCategory: 'knitting',
        totalLikes: 156,
        totalComments: 89
      },
      '2': {
        postsRead: 42,
        commentsWritten: 5,
        lastLogin: new Date().toISOString(),
        projectsCompleted: 3,
        tutorialsCompleted: 7,
        totalCraftingTime: 45, // hours
        achievements: [
          {
            id: 'ach-1',
            type: 'milestone',
            name: 'First Project',
            description: 'Completed your first crafting project',
            unlockedAt: '2024-11-01T00:00:00Z',
            icon: '🎉'
          }
        ],
        favoriteCategory: 'embroidery',
        totalLikes: 12,
        totalComments: 5
      }
    }
    
    const stats = mockStats[decoded.id] || {
      postsRead: 0,
      commentsWritten: 0,
      lastLogin: new Date().toISOString(),
      projectsCompleted: 0,
      tutorialsCompleted: 0,
      totalCraftingTime: 0,
      achievements: [],
      totalLikes: 0,
      totalComments: 0
    }
    
    // Calculate some derived stats
    const level = Math.floor(stats.projectsCompleted / 10) + 1
    const nextLevelProjects = (level * 10) - (stats.projectsCompleted % 10)
    
    return {
      success: true,
      stats: {
        ...stats,
        level,
        nextLevelProjects,
        averageCraftingTime: stats.projectsCompleted > 0 
          ? Math.round(stats.totalCraftingTime / stats.projectsCompleted * 10) / 10 
          : 0
      }
    }
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token'
      })
    }
    throw error
  }
})