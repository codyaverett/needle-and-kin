<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Search Header -->
    <div class="bg-gradient-to-r from-pink-50 to-purple-50 py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900 text-center mb-6">
          Search Our Craft Library
        </h1>
        
        <!-- Search Box -->
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="debouncedSearch"
            type="text"
            placeholder="Search for tutorials, patterns, techniques..."
            class="w-full px-6 py-4 pr-12 text-lg rounded-full border-2 border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
            autofocus
          >
          <button
            @click="performSearch"
            class="absolute right-2 top-1/2 -translate-y-1/2 bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <!-- Quick Filters -->
        <div class="mt-6 flex flex-wrap justify-center gap-2">
          <button
            v-for="suggestion in searchSuggestions"
            :key="suggestion"
            @click="searchQuery = suggestion; performSearch()"
            class="px-4 py-2 bg-white rounded-full text-sm text-gray-700 hover:bg-pink-100 hover:text-pink-700 transition-colors"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>

    <!-- Search Results -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Results Header -->
      <div v-if="hasSearched" class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              <span v-if="searchResults.length > 0">
                Found {{ searchResults.length }} results for "{{ lastSearchQuery }}"
              </span>
              <span v-else>
                No results found for "{{ lastSearchQuery }}"
              </span>
            </h2>
            <p v-if="searchResults.length > 0" class="text-gray-600 mt-1">
              Showing {{ searchType }} results
            </p>
          </div>

          <!-- Search Type Toggle -->
          <div class="flex items-center space-x-2 bg-white rounded-lg p-1">
            <button
              v-for="type in ['all', 'posts', 'tutorials', 'patterns', 'authors']"
              :key="type"
              @click="searchType = type; filterResults()"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                searchType === type
                  ? 'bg-pink-100 text-pink-700'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-pink-600 border-t-transparent"></div>
      </div>

      <!-- No Results State -->
      <div v-else-if="hasSearched && searchResults.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No results found</h3>
        <p class="mt-2 text-gray-600">
          Try adjusting your search terms or browse our categories
        </p>
        <div class="mt-6 flex justify-center space-x-4">
          <NuxtLink
            to="/blog"
            class="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Browse All Posts
          </NuxtLink>
          <button
            @click="clearSearch"
            class="bg-white text-gray-700 px-6 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            Clear Search
          </button>
        </div>
      </div>

      <!-- Results Grid -->
      <div v-else-if="searchResults.length > 0" class="space-y-8">
        <!-- Posts Results -->
        <div v-if="filteredResults.posts?.length > 0">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Blog Posts</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article
              v-for="post in filteredResults.posts"
              :key="post.id"
              class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <NuxtLink :to="`/blog/${post.slug}`">
                <img
                  :src="post.image"
                  :alt="post.title"
                  class="w-full h-48 object-cover rounded-t-lg"
                >
                <div class="p-4">
                  <h4 class="font-semibold text-gray-900 mb-2 hover:text-pink-600 transition-colors">
                    <span v-html="highlightMatch(post.title)"></span>
                  </h4>
                  <p class="text-gray-600 text-sm line-clamp-2">
                    <span v-html="highlightMatch(post.excerpt)"></span>
                  </p>
                  <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{{ post.author?.name }}</span>
                    <span>{{ formatDate(post.publishedAt) }}</span>
                  </div>
                </div>
              </NuxtLink>
            </article>
          </div>
        </div>

        <!-- Tutorials Results -->
        <div v-if="filteredResults.tutorials?.length > 0">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Tutorials</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="tutorial in filteredResults.tutorials"
              :key="tutorial.id"
              class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex items-start space-x-4"
            >
              <div class="flex-shrink-0">
                <SkillLevelBadge :level="tutorial.difficulty" />
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 mb-1">
                  <NuxtLink :to="`/blog/${tutorial.slug}`" class="hover:text-pink-600 transition-colors">
                    <span v-html="highlightMatch(tutorial.title)"></span>
                  </NuxtLink>
                </h4>
                <p class="text-gray-600 text-sm">
                  <span v-html="highlightMatch(tutorial.description)"></span>
                </p>
                <div class="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  <span>{{ tutorial.duration }} min</span>
                  <span>{{ tutorial.steps }} steps</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Patterns Results -->
        <div v-if="filteredResults.patterns?.length > 0">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Patterns</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="pattern in filteredResults.patterns"
              :key="pattern.id"
              class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <NuxtLink :to="`/patterns/${pattern.slug}`">
                <img
                  :src="pattern.thumbnail"
                  :alt="pattern.name"
                  class="w-full h-32 object-cover"
                >
                <div class="p-3">
                  <h4 class="font-medium text-gray-900 text-sm">
                    <span v-html="highlightMatch(pattern.name)"></span>
                  </h4>
                  <p class="text-xs text-gray-500 mt-1">{{ pattern.category }}</p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Authors Results -->
        <div v-if="filteredResults.authors?.length > 0">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Authors</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="author in filteredResults.authors"
              :key="author.id"
              class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
            >
              <NuxtLink :to="`/blog/author/${author.id}`" class="flex items-center space-x-4">
                <img
                  :src="author.avatar"
                  :alt="author.name"
                  class="w-16 h-16 rounded-full"
                >
                <div>
                  <h4 class="font-semibold text-gray-900 hover:text-pink-600 transition-colors">
                    <span v-html="highlightMatch(author.name)"></span>
                  </h4>
                  <p class="text-sm text-gray-600">
                    <span v-html="highlightMatch(author.bio)"></span>
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ author.postCount }} posts · {{ author.followers }} followers
                  </p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Popular Content (shown when no search) -->
      <div v-else class="space-y-8">
        <!-- Trending Searches -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Trending Searches</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="trend in trendingSearches"
              :key="trend.term"
              @click="searchQuery = trend.term; performSearch()"
              class="bg-white px-4 py-2 rounded-full text-sm hover:bg-pink-100 hover:text-pink-700 transition-colors"
            >
              <span class="font-medium">{{ trend.term }}</span>
              <span class="text-gray-500 ml-2">{{ trend.count }}</span>
            </button>
          </div>
        </div>

        <!-- Browse by Category -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NuxtLink
              v-for="category in categories"
              :key="category.name"
              :to="`/blog/category/${category.slug}`"
              class="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow"
            >
              <div class="text-3xl mb-2">{{ category.emoji }}</div>
              <h4 class="font-medium text-gray-900">{{ category.name }}</h4>
              <p class="text-sm text-gray-500">{{ category.count }} posts</p>
            </NuxtLink>
          </div>
        </div>

        <!-- Recent Searches -->
        <div v-if="recentSearches.length > 0">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Your Recent Searches</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="recent in recentSearches"
              :key="recent"
              @click="searchQuery = recent; performSearch()"
              class="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <svg class="inline-block w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ recent }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBlogStore } from '~/stores/blog'
