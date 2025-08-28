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
            {{ userProfile?.name || username }}'s Followers
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            @{{ username }}
          </p>
        </div>
      </div>

      <div class="flex space-x-1 border-b border-gray-200">
        <NuxtLink
          :to="`/profile/${username}/followers`"
          class="px-4 py-2 border-b-2 border-pink-600 text-pink-600 font-medium"
        >
          Followers
          <span class="ml-2 px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs">
            {{ followers.length }}
          </span>
        </NuxtLink>
        <NuxtLink
          :to="`/profile/${username}/following`"
          class="px-4 py-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900"
        >
          Following
          <span class="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
            {{ followingCount }}
          </span>
        </NuxtLink>
      </div>
    </div>

    <FollowerList
      :users="followers"
      :title="`${followers.length} Follower${followers.length !== 1 ? 's' : ''}`"
      :loading="loading"
      :show-search="true"
      :show-follow-buttons="true"
      :show-pagination="true"
      :items-per-page="20"
      :current-user-id="currentUserId"
      empty-message="No followers yet"
      @follow="handleFollow"
      @unfollow="handleUnfollow"
      @select="handleUserSelect"
    />

    <div v-if="!loading && isOwnProfile" class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex">
        <Icon name="mdi:information" class="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-blue-800">Grow your following</h3>
          <p class="mt-1 text-sm text-blue-700">
            Share your projects and engage with the community to gain more followers.
          </p>
          <div class="mt-3">
            <NuxtLink
              to="/discover/people"
              class="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Discover people to follow →
            </NuxtLink>
          </div>
        </div>
      </div>
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
const followers = ref<any[]>([])
const followingCount = ref(0)
const loading = ref(true)

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

const fetchFollowers = async () => {
  loading.value = true
  try {
    const { data } = await $fetch(`/api/users/${username.value}/followers`)
    if (data) {
      followers.value = data.followers
      followingCount.value = data.followingCount || 0
    }
  } catch (error) {
    console.error('Failed to fetch followers:', error)
  } finally {
    loading.value = false
  }
}

const handleFollow = async (userId: string) => {
  try {
    await $fetch(`/api/users/${userId}/follow`, {
      method: 'POST',
      credentials: 'include'
    })
    
    const user = followers.value.find(u => u.id === userId)
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
    
    const user = followers.value.find(u => u.id === userId)
    if (user) {
      user.isFollowing = false
    }
  } catch (error) {
    console.error('Failed to unfollow user:', error)
  }
}

const handleUserSelect = (user: any) => {
  navigateTo(`/profile/${user.username}`)
}

onMounted(() => {
  fetchUserProfile()
  fetchFollowers()
})
</script>