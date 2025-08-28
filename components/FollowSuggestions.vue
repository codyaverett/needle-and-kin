<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <button
          @click="refreshSuggestions"
          class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
          aria-label="Refresh suggestions"
        >
          <Icon name="mdi:refresh" class="h-5 w-5" />
        </button>
      </div>
      <p v-if="subtitle" class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
    </div>

    <div v-if="loading" class="p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
      <p class="text-sm text-gray-500 text-center mt-3">Finding suggestions...</p>
    </div>

    <div v-else-if="suggestions.length === 0" class="p-8 text-center">
      <Icon name="mdi:account-search-outline" class="h-12 w-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500">No suggestions available</p>
      <p class="text-sm text-gray-400 mt-1">Check back later for new recommendations</p>
    </div>

    <div v-else>
      <div v-if="layout === 'list'" class="divide-y divide-gray-100">
        <div
          v-for="user in displayedSuggestions"
          :key="user.id"
          class="p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start space-x-3">
            <img
              :src="user.avatar || '/default-avatar.png'"
              :alt="user.name"
              class="h-12 w-12 rounded-full object-cover"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <div>
                  <NuxtLink
                    :to="`/profile/${user.username}`"
                    class="text-sm font-medium text-gray-900 hover:text-pink-600"
                  >
                    {{ user.name }}
                    <Icon v-if="user.isVerified" name="mdi:check-circle" class="inline-block ml-1 h-4 w-4 text-blue-500" />
                  </NuxtLink>
                  <p class="text-xs text-gray-500">@{{ user.username }}</p>
                </div>
                <button
                  @click="handleFollow(user)"
                  :disabled="user.isFollowing"
                  class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
                  :class="user.isFollowing 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-pink-600 text-white hover:bg-pink-700'"
                >
                  {{ user.isFollowing ? 'Following' : 'Follow' }}
                </button>
              </div>
              <p v-if="user.bio" class="text-sm text-gray-600 mt-1 line-clamp-2">{{ user.bio }}</p>
              <div class="flex items-center space-x-4 mt-2">
                <span class="text-xs text-gray-500">
                  <span class="font-medium">{{ user.followersCount || 0 }}</span> followers
                </span>
                <span v-if="user.mutualFollowers && user.mutualFollowers.length > 0" class="text-xs text-gray-500">
                  Followed by {{ formatMutualFollowers(user.mutualFollowers) }}
                </span>
              </div>
              <div v-if="user.commonInterests && user.commonInterests.length > 0" class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="interest in user.commonInterests.slice(0, 3)"
                  :key="interest"
                  class="px-2 py-0.5 text-xs bg-pink-50 text-pink-700 rounded-full"
                >
                  {{ interest }}
                </span>
                <span
                  v-if="user.commonInterests.length > 3"
                  class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  +{{ user.commonInterests.length - 3 }} more
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="layout === 'grid'" class="grid grid-cols-2 gap-4 p-4">
        <div
          v-for="user in displayedSuggestions"
          :key="user.id"
          class="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors"
        >
          <img
            :src="user.avatar || '/default-avatar.png'"
            :alt="user.name"
            class="h-16 w-16 rounded-full object-cover mx-auto mb-3"
          />
          <NuxtLink
            :to="`/profile/${user.username}`"
            class="block text-sm font-medium text-gray-900 hover:text-pink-600"
          >
            {{ user.name }}
          </NuxtLink>
          <p class="text-xs text-gray-500 mb-3">@{{ user.username }}</p>
          <button
            @click="handleFollow(user)"
            :disabled="user.isFollowing"
            class="w-full px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
            :class="user.isFollowing 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-pink-600 text-white hover:bg-pink-700'"
          >
            {{ user.isFollowing ? 'Following' : 'Follow' }}
          </button>
        </div>
      </div>

      <div v-else-if="layout === 'carousel'" class="relative">
        <div class="overflow-x-auto scrollbar-hide">
          <div class="flex space-x-4 p-4">
            <div
              v-for="user in displayedSuggestions"
              :key="user.id"
              class="flex-shrink-0 w-40 bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors"
            >
              <img
                :src="user.avatar || '/default-avatar.png'"
                :alt="user.name"
                class="h-16 w-16 rounded-full object-cover mx-auto mb-3"
              />
              <NuxtLink
                :to="`/profile/${user.username}`"
                class="block text-sm font-medium text-gray-900 hover:text-pink-600 truncate"
              >
                {{ user.name }}
              </NuxtLink>
              <p class="text-xs text-gray-500 mb-3 truncate">@{{ user.username }}</p>
              <button
                @click="handleFollow(user)"
                :disabled="user.isFollowing"
                class="w-full px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                :class="user.isFollowing 
                  ? 'bg-gray-200 text-gray-700' 
                  : 'bg-pink-600 text-white hover:bg-pink-700'"
              >
                {{ user.isFollowing ? 'Following' : 'Follow' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && suggestions.length > displayLimit && showViewAll" class="p-3 border-t border-gray-200 bg-gray-50">
      <NuxtLink
        to="/discover/people"
        class="block text-center text-sm text-pink-600 hover:text-pink-700 font-medium"
      >
        Discover more people
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface SuggestedUser {
  id: string
  username: string
  name: string
  avatar?: string
  bio?: string
  isFollowing?: boolean
  followersCount?: number
  isVerified?: boolean
  mutualFollowers?: string[]
  commonInterests?: string[]
  suggestionReason?: string
}

const props = withDefaults(defineProps<{
  suggestions?: SuggestedUser[]
  title?: string
  subtitle?: string
  layout?: 'list' | 'grid' | 'carousel'
  displayLimit?: number
  showViewAll?: boolean
  loading?: boolean
}>(), {
  suggestions: () => [],
  title: 'Suggested for you',
  layout: 'list',
  displayLimit: 5,
  showViewAll: true,
  loading: false
})

const emit = defineEmits<{
  follow: [user: SuggestedUser]
  unfollow: [user: SuggestedUser]
  refresh: []
}>()

const displayedSuggestions = computed(() => {
  return props.suggestions.slice(0, props.displayLimit)
})

const formatMutualFollowers = (followers: string[]) => {
  if (followers.length === 1) {
    return followers[0]
  } else if (followers.length === 2) {
    return `${followers[0]} and ${followers[1]}`
  } else {
    return `${followers[0]} and ${followers.length - 1} others`
  }
}

const handleFollow = async (user: SuggestedUser) => {
  if (user.isFollowing) {
    emit('unfollow', user)
  } else {
    emit('follow', user)
  }
}

const refreshSuggestions = () => {
  emit('refresh')
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>