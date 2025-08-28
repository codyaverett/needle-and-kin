<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
      <button
        @click="showSettings = !showSettings"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
      >
        <Icon name="mdi:cog" class="mr-2" />
        Settings
      </button>
    </div>

    <div v-if="showSettings" class="mb-6">
      <NotificationSettings @saved="handleSettingsSaved" />
    </div>

    <div class="bg-white rounded-lg shadow">
      <div class="p-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">
            {{ notificationsStore.unreadCount }} unread
          </span>
          <button
            v-if="notificationsStore.unreadCount > 0"
            @click="markAllAsRead"
            class="text-sm font-medium text-pink-600 hover:text-pink-700"
          >
            Mark all as read
          </button>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="showFilters = !showFilters"
            :class="[
              'p-2 rounded-md',
              showFilters 
                ? 'bg-pink-50 text-pink-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            ]"
            aria-label="Toggle filters"
          >
            <Icon name="mdi:filter-variant" class="h-5 w-5" />
          </button>
          <button
            @click="refreshNotifications"
            class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
            aria-label="Refresh notifications"
          >
            <Icon name="mdi:refresh" class="h-5 w-5" />
          </button>
        </div>
      </div>

      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-40"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 max-h-40"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-if="showFilters" class="p-4 border-b border-gray-200 overflow-hidden">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="type in notificationTypes"
              :key="type.value"
              @click="toggleFilter(type.value)"
              :class="[
                'px-3 py-1 text-xs font-medium rounded-full transition-colors',
                activeFilters.includes(type.value)
                  ? 'bg-pink-100 text-pink-700 border border-pink-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ type.label }}
            </button>
            <button
              v-if="activeFilters.length > 0"
              @click="clearFilters"
              class="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800"
            >
              Clear all
            </button>
          </div>
        </div>
      </Transition>

      <div v-if="notificationsStore.loading && !notificationsStore.notifications.length" class="p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
        <p class="text-sm text-gray-500 text-center mt-3">Loading notifications...</p>
      </div>

      <div v-else-if="filteredNotifications.length === 0" class="p-16 text-center">
        <Icon name="mdi:bell-off-outline" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ activeFilters.length > 0 ? 'No matching notifications' : 'No notifications' }}
        </h3>
        <p class="text-gray-500">
          {{ activeFilters.length > 0 
            ? 'Try adjusting your filters to see more notifications' 
            : "You're all caught up! Check back later for new updates." 
          }}
        </p>
      </div>

      <div v-else class="divide-y divide-gray-100">
        <TransitionGroup
          name="notification-list"
          tag="div"
        >
          <NotificationCard
            v-for="notification in filteredNotifications"
            :key="notification.id"
            :notification="notification"
            @click="handleNotificationClick"
            @read="markAsRead"
            @delete="deleteNotification"
          />
        </TransitionGroup>
      </div>

      <div 
        v-if="notificationsStore.hasMore && filteredNotifications.length > 0" 
        class="p-4 border-t border-gray-200"
      >
        <button
          @click="loadMore"
          :disabled="notificationsStore.loading"
          class="w-full px-4 py-2 bg-gray-50 text-gray-700 font-medium rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          {{ notificationsStore.loading ? 'Loading...' : 'Load more notifications' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotificationsStore } from '~/stores/notifications'
import type { Notification } from '~/types/notification'

definePageMeta({
  middleware: 'auth'
})

const notificationsStore = useNotificationsStore()

const showSettings = ref(false)
const showFilters = ref(false)
const activeFilters = ref<string[]>([])

const notificationTypes = [
  { value: 'comment_reply', label: 'Comments' },
  { value: 'post_like', label: 'Likes' },
  { value: 'new_follower', label: 'Followers' },
  { value: 'mention', label: 'Mentions' },
  { value: 'achievement_unlocked', label: 'Achievements' },
  { value: 'project_feedback', label: 'Projects' },
  { value: 'group_invite', label: 'Groups' },
  { value: 'system_announcement', label: 'System' }
]

const filteredNotifications = computed(() => {
  if (activeFilters.value.length === 0) {
    return notificationsStore.sortedNotifications
  }
  return notificationsStore.sortedNotifications.filter(n => 
    activeFilters.value.includes(n.type)
  )
})

const toggleFilter = (type: string) => {
  const index = activeFilters.value.indexOf(type)
  if (index > -1) {
    activeFilters.value.splice(index, 1)
  } else {
    activeFilters.value.push(type)
  }
}

const clearFilters = () => {
  activeFilters.value = []
}

const refreshNotifications = async () => {
  await notificationsStore.fetchNotifications(true)
}

const markAsRead = async (notificationId: string) => {
  await notificationsStore.markAsRead(notificationId)
}

const markAllAsRead = async () => {
  await notificationsStore.markAllAsRead()
}

const deleteNotification = async (notificationId: string) => {
  await notificationsStore.deleteNotification(notificationId)
}

const loadMore = async () => {
  await notificationsStore.loadMore()
}

const handleNotificationClick = (notification: Notification) => {
  if (notification.metadata?.actionUrl) {
    navigateTo(notification.metadata.actionUrl)
  }
}

const handleSettingsSaved = () => {
  showSettings.value = false
}

onMounted(() => {
  notificationsStore.fetchNotifications(true)
  notificationsStore.fetchPreferences()
})
</script>

<style scoped>
.notification-list-enter-active,
.notification-list-leave-active {
  transition: all 0.3s ease;
}

.notification-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.notification-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.notification-list-move {
  transition: transform 0.3s ease;
}
</style>