<template>
  <div>
    <section class="bg-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-center mb-8">Our Blog</h1>
        <p class="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Explore our collection of crafting tutorials, creative inspiration,
          and stories from the maker community.
        </p>
      </div>
    </section>

    <section class="py-12">
      <div class="container mx-auto px-4">
        <!-- Category Filter -->
        <div class="flex flex-wrap gap-4 mb-8">
          <button
            @click="blogStore.setCategory('all')"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              blogStore.selectedCategory === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            All Posts
          </button>
          <button
            v-for="category in categories"
            :key="category.value"
            @click="blogStore.setCategory(category.value)"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              blogStore.selectedCategory === category.value
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            {{ category.label }}
          </button>
        </div>


        <!-- Search Bar -->
        <div class="mb-8">
          <div class="max-w-md mx-auto">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="debouncedSearch"
                type="text"
                placeholder="Search posts..."
                class="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
              <button
                @click="handleSearch"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Posts Grid -->
        <div
          v-if="blogStore.paginatedPosts.length > 0"
          class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          <BlogCard 
            v-for="post in blogStore.paginatedPosts" 
            :key="post.id" 
            :post="post" 
          />
        </div>

        <div v-else-if="!blogStore.loading" class="text-center py-12">
          <p class="text-gray-500">No posts found.</p>
        </div>

        <div v-else class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p class="text-gray-500 mt-4">Loading posts...</p>
        </div>

        <!-- Pagination -->
        <div v-if="blogStore.totalPages > 1" class="flex justify-center space-x-2">
          <button
            @click="blogStore.setPage(blogStore.currentPage - 1)"
            :disabled="blogStore.currentPage === 1"
            class="px-4 py-2 rounded-lg font-medium transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="blogStore.setPage(page)"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              blogStore.currentPage === page
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="blogStore.setPage(blogStore.currentPage + 1)"
            :disabled="blogStore.currentPage === blogStore.totalPages"
            class="px-4 py-2 rounded-lg font-medium transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useBlogStore } from '~/stores/blog'
import { useUIStore } from '~/stores/ui'
import { debounce } from 'lodash-es'

const blogStore = useBlogStore()
const uiStore = useUIStore()

const searchQuery = ref('')

// Define categories
const categories = [
  { value: 'knitting', label: 'Knitting' },
  { value: 'crochet', label: 'Crochet' },
  { value: 'embroidery', label: 'Embroidery' },
  { value: 'quilting', label: 'Quilting' },
  { value: 'sewing', label: 'Sewing' },
  { value: 'weaving', label: 'Weaving' }
]

// Fetch initial posts
const { data: response } = await useFetch("/api/posts", {
  query: computed(() => ({
    category: blogStore.selectedCategory === 'all' ? '' : blogStore.selectedCategory,
    page: blogStore.currentPage,
    limit: blogStore.postsPerPage
  }))
})

// Watch for response changes and update store
watchEffect(() => {
  if (response.value) {
    blogStore.posts = response.value.data || []
    blogStore.totalPosts = response.value.total || 0
  }
})

// Compute visible pages for pagination
const visiblePages = computed(() => {
  const current = blogStore.currentPage
  const total = blogStore.totalPages
  const delta = 2
  const range = []
  
  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    range.push(i)
  }
  
  return range
})

// Search handling
const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    await blogStore.searchPosts(searchQuery.value)
  } else {
    await blogStore.fetchPosts()
  }
}

const debouncedSearch = debounce(handleSearch, 500)

// Load user favorites
onMounted(() => {
  blogStore.loadFavorites()
  blogStore.loadRecentlyViewed()
})

useHead({
  title: "Blog - Needle & Kin",
  meta: [
    {
      name: "description",
      content:
        "Explore our crafting tutorials, creative inspiration, and maker community stories.",
    },
  ],
});
</script>
