import { useUserStore } from '~/stores/user'

export default defineNuxtPlugin(async () => {
  const userStore = useUserStore()
  
  // Try to restore authentication from cookies on app load
  try {
    await userStore.checkAuthentication()
  } catch (error) {
    console.error('Failed to restore authentication:', error)
  }
})