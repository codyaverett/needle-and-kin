<template>
  <div class="relative" ref="searchContainer">
    <!-- Search Input -->
    <div class="relative">
      <input
        v-model="searchQuery"
        @focus="isFocused = true"
        @keydown.enter="handleSearch"
        @keydown.escape="clearSearch"
        @keydown.down.prevent="navigateResults(1)"
        @keydown.up.prevent="navigateResults(-1)"
        type="text"
        :placeholder="placeholder"
        class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      >
      
      <!-- Search Icon -->
      <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
        <svg
          v-if="!isLoading"
          class="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <svg
          v-else
          class="w-5 h-5 text-gray-400 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      
      <!-- Clear Button -->
      <button
        v-if="searchQuery"
        @click="clearSearch"
        type="button"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!-- Search Results Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="showResults && (searchResults.length > 0 || searchQuery.length >= minSearchLength)"
        class="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
      >
        <!-- Search Suggestions -->
        <div v-if="suggestions.length > 0 && !searchQuery" class="p-2 border-b border-gray-200">
          <p class="text-xs text-gray-500 uppercase tracking-wide px-3 py-1">Suggestions</p>
          <button
            v-for="suggestion in suggestions"
            :key="suggestion"
            @click="searchQuery = suggestion"
            class="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
          >
            {{ suggestion }}
          </button>
        </div>

        <!-- Categories Filter -->
        <div v-if="showCategories && categories.length > 0" class="p-2 border-b border-gray-200">
          <p class="text-xs text-gray-500 uppercase tracking-wide px-3 py-1">Filter by Category</p>
          <div class="flex flex-wrap gap-2 px-3">
            <button
              v-for="category in categories"
              :key="category"
              @click="toggleCategory(category)"
              :class="[
                'px-3 py-1 text-xs rounded-full transition-colors',
                selectedCategories.includes(category)
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <!-- Results -->
        <div v-if="searchResults.length > 0" class="py-2">
          <p class="text-xs text-gray-500 uppercase tracking-wide px-5 py-1">
            Results ({{ totalResults }})
          </p>
          <a
            v-for="(result, index) in searchResults"
            :key="result.id"
            :href="`/blog/${result.slug}`"
            @click="handleResultClick(result)"
            @mouseenter="selectedIndex = index"
            :class="[
              'block px-5 py-3 hover:bg-gray-50 transition-colors',
              selectedIndex === index ? 'bg-gray-50' : ''
            ]"
          >
            <div class="flex items-start space-x-3">
              <img
                v-if="result.image"
                :src="result.image"
                :alt="result.title"
                class="w-12 h-12 object-cover rounded"
              >
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 truncate">
                  <span v-html="highlightMatch(result.title)"></span>
                </h4>
                <p class="text-xs text-gray-600 line-clamp-2 mt-1">
                  <span v-html="highlightMatch(result.excerpt)"></span>
                </p>
                <div class="flex items-center space-x-2 mt-1">
                  <span class="text-xs text-purple-600">{{ result.category }}</span>
                  <span class="text-xs text-gray-400">•</span>
                  <span class="text-xs text-gray-400">{{ formatDate(result.publishedAt) }}</span>
                </div>
              </div>
            </div>
          </a>
        </div>

        <!-- No Results -->
        <div v-else-if="searchQuery.length >= minSearchLength && !isLoading" class="p-8 text-center">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="mt-2 text-sm text-gray-500">No results found for "{{ searchQuery }}"</p>
          <p class="text-xs text-gray-400 mt-1">Try different keywords or check the spelling</p>
        </div>

        <!-- View All Results -->
        <div v-if="searchResults.length > 0 && hasMore" class="border-t border-gray-200 p-3">
          <button
            @click="viewAllResults"
            class="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            View all {{ totalResults }} results
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search posts, tutorials, patterns...'
  },
  minSearchLength: {
    type: Number,
    default: 2
  },
  debounceMs: {
    type: Number,
    default: 300
  },
  maxResults: {
    type: Number,
    default: 5
  },
  showCategories: {
    type: Boolean,
    default: true
  },
  apiEndpoint: {
    type: String,
    default: '/api/posts/search'
  }
})

