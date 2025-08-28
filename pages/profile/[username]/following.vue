<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-6">
      <div class="flex items-center space-x-4 mb-4">
        <NuxtLink
          :to="`/profile/${username}`"
          class="p-2 hover:bg-gray-100 rounded-full"
        >
          <Icon name="mdi:arrow-left" class="h-5 w-5" />
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ userProfile?.name || username }}'s Following
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            @{{ username }}
          </p>
        </div>
      </div>

      <div class="flex space-x-1 border-b border-gray-200">
        <NuxtLink
          :to="`/profile/${username}/followers`"
          class="px-4 py-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900"
        >
          Followers
          <span class="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
            {{ followerCount }}
          </span>
        </NuxtLink>
        <NuxtLink
          :to="`/profile/${username}/following`"
          class="px-4 py-2 border-b-2 border-pink-600 text-pink-600 font-medium"
        >
          Following
          <span class="ml-2 px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs">
            {{ following.length }}
          </span>
        </NuxtLink>
      </div>
    </div>

    <FollowerList
      :users="following"
      :title="`Following ${following.length} ${following.length !== 1 ? 'people' : 'person'}`"
      :loading="loading"
      :show-search="true"
      :show-follow-buttons="true"
      :show-pagination="true"
      :items-per-page="20"
      :current-user-id="currentUserId"
      empty-message="Not following anyone yet"
      @follow="handleFollow"
      @unfollow="handleUnfollow"
      @select="handleUserSelect"
    />

    <div v-if="!loading && following.length === 0 && !isOwnProfile" class="mt-8">
      <FollowSuggestions
        :suggestions="suggestions"
        title="Suggested for you"
        subtitle="People you might like to follow"
        layout="list"
        :display-limit="5"
        :loading="loadingSuggestions"
        @follow="handleFollowSuggestion"
        @refresh="fetchSuggestions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/stores/user'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const userStore = useUserStore()

const username = computed(() => route.params.username as string)
const currentUserId = computed(() => userStore.user?.id)
const isOwnProfile = computed(() => userStore.user?.username === username.value)

const userProfile = ref<any>(null)
const following = ref<any[]>([])
const followerCount = ref(0)
const loading = ref(true)
const suggestions = ref<any[]>([])
const loadingSuggestions = ref(false)

const fetchUserProfile = async () => {
  try {
    const { data } = await $fetch(`/api/users/${username.value}`)
    if (data) {
      userProfile.value = data
    }
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
  }
}

const fetchFollowing = async () => {
  loading.value = true
  try {
    const { data } = await $fetch(`/api/users/${username.value}/following`)
    if (data) {
      following.value = data.following
      followerCount.value = data.followerCount || 0
    }
  } catch (error) {
    console.error('Failed to fetch following:', error)
  } finally {
    loading.value = false
  }
}

const fetchSuggestions = async () => {
  loadingSuggestions.value = true
  try {
    const { data } = await $fetch('/api/users/suggestions', {
      credentials: 'include'
    })
    if (data) {
      suggestions.value = data.suggestions
    }
  } catch (error) {
    console.error('Failed to fetch suggestions:', error)
  } finally {
    loadingSuggestions.value = false
  }
}

const handleFollow = async (userId: string) => {
  try {
    await $fetch(`/api/users/${userId}/follow`, {
      method: 'POST',
      credentials: 'include'
    })
    
    const user = following.value.find(u => u.id === userId)
    if (user) {
      user.isFollowing = true
    }
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
    
    if (isOwnProfile.value) {
      // Remove from list if it's own profile
      const index = following.value.findIndex(u => u.id === userId)
      if (index > -1) {
        following.value.splice(index, 1)
      }
    } else {
      const user = following.value.find(u => u.id === userId)
      if (user) {
        user.isFollowing = false
      }
    }
  } catch (error) {
    console.error('Failed to unfollow user:', error)
  }
}

const handleFollowSuggestion = async (user: any) => {
  await handleFollow(user.id)
  user.isFollowing = true
}

const handleUserSelect = (user: any) => {
  navigateTo(`/profile/${user.username}`)
}

onMounted(() => {
  fetchUserProfile()
  fetchFollowing()
  if (following.value.length === 0 && !isOwnProfile.value) {
    fetchSuggestions()
  }
})
</script>