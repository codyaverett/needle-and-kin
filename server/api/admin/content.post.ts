import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

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
    const body = await readBody(event)
    
    // Save content to a JSON file (in production, this would be to a database)
    const contentPath = join(process.cwd(), 'server/data/site-content.json')
    const contentDir = dirname(contentPath)
    
    // Create directory if it doesn't exist
    if (!existsSync(contentDir)) {
      mkdirSync(contentDir, { recursive: true })
    }
    
    // Save content with timestamp
    const contentWithMeta = {
      ...body,
      lastUpdated: new Date().toISOString(),
      updatedBy: user.email
    }
    
    writeFileSync(contentPath, JSON.stringify(contentWithMeta, null, 2))
    
    return {
      success: true,
      message: 'Content saved successfully'
    }
  } catch (error) {
    console.error('Failed to save content:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save content'
    })
  }
})