import { useUIStore } from '~/stores/ui'
import { debounce } from 'lodash-es'

const blogStore = useBlogStore()
const uiStore = useUIStore()

// Search state
const searchQuery = ref('')
const lastSearchQuery = ref('')
const searchResults = ref([])
const filteredResults = ref({ posts: [], tutorials: [], patterns: [], authors: [] })
const searchType = ref('all')
const loading = ref(false)
const hasSearched = ref(false)
const recentSearches = ref([])

// Search suggestions
const searchSuggestions = [
  'Knitting basics',
  'Crochet patterns',
  'Embroidery tutorials',
  'Quilting techniques',
  'Sewing tips',
  'Cross stitch',
  'Macrame projects',
  'Weaving'
]

// Trending searches (mock data)
const trendingSearches = ref([
  { term: 'Christmas ornaments', count: 245 },
  { term: 'Beginner knitting', count: 189 },
  { term: 'Baby blanket', count: 156 },
  { term: 'Scarf patterns', count: 142 },
  { term: 'Amigurumi', count: 128 },
  { term: 'Granny squares', count: 115 }
])

// Categories (mock data)
const categories = ref([
  { name: 'Knitting', slug: 'knitting', emoji: '🧶', count: 142 },
  { name: 'Crochet', slug: 'crochet', emoji: '🪡', count: 98 },
  { name: 'Sewing', slug: 'sewing', emoji: '✂️', count: 76 },
  { name: 'Embroidery', slug: 'embroidery', emoji: '🪡', count: 54 },
  { name: 'Quilting', slug: 'quilting', emoji: '🛏️', count: 43 },
  { name: 'Cross Stitch', slug: 'cross-stitch', emoji: '✖️', count: 38 },
  { name: 'Macrame', slug: 'macrame', emoji: '🪢', count: 29 },
  { name: 'Weaving', slug: 'weaving', emoji: '🧵', count: 21 }
])

