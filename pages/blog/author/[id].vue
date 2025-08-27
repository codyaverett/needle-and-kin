<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Author Header -->
    <div class="bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <!-- Author Avatar -->
          <div class="relative">
            <img
              :src="author?.avatar || 'https://picsum.photos/200/200'"
              :alt="author?.name"
              class="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl"
            >
            <div v-if="author?.verified" class="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <!-- Author Info -->
          <div class="flex-1 text-center md:text-left">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900">
              {{ author?.name || 'Author' }}
            </h1>
            <p class="text-lg text-gray-600 mt-2">
              {{ author?.tagline || 'Crafting enthusiast and creative maker' }}
            </p>
            <p class="text-gray-600 mt-4 max-w-2xl">
              {{ author?.bio || 'Sharing my passion for crafting through tutorials and patterns.' }}
            </p>

            <!-- Author Stats -->
            <div class="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ authorStats.posts }}</div>
                <div class="text-sm text-gray-600">Posts</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ authorStats.followers }}</div>
                <div class="text-sm text-gray-600">Followers</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ authorStats.projects }}</div>
                <div class="text-sm text-gray-600">Projects</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ authorStats.likes }}</div>
                <div class="text-sm text-gray-600">Likes</div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
              <button
                @click="toggleFollow"
                :class="[
                  'px-6 py-2 rounded-full font-medium transition-colors',
                  isFollowing
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-pink-600 text-white hover:bg-pink-700'
                ]"
              >
                {{ isFollowing ? 'Following' : 'Follow' }}
              </button>
              <button class="px-6 py-2 rounded-full bg-white text-gray-700 border hover:bg-gray-50 transition-colors">
                Message
              </button>
              <button class="p-2 rounded-full bg-white text-gray-700 border hover:bg-gray-50 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
                </svg>
              </button>
            </div>

            <!-- Social Links -->
            <div class="flex justify-center md:justify-start space-x-4 mt-4">
              <a v-if="author?.social?.instagram" :href="author.social.instagram" target="_blank" class="text-gray-600 hover:text-pink-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
              </a>
              <a v-if="author?.social?.pinterest" :href="author.social.pinterest" target="_blank" class="text-gray-600 hover:text-pink-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 00-4.373 23.183c-.063-.522-.12-1.324.025-1.895l.837-3.544s-.214-.428-.214-1.06c0-.992.576-1.733 1.291-1.733.609 0 .903.457.903 1.005 0 .612-.39 1.528-.591 2.376-.169.71.356 1.29 1.056 1.29 1.268 0 2.243-1.337 2.243-3.265 0-1.708-1.227-2.903-2.978-2.903-2.03 0-3.22 1.522-3.22 3.095 0 .612.236 1.269.531 1.626a.213.213 0 01.049.204l-.198.817c-.032.13-.104.157-.24.094-1.89-.88-3.07-3.643-3.07-5.86 0-4.753 3.454-9.118 9.957-9.118 5.226 0 9.287 3.723 9.287 8.696 0 5.19-3.272 9.366-7.815 9.366-1.527 0-2.962-.794-3.453-1.732l-.939 3.578c-.34 1.31-1.26 2.95-1.875 3.95A12 12 0 1012 0z"/>
                </svg>
              </a>
              <a v-if="author?.social?.youtube" :href="author.social.youtube" target="_blank" class="text-gray-600 hover:text-pink-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a v-if="author?.website" :href="author.website" target="_blank" class="text-gray-600 hover:text-pink-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Tabs -->
    <div class="bg-white shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-8 border-b">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.label }}
            <span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Posts Tab -->
      <div v-if="activeTab === 'posts'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BlogCard
            v-for="post in authorPosts"
            :key="post.id"
            :title="post.title"
            :excerpt="post.excerpt"
            :image="post.image"
            :author="post.author"
            :date="post.publishedAt"
            :readTime="post.readTime"
            :category="post.category"
            @click="$router.push(`/blog/${post.slug}`)"
          />
        </div>
      </div>

      <!-- Projects Tab -->
      <div v-if="activeTab === 'projects'">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="project in authorProjects"
            :key="project.id"
            class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div class="aspect-w-16 aspect-h-9">
              <img :src="project.image" :alt="project.title" class="w-full h-48 object-cover">
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ project.title }}</h3>
              <p class="text-gray-600 mb-4">{{ project.description }}</p>
              <div class="flex items-center justify-between">
                <SkillLevelBadge :level="project.difficulty" />
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{{ project.duration }}</span>
                  <span>{{ project.materials.length }} materials</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Patterns Tab -->
      <div v-if="activeTab === 'patterns'">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="pattern in authorPatterns"
            :key="pattern.id"
            class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <img :src="pattern.thumbnail" :alt="pattern.name" class="w-full h-32 object-cover">
            <div class="p-3">
              <h4 class="font-medium text-gray-900">{{ pattern.name }}</h4>
              <p class="text-sm text-gray-500 mt-1">{{ pattern.downloads }} downloads</p>
            </div>
          </div>
        </div>
      </div>

      <!-- About Tab -->
      <div v-if="activeTab === 'about'" class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-sm p-8">
          <!-- Extended Bio -->
          <div class="mb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">About {{ author?.name }}</h3>
            <div class="prose prose-gray max-w-none">
              <p>{{ author?.fullBio || author?.bio }}</p>
            </div>
          </div>

          <!-- Skills & Expertise -->
          <div class="mb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in author?.skills"
                :key="skill"
                class="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Achievements -->
          <div class="mb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Achievements</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="achievement in achievements"
                :key="achievement.id"
                class="text-center"
              >
                <div class="text-3xl mb-2">{{ achievement.emoji }}</div>
                <div class="text-sm font-medium text-gray-900">{{ achievement.title }}</div>
                <div class="text-xs text-gray-500">{{ achievement.description }}</div>
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Journey</h3>
            <div class="space-y-4">
              <div
                v-for="event in timeline"
                :key="event.id"
                class="flex space-x-4"
              >
                <div class="flex-shrink-0 w-2 h-2 mt-2 bg-pink-600 rounded-full"></div>
                <div>
                  <div class="text-sm text-gray-500">{{ event.date }}</div>
                  <div class="font-medium text-gray-900">{{ event.title }}</div>
                  <div class="text-sm text-gray-600">{{ event.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '~/stores/blog'
import { useUserStore } from '~/stores/user'
import { useUIStore } from '~/stores/ui'
import BlogCard from '~/components/BlogCard/BlogCard.vue'
import SkillLevelBadge from '~/components/SkillLevelBadge/SkillLevelBadge.vue'

const route = useRoute()
const blogStore = useBlogStore()
const userStore = useUserStore()
const uiStore = useUIStore()

const activeTab = ref('posts')
const isFollowing = ref(false)

// Fetch author data
const { data: author } = await useFetch(`/api/authors/${route.params.id}`)

// Mock author stats
const authorStats = ref({
  posts: 42,
  followers: 1234,
  projects: 28,
  likes: 5678
})

// Tabs configuration
const tabs = computed(() => [
  { id: 'posts', label: 'Blog Posts', count: authorPosts.value.length },
  { id: 'projects', label: 'Projects', count: authorProjects.value.length },
  { id: 'patterns', label: 'Patterns', count: authorPatterns.value.length },
  { id: 'about', label: 'About', count: '' }
])

// Fetch author's posts
const { data: postsData } = await useFetch('/api/posts', {
  query: {
    author: route.params.id
  }
})

const authorPosts = computed(() => postsData.value?.data || [])

// Mock author's projects
const authorProjects = ref([
  {
    id: 1,
    title: 'Cable Knit Sweater',
    description: 'A cozy cable knit sweater perfect for winter',
    image: 'https://picsum.photos/400/300?random=1',
    difficulty: 'intermediate',
    duration: '2 weeks',
    materials: ['Wool yarn', 'Knitting needles', 'Cable needle']
  },
  {
    id: 2,
    title: 'Granny Square Blanket',
    description: 'Colorful granny square blanket for beginners',
    image: 'https://picsum.photos/400/300?random=2',
    difficulty: 'beginner',
    duration: '1 week',
    materials: ['Cotton yarn', 'Crochet hook']
  }
])

// Mock author's patterns
const authorPatterns = ref([
  {
    id: 1,
    name: 'Basic Scarf Pattern',
    thumbnail: 'https://picsum.photos/200/150?random=3',
    downloads: 245
  },
  {
    id: 2,
    name: 'Baby Booties',
    thumbnail: 'https://picsum.photos/200/150?random=4',
    downloads: 189
  },
  {
    id: 3,
    name: 'Market Bag',
    thumbnail: 'https://picsum.photos/200/150?random=5',
    downloads: 167
  },
  {
    id: 4,
    name: 'Dishcloth Set',
    thumbnail: 'https://picsum.photos/200/150?random=6',
    downloads: 134
  }
])

// Mock achievements
const achievements = ref([
  {
    id: 1,
    emoji: '🏆',
    title: 'Top Author',
    description: '2023'
  },
  {
    id: 2,
    emoji: '⭐',
    title: '1K Followers',
    description: 'Milestone'
  },
  {
    id: 3,
    emoji: '📝',
    title: '50+ Posts',
    description: 'Published'
  },
  {
    id: 4,
    emoji: '❤️',
    title: 'Community Favorite',
    description: 'Award'
  }
])

// Mock timeline
const timeline = ref([
  {
    id: 1,
    date: 'January 2024',
    title: 'Published Cable Knit Mastery Course',
    description: 'Comprehensive video course with 20+ lessons'
  },
  {
    id: 2,
    date: 'November 2023',
    title: 'Reached 1000 Followers',
    description: 'Grateful for the amazing community support'
  },
  {
    id: 3,
    date: 'September 2023',
    title: 'Started Needle & Kin Journey',
    description: 'Joined as a contributing author'
  },
  {
    id: 4,
    date: 'July 2023',
    title: 'First Pattern Published',
    description: 'Basic scarf pattern became instant hit'
  }
])

// Toggle follow
const toggleFollow = async () => {
  if (!userStore.isAuthenticated) {
    uiStore.showWarning('Please login to follow authors')
    return
  }

  try {
    if (isFollowing.value) {
      await userStore.unfollowAuthor(route.params.id)
    } else {
      await userStore.followAuthor(route.params.id)
    }
    isFollowing.value = !isFollowing.value
  } catch (error) {
    uiStore.showError('Failed to update follow status')
  }
}

// Check if following
onMounted(() => {
  if (userStore.isAuthenticated) {
    isFollowing.value = userStore.isFollowing(route.params.id)
  }
})
</script>