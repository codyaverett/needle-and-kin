<template>
  <div v-if="posts.length > 0" class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ title }}</h2>
    
    <div v-if="layout === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="post in posts"
        :key="post.id"
        class="group cursor-pointer"
      >
        <NuxtLink :to="`/blog/${post.slug}`" class="block">
          <div class="relative overflow-hidden rounded-lg mb-3">
            <img
              :src="post.featuredImage || '/images/placeholder.jpg'"
              :alt="post.title"
              class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            >
            <div class="absolute top-2 left-2">
              <span class="px-2 py-1 bg-white/90 backdrop-blur text-xs font-medium text-purple-600 rounded">
                {{ post.category }}
              </span>
            </div>
          </div>
          <h3 class="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-2 line-clamp-2">
            {{ post.title }}
          </h3>
          <p class="text-sm text-gray-600 line-clamp-2 mb-3">
            {{ post.excerpt }}
          </p>
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>{{ formatDate(post.publishedAt) }}</span>
            <span>{{ post.readingTime }} min read</span>
          </div>
        </NuxtLink>
      </article>
    </div>

    <div v-else-if="layout === 'list'" class="space-y-4">
      <article
        v-for="post in posts"
        :key="post.id"
        class="group cursor-pointer border-b border-gray-200 pb-4 last:border-0"
      >
        <NuxtLink :to="`/blog/${post.slug}`" class="flex space-x-4">
          <div class="flex-shrink-0">
            <img
              :src="post.featuredImage || '/images/placeholder.jpg'"
              :alt="post.title"
              class="w-24 h-24 object-cover rounded-lg"
            >
          </div>
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <span class="text-xs font-medium text-purple-600">{{ post.category }}</span>
              <span class="text-xs text-gray-500">•</span>
              <span class="text-xs text-gray-500">{{ formatDate(post.publishedAt) }}</span>
            </div>
            <h3 class="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
              {{ post.title }}
            </h3>
            <p class="text-sm text-gray-600 line-clamp-2">
              {{ post.excerpt }}
            </p>
          </div>
        </NuxtLink>
      </article>
    </div>

    <div v-else-if="layout === 'minimal'" class="space-y-3">
      <article
        v-for="post in posts"
        :key="post.id"
        class="group"
      >
        <NuxtLink :to="`/blog/${post.slug}`" class="block">
          <h3 class="font-medium text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
            {{ post.title }}
          </h3>
          <div class="flex items-center space-x-2 text-xs text-gray-500">
            <span>{{ post.category }}</span>
            <span>•</span>
            <span>{{ formatDate(post.publishedAt) }}</span>
          </div>
        </NuxtLink>
      </article>
    </div>

    <div v-if="showViewAll" class="mt-6 text-center">
      <NuxtLink
        :to="viewAllLink"
        class="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
      >
        View all {{ viewAllText }}
        <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  postId: {
    type: [String, Number],
    default: null
  },
  category: {
    type: String,
    default: ''
  },
  tags: {
    type: Array,
    default: () => []
  },
  limit: {
    type: Number,
    default: 3
  },
  title: {
    type: String,
    default: 'Related Posts'
  },
  layout: {
    type: String,
    default: 'grid',
    validator: (value) => ['grid', 'list', 'minimal'].includes(value)
  },
  showViewAll: {
    type: Boolean,
    default: false
  },
  viewAllLink: {
    type: String,
    default: '/blog'
  },
  viewAllText: {
    type: String,
    default: 'posts'
  }
})

const posts = ref([])
const isLoading = ref(false)

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  })
}

const fetchRelatedPosts = async () => {
  isLoading.value = true
  
  try {
    if (props.postId) {
      // Fetch related posts based on current post
      const response = await $fetch(`/api/posts/${props.postId}/related`, {
        params: {
          limit: props.limit
        }
      })
      
      if (response.success) {
        posts.value = response.posts
      }
    } else if (props.category) {
      // Fetch posts from same category
      const response = await $fetch('/api/posts', {
        params: {
          category: props.category,
          limit: props.limit
        }
      })
      
      if (response.posts) {
        posts.value = response.posts
      }
    } else {
      // Fetch latest posts
      const response = await $fetch('/api/posts', {
        params: {
          limit: props.limit
        }
      })
      
      if (response.posts) {
        posts.value = response.posts
      }
    }
  } catch (error) {
    console.error('Error fetching related posts:', error)
    
    // Use mock data as fallback
    posts.value = [
      {
        id: '1',
        title: 'Getting Started with Cable Knitting',
        slug: 'getting-started-cable-knitting',
        excerpt: 'Learn the basics of cable knitting with this beginner-friendly guide.',
        category: 'knitting',
        featuredImage: '/images/blog/cable-knitting.jpg',
        publishedAt: new Date().toISOString(),
        readingTime: 5
      },
      {
        id: '2',
        title: 'Essential Crochet Stitches for Beginners',
        slug: 'essential-crochet-stitches',
        excerpt: 'Master the fundamental crochet stitches every beginner should know.',
        category: 'crochet',
        featuredImage: '/images/blog/crochet-stitches.jpg',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        readingTime: 7
      },
      {
        id: '3',
        title: 'Choosing the Right Yarn for Your Project',
        slug: 'choosing-right-yarn',
        excerpt: 'A comprehensive guide to selecting the perfect yarn for any project.',
        category: 'crafts',
        featuredImage: '/images/blog/yarn-selection.jpg',
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        readingTime: 6
      }
    ].slice(0, props.limit)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchRelatedPosts()
})
</script>