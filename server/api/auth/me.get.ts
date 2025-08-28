import { auth } from '~/server/utils/auth'
import type { User } from '~/server/types/auth'

export default defineEventHandler(async (event) => {
  // Get current authenticated user
  const user = await auth.getCurrentUser(event) as User | null
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated'
    })
  }
  
  // Ensure no sensitive data is returned
  const { password: _password, sessionToken: _sessionToken, ...safeUser } = user as any
  return safeUser
})