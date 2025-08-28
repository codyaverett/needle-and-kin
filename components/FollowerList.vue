<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ title }}
        </h3>
        <span class="text-sm text-gray-500">
          {{ users.length }} {{ users.length === 1 ? 'user' : 'users' }}
        </span>
      </div>
      
      <div v-if="showSearch" class="mt-3">
        <div class="relative">
          <Icon name="mdi:magnify" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
      </div>
    </div>

    <div v-if="loading" class="p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
      <p class="text-sm text-gray-500 text-center mt-3">Loading users...</p>
    </div>

    <div v-else-if="filteredUsers.length === 0" class="p-8 text-center">
      <Icon name="mdi:account-group-outline" class="h-12 w-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500">
        {{ searchQuery ? 'No users found matching your search' : emptyMessage }}
      </p>
    </div>

    <div v-else class="divide-y divide-gray-100">
      <UserCard
        v-for="user in paginatedUsers"
        :key="user.id"
        :user="user"
        :show-follow-button="showFollowButtons"
        :current-user-id="currentUserId"
        @follow="$emit('follow', user.id)"
        @unfollow="$emit('unfollow', user.id)"
        @click="$emit('select', user)"
      />
    </div>

    <div v-if="showPagination && totalPages > 1" class="p-4 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="mdi:chevron-left" class="h-4 w-4" />
        </button>
        
        <div class="flex items-center space-x-2">
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-1 text-sm rounded-md',
              currentPage === page
                ? 'bg-pink-600 text-white'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon name="mdi:chevron-right" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div v-if="showViewAll && !showPagination && users.length > displayLimit" class="p-3 border-t border-gray-200 bg-gray-50">
      <button
        @click="$emit('viewAll')"
        class="w-full text-sm text-pink-600 hover:text-pink-700 font-medium"
      >
        View all {{ users.length }} {{ users.length === 1 ? 'user' : 'users' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface User {
  id: string
  username: string
  name: string
  avatar?: string
  bio?: string
  isFollowing?: boolean
  followersCount?: number
  followingCount?: number
  isVerified?: boolean
}

const props = withDefaults(defineProps<{
  users: User[]
  title?: string
  loading?: boolean
  showSearch?: boolean
  showFollowButtons?: boolean
  showPagination?: boolean
  showViewAll?: boolean
  displayLimit?: number
  itemsPerPage?: number
  currentUserId?: string
  emptyMessage?: string
}>(), {
  title: 'Users',
  loading: false,
  showSearch: false,
  showFollowButtons: true,
  showPagination: false,
  showViewAll: true,
  displayLimit: 10,
  itemsPerPage: 20,
  emptyMessage: 'No users to display'
})

const emit = defineEmits<{
  follow: [userId: string]
  unfollow: [userId: string]
  select: [user: User]
  viewAll: []
}>()

const searchQuery = ref('')
const currentPage = ref(1)

const filteredUsers = computed(() => {
  if (!searchQuery.value) return props.users
  
  const query = searchQuery.value.toLowerCase()
  return props.users.filter(user => 
    user.name.toLowerCase().includes(query) ||
    user.username.toLowerCase().includes(query) ||
    user.bio?.toLowerCase().includes(query)
  )
})

const paginatedUsers = computed(() => {
  if (props.showPagination) {
    const start = (currentPage.value - 1) * props.itemsPerPage
    const end = start + props.itemsPerPage
    return filteredUsers.value.slice(start, end)
  }
  
  return filteredUsers.value.slice(0, props.displayLimit)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / props.itemsPerPage)
})

const displayedPages = computed(() => {
  const pages: number[] = []
  const maxPages = 5
  const halfPages = Math.floor(maxPages / 2)
  
  let start = Math.max(1, currentPage.value - halfPages)
  let end = Math.min(totalPages.value, start + maxPages - 1)
  
  if (end - start < maxPages - 1) {
    start = Math.max(1, end - maxPages + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})
</script>