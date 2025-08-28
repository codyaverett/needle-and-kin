<template>
  <div class="bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
        <div class="flex items-center space-x-2">
          <button
            @click="showFilters = !showFilters"
            class="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
            :aria-label="showFilters ? 'Hide filters' : 'Show filters'"
          >
            <Icon name="mdi:filter-variant" class="h-5 w-5" />
          </button>
          <button
            @click="$emit('settings')"
            class="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
            aria-label="Notification settings"
          >
            <Icon name="mdi:cog-outline" class="h-5 w-5" />
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
        <div v-if="showFilters" class="overflow-hidden">
          <div class="flex flex-wrap gap-2 pt-3">
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
          </div>
        </div>
      </Transition>
    </div>

    <div class="overflow-y-auto" :style="{ maxHeight: maxHeight }">
      <div v-if="loading" class="p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
        <p class="text-sm text-gray-500 text-center mt-3">Loading notifications...</p>
      </div>

      <div v-else-if="filteredNotifications.length === 0" class="p-8 text-center">
        <Icon name="mdi:bell-sleep-outline" class="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500">
          {{ activeFilters.length > 0 ? 'No notifications match your filters' : 'No notifications yet' }}
        </p>
        <p class="text-sm text-gray-400 mt-1">
          {{ activeFilters.length > 0 ? 'Try adjusting your filters' : "We'll notify you when something happens" }}
        </p>
      </div>

      <TransitionGroup
        v-else
        name="notification-list"
        tag="div"
        class="divide-y divide-gray-100"
      >
        <NotificationCard
          v-for="notification in filteredNotifications"
          :key="notification.id"
          :notification="notification"
          @click="$emit('select', notification)"
          @read="$emit('read', notification.id)"
          @delete="$emit('delete', notification.id)"
        />
      </TransitionGroup>
    </div>

    <div v-if="hasMore" class="p-3 border-t border-gray-200">
      <button
        @click="$emit('loadMore')"
        :disabled="loadingMore"
        class="w-full px-4 py-2 text-sm font-medium text-pink-600 hover:text-pink-700 disabled:opacity-50"
      >
        {{ loadingMore ? 'Loading...' : 'Load more notifications' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
  metadata?: any
}

const props = withDefaults(defineProps<{
  notifications: Notification[]
  loading?: boolean
  loadingMore?: boolean
  hasMore?: boolean
  maxHeight?: string
}>(), {
  loading: false,
  loadingMore: false,
  hasMore: false,
  maxHeight: '400px'
})

const emit = defineEmits<{
  select: [notification: Notification]
  read: [id: string]
  delete: [id: string]
  loadMore: []
  settings: []
}>()

const showFilters = ref(false)
const activeFilters = ref<string[]>([])

const notificationTypes = [
  { value: 'comment_reply', label: 'Comments' },
  { value: 'post_like', label: 'Likes' },
  { value: 'new_follower', label: 'Followers' },
  { value: 'mention', label: 'Mentions' },
  { value: 'achievement_unlocked', label: 'Achievements' },
  { value: 'system_announcement', label: 'System' }
]

const filteredNotifications = computed(() => {
  if (activeFilters.value.length === 0) {
    return props.notifications
  }
  return props.notifications.filter(n => activeFilters.value.includes(n.type))
})

const toggleFilter = (type: string) => {
  const index = activeFilters.value.indexOf(type)
  if (index > -1) {
    activeFilters.value.splice(index, 1)
  } else {
    activeFilters.value.push(type)
  }
}
</script>

<style scoped>
.notification-list-enter-active,
.notification-list-leave-active {
  transition: all 0.3s ease;
}

.notification-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.notification-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.notification-list-move {
  transition: transform 0.3s ease;
}
</style>