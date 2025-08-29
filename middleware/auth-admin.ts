import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to, _from) => {
  const userStore = useUserStore()
  
  // Check if user is authenticated
  if (!userStore.isAuthenticated) {
    const returnUrl = to.fullPath
    return navigateTo(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
  }
  
  // Check if user has admin role
  if (userStore.currentUser?.role !== 'admin') {
    // Show 404 to hide admin pages from non-admin users
    throw createError({
      statusCode: 404,
      statusMessage: 'Page not found'
    })
  }
})