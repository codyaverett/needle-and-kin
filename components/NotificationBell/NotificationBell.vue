<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-full"
      :aria-label="`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`"
    >
      <Icon name="mdi:bell-outline" class="h-6 w-6" />
      
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        v-click-outside="closeDropdown"
        class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
      >
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
            <button
              v-if="unreadCount > 0"
              @click="markAllAsRead"
              class="text-sm text-pink-600 hover:text-pink-700"
            >
              Mark all as read
            </button>
          </div>
        </div>

        <div class="max-h-96 overflow-y-auto">
          <div v-if="notifications.length === 0" class="p-8 text-center">
            <Icon name="mdi:bell-off-outline" class="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">No notifications yet</p>
            <p class="text-sm text-gray-400 mt-1">We'll notify you when something happens</p>
          </div>

          <NotificationCard
            v-for="notification in notifications"
            :key="notification.id"
            :notification="notification"
            @read="markAsRead"
            @delete="deleteNotification"
          />
        </div>

        <div class="p-3 border-t border-gray-200 bg-gray-50">
          <NuxtLink
            to="/notifications"
            class="block text-center text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            View all notifications
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { vClickOutside } from '@vueuse/components'
import { useNotificationsStore } from '~/stores/notifications'

const notificationsStore = useNotificationsStore()

const isOpen = ref(false)

const notifications = computed(() => notificationsStore.recentNotifications)
const unreadCount = computed(() => notificationsStore.unreadCount)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    notificationsStore.fetchNotifications()
  }
}

const closeDropdown = () => {
  isOpen.value = false
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

const pollInterval = ref<NodeJS.Timeout | null>(null)

onMounted(() => {
  notificationsStore.fetchUnreadCount()
  
  pollInterval.value = setInterval(() => {
    notificationsStore.fetchUnreadCount()
  }, 30000)
})

onUnmounted(() => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
})
</script>