<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Newsletter Preferences</h3>
      <p class="text-sm text-gray-600">Manage your email subscription preferences</p>
    </div>

    <form @submit.prevent="savePreferences" class="space-y-6">
      <div>
        <label class="flex items-center justify-between">
          <div>
            <span class="text-sm font-medium text-gray-900">Newsletter Subscription</span>
            <p class="text-sm text-gray-500">Receive updates about new posts and crafting tips</p>
          </div>
          <input
            v-model="preferences.subscribed"
            type="checkbox"
            class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
          />
        </label>
      </div>

      <div v-if="preferences.subscribed" class="space-y-4 pl-4 border-l-2 border-gray-200">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email Frequency
          </label>
          <select
            v-model="preferences.frequency"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="daily">Daily Digest</option>
            <option value="weekly">Weekly Summary</option>
            <option value="monthly">Monthly Roundup</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Categories of Interest
          </label>
          <div class="space-y-2">
            <label
              v-for="category in availableCategories"
              :key="category.value"
              class="flex items-center"
            >
              <input
                v-model="preferences.categories"
                :value="category.value"
                type="checkbox"
                class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded mr-2"
              />
              <span class="text-sm text-gray-700">{{ category.label }}</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email Types
          </label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                v-model="preferences.emailTypes.newPosts"
                type="checkbox"
                class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded mr-2"
              />
              <span class="text-sm text-gray-700">New Blog Posts</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="preferences.emailTypes.weeklyDigest"
                type="checkbox"
                class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded mr-2"
              />
              <span class="text-sm text-gray-700">Weekly Digest</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="preferences.emailTypes.projectIdeas"
                type="checkbox"
                class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded mr-2"
              />
              <span class="text-sm text-gray-700">Project Ideas & Tutorials</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="preferences.emailTypes.communityUpdates"
                type="checkbox"
                class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded mr-2"
              />
              <span class="text-sm text-gray-700">Community Updates</span>
            </label>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-gray-200">
        <div v-if="lastSaved" class="text-sm text-green-600">
          <Icon name="mdi:check-circle" class="inline-block mr-1" />
          Saved {{ formatRelativeTime(lastSaved) }}
        </div>
        <div v-else></div>
        <button
          type="submit"
          :disabled="saving"
          class="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
        >
          {{ saving ? 'Saving...' : 'Save Preferences' }}
        </button>
      </div>
    </form>

    <div v-if="preferences.subscribed" class="mt-6 pt-6 border-t border-gray-200">
      <p class="text-xs text-gray-500">
        You can unsubscribe at any time by clicking the link in any newsletter email.
        Your email: <span class="font-medium">{{ userEmail }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface NewsletterPreferences {
  subscribed: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
  categories: string[]
  emailTypes: {
    newPosts: boolean
    weeklyDigest: boolean
    projectIdeas: boolean
    communityUpdates: boolean
  }
}

const props = withDefaults(defineProps<{
  userEmail?: string
}>(), {
  userEmail: ''
})

const emit = defineEmits<{
  saved: [preferences: NewsletterPreferences]
}>()

const preferences = ref<NewsletterPreferences>({
  subscribed: false,
  frequency: 'weekly',
  categories: [],
  emailTypes: {
    newPosts: true,
    weeklyDigest: true,
    projectIdeas: false,
    communityUpdates: false
  }
})

const availableCategories = [
  { value: 'knitting', label: 'Knitting' },
  { value: 'crochet', label: 'Crochet' },
  { value: 'sewing', label: 'Sewing' },
  { value: 'embroidery', label: 'Embroidery' },
  { value: 'quilting', label: 'Quilting' },
  { value: 'weaving', label: 'Weaving' },
  { value: 'spinning', label: 'Spinning' },
  { value: 'dyeing', label: 'Dyeing' }
]

const saving = ref(false)
const lastSaved = ref<Date | null>(null)

const formatRelativeTime = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  return `${Math.floor(seconds / 86400)} days ago`
}

const loadPreferences = async () => {
  try {
    const { data } = await $fetch('/api/newsletter/preferences', {
      credentials: 'include'
    })
    if (data) {
      preferences.value = data
    }
  } catch (error) {
    console.error('Failed to load newsletter preferences:', error)
  }
}

const savePreferences = async () => {
  saving.value = true
  try {
    await $fetch('/api/newsletter/preferences', {
      method: 'PUT',
      body: preferences.value,
      credentials: 'include'
    })
    lastSaved.value = new Date()
    emit('saved', preferences.value)
  } catch (error) {
    console.error('Failed to save newsletter preferences:', error)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadPreferences()
})
</script>