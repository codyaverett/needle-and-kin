<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div class="flex items-start space-x-3">
      <NuxtLink :to="`/profile/${activity.user.username}`" class="flex-shrink-0">
        <img
          :src="activity.user.avatar || '/default-avatar.png'"
          :alt="activity.user.name"
          class="h-10 w-10 rounded-full object-cover hover:ring-2 hover:ring-pink-500 transition-all"
        />
      </NuxtLink>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm">
              <NuxtLink
                :to="`/profile/${activity.user.username}`"
                class="font-medium text-gray-900 hover:text-pink-600"
              >
                {{ activity.user.name }}
              </NuxtLink>
              <Icon v-if="activity.user.isVerified" name="mdi:check-circle" class="inline-block ml-1 h-4 w-4 text-blue-500" />
              <span class="mx-1 text-gray-500">{{ getActivityText(activity) }}</span>
              <NuxtLink
                v-if="activity.target"
                :to="getTargetLink(activity.target)"
                class="font-medium text-gray-900 hover:text-pink-600"
              >
                {{ activity.target.title || 'untitled' }}
              </NuxtLink>
            </p>
            <p class="text-xs text-gray-500 mt-1">
              {{ formatRelativeTime(activity.createdAt) }}
            </p>
          </div>

          <button
            @click="showMenu = !showMenu"
            class="p-1 rounded hover:bg-gray-100"
            aria-label="More options"
          >
            <Icon name="mdi:dots-horizontal" class="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div v-if="activity.metadata?.comment" class="mt-3 text-sm text-gray-700">
          {{ activity.metadata.comment }}
        </div>

        <div v-if="activity.target && shouldShowPreview(activity)" class="mt-3">
          <div @click="handleCardClick" class="cursor-pointer">
            <div v-if="activity.target.type === 'post'" class="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
              <div class="flex space-x-3">
                <img
                  v-if="activity.target.image"
                  :src="activity.target.image"
                  :alt="activity.target.title"
                  class="h-16 w-16 rounded object-cover"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 line-clamp-1">
                    {{ activity.target.title }}
                  </h4>
                  <p class="text-sm text-gray-600 line-clamp-2 mt-1">
                    {{ activity.target.excerpt }}
                  </p>
                </div>
              </div>
            </div>

            <div v-else-if="activity.target.type === 'project'" class="border border-gray-200 rounded-lg overflow-hidden hover:bg-gray-50">
              <img
                v-if="activity.target.image"
                :src="activity.target.image"
                :alt="activity.target.title"
                class="w-full h-48 object-cover"
              />
              <div class="p-3">
                <h4 class="text-sm font-medium text-gray-900">{{ activity.target.title }}</h4>
                <div v-if="activity.metadata?.project" class="mt-2">
                  <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>{{ activity.metadata.project.category }}</span>
                    <span>{{ activity.metadata.project.progress }}% complete</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      class="bg-pink-600 h-1.5 rounded-full"
                      :style="`width: ${activity.metadata.project.progress}%`"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="activity.target.type === 'achievement'" class="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-center space-x-3">
                <div class="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Icon :name="activity.metadata?.achievement?.icon || 'mdi:trophy'" class="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-900">
                    {{ activity.metadata?.achievement?.name || 'Achievement Unlocked' }}
                  </h4>
                  <p class="text-xs text-gray-600 mt-0.5">
                    {{ activity.metadata?.achievement?.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showActions" class="flex items-center space-x-4 mt-4">
          <button
            @click="handleLike"
            :class="[
              'flex items-center space-x-1 text-sm transition-colors',
              activity.isLiked ? 'text-pink-600' : 'text-gray-500 hover:text-pink-600'
            ]"
          >
            <Icon :name="activity.isLiked ? 'mdi:heart' : 'mdi:heart-outline'" class="h-5 w-5" />
            <span>{{ activity.likesCount || 0 }}</span>
          </button>

          <button
            @click="handleComment"
            class="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <Icon name="mdi:comment-outline" class="h-5 w-5" />
            <span>{{ activity.commentsCount || 0 }}</span>
          </button>

          <button
            @click="handleShare"
            class="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <Icon name="mdi:share-variant" class="h-5 w-5" />
            <span>Share</span>
          </button>

          <div class="flex-1"></div>

          <button
            @click="handleSave"
            class="text-gray-500 hover:text-gray-700"
          >
            <Icon name="mdi:bookmark-outline" class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <Transition name="menu">
      <div
        v-if="showMenu"
        v-click-outside="() => showMenu = false"
        class="absolute right-4 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
      >
        <button
          @click="copyLink"
          class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
        >
          Copy link
        </button>
        <button
          @click="hideActivity"
          class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
        >
          Hide this activity
        </button>
        <button
          @click="muteUser"
          class="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
        >
          Mute @{{ activity.user.username }}
        </button>
        <button
          @click="reportActivity"
          class="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
        >
          Report
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { vOnClickOutside as vClickOutside } from '@vueuse/components'
import type { Activity } from '~/types/activity'

const props = withDefaults(defineProps<{
  activity: Activity
  showActions?: boolean
}>(), {
  showActions: true
})

const emit = defineEmits<{
  like: [activity: Activity]
  comment: [activity: Activity]
  share: [activity: Activity]
  save: [activity: Activity]
  click: [activity: Activity]
  hide: [activity: Activity]
  mute: [userId: string]
  report: [activity: Activity]
}>()

const showMenu = ref(false)

const getActivityText = (activity: Activity): string => {
  const texts: Record<string, string> = {
    'posted': 'shared',
    'liked': 'liked',
    'commented': 'commented on',
    'followed': 'started following',
    'created_project': 'created a new project',
    'completed_tutorial': 'completed',
    'joined_group': 'joined',
    'earned_achievement': 'earned',
    'shared': 'shared',
    'updated_profile': 'updated their profile'
  }
  return texts[activity.type] || activity.type
}

const getTargetLink = (target: any): string => {
  const links: Record<string, string> = {
    'post': `/blog/${target.slug || target.id}`,
    'project': `/projects/${target.id}`,
    'tutorial': `/tutorials/${target.id}`,
    'user': `/profile/${target.slug || target.id}`,
    'group': `/groups/${target.id}`,
    'achievement': `/achievements/${target.id}`
  }
  return target.url || links[target.type] || '#'
}

const shouldShowPreview = (activity: Activity): boolean => {
  const previewTypes = ['posted', 'liked', 'commented', 'shared', 'created_project', 'earned_achievement']
  return previewTypes.includes(activity.type) && !!activity.target
}

const formatRelativeTime = (dateString: string | Date): string => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const handleCardClick = () => {
  emit('click', props.activity)
}

const handleLike = () => {
  emit('like', props.activity)
}

const handleComment = () => {
  emit('comment', props.activity)
}

const handleShare = () => {
  emit('share', props.activity)
}

const handleSave = () => {
  emit('save', props.activity)
}

const copyLink = () => {
  if (props.activity.target) {
    const link = window.location.origin + getTargetLink(props.activity.target)
    navigator.clipboard.writeText(link)
  }
  showMenu.value = false
}

const hideActivity = () => {
  emit('hide', props.activity)
  showMenu.value = false
}

const muteUser = () => {
  emit('mute', props.activity.user.id)
  showMenu.value = false
}

const reportActivity = () => {
  emit('report', props.activity)
  showMenu.value = false
}
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: all 0.2s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>