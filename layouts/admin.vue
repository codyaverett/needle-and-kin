<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Admin Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900">
      <div class="flex h-16 items-center justify-center bg-purple-700">
        <NuxtLink to="/admin" class="text-xl font-bold text-white">
          Admin Panel
        </NuxtLink>
      </div>
      
      <nav class="mt-8 px-4">
        <div class="space-y-2">
          <NuxtLink
            to="/admin"
            class="flex items-center rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
            :class="{ 'bg-gray-800 text-white': $route.path === '/admin' }"
          >
            <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </NuxtLink>
          
          <NuxtLink
            to="/admin/posts"
            class="flex items-center rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
            :class="{ 'bg-gray-800 text-white': $route.path.startsWith('/admin/posts') }"
          >
            <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Blog Posts
          </NuxtLink>
          
          <NuxtLink
            to="/admin/users"
            class="flex items-center rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
            :class="{ 'bg-gray-800 text-white': $route.path.startsWith('/admin/users') }"
          >
            <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Users
          </NuxtLink>
          
          <NuxtLink
            to="/admin/contact-submissions"
            class="flex items-center justify-between rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
            :class="{ 'bg-gray-800 text-white': $route.path === '/admin/contact-submissions' }"
          >
            <div class="flex items-center">
              <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Messages
            </div>
            <span v-if="unreadMessagesCount > 0" class="ml-2 px-2 py-1 text-xs font-bold rounded-full bg-red-600 text-white">
              {{ unreadMessagesCount }}
            </span>
          </NuxtLink>
          
          <NuxtLink
            to="/admin/content"
            class="flex items-center rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
            :class="{ 'bg-gray-800 text-white': $route.path === '/admin/content' }"
          >
            <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Site Content
          </NuxtLink>
          
          <NuxtLink
            to="/admin/settings"
            class="flex items-center rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
            :class="{ 'bg-gray-800 text-white': $route.path === '/admin/settings' }"
          >
            <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </NuxtLink>
        </div>
        
        <div class="mt-8 border-t border-gray-700 pt-8">
          <NuxtLink
            to="/"
            class="flex items-center rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Site
          </NuxtLink>
          
          <button
            @click="handleLogout"
            class="flex w-full items-center rounded-lg px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <svg class="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </nav>
    </div>
    
    <!-- Main Content -->
    <div class="pl-64">
      <!-- Top Bar -->
      <div class="sticky top-0 z-40 flex h-16 items-center justify-between bg-white px-6 shadow">
        <h1 class="text-xl font-semibold text-gray-800">
          {{ pageTitle }}
        </h1>
        
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">
            Welcome, {{ userStore.fullName }}
          </span>
          <img
            :src="userStore.userAvatar"
            :alt="userStore.fullName"
            class="h-8 w-8 rounded-full"
          >
        </div>
      </div>
      
      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

// Use the shared messages composable
const { unreadMessagesCount, fetchUnreadCount } = useMessages()

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/admin') return 'Dashboard'
  if (path.startsWith('/admin/posts')) return 'Blog Posts'
  if (path.startsWith('/admin/users')) return 'User Management'
  if (path === '/admin/contact-submissions') return 'Messages'
  if (path === '/admin/content') return 'Site Content'
  if (path === '/admin/settings') return 'Settings'
  return 'Admin'
})

const handleLogout = async () => {
  await userStore.logout()
  router.push('/')
}

// Fetch unread count on mount and periodically
onMounted(() => {
  fetchUnreadCount()
  // Refresh count every 60 seconds (less frequent since we have instant updates now)
  const interval = setInterval(fetchUnreadCount, 60000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>