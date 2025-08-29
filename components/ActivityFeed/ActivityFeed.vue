<template>
  <div class="space-y-4">
    <div v-if="showHeader" class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
        <div class="flex items-center space-x-2">
          <button
            @click="showFilters = !showFilters"
            :class="[
              'p-2 rounded-md transition-colors',
              showFilters || activeFilters.length > 0
                ? 'bg-pink-50 text-pink-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            ]"
            aria-label="Toggle filters"
          >
            <Icon name="mdi:filter-variant" class="h-5 w-5" />
            <span v-if="activeFilters.length > 0" class="absolute -top-1 -right-1 h-4 w-4 bg-pink-600 text-white text-xs rounded-full flex items-center justify-center">
              {{ activeFilters.length }}
            </span>
          </button>
          <button
            @click="refreshFeed"
            :disabled="loading"
            class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50"
            aria-label="Refresh feed"
          >
            <Icon name="mdi:refresh" :class="['h-5 w-5', loading && 'animate-spin']" />
          </button>
        </div>
      </div>

      <ActivityFilter
        v-if="showFilters"
        :filters="activeFilters"
        @update="updateFilters"
        @clear="clearFilters"
      />
    </div>

    <div v-if="loading && activities.length === 0" class="bg-white rounded-lg shadow-sm p-8">
      <div class="animate-pulse space-y-4">
        <div class="flex space-x-3">
          <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        <div class="flex space-x-3">
          <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
            <div class="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredActivities.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
      <Icon name="mdi:timeline-text-outline" class="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ emptyStateTitle }}
      </h3>
      <p class="text-gray-500 mb-6">
        {{ emptyStateMessage }}
      </p>
      <button
        v-if="activeFilters.length > 0"
        @click="clearFilters"
        class="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
      >
        Clear filters
      </button>
      <NuxtLink
        v-else
        to="/discover"
        class="inline-block px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
      >
        Discover people to follow
      </NuxtLink>
    </div>

    <TransitionGroup
      v-else
      name="activity-list"
      tag="div"
      class="space-y-4"
    >
      <ActivityCard
        v-for="activity in paginatedActivities"
        :key="activity.id"
        :activity="activity"
        :show-actions="showActions"
        @like="handleLike"
        @comment="handleComment"
        @share="handleShare"
        @click="handleActivityClick"
      />
    </TransitionGroup>

    <div v-if="hasMore && !loading" class="flex justify-center py-4">
      <button
        @click="loadMore"
        :disabled="loadingMore"
        class="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
      >
        {{ loadingMore ? 'Loading...' : 'Load more' }}
      </button>
    </div>

    <div v-if="showInfiniteScroll && hasMore" ref="scrollTrigger" class="h-20"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Activity } from '~/types/activity'

const props = withDefaults(defineProps<{
  activities: Activity[]
  title?: string
  showHeader?: boolean
  showActions?: boolean
  showInfiniteScroll?: boolean
  itemsPerPage?: number
  loading?: boolean
  hasMore?: boolean
  emptyStateTitle?: string
  emptyStateMessage?: string
}>(), {
  title: 'Activity Feed',
  showHeader: true,
  showActions: true,
  showInfiniteScroll: false,
  itemsPerPage: 20,
  loading: false,
  hasMore: false,
  emptyStateTitle: 'No activity yet',
  emptyStateMessage: 'When you follow people, their activity will show up here.'
})

const emit = defineEmits<{
  refresh: []
  loadMore: []
  like: [activity: Activity]
  comment: [activity: Activity]
  share: [activity: Activity]
  click: [activity: Activity]
  updateFilters: [filters: string[]]
}>()

const showFilters = ref(false)
const activeFilters = ref<string[]>([])
const currentPage = ref(1)
const loadingMore = ref(false)
const scrollTrigger = ref<HTMLElement | null>(null)

const filteredActivities = computed(() => {
  if (activeFilters.value.length === 0) {
    return props.activities
  }
  
  return props.activities.filter(activity => 
    activeFilters.value.includes(activity.type)
  )
})

const paginatedActivities = computed(() => {
  if (props.showInfiniteScroll) {
    return filteredActivities.value.slice(0, currentPage.value * props.itemsPerPage)
  }
  return filteredActivities.value
})

const updateFilters = (filters: string[]) => {
  activeFilters.value = filters
  emit('updateFilters', filters)
}

const clearFilters = () => {
  activeFilters.value = []
  emit('updateFilters', [])
}

const refreshFeed = () => {
  currentPage.value = 1
  emit('refresh')
}

const loadMore = async () => {
  loadingMore.value = true
  currentPage.value++
  emit('loadMore')
  setTimeout(() => {
    loadingMore.value = false
  }, 500)
}

const handleLike = (activity: Activity) => {
  emit('like', activity)
}

const handleComment = (activity: Activity) => {
  emit('comment', activity)
}

const handleShare = (activity: Activity) => {
  emit('share', activity)
}

const handleActivityClick = (activity: Activity) => {
  emit('click', activity)
}

let intersectionObserver: IntersectionObserver | null = null

onMounted(() => {
  if (props.showInfiniteScroll && scrollTrigger.value) {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && props.hasMore && !loadingMore.value) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )
    intersectionObserver.observe(scrollTrigger.value)
  }
})

onUnmounted(() => {
  if (intersectionObserver && scrollTrigger.value) {
    intersectionObserver.unobserve(scrollTrigger.value)
    intersectionObserver.disconnect()
  }
})

watch(() => props.activities, () => {
  if (currentPage.value === 1) {
    loadingMore.value = false
  }
})
</script>

<style scoped>
.activity-list-enter-active,
.activity-list-leave-active {
  transition: all 0.3s ease;
}

.activity-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.activity-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.activity-list-move {
  transition: transform 0.3s ease;
}
</style>