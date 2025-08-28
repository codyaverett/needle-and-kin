import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware((to, _from) => {
  const userStore = useUserStore()
  
  // Check if user is authenticated
  if (!userStore.isAuthenticated) {
    // Save the intended destination
    const returnUrl = to.fullPath
    
    // Redirect to login page
    return navigateTo(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
  }
})