// Perform search
const performSearch = async () => {
  if (!searchQuery.value.trim()) return

  loading.value = true
  hasSearched.value = true
  lastSearchQuery.value = searchQuery.value

  try {
    // Add to recent searches
    addToRecentSearches(searchQuery.value)

    // Call blog store search
    await blogStore.searchPosts(searchQuery.value)
    
    // For demo, simulate different result types
    searchResults.value = blogStore.posts.map(post => ({
      ...post,
      type: 'post',
      relevance: Math.random()
    }))

    // Add some mock tutorials and patterns
    if (searchQuery.value.toLowerCase().includes('tutorial')) {
      searchResults.value.push(...generateMockTutorials())
    }
    if (searchQuery.value.toLowerCase().includes('pattern')) {
      searchResults.value.push(...generateMockPatterns())
    }

    // Filter results by type
    filterResults()

  } catch (error) {
    console.error('Search error:', error)
    uiStore.showError('Search failed. Please try again.')
  } finally {
    loading.value = false
  }
}

// Debounced search
const debouncedSearch = debounce(performSearch, 500)

// Filter results by type
const filterResults = () => {
  if (searchType.value === 'all') {
    filteredResults.value = {
      posts: searchResults.value.filter(r => r.type === 'post').slice(0, 6),
      tutorials: searchResults.value.filter(r => r.type === 'tutorial').slice(0, 4),
      patterns: searchResults.value.filter(r => r.type === 'pattern').slice(0, 8),
      authors: searchResults.value.filter(r => r.type === 'author').slice(0, 3)
    }
  } else {
    const typeKey = searchType.value === 'posts' ? 'post' : searchType.value.slice(0, -1)
    filteredResults.value = {
      [searchType.value]: searchResults.value.filter(r => r.type === typeKey)
    }
  }
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  lastSearchQuery.value = ''
  searchResults.value = []
  hasSearched.value = false
  searchType.value = 'all'
}

// Add to recent searches
const addToRecentSearches = (query) => {
  const filtered = recentSearches.value.filter(s => s !== query)
  recentSearches.value = [query, ...filtered].slice(0, 5)
  
  // Save to localStorage
  if (process.client) {
    localStorage.setItem('recent_searches', JSON.stringify(recentSearches.value))
  }
}

// Load recent searches
const loadRecentSearches = () => {
  if (process.client) {
    const saved = localStorage.getItem('recent_searches')
    if (saved) {
      recentSearches.value = JSON.parse(saved)
    }
  }
}

// Highlight search matches
const highlightMatch = (text) => {
  if (!text || !lastSearchQuery.value) return text
  
  const regex = new RegExp(`(${lastSearchQuery.value})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
}

// Mock data generators
const generateMockTutorials = () => {
  return [
    {
      id: 't1',
      type: 'tutorial',
      title: 'Basic Knitting Tutorial for Beginners',
      description: 'Learn the fundamentals of knitting with this step-by-step guide',
      difficulty: 'beginner',
      duration: 45,
      steps: 12,
      slug: 'basic-knitting-tutorial'
    },
    {
      id: 't2',
      type: 'tutorial',
      title: 'Advanced Cable Knitting Tutorial',
      description: 'Master cable knitting techniques with detailed instructions',
      difficulty: 'advanced',
      duration: 90,
      steps: 24,
      slug: 'advanced-cable-knitting'
    }
  ]
}

const generateMockPatterns = () => {
  return [
    {
      id: 'p1',
      type: 'pattern',
      name: 'Cozy Winter Scarf Pattern',
      category: 'Knitting',
      thumbnail: 'https://picsum.photos/200/150?random=1',
      slug: 'cozy-winter-scarf'
    },
    {
      id: 'p2',
      type: 'pattern',
      name: 'Granny Square Blanket Pattern',
      category: 'Crochet',
      thumbnail: 'https://picsum.photos/200/150?random=2',
      slug: 'granny-square-blanket'
    }
  ]
}

// Utilities
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

// Load recent searches on mount
onMounted(() => {
  loadRecentSearches()
})
</script>