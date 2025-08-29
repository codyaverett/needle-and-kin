import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs'
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
    
    // Save settings to a JSON file (in production, this would be to a database)
    const settingsPath = join(process.cwd(), 'server/data/app-settings.json')
    const settingsDir = dirname(settingsPath)
    
    // Create directory if it doesn't exist
    if (!existsSync(settingsDir)) {
      mkdirSync(settingsDir, { recursive: true })
    }
    
    // If updating email settings and password is masked, preserve the existing password
    if (body.email?.smtpPassword === '••••••••') {
      try {
        const existingSettings = JSON.parse(readFileSync(settingsPath, 'utf-8'))
        if (existingSettings.email?.smtpPassword) {
          body.email.smtpPassword = existingSettings.email.smtpPassword
        }
      } catch (err) {
        // File doesn't exist or is invalid, continue with the masked password
      }
    }
    
    // Save settings with timestamp
    const settingsWithMeta = {
      ...body,
      lastUpdated: new Date().toISOString(),
      updatedBy: user.email
    }
    
    writeFileSync(settingsPath, JSON.stringify(settingsWithMeta, null, 2))
    
    // In production, you would also update environment variables or restart services as needed
    // For example, updating email settings might require restarting the email service
    
    return {
      success: true,
      message: 'Settings saved successfully'
    }
  } catch (error) {
    console.error('Failed to save settings:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save settings'
    })
  }
})