<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="p-6 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">Notification Settings</h3>
      <p class="text-sm text-gray-600 mt-1">Choose how you want to be notified</p>
    </div>

    <form @submit.prevent="saveSettings" class="p-6 space-y-6">
      <div>
        <h4 class="text-sm font-medium text-gray-900 mb-4">Email Notifications</h4>
        <div class="space-y-3">
          <label
            v-for="type in notificationTypes"
            :key="type.value"
            class="flex items-start"
          >
            <div class="flex items-center h-5">
              <input
                v-model="settings.email[type.value]"
                type="checkbox"
                class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-700">{{ type.label }}</div>
              <div class="text-xs text-gray-500">{{ type.description }}</div>
            </div>
          </label>
        </div>
      </div>

      <div>
        <h4 class="text-sm font-medium text-gray-900 mb-4">In-App Notifications</h4>
        <div class="space-y-3">
          <label
            v-for="type in notificationTypes"
            :key="type.value"
            class="flex items-start"
          >
            <div class="flex items-center h-5">
              <input
                v-model="settings.inApp[type.value]"
                type="checkbox"
                class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-700">{{ type.label }}</div>
            </div>
          </label>
        </div>
      </div>

      <div>
        <h4 class="text-sm font-medium text-gray-900 mb-4">Notification Frequency</h4>
        <div class="space-y-3">
          <label class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-700">Digest Mode</div>
              <div class="text-xs text-gray-500">Combine multiple notifications into a single email</div>
            </div>
            <input
              v-model="settings.digestMode"
              type="checkbox"
              class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
          </label>

          <div v-if="settings.digestMode" class="ml-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Digest Frequency
            </label>
            <select
              v-model="settings.digestFrequency"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="hourly">Every Hour</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <label class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-700">Quiet Hours</div>
              <div class="text-xs text-gray-500">Don't send notifications during these hours</div>
            </div>
            <input
              v-model="settings.quietHours"
              type="checkbox"
              class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
          </label>

          <div v-if="settings.quietHours" class="ml-6 flex items-center space-x-2">
            <div>
              <label class="block text-xs text-gray-600 mb-1">From</label>
              <input
                v-model="settings.quietStart"
                type="time"
                class="px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1">To</label>
              <input
                v-model="settings.quietEnd"
                type="time"
                class="px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button
              type="button"
              @click="resetToDefaults"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Reset to defaults
            </button>
            <div v-if="lastSaved" class="text-sm text-green-600">
              <Icon name="mdi:check-circle" class="inline-block mr-1" />
              Saved {{ formatRelativeTime(lastSaved) }}
            </div>
          </div>
          <button
            type="submit"
            :disabled="saving"
            class="px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : 'Save Settings' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface NotificationSettings {
  email: Record<string, boolean>
  inApp: Record<string, boolean>
  digestMode: boolean
  digestFrequency: 'hourly' | 'daily' | 'weekly'
  quietHours: boolean
  quietStart: string
  quietEnd: string
}

const emit = defineEmits<{
  saved: [settings: NotificationSettings]
}>()

const notificationTypes = [
  {
    value: 'comment_reply',
    label: 'Comment Replies',
    description: 'When someone replies to your comments'
  },
  {
    value: 'post_like',
    label: 'Post Likes',
    description: 'When someone likes your blog posts'
  },
  {
    value: 'new_follower',
    label: 'New Followers',
    description: 'When someone starts following you'
  },
  {
    value: 'mention',
    label: 'Mentions',
    description: 'When someone mentions you in a post or comment'
  },
  {
    value: 'achievement_unlocked',
    label: 'Achievements',
    description: 'When you unlock a new achievement'
  },
  {
    value: 'project_feedback',
    label: 'Project Feedback',
    description: 'When someone comments on your projects'
  },
  {
    value: 'group_invite',
    label: 'Group Invites',
    description: 'When you are invited to join a group'
  },
  {
    value: 'system_announcement',
    label: 'System Announcements',
    description: 'Important updates and announcements'
  }
]

const defaultSettings: NotificationSettings = {
  email: {
    comment_reply: true,
    post_like: false,
    new_follower: true,
    mention: true,
    achievement_unlocked: true,
    project_feedback: true,
    group_invite: true,
    system_announcement: true
  },
  inApp: {
    comment_reply: true,
    post_like: true,
    new_follower: true,
    mention: true,
    achievement_unlocked: true,
    project_feedback: true,
    group_invite: true,
    system_announcement: true
  },
  digestMode: false,
  digestFrequency: 'daily',
  quietHours: false,
  quietStart: '22:00',
  quietEnd: '08:00'
}

const settings = ref<NotificationSettings>({ ...defaultSettings })
const saving = ref(false)
const lastSaved = ref<Date | null>(null)

const formatRelativeTime = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  return `${Math.floor(seconds / 86400)} days ago`
}

const loadSettings = async () => {
  try {
    const { data } = await $fetch('/api/notifications/preferences', {
      credentials: 'include'
    })
    if (data) {
      settings.value = data
    }
  } catch (error) {
    console.error('Failed to load notification settings:', error)
  }
}

const saveSettings = async () => {
  saving.value = true
  try {
    await $fetch('/api/notifications/preferences', {
      method: 'PUT',
      body: settings.value,
      credentials: 'include'
    })
    lastSaved.value = new Date()
    emit('saved', settings.value)
  } catch (error) {
    console.error('Failed to save notification settings:', error)
  } finally {
    saving.value = false
  }
}

const resetToDefaults = () => {
  settings.value = { ...defaultSettings }
}

onMounted(() => {
  loadSettings()
})
</script>