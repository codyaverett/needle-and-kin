<template>
  <div 
    @click="handleClick"
    :class="[
      'group relative p-4 transition-colors cursor-pointer',
      variant === 'compact' ? 'hover:bg-gray-50' : 'hover:bg-gray-50 border-b border-gray-100'
    ]"
  >
    <div class="flex items-start space-x-3">
      <div class="relative flex-shrink-0">
        <img
          :src="user.avatar || '/default-avatar.png'"
          :alt="user.name"
          :class="[
            'object-cover',
            avatarSize === 'small' ? 'h-10 w-10' : avatarSize === 'medium' ? 'h-12 w-12' : 'h-14 w-14',
            'rounded-full'
          ]"
        />
        <div v-if="user.isOnline" class="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-1">
              <NuxtLink
                :to="`/profile/${user.username}`"
                class="text-sm font-medium text-gray-900 hover:text-pink-600"
                @click.stop
              >
                {{ user.name }}
              </NuxtLink>
              <Icon v-if="user.isVerified" name="mdi:check-circle" class="h-4 w-4 text-blue-500" />
              <span v-if="user.badge" class="px-1.5 py-0.5 text-xs font-medium rounded-full" :class="getBadgeClass(user.badge)">
                {{ user.badge }}
              </span>
            </div>
            <p class="text-sm text-gray-500">@{{ user.username }}</p>
          </div>

          <div v-if="showFollowButton && user.id !== currentUserId" class="ml-2">
            <button
              @click.stop="handleFollowToggle"
              :disabled="followLoading"
              :class="[
                'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                user.isFollowing 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-red-600 group-hover:bg-red-50 group-hover:text-red-600 group-hover:border-red-200'
                  : 'bg-pink-600 text-white hover:bg-pink-700',
                followLoading && 'opacity-50 cursor-not-allowed'
              ]"
            >
              <span v-if="!user.isFollowing">Follow</span>
              <span v-else class="group-hover:hidden">Following</span>
              <span v-if="user.isFollowing" class="hidden group-hover:inline">Unfollow</span>
            </button>
          </div>
        </div>

        <p v-if="user.bio && showBio" class="text-sm text-gray-600 mt-1 line-clamp-2">
          {{ user.bio }}
        </p>

        <div v-if="showStats" class="flex items-center space-x-4 mt-2">
          <span class="text-xs text-gray-500">
            <span class="font-medium">{{ formatNumber(user.followersCount || 0) }}</span> followers
          </span>
          <span class="text-xs text-gray-500">
            <span class="font-medium">{{ formatNumber(user.followingCount || 0) }}</span> following
          </span>
          <span v-if="user.postsCount" class="text-xs text-gray-500">
            <span class="font-medium">{{ formatNumber(user.postsCount) }}</span> posts
          </span>
        </div>

        <div v-if="user.skills && user.skills.length > 0 && showSkills" class="flex flex-wrap gap-1 mt-2">
          <span
            v-for="skill in user.skills.slice(0, maxSkills)"
            :key="skill"
            class="px-2 py-0.5 text-xs bg-pink-50 text-pink-700 rounded-full"
          >
            {{ skill }}
          </span>
          <span
            v-if="user.skills.length > maxSkills"
            class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
          >
            +{{ user.skills.length - maxSkills }} more
          </span>
        </div>

        <div v-if="showMutualInfo && user.mutualFollowers && user.mutualFollowers.length > 0" class="flex items-center mt-2">
          <div class="flex -space-x-2">
            <img
              v-for="(follower, index) in user.mutualFollowers.slice(0, 3)"
              :key="index"
              :src="follower.avatar || '/default-avatar.png'"
              :alt="follower.name"
              class="h-6 w-6 rounded-full border-2 border-white"
            />
          </div>
          <span class="ml-2 text-xs text-gray-500">
            Followed by {{ formatMutualFollowers(user.mutualFollowers) }}
          </span>
        </div>

        <div v-if="showActions" class="flex items-center space-x-3 mt-3">
          <button
            @click.stop="$emit('message', user)"
            class="text-xs text-gray-600 hover:text-gray-900"
          >
            <Icon name="mdi:message-outline" class="h-4 w-4 inline mr-1" />
            Message
          </button>
          <button
            @click.stop="$emit('share', user)"
            class="text-xs text-gray-600 hover:text-gray-900"
          >
            <Icon name="mdi:share-variant" class="h-4 w-4 inline mr-1" />
            Share
          </button>
          <button
            v-if="showMoreOptions"
            @click.stop="$emit('more', user)"
            class="text-xs text-gray-600 hover:text-gray-900"
          >
            <Icon name="mdi:dots-horizontal" class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface MutualFollower {
  name: string
  avatar?: string
}

interface User {
  id: string
  username: string
  name: string
  avatar?: string
  bio?: string
  isFollowing?: boolean
  followersCount?: number
  followingCount?: number
  postsCount?: number
  isVerified?: boolean
  isOnline?: boolean
  badge?: string
  skills?: string[]
  mutualFollowers?: MutualFollower[]
}

const props = withDefaults(defineProps<{
  user: User
  variant?: 'default' | 'compact'
  avatarSize?: 'small' | 'medium' | 'large'
  showFollowButton?: boolean
  showBio?: boolean
  showStats?: boolean
  showSkills?: boolean
  showMutualInfo?: boolean
  showActions?: boolean
  showMoreOptions?: boolean
  maxSkills?: number
  currentUserId?: string
}>(), {
  variant: 'default',
  avatarSize: 'medium',
  showFollowButton: true,
  showBio: true,
  showStats: true,
  showSkills: false,
  showMutualInfo: false,
  showActions: false,
  showMoreOptions: false,
  maxSkills: 3
})

const emit = defineEmits<{
  click: [user: User]
  follow: [userId: string]
  unfollow: [userId: string]
  message: [user: User]
  share: [user: User]
  more: [user: User]
}>()

const followLoading = ref(false)

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

const formatMutualFollowers = (followers: MutualFollower[]) => {
  if (followers.length === 1) {
    return followers[0].name
  } else if (followers.length === 2) {
    return `${followers[0].name} and ${followers[1].name}`
  } else {
    return `${followers[0].name} and ${followers.length - 1} others`
  }
}

const getBadgeClass = (badge: string) => {
  const badges: Record<string, string> = {
    'Pro': 'bg-purple-100 text-purple-700',
    'Expert': 'bg-blue-100 text-blue-700',
    'Moderator': 'bg-green-100 text-green-700',
    'Admin': 'bg-red-100 text-red-700',
    'New': 'bg-yellow-100 text-yellow-700'
  }
  return badges[badge] || 'bg-gray-100 text-gray-700'
}

const handleClick = () => {
  emit('click', props.user)
}

const handleFollowToggle = async () => {
  followLoading.value = true
  try {
    if (props.user.isFollowing) {
      emit('unfollow', props.user.id)
    } else {
      emit('follow', props.user.id)
    }
  } finally {
    setTimeout(() => {
      followLoading.value = false
    }, 300)
  }
}
</script>