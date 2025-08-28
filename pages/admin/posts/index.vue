<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Manage Posts</h1>
            <p class="mt-1 text-sm text-gray-600">
              Create, edit, and manage all blog posts
            </p>
          </div>
          <NuxtLink
            to="/admin/posts/create"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Post</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex flex-wrap gap-4">
        <!-- Search -->
        <div class="flex-grow max-w-md">
          <div class="relative">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search posts..."
              class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
            <svg
              class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
          </div>
        </div>

        <!-- Status Filter -->
        <select
          v-model="filters.status"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="archived">Archived</option>
        </select>

        <!-- Category Filter -->
        <select
          v-model="filters.category"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Categories</option>
          <option value="knitting">Knitting</option>
          <option value="crochet">Crochet</option>
          <option value="embroidery">Embroidery</option>
          <option value="quilting">Quilting</option>
          <option value="sewing">Sewing</option>
          <option value="weaving">Weaving</option>
        </select>

        <!-- Sort -->
        <select
          v-model="filters.sortBy"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="lastModified">Last Modified</option>
          <option value="title">Title</option>
          <option value="views">Views</option>
          <option value="likes">Likes</option>
          <option value="comments">Comments</option>
        </select>
      </div>

      <!-- Stats -->
      <div class="mt-4 flex items-center space-x-6 text-sm">
        <span class="text-gray-600">
          <strong class="text-gray-900">{{ stats.total }}</strong> Total
        </span>
        <span class="text-gray-600">
          <strong class="text-green-600">{{ stats.published }}</strong> Published
        </span>
        <span class="text-gray-600">
          <strong class="text-yellow-600">{{ stats.draft }}</strong> Drafts
        </span>
        <span class="text-gray-600">
          <strong class="text-blue-600">{{ stats.scheduled }}</strong> Scheduled
        </span>
      </div>
    </div>

    <!-- Posts Table -->
    <div class="px-6 py-4">
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Post
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stats
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
              <!-- Post Info -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <img
                    :src="post.image"
                    :alt="post.title"
                    class="h-10 w-10 rounded object-cover"
                  >
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ post.title }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ formatDate(post.lastModified) }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Author -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <img
                    :src="post.author.avatar"
                    :alt="post.author.name"
                    class="h-6 w-6 rounded-full"
                  >
                  <span class="text-sm text-gray-900">{{ post.author.name }}</span>
                </div>
              </td>

              <!-- Category -->
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900 capitalize">{{ post.category }}</span>
              </td>

              <!-- Status -->
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    post.status === 'published' ? 'bg-green-100 text-green-800' :
                    post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ post.status }}
                </span>
              </td>

              <!-- Stats -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <div class="flex items-center space-x-1">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{{ post.views }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L10 18.364l5.682-5.682a4.5 4.5 0 00-6.364-6.364L10 7l-.682-.682a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{{ post.likes }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{{ post.comments }}</span>
                  </div>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <NuxtLink
                    :to="`/blog/${post.slug}`"
                    class="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                    title="View"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/posts/${post.id}/edit`"
                    class="p-1 text-blue-600 hover:text-blue-900 transition-colors"
                    title="Edit"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </NuxtLink>
                  <button
                    @click="deletePost(post.id)"
                    class="p-1 text-red-600 hover:text-red-900 transition-colors"
                    title="Delete"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="posts.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-4 text-gray-500">No posts found</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to 
          {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of 
          {{ pagination.total }} posts
        </div>
        <div class="flex space-x-2">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 rounded text-sm',
              page === pagination.page
                ? 'bg-purple-600 text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages"
            class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const posts = ref([])
const stats = ref({
  total: 0,
  published: 0,
  draft: 0,
  scheduled: 0,
  archived: 0
})
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0
})

const filters = ref({
  search: '',
  status: '',
  category: '',
  sortBy: 'lastModified',
  order: 'desc'
})

const visiblePages = computed(() => {
  const pages = []
  const total = pagination.value.totalPages
  const current = pagination.value.page
  const delta = 2

  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    pages.push(i)
  }

  return pages
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchPosts = async () => {
  try {
    const query = new URLSearchParams({
      page: pagination.value.page.toString(),
      limit: pagination.value.limit.toString(),
      ...filters.value
    })

    const response = await $fetch(`/api/admin/posts?${query}`)
    
    posts.value = response.posts
    stats.value = response.stats
    pagination.value = response.pagination
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
}

const changePage = (page) => {
  if (page < 1 || page > pagination.value.totalPages) return
  pagination.value.page = page
  fetchPosts()
}

const deletePost = async (postId) => {
  if (!confirm('Are you sure you want to delete this post?')) return

  try {
    await $fetch(`/api/admin/posts/${postId}`, {
      method: 'DELETE'
    })
    
    // Refresh the list
    await fetchPosts()
  } catch (error) {
    console.error('Error deleting post:', error)
    alert('Failed to delete post')
  }
}

// Watch filters and refetch
watch(filters, () => {
  pagination.value.page = 1
  fetchPosts()
}, { deep: true })

onMounted(() => {
  fetchPosts()
})

useHead({
  title: 'Manage Posts - Admin - Needle & Kin'
})
</script>