<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Author Header -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
          <!-- Avatar -->
          <img
            :src="author.avatar"
            :alt="author.name"
            class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          >
          
          <!-- Author Info -->
          <div class="flex-1 text-center md:text-left">
            <div class="flex flex-col md:flex-row items-center md:items-start md:justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{{ author.name }}</h1>
                <p class="text-lg text-gray-600 mt-1">{{ author.title }}</p>
                <p class="text-gray-500 mt-2">Member since {{ formatDate(author.joinedDate) }}</p>
              </div>
              
              <!-- Follow Button -->
              <div class="mt-4 md:mt-0">
                <button
                  v-if="!isCurrentUser"
                  @click="toggleFollow"
                  :disabled="isFollowLoading"
                  :class="[
                    'px-6 py-2 rounded-lg font-medium transition-colors',
                    isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  ]"
                >
                  {{ isFollowLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow' }}
                </button>
                <NuxtLink
                  v-else
                  to="/profile/edit"
                  class="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Edit Profile
                </NuxtLink>
              </div>
            </div>
            
            <!-- Bio -->
            <p class="mt-4 text-gray-700 max-w-3xl">{{ author.bio }}</p>
            
            <!-- Stats -->
            <div class="mt-6 flex flex-wrap justify-center md:justify-start gap-6">
              <div class="text-center md:text-left">
                <div class="text-2xl font-bold text-gray-900">{{ author.stats.posts }}</div>
                <div class="text-sm text-gray-600">Posts</div>
              </div>
              <div class="text-center md:text-left">
                <div class="text-2xl font-bold text-gray-900">{{ author.stats.followers }}</div>
                <div class="text-sm text-gray-600">Followers</div>
              </div>
              <div class="text-center md:text-left">
                <div class="text-2xl font-bold text-gray-900">{{ author.stats.following }}</div>
                <div class="text-sm text-gray-600">Following</div>
              </div>
              <div class="text-center md:text-left">
                <div class="text-2xl font-bold text-gray-900">{{ author.stats.likes }}</div>
                <div class="text-sm text-gray-600">Total Likes</div>
              </div>
            </div>
            
            <!-- Social Links -->
            <div class="mt-6 flex justify-center md:justify-start space-x-4">
              <a
                v-if="author.social.website"
                :href="author.social.website"
                target="_blank"
                class="text-gray-600 hover:text-gray-900 transition-colors"
                title="Website"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clip-rule="evenodd" />
                </svg>
              </a>
              <a
                v-if="author.social.instagram"
                :href="`https://instagram.com/${author.social.instagram}`"
                target="_blank"
                class="text-gray-600 hover:text-gray-900 transition-colors"
                title="Instagram"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
              </a>
              <a
                v-if="author.social.pinterest"
                :href="`https://pinterest.com/${author.social.pinterest}`"
                target="_blank"
                class="text-gray-600 hover:text-gray-900 transition-colors"
                title="Pinterest"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 0 0-4.373 23.164c-.054-.477-.103-1.211.022-1.732l.773-3.275s-.192-.384-.192-.952c0-.892.517-1.559 1.161-1.559.548 0 .813.412.813.905 0 .551-.351 1.376-.532 2.14-.151.64.321 1.161.951 1.161 1.142 0 2.019-1.203 2.019-2.94 0-1.537-.104-2.764-2.764-2.764-1.883 0-2.989 1.412-2.989 2.871 0 .569.219 1.178.492 1.509a.198.198 0 0 1 .046.19l-.183.744c-.03.119-.095.144-.22.087-.826-.385-1.343-1.594-1.343-2.565 0-2.024 1.471-3.883 4.24-3.883 2.227 0 3.958 1.587 3.958 3.709 0 2.213-1.395 3.993-3.332 3.993-.651 0-1.262-.338-1.471-.737l-.4 1.524c-.144.556-.534 1.253-.795 1.678A12 12 0 1 0 12 0z"/>
                </svg>
              </a>
              <a
                v-if="author.social.youtube"
                :href="`https://youtube.com/${author.social.youtube}`"
                target="_blank"
                class="text-gray-600 hover:text-gray-900 transition-colors"
                title="YouTube"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
            
            <!-- Expertise -->
            <div v-if="author.expertise.length > 0" class="mt-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-2">Expertise</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in author.expertise"
                  :key="skill"
                  class="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Tabs -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="border-b border-gray-200 mt-8">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'posts'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'posts'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Posts ({{ author.stats.posts }})
          </button>
          <button
            @click="activeTab = 'about'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'about'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            About
          </button>
          <button
            @click="activeTab = 'followers'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === 'followers'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Followers
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="py-8">
        <!-- Posts Tab -->
        <div v-if="activeTab === 'posts'">
          <!-- Filters -->
          <div class="mb-6 flex flex-wrap gap-3">
            <select
              v-model="postFilters.category"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Categories</option>
              <option value="knitting">Knitting</option>
              <option value="crochet">Crochet</option>
              <option value="embroidery">Embroidery</option>
              <option value="sewing">Sewing</option>
              <option value="quilting">Quilting</option>
            </select>
            <select
              v-model="postFilters.sort"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="commented">Most Commented</option>
            </select>
          </div>

          <!-- Posts Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article
              v-for="post in authorPosts"
              :key="post.id"
              class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              <NuxtLink :to="`/blog/${post.slug}`">
                <img
                  :src="post.featuredImage"
                  :alt="post.title"
                  class="w-full h-48 object-cover"
                >
                <div class="p-6">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-purple-600 uppercase">
                      {{ post.category }}
                    </span>
                    <time class="text-xs text-gray-500">
                      {{ formatDate(post.publishedAt) }}
                    </time>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ post.title }}</h3>
                  <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ post.excerpt }}</p>
                  <div class="flex items-center justify-between text-sm text-gray-500">
                    <div class="flex items-center space-x-4">
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {{ post.views }}
                      </span>
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {{ post.likes }}
                      </span>
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {{ post.comments }}
                      </span>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </article>
          </div>

          <!-- Load More -->
          <div v-if="hasMorePosts" class="mt-8 text-center">
            <button
              @click="loadMorePosts"
              :disabled="isLoadingPosts"
              class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {{ isLoadingPosts ? 'Loading...' : 'Load More Posts' }}
            </button>
          </div>
        </div>

        <!-- About Tab -->
        <div v-if="activeTab === 'about'" class="max-w-3xl">
          <div class="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <!-- Extended Bio -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">About {{ author.name }}</h3>
              <div class="prose prose-gray max-w-none">
                <p>{{ author.extendedBio || author.bio }}</p>
              </div>
            </div>

            <!-- Skills & Interests -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Skills & Interests</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Skill Level</h4>
                  <div class="space-y-2">
                    <div v-for="skill in author.skills" :key="skill.name" class="flex items-center justify-between">
                      <span class="text-sm text-gray-600">{{ skill.name }}</span>
                      <div class="flex space-x-1">
                        <span
                          v-for="i in 5"
                          :key="i"
                          :class="[
                            'w-2 h-2 rounded-full',
                            i <= skill.level ? 'bg-purple-600' : 'bg-gray-300'
                          ]"
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Favorite Materials</h4>
                  <ul class="space-y-1">
                    <li v-for="material in author.favoriteMaterials" :key="material" class="text-sm text-gray-600">
                      • {{ material }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Achievements -->
            <div v-if="author.achievements.length > 0">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Achievements</h3>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  v-for="achievement in author.achievements"
                  :key="achievement.id"
                  class="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg"
                >
                  <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <h4 class="text-sm font-medium text-gray-900">{{ achievement.name }}</h4>
                  <p class="text-xs text-gray-500 mt-1">{{ achievement.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Followers Tab -->
        <div v-if="activeTab === 'followers'">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="follower in followers"
              :key="follower.id"
              class="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4"
            >
              <img
                :src="follower.avatar"
                :alt="follower.name"
                class="w-12 h-12 rounded-full object-cover"
              >
              <div class="flex-1">
                <NuxtLink
                  :to="`/authors/${follower.id}`"
                  class="font-medium text-gray-900 hover:text-purple-600"
                >
                  {{ follower.name }}
                </NuxtLink>
                <p class="text-sm text-gray-500">{{ follower.followersCount }} followers</p>
              </div>
              <button
                v-if="!follower.isFollowing"
                @click="followUser(follower.id)"
                class="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Follow
              </button>
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
import { useUserStore } from '~/stores/user'

const route = useRoute()
const userStore = useUserStore()

const activeTab = ref('posts')
const isFollowing = ref(false)
const isFollowLoading = ref(false)
const postFilters = ref({
  category: '',
  sort: 'newest'
})
const isLoadingPosts = ref(false)

// Mock author data
const author = ref({
  id: route.params.id,
  name: 'Sarah Mitchell',
  title: 'Master Knitter & Pattern Designer',
  avatar: '/avatars/sarah-mitchell.jpg',
  bio: 'Passionate about all things fiber arts. I love sharing my knowledge and helping others discover the joy of creating beautiful handmade items.',
  extendedBio: 'I started my crafting journey over 20 years ago when my grandmother taught me to knit. Since then, I\'ve explored various fiber arts and developed my own unique style. I specialize in modern interpretations of traditional patterns and love experimenting with color and texture.',
  joinedDate: '2023-06-15',
  stats: {
    posts: 47,
    followers: 1234,
    following: 89,
    likes: 3456
  },
  social: {
    website: 'https://sarahmitchell.com',
    instagram: 'sarahknits',
    pinterest: 'sarahknits',
    youtube: '@sarahknits'
  },
  expertise: ['Knitting', 'Pattern Design', 'Color Theory', 'Cable Knitting', 'Fair Isle'],
  skills: [
    { name: 'Knitting', level: 5 },
    { name: 'Crochet', level: 3 },
    { name: 'Pattern Design', level: 5 },
    { name: 'Teaching', level: 4 }
  ],
  favoriteMaterials: ['Merino Wool', 'Alpaca', 'Silk Blends', 'Organic Cotton'],
  achievements: [
    {
      id: '1',
      name: 'Top Contributor',
      description: '100+ posts published'
    },
    {
      id: '2',
      name: 'Community Leader',
      description: '1000+ followers'
    },
    {
      id: '3',
      name: 'Pattern Master',
      description: '50+ patterns shared'
    }
  ]
})

// Mock posts data
const authorPosts = ref([
  {
    id: '1',
    title: 'Cable Knit Sweater Pattern for Beginners',
    slug: 'cable-knit-sweater-pattern',
    excerpt: 'Learn how to create your first cable knit sweater with this step-by-step pattern designed for beginners.',
    featuredImage: '/images/blog/cable-sweater.jpg',
    category: 'knitting',
    publishedAt: '2024-12-20',
    views: 1250,
    likes: 89,
    comments: 23
  },
  {
    id: '2',
    title: 'Understanding Yarn Weights: A Complete Guide',
    slug: 'understanding-yarn-weights',
    excerpt: 'Everything you need to know about yarn weights and how to choose the right one for your project.',
    featuredImage: '/images/blog/yarn-weights.jpg',
    category: 'knitting',
    publishedAt: '2024-12-15',
    views: 890,
    likes: 67,
    comments: 15
  },
  {
    id: '3',
    title: 'Color Theory for Knitters',
    slug: 'color-theory-knitters',
    excerpt: 'Master the art of color selection and create stunning color combinations in your knitting projects.',
    featuredImage: '/images/blog/color-theory.jpg',
    category: 'knitting',
    publishedAt: '2024-12-10',
    views: 756,
    likes: 45,
    comments: 12
  }
])

const followers = ref([
  {
    id: '1',
    name: 'Emily Johnson',
    avatar: '/avatars/emily.jpg',
    followersCount: 234,
    isFollowing: false
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: '/avatars/michael.jpg',
    followersCount: 567,
    isFollowing: true
  },
  {
    id: '3',
    name: 'Lisa Rodriguez',
    avatar: '/avatars/lisa.jpg',
    followersCount: 123,
    isFollowing: false
  }
])

const hasMorePosts = ref(true)

const isCurrentUser = computed(() => {
  return userStore.currentUser?.id === author.value.id
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })
}

const toggleFollow = async () => {
  isFollowLoading.value = true
  
  try {
    const endpoint = isFollowing.value
      ? `/api/authors/${author.value.id}/unfollow`
      : `/api/authors/${author.value.id}/follow`
    
    const response = await $fetch(endpoint, {
      method: 'POST'
    })
    
    if (response.success) {
      isFollowing.value = !isFollowing.value
      author.value.stats.followers += isFollowing.value ? 1 : -1
    }
  } catch (error) {
    console.error('Error toggling follow:', error)
  } finally {
    isFollowLoading.value = false
  }
}

const loadMorePosts = async () => {
  isLoadingPosts.value = true
  
  // Simulate loading more posts
  setTimeout(() => {
    // Add more posts to the list
    hasMorePosts.value = false
    isLoadingPosts.value = false
  }, 1000)
}

const followUser = (userId) => {
  const follower = followers.value.find(f => f.id === userId)
  if (follower) {
    follower.isFollowing = true
  }
}

onMounted(() => {
  // Load author data
  // In a real app, this would fetch from the API
})
</script>