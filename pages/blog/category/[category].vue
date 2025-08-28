<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Category Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 capitalize">
              {{ category }} Projects
            </h1>
            <p class="mt-2 text-gray-600">
              Discover {{ filteredPosts.length }} amazing {{ category.toLowerCase() }} tutorials and patterns
            </p>
          </div>
          
          <!-- View Mode Toggle -->
          <div class="flex items-center space-x-4">
            <button
              @click="uiStore.setViewMode('grid')"
              :class="[
                'p-2 rounded-lg transition-colors',
                uiStore.viewMode === 'grid' 
                  ? 'bg-pink-100 text-pink-600' 
                  : 'text-gray-400 hover:text-gray-600'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              @click="uiStore.setViewMode('list')"
              :class="[
                'p-2 rounded-lg transition-colors',
                uiStore.viewMode === 'list' 
                  ? 'bg-pink-100 text-pink-600' 
                  : 'text-gray-400 hover:text-gray-600'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Category Stats -->
        <div class="mt-6 grid grid-cols-4 gap-4">
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <div class="text-2xl font-semibold text-gray-900">{{ totalPosts }}</div>
            <div class="text-sm text-gray-600">Total Posts</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <div class="text-2xl font-semibold text-gray-900">{{ uniqueAuthors }}</div>
            <div class="text-sm text-gray-600">Contributors</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <div class="text-2xl font-semibold text-gray-900">{{ averageDifficulty }}</div>
            <div class="text-sm text-gray-600">Avg. Difficulty</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <div class="text-2xl font-semibold text-gray-900">{{ totalViews }}</div>
            <div class="text-sm text-gray-600">Total Views</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white shadow-sm border-b sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Sort Dropdown -->
            <select 
              v-model="sortBy"
              class="rounded-lg border-gray-300 text-sm focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="latest">Latest First</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
              <option value="difficulty-asc">Easiest First</option>
              <option value="difficulty-desc">Hardest First</option>
            </select>

            <!-- Skill Level Filter -->
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">Skill Level:</span>
              <button
                v-for="level in ['All', 'Beginner', 'Intermediate', 'Advanced']"
                :key="level"
                @click="skillFilter = level"
                :class="[
                  'px-3 py-1 rounded-full text-sm transition-colors',
                  skillFilter === level
                    ? 'bg-pink-100 text-pink-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                {{ level }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Posts Grid/List -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Grid View -->
      <div v-if="uiStore.viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article 
          v-for="post in sortedPosts" 
          :key="post.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
        >
          <NuxtLink :to="`/blog/${post.slug}`" class="block">
            <div class="aspect-w-16 aspect-h-9 relative overflow-hidden">
              <img 
                :src="post.image" 
                :alt="post.title"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              >
              <div class="absolute top-3 left-3">
                <SkillLevelBadge :level="post.difficulty" />
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                {{ post.title }}
              </h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                {{ post.excerpt }}
              </p>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <img 
                    :src="post.author.avatar" 
                    :alt="post.author.name"
                    class="w-6 h-6 rounded-full"
                  >
                  <span class="text-sm text-gray-600">{{ post.author.name }}</span>
                </div>
                <span class="text-sm text-gray-500">{{ formatDate(post.publishedAt) }}</span>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>

      <!-- List View -->
      <div v-else class="space-y-4">
        <article 
          v-for="post in sortedPosts" 
          :key="post.id"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <NuxtLink :to="`/blog/${post.slug}`" class="flex">
            <img 
              :src="post.image" 
              :alt="post.title"
              class="w-48 h-32 object-cover flex-shrink-0"
            >
            <div class="p-6 flex-1">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-xl font-semibold text-gray-900 hover:text-pink-600 transition-colors">
                  {{ post.title }}
                </h3>
                <SkillLevelBadge :level="post.difficulty" size="sm" />
              </div>
              <p class="text-gray-600 mb-4">
                {{ post.excerpt }}
              </p>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-2">
                    <img 
                      :src="post.author.avatar" 
                      :alt="post.author.name"
                      class="w-6 h-6 rounded-full"
                    >
                    <span class="text-sm text-gray-600">{{ post.author.name }}</span>
                  </div>
                  <span class="text-sm text-gray-500">{{ formatDate(post.publishedAt) }}</span>
                  <span class="text-sm text-gray-500">{{ post.readTime }} min read</span>
                </div>
                <div class="flex space-x-1">
                  <span 
                    v-for="tag in post.tags.slice(0, 3)" 
                    :key="tag"
                    class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-12 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            @click="blogStore.setPage(blogStore.currentPage - 1)"
            :disabled="blogStore.currentPage === 1"
            class="px-3 py-2 rounded-lg bg-white border text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="blogStore.setPage(page)"
            :class="[
              'px-3 py-2 rounded-lg border transition-colors',
              blogStore.currentPage === page
                ? 'bg-pink-600 text-white border-pink-600'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
          
          <button
            @click="blogStore.setPage(blogStore.currentPage + 1)"
            :disabled="blogStore.currentPage === totalPages"
            class="px-3 py-2 rounded-lg bg-white border text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      </div>
    </div>

    <!-- Newsletter CTA -->
    <div class="bg-gradient-to-r from-pink-50 to-purple-50 py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          Never Miss a {{ category }} Tutorial
        </h2>
        <p class="text-gray-600 mb-6">
          Get the latest {{ category.toLowerCase() }} projects and patterns delivered to your inbox
        </p>
        <form @submit.prevent="subscribeNewsletter" class="max-w-md mx-auto flex">
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="flex-1 px-4 py-2 rounded-l-lg border-gray-300 focus:ring-pink-500 focus:border-pink-500"
            required
          >
          <button
            type="submit"
            class="bg-pink-600 text-white px-6 py-2 rounded-r-lg hover:bg-pink-700 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '~/stores/blog'
