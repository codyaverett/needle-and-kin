<template>
  <div>
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-purple-100 rounded-lg p-3">
            <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500">Total Users</h3>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500">Total Posts</h3>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalPosts }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500">Total Views</h3>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalViews.toLocaleString() }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-pink-100 rounded-lg p-3">
            <svg class="h-6 w-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-500">Comments</h3>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalComments }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Recent Posts -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Recent Posts</h2>
        </div>
        <div class="p-6">
          <div v-if="recentPosts.length" class="space-y-4">
            <div v-for="post in recentPosts" :key="post.id" class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ post.title }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ post.author?.name || 'Unknown' }} • {{ formatDate(post.publishedAt) }}
                </p>
              </div>
              <div class="ml-4 flex items-center space-x-2">
                <NuxtLink
                  :to="`/admin/posts/${post.id}`"
                  class="text-purple-600 hover:text-purple-700"
                >
                  Edit
                </NuxtLink>
                <span class="text-gray-400">|</span>
                <NuxtLink
                  :to="`/blog/${post.slug}`"
                  class="text-blue-600 hover:text-blue-700"
                >
                  View
                </NuxtLink>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500">No posts yet</p>
        </div>
      </div>
      
      <!-- Recent Users -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Recent Users</h2>
        </div>
        <div class="p-6">
          <div v-if="recentUsers.length" class="space-y-4">
            <div v-for="user in recentUsers" :key="user.id" class="flex items-center justify-between">
              <div class="flex items-center">
                <img
                  :src="user.avatar"
                  :alt="user.firstName + ' ' + user.lastName"
                  class="h-8 w-8 rounded-full"
                >
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    {{ user.firstName }} {{ user.lastName }}
                  </p>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'author' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ user.role }}
                </span>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500">No users yet</p>
        </div>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          to="/admin/posts/create"
          class="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-purple-400 hover:bg-purple-50 transition-colors"
        >
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="mt-2 block text-sm font-medium text-gray-900">New Post</span>
          </div>
        </NuxtLink>
        
        <NuxtLink
          to="/admin/users"
          class="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-purple-400 hover:bg-purple-50 transition-colors"
        >
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span class="mt-2 block text-sm font-medium text-gray-900">Add User</span>
          </div>
        </NuxtLink>
        
        <NuxtLink
          to="/admin/content"
          class="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-purple-400 hover:bg-purple-50 transition-colors"
        >
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span class="mt-2 block text-sm font-medium text-gray-900">Edit Content</span>
          </div>
        </NuxtLink>
        
        <NuxtLink
          to="/admin/settings"
          class="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-purple-400 hover:bg-purple-50 transition-colors"
        >
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="mt-2 block text-sm font-medium text-gray-900">Settings</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const stats = ref({
  totalUsers: 0,
  totalPosts: 0,
  totalViews: 0,
  totalComments: 0
})

const recentPosts = ref([])
const recentUsers = ref([])

onMounted(async () => {
  try {
    // Fetch admin statistics
    const response = await $fetch('/api/admin/stats')
    stats.value = response.stats
    recentPosts.value = response.recentPosts || []
    recentUsers.value = response.recentUsers || []
  } catch (error) {
    console.error('Failed to fetch admin stats:', error)
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

useHead({
  title: 'Admin Dashboard - Needle & Kin',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>