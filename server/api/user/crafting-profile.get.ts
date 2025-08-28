import jwt from 'jsonwebtoken'
import type { JWTPayload } from '~/server/types/auth'

interface CraftingProfile {
  skillLevel: 'beginner' | 'intermediate' | 'advanced'
  interests: string[]
  completedProjects: number
  currentProjects: Array<{
    id: string
    name: string
    type: string
    startedAt: string
    progress: number
  }>
  wishlist: string[]
  tools: string[]
  materials: string[]
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
    const mockProfiles: Record<string, CraftingProfile> = {
      '1': {
        skillLevel: 'advanced',
        interests: ['knitting', 'crochet', 'pattern design'],
        completedProjects: 47,
        currentProjects: [
          {
            id: 'proj-1',
            name: 'Winter Scarf Collection',
            type: 'knitting',
            startedAt: '2024-11-01T00:00:00Z',
            progress: 75
          }
        ],
        wishlist: ['Merino wool yarn', 'Circular needles set'],
        tools: ['Knitting needles', 'Crochet hooks', 'Stitch markers'],
        materials: ['Wool yarn', 'Cotton thread', 'Acrylic yarn']
      },
      '2': {
        skillLevel: 'beginner',
        interests: ['knitting', 'embroidery'],
        completedProjects: 3,
        currentProjects: [
          {
            id: 'proj-2',
            name: 'My First Sweater',
            type: 'knitting',
            startedAt: '2024-12-01T00:00:00Z',
            progress: 25
          }
        ],
        wishlist: ['Beginner knitting book', 'Yarn bowl'],
        tools: ['Basic knitting needles', 'Scissors'],
        materials: ['Acrylic yarn']
      }
    }
    
    const profile = mockProfiles[decoded.id] || {
      skillLevel: 'beginner',
      interests: [],
      completedProjects: 0,
      currentProjects: [],
      wishlist: [],
      tools: [],
      materials: []
    }
    
    return {
      success: true,
      craftingProfile: profile
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