import { useUIStore } from '~/stores/ui'
// import { useUserStore } from '~/stores/user'

const route = useRoute()
const blogStore = useBlogStore()
const uiStore = useUIStore()
// const userStore = useUserStore()  // TODO: Use when implementing user features

const category = computed(() => route.params.category)
const sortBy = ref('latest')
const skillFilter = ref('All')
const email = ref('')

// Fetch posts for this category
const { data: posts, pending: _pending } = await useFetch('/api/posts', {
  query: {
    category: category.value
  }
})

// Set posts in store
if (posts.value) {
  blogStore.posts = posts.value.data || []
}

// Filter posts by category and skill level
const filteredPosts = computed(() => {
  let filtered = blogStore.posts.filter(post => 
    post.category?.toLowerCase() === category.value?.toLowerCase()
  )
  
  if (skillFilter.value !== 'All') {
    filtered = filtered.filter(post => 
      post.difficulty === skillFilter.value.toLowerCase()
    )
  }
  
  return filtered
})

// Sort posts
const sortedPosts = computed(() => {
  const posts = [...filteredPosts.value]
  
  switch (sortBy.value) {
    case 'popular':
      return posts.sort((a, b) => (b.views || 0) - (a.views || 0))
    case 'trending':
      return posts.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    case 'difficulty-asc': {
      const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 }
      return posts.sort((a, b) => 
        (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0)
      )
    }
    case 'difficulty-desc': {
      const difficultyOrderDesc = { beginner: 1, intermediate: 2, advanced: 3 }
      return posts.sort((a, b) => 
        (difficultyOrderDesc[b.difficulty] || 0) - (difficultyOrderDesc[a.difficulty] || 0)
      )
    }
    default: // latest
      return posts.sort((a, b) => 
        new Date(b.publishedAt) - new Date(a.publishedAt)
      )
  }
})

// Stats
const totalPosts = computed(() => filteredPosts.value.length)
const uniqueAuthors = computed(() => {
  const authors = new Set(filteredPosts.value.map(p => p.author?.id).filter(Boolean))
  return authors.size
})
const averageDifficulty = computed(() => {
  const difficulties = filteredPosts.value.map(p => p.difficulty).filter(Boolean)
  const counts = { beginner: 0, intermediate: 0, advanced: 0 }
  difficulties.forEach(d => counts[d]++)
  const max = Math.max(...Object.values(counts))
  return Object.keys(counts).find(key => counts[key] === max) || 'Mixed'
})
const totalViews = computed(() => {
  return filteredPosts.value.reduce((sum, post) => sum + (post.views || 0), 0)
})

// Popular tags
const _popularTags = computed(() => {
  const tagCounts = {}
  filteredPosts.value.forEach(post => {
    post.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / blogStore.postsPerPage))
const visiblePages = computed(() => {
  const current = blogStore.currentPage
  const total = totalPages.value
  const delta = 2
  const range = []
  
  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    range.push(i)
  }
  
  return range
})

// Newsletter subscription
const subscribeNewsletter = async () => {
  try {
    await $fetch('/api/newsletter/subscribe', {
      method: 'POST',
      body: { email: email.value, categories: [category.value] }
    })
    uiStore.showSuccess('Successfully subscribed to newsletter!')
    email.value = ''
  } catch (error) {
    uiStore.showError('Failed to subscribe. Please try again.')
  }
}

// Utilities
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>