const emit = defineEmits(['search', 'select', 'clear'])

const router = useRouter()
const searchContainer = ref(null)
const searchQuery = ref('')
const searchResults = ref([])
const totalResults = ref(0)
const isLoading = ref(false)
const isFocused = ref(false)
const selectedIndex = ref(-1)
const selectedCategories = ref([])
const hasMore = ref(false)

const suggestions = ref([
  'knitting patterns',
  'beginner crochet',
  'embroidery tutorials',
  'quilting tips'
])

const categories = ref([
  'knitting',
  'crochet',
  'embroidery',
  'sewing',
  'quilting'
])

const showResults = computed(() => {
  return isFocused.value && (searchQuery.value.length >= props.minSearchLength || suggestions.value.length > 0)
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const highlightMatch = (text) => {
  if (!searchQuery.value || !text) return text
  
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
}

const performSearch = async () => {
  if (searchQuery.value.length < props.minSearchLength) {
    searchResults.value = []
    return
  }

  isLoading.value = true

  try {
    const params = {
      q: searchQuery.value,
      limit: props.maxResults
    }

    if (selectedCategories.value.length > 0) {
      params.categories = selectedCategories.value.join(',')
    }

    const response = await $fetch(props.apiEndpoint, { params })

    if (response.success) {
      searchResults.value = response.results || []
      totalResults.value = response.total || 0
      hasMore.value = response.hasMore || false
    }
  } catch (error) {
    console.error('Search error:', error)
    // Use mock data as fallback
    searchResults.value = [
      {
        id: '1',
        title: 'Cable Knitting Patterns for Beginners',
        slug: 'cable-knitting-patterns',
        excerpt: 'Learn the basics of cable knitting with these simple patterns.',
        category: 'knitting',
        image: '/images/blog/cable-knitting.jpg',
        publishedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Essential Crochet Tools',
        slug: 'essential-crochet-tools',
        excerpt: 'Discover the must-have tools for every crochet enthusiast.',
        category: 'crochet',
        image: '/images/blog/crochet-tools.jpg',
        publishedAt: new Date().toISOString()
      }
    ].filter(post => 
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    totalResults.value = searchResults.value.length
    hasMore.value = false
  } finally {
    isLoading.value = false
  }
}

// Debounced search function
const debouncedSearch = useDebounceFn(performSearch, props.debounceMs)

// Watch for search query changes
watch(searchQuery, () => {
  selectedIndex.value = -1
  if (searchQuery.value.length >= props.minSearchLength) {
    debouncedSearch()
  } else {
    searchResults.value = []
  }
})

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  selectedCategories.value = []
  emit('clear')
}

const handleSearch = () => {
  if (selectedIndex.value >= 0 && selectedIndex.value < searchResults.value.length) {
    handleResultClick(searchResults.value[selectedIndex.value])
  } else if (searchQuery.value) {
    viewAllResults()
  }
}

const handleResultClick = (result) => {
  emit('select', result)
  clearSearch()
  router.push(`/blog/${result.slug}`)
}

const viewAllResults = () => {
  router.push({
    path: '/blog',
    query: {
      search: searchQuery.value,
      categories: selectedCategories.value.join(',')
    }
  })
  clearSearch()
}

const toggleCategory = (category) => {
  const index = selectedCategories.value.indexOf(category)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(category)
  }
  debouncedSearch()
}

const navigateResults = (direction) => {
  const maxIndex = searchResults.value.length - 1
  
  if (direction === 1) {
    selectedIndex.value = selectedIndex.value < maxIndex ? selectedIndex.value + 1 : 0
  } else {
    selectedIndex.value = selectedIndex.value > 0 ? selectedIndex.value - 1 : maxIndex
  }
}

// Click outside to close
const handleClickOutside = (e) => {
  if (searchContainer.value && !searchContainer.value.contains(e.target)) {
    isFocused.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>