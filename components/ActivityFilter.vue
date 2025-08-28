<template>
  <div class="space-y-3">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Activity Types</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="type in activityTypes"
          :key="type.value"
          @click="toggleFilter(type.value)"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
            filters.includes(type.value)
              ? 'bg-pink-100 text-pink-700 border border-pink-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          <Icon :name="type.icon" class="inline-block mr-1 h-3.5 w-3.5" />
          {{ type.label }}
        </button>
      </div>
    </div>

    <div v-if="showDateFilter">
      <label class="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
      <div class="flex items-center space-x-2">
        <select
          v-model="dateRange"
          @change="updateDateFilter"
          class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="all">All time</option>
          <option value="today">Today</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
          <option value="custom">Custom range</option>
        </select>
      </div>
      
      <div v-if="dateRange === 'custom'" class="flex items-center space-x-2 mt-2">
        <input
          v-model="customStartDate"
          type="date"
          class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
        />
        <span class="text-sm text-gray-500">to</span>
        <input
          v-model="customEndDate"
          type="date"
          class="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
        />
      </div>
    </div>

    <div v-if="showUserFilter">
      <label class="block text-sm font-medium text-gray-700 mb-2">Show Activity From</label>
      <div class="space-y-2">
        <label class="flex items-center">
          <input
            v-model="userFilter"
            type="radio"
            value="all"
            class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
          />
          <span class="ml-2 text-sm text-gray-700">Everyone</span>
        </label>
        <label class="flex items-center">
          <input
            v-model="userFilter"
            type="radio"
            value="following"
            class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
          />
          <span class="ml-2 text-sm text-gray-700">People I follow</span>
        </label>
        <label class="flex items-center">
          <input
            v-model="userFilter"
            type="radio"
            value="mutual"
            class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
          />
          <span class="ml-2 text-sm text-gray-700">Mutual followers</span>
        </label>
      </div>
    </div>

    <div v-if="filters.length > 0 || dateRange !== 'all' || userFilter !== 'all'" class="pt-3 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-500">
          {{ filters.length }} filter{{ filters.length !== 1 ? 's' : '' }} active
        </span>
        <button
          @click="clearAllFilters"
          class="text-sm text-pink-600 hover:text-pink-700 font-medium"
        >
          Clear all
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface ActivityTypeOption {
  value: string
  label: string
  icon: string
}

const props = withDefaults(defineProps<{
  filters: string[]
  showDateFilter?: boolean
  showUserFilter?: boolean
}>(), {
  filters: () => [],
  showDateFilter: true,
  showUserFilter: true
})

const emit = defineEmits<{
  update: [filters: string[]]
  clear: []
  updateDate: [range: { start?: string, end?: string }]
  updateUserFilter: [filter: string]
}>()

const activityTypes: ActivityTypeOption[] = [
  { value: 'posted', label: 'Posts', icon: 'mdi:pencil' },
  { value: 'liked', label: 'Likes', icon: 'mdi:heart' },
  { value: 'commented', label: 'Comments', icon: 'mdi:comment' },
  { value: 'followed', label: 'Follows', icon: 'mdi:account-plus' },
  { value: 'created_project', label: 'Projects', icon: 'mdi:folder-plus' },
  { value: 'completed_tutorial', label: 'Tutorials', icon: 'mdi:school' },
  { value: 'joined_group', label: 'Groups', icon: 'mdi:account-group' },
  { value: 'earned_achievement', label: 'Achievements', icon: 'mdi:trophy' }
]

const dateRange = ref('all')
const customStartDate = ref('')
const customEndDate = ref('')
const userFilter = ref('all')

const toggleFilter = (type: string) => {
  const newFilters = [...props.filters]
  const index = newFilters.indexOf(type)
  
  if (index > -1) {
    newFilters.splice(index, 1)
  } else {
    newFilters.push(type)
  }
  
  emit('update', newFilters)
}

const updateDateFilter = () => {
  if (dateRange.value === 'all') {
    emit('updateDate', {})
    return
  }
  
  const now = new Date()
  let start: Date | undefined
  let end = now
  
  switch (dateRange.value) {
    case 'today':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'week':
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case 'custom':
      if (customStartDate.value) {
        start = new Date(customStartDate.value)
      }
      if (customEndDate.value) {
        end = new Date(customEndDate.value)
      }
      break
  }
  
  emit('updateDate', {
    start: start?.toISOString(),
    end: end.toISOString()
  })
}

const clearAllFilters = () => {
  dateRange.value = 'all'
  customStartDate.value = ''
  customEndDate.value = ''
  userFilter.value = 'all'
  emit('clear')
}

watch(userFilter, (value) => {
  emit('updateUserFilter', value)
})

watch([customStartDate, customEndDate], () => {
  if (dateRange.value === 'custom') {
    updateDateFilter()
  }
})
</script>