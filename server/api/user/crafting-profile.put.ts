import jwt from 'jsonwebtoken'
import type { JWTPayload } from '~/server/types/auth'

interface UpdateCraftingProfileBody {
  skillLevel?: 'beginner' | 'intermediate' | 'advanced'
  interests?: string[]
  tools?: string[]
  materials?: string[]
  wishlist?: string[]
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
    const body = await readBody<UpdateCraftingProfileBody>(event)
    
    // Validate skill level
    if (body.skillLevel && !['beginner', 'intermediate', 'advanced'].includes(body.skillLevel)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid skill level'
      })
    }
    
    // Validate interests
    const validInterests = [
      'knitting', 'crochet', 'embroidery', 'quilting', 'sewing', 
      'weaving', 'pattern design', 'dyeing', 'spinning', 'felting'
    ]
    if (body.interests) {
      const invalidInterests = body.interests.filter(interest => !validInterests.includes(interest))
      if (invalidInterests.length > 0) {
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid interests: ${invalidInterests.join(', ')}`
        })
      }
    }
    
    // Limit array sizes
    if (body.tools && body.tools.length > 50) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Too many tools (maximum 50)'
      })
    }
    
    if (body.materials && body.materials.length > 50) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Too many materials (maximum 50)'
      })
    }
    
    if (body.wishlist && body.wishlist.length > 20) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Too many wishlist items (maximum 20)'
      })
    }
    
    // Build updated profile
    const updatedProfile = {
      skillLevel: body.skillLevel || 'beginner',
      interests: body.interests || [],
      tools: body.tools || [],
      materials: body.materials || [],
      wishlist: body.wishlist || [],
      updatedAt: new Date().toISOString()
    }
    
    // In production, this would update the database
    return {
      success: true,
      message: 'Crafting profile updated successfully',
      craftingProfile: updatedProfile
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