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
    // Read settings from a JSON file (in production, this would be from a database)
    const settingsPath = join(process.cwd(), 'server/data/app-settings.json')
    
    if (existsSync(settingsPath)) {
      const settings = JSON.parse(readFileSync(settingsPath, 'utf-8'))
      
      // Remove sensitive data before sending to client
      if (settings.email?.smtpPassword) {
        settings.email.smtpPassword = '••••••••'
      }
      
      return {
        success: true,
        data: settings
      }
    }
    
    // Return default settings if file doesn't exist
    return {
      success: true,
      data: null
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load settings'
    })
  }
})