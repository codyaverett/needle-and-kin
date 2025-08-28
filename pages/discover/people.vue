<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Discover People</h1>
      <p class="text-gray-600 mt-2">Find and connect with fellow crafters in the community</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Suggested for You</h2>
            <button
              @click="refreshSuggestions"
              :disabled="loadingSuggestions"
              class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Icon name="mdi:refresh" :class="['h-5 w-5', loadingSuggestions && 'animate-spin']" />
            </button>
          </div>

          <div v-if="loadingSuggestions" class="py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
          </div>

          <div v-else-if="suggestedUsers.length === 0" class="py-8 text-center">
            <Icon name="mdi:account-search" class="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">No suggestions available right now</p>
          </div>

          <div v-else class="space-y-4">
            <UserCard
              v-for="user in suggestedUsers"
              :key="user.id"
              :user="user"
              :show-bio="true"
              :show-stats="true"
              :show-skills="true"
              :show-mutual-info="true"
              :current-user-id="currentUserId"
              @follow="handleFollow"
              @unfollow="handleUnfollow"
              @click="navigateToProfile"
            />
          </div>

          <button
            v-if="hasMoreSuggestions"
            @click="loadMoreSuggestions"
            :disabled="loadingMore"
            class="w-full mt-4 px-4 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            {{ loadingMore ? 'Loading...' : 'Load more suggestions' }}
          </button>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Browse by Interest</h2>
          
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              v-for="category in categories"
              :key="category.value"
              @click="selectCategory(category.value)"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                selectedCategory === category.value
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              <Icon :name="category.icon" class="inline-block mr-2 h-4 w-4" />
              {{ category.label }}
            </button>
          </div>

          <div v-if="categoryUsers.length > 0" class="mt-6 space-y-4">
            <h3 class="text-sm font-medium text-gray-700">
              People interested in {{ selectedCategoryLabel }}
            </h3>
            <UserCard
              v-for="user in categoryUsers"
              :key="user.id"
              :user="user"
              :variant="'compact'"
              :show-bio="false"
              :show-stats="false"
              :current-user-id="currentUserId"
              @follow="handleFollow"
              @unfollow="handleUnfollow"
              @click="navigateToProfile"
            />
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Popular Creators</h3>
          
          <div v-if="loadingPopular" class="py-4">
            <div class="animate-pulse space-y-3">
              <div class="flex space-x-3">
                <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(user, index) in popularUsers"
              :key="user.id"
              class="flex items-center space-x-3"
            >
              <span class="text-lg font-bold text-gray-400 w-6">{{ index + 1 }}</span>
              <img
                :src="user.avatar || '/default-avatar.png'"
                :alt="user.name"
                class="h-10 w-10 rounded-full object-cover"
              />
              <div class="flex-1 min-w-0">
                <NuxtLink
                  :to="`/profile/${user.username}`"
                  class="text-sm font-medium text-gray-900 hover:text-pink-600"
                >
                  {{ user.name }}
                </NuxtLink>
                <p class="text-xs text-gray-500">{{ formatNumber(user.followersCount) }} followers</p>
              </div>
              <button
                @click="handleFollowPopular(user)"
                :disabled="user.isFollowing"
                class="px-3 py-1 text-xs font-medium rounded-md"
                :class="user.isFollowing
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-pink-600 text-white hover:bg-pink-700'"
              >
                {{ user.isFollowing ? 'Following' : 'Follow' }}
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">New to Needle & Kin</h3>
          
          <div v-if="loadingNew" class="py-4">
            <div class="animate-pulse space-y-3">
              <div class="flex space-x-3">
                <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="user in newUsers"
              :key="user.id"
              class="flex items-center space-x-3"
            >
              <img
                :src="user.avatar || '/default-avatar.png'"
                :alt="user.name"
                class="h-10 w-10 rounded-full object-cover"
              />
              <div class="flex-1 min-w-0">
                <NuxtLink
                  :to="`/profile/${user.username}`"
                  class="text-sm font-medium text-gray-900 hover:text-pink-600"
                >
                  {{ user.name }}
                </NuxtLink>
                <p class="text-xs text-gray-500">Joined {{ formatDate(user.joinedAt) }}</p>
              </div>
              <button
                @click="handleFollowNew(user)"
                :disabled="user.isFollowing"
                class="px-3 py-1 text-xs font-medium rounded-md"
                :class="user.isFollowing
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-pink-600 text-white hover:bg-pink-700'"
              >
                {{ user.isFollowing ? 'Following' : 'Follow' }}
              </button>
            </div>
          </div>

          <p class="text-xs text-gray-500 mt-4">
            Welcome new members and help them feel at home!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '~/stores/user'

definePageMeta({
  middleware: 'auth'
})

const userStore = useUserStore()
const currentUserId = computed(() => userStore.user?.id)

const suggestedUsers = ref<any[]>([])
const popularUsers = ref<any[]>([])
const newUsers = ref<any[]>([])
const categoryUsers = ref<any[]>([])

const loadingSuggestions = ref(false)
const loadingPopular = ref(false)
const loadingNew = ref(false)
const loadingMore = ref(false)
const hasMoreSuggestions = ref(true)

const selectedCategory = ref('')
const selectedCategoryLabel = computed(() => {
  const cat = categories.find(c => c.value === selectedCategory.value)
  return cat?.label || ''
})

const categories = [
  { value: 'knitting', label: 'Knitting', icon: 'mdi:knit' },
  { value: 'crochet', label: 'Crochet', icon: 'mdi:hook' },
  { value: 'sewing', label: 'Sewing', icon: 'mdi:needle' },
  { value: 'embroidery', label: 'Embroidery', icon: 'mdi:flower' },
  { value: 'quilting', label: 'Quilting', icon: 'mdi:grid' },
  { value: 'weaving', label: 'Weaving', icon: 'mdi:texture' }
]

const fetchSuggestions = async () => {
  loadingSuggestions.value = true
  try {
    const { data } = await $fetch('/api/users/suggestions', {
      params: { limit: 10 },
      credentials: 'include'
    })
    if (data) {
      suggestedUsers.value = data.suggestions
    }
  } catch (error) {
    console.error('Failed to fetch suggestions:', error)
  } finally {
    loadingSuggestions.value = false
  }
}

const fetchPopularUsers = async () => {
  loadingPopular.value = true
  try {
    const { data } = await $fetch('/api/users/popular', {
      params: { limit: 5 },
      credentials: 'include'
    })
    if (data) {
      popularUsers.value = data.users
    }
  } catch (error) {
    console.error('Failed to fetch popular users:', error)
  } finally {
    loadingPopular.value = false
  }
}

const fetchNewUsers = async () => {
  loadingNew.value = true
  try {
    const { data } = await $fetch('/api/users/new', {
      params: { limit: 5 },
      credentials: 'include'
    })
    if (data) {
      newUsers.value = data.users
    }
  } catch (error) {
    console.error('Failed to fetch new users:', error)
  } finally {
    loadingNew.value = false
  }
}

const fetchCategoryUsers = async (category: string) => {
  try {
    const { data } = await $fetch('/api/users/by-interest', {
      params: { interest: category, limit: 5 },
      credentials: 'include'
    })
    if (data) {
      categoryUsers.value = data.users
    }
  } catch (error) {
    console.error('Failed to fetch users by category:', error)
  }
}

const refreshSuggestions = () => {
  fetchSuggestions()
}

const loadMoreSuggestions = async () => {
  loadingMore.value = true
  try {
    const { data } = await $fetch('/api/users/suggestions', {
      params: { 
        limit: 10,
        offset: suggestedUsers.value.length
      },
      credentials: 'include'
    })
    if (data) {
      suggestedUsers.value.push(...data.suggestions)
      hasMoreSuggestions.value = data.hasMore
    }
  } catch (error) {
    console.error('Failed to load more suggestions:', error)
  } finally {
    loadingMore.value = false
  }
}

const selectCategory = (category: string) => {
  selectedCategory.value = category
  fetchCategoryUsers(category)
}

const handleFollow = async (userId: string) => {
  try {
    await $fetch(`/api/users/${userId}/follow`, {
      method: 'POST',
      credentials: 'include'
    })
    updateFollowStatus(userId, true)
  } catch (error) {
    console.error('Failed to follow user:', error)
  }
}

const handleUnfollow = async (userId: string) => {
  try {
    await $fetch(`/api/users/${userId}/unfollow`, {
      method: 'POST',
      credentials: 'include'
    })
    updateFollowStatus(userId, false)
  } catch (error) {
    console.error('Failed to unfollow user:', error)
  }
}

const handleFollowPopular = async (user: any) => {
  await handleFollow(user.id)
  user.isFollowing = true
}

const handleFollowNew = async (user: any) => {
  await handleFollow(user.id)
  user.isFollowing = true
}

const updateFollowStatus = (userId: string, isFollowing: boolean) => {
  const updateUser = (user: any) => {
    if (user.id === userId) {
      user.isFollowing = isFollowing
    }
  }
  
  suggestedUsers.value.forEach(updateUser)
  popularUsers.value.forEach(updateUser)
  newUsers.value.forEach(updateUser)
  categoryUsers.value.forEach(updateUser)
}

const navigateToProfile = (user: any) => {
  navigateTo(`/profile/${user.username}`)
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

const formatDate = (date: string | Date) => {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

onMounted(() => {
  fetchSuggestions()
  fetchPopularUsers()
  fetchNewUsers()
})
</script>