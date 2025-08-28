<template>
  <div
    @click="handleClick"
    :class="[
      'group relative p-4 hover:bg-gray-50 cursor-pointer transition-colors',
      !notification.read && 'bg-blue-50 hover:bg-blue-100'
    ]"
  >
    <div class="flex items-start space-x-3">
      <div :class="[
        'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
        getIconStyle(notification.type).bg
      ]">
        <Icon
          :name="getIconStyle(notification.type).icon"
          :class="['h-5 w-5', getIconStyle(notification.type).color]"
        />
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p :class="[
              'text-sm font-medium',
              notification.read ? 'text-gray-900' : 'text-gray-900'
            ]">
              {{ notification.title }}
            </p>
            <p :class="[
              'text-sm mt-1',
              notification.read ? 'text-gray-600' : 'text-gray-700'
            ]">
              {{ notification.message }}
            </p>
            
            <div
              v-if="notification.metadata && notification.metadata.actionUrl"
              class="mt-2"
            >
              <NuxtLink
                :to="notification.metadata.actionUrl"
                class="inline-flex items-center text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                {{ notification.metadata.actionText || 'View' }}
                <Icon name="mdi:arrow-right" class="ml-1 h-4 w-4" />
              </NuxtLink>
            </div>

            <p class="text-xs text-gray-500 mt-2">
              {{ formatRelativeTime(notification.createdAt) }}
            </p>
          </div>

          <div class="flex items-center space-x-1 ml-4">
            <button
              v-if="!notification.read"
              @click.stop="markAsRead"
              class="p-1 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Mark as read"
            >
              <Icon name="mdi:check" class="h-4 w-4 text-gray-600" />
            </button>
            <button
              @click.stop="deleteNotification"
              class="p-1 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Delete notification"
            >
              <Icon name="mdi:close" class="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!notification.read"
      class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface NotificationMetadata {
  actionUrl?: string
  actionText?: string
  userId?: string
  postId?: string
  commentId?: string
  achievementId?: string
  [key: string]: any
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
  metadata?: NotificationMetadata
}

const props = defineProps<{
  notification: Notification
}>()

const emit = defineEmits<{
  click: [notification: Notification]
  read: [id: string]
  delete: [id: string]
}>()

const getIconStyle = (type: string) => {
  const styles: Record<string, { icon: string; bg: string; color: string }> = {
    comment_reply: {
      icon: 'mdi:comment-text',
      bg: 'bg-blue-100',
      color: 'text-blue-600'
    },
    post_like: {
      icon: 'mdi:heart',
      bg: 'bg-red-100',
      color: 'text-red-600'
    },
    new_follower: {
      icon: 'mdi:account-plus',
      bg: 'bg-purple-100',
      color: 'text-purple-600'
    },
    mention: {
      icon: 'mdi:at',
      bg: 'bg-yellow-100',
      color: 'text-yellow-600'
    },
    achievement_unlocked: {
      icon: 'mdi:trophy',
      bg: 'bg-green-100',
      color: 'text-green-600'
    },
    project_feedback: {
      icon: 'mdi:message-star',
      bg: 'bg-indigo-100',
      color: 'text-indigo-600'
    },
    group_invite: {
      icon: 'mdi:account-group',
      bg: 'bg-teal-100',
      color: 'text-teal-600'
    },
    system_announcement: {
      icon: 'mdi:bullhorn',
      bg: 'bg-gray-100',
      color: 'text-gray-600'
    }
  }

  return styles[type] || {
    icon: 'mdi:bell',
    bg: 'bg-gray-100',
    color: 'text-gray-600'
  }
}

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  }
  if (seconds < 604800) {
    const days = Math.floor(seconds / 86400)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }
  
  return date.toLocaleDateString()
}

const handleClick = () => {
  emit('click', props.notification)
  if (!props.notification.read) {
    markAsRead()
  }
}

const markAsRead = () => {
  emit('read', props.notification.id)
}

const deleteNotification = () => {
  emit('delete', props.notification.id)
}
</script>