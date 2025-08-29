import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  // Check if user is admin
  const user = event.context.user
  if (!user || user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    // Read content from a JSON file (in production, this would be from a database)
    const contentPath = join(process.cwd(), 'server/data/site-content.json')
    
    if (existsSync(contentPath)) {
      const content = JSON.parse(readFileSync(contentPath, 'utf-8'))
      return {
        success: true,
        data: content
      }
    }
    
    // Return default content if file doesn't exist
    return {
      success: true,
      data: null
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load content'
    })
  }
})