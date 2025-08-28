<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/admin/posts"
              class="text-gray-600 hover:text-gray-900"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-900">Create New Post</h1>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="saveDraft"
              :disabled="isSaving"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {{ isSaving ? 'Saving...' : 'Save Draft' }}
            </button>
            <button
              @click="publishPost"
              :disabled="isSaving || !isValid"
              class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {{ isSaving ? 'Publishing...' : 'Publish' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form @submit.prevent="publishPost" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Title -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                id="title"
                v-model="post.title"
                type="text"
                required
                placeholder="Enter post title"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
              <div class="mt-2 text-sm text-gray-500">
                Slug: {{ generatedSlug }}
              </div>
            </div>

            <!-- Excerpt -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <label for="excerpt" class="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                v-model="post.excerpt"
                rows="3"
                placeholder="Brief description of the post"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              ></textarea>
              <div class="mt-1 text-sm text-gray-500">
                {{ post.excerpt.length }}/300 characters
              </div>
            </div>

            <!-- Content -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <RichTextEditor
                v-model="post.content"
                placeholder="Start writing your post..."
                @insert-image="showMediaLibrary = true"
              />
            </div>

            <!-- SEO -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
              <div class="space-y-4">
                <div>
                  <label for="metaTitle" class="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    id="metaTitle"
                    v-model="post.seo.metaTitle"
                    type="text"
                    placeholder="SEO title (defaults to post title)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                  <div class="mt-1 text-sm text-gray-500">
                    {{ (post.seo.metaTitle || post.title).length }}/60 characters
                  </div>
                </div>
                <div>
                  <label for="metaDescription" class="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    id="metaDescription"
                    v-model="post.seo.metaDescription"
                    rows="2"
                    placeholder="SEO description (defaults to excerpt)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  ></textarea>
                  <div class="mt-1 text-sm text-gray-500">
                    {{ (post.seo.metaDescription || post.excerpt).length }}/160 characters
                  </div>
                </div>
                <div>
                  <label for="keywords" class="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                  </label>
                  <input
                    id="keywords"
                    v-model="keywordsInput"
                    type="text"
                    placeholder="Comma-separated keywords"
                    @keydown.enter.prevent="addKeyword"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span
                      v-for="(keyword, index) in post.seo.keywords"
                      :key="index"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      {{ keyword }}
                      <button
                        @click="removeKeyword(index)"
                        type="button"
                        class="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Featured Image -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
              <div v-if="post.featuredImage" class="relative">
                <img
                  :src="post.featuredImage"
                  alt="Featured"
                  class="w-full h-48 object-cover rounded-lg"
                >
                <button
                  @click="post.featuredImage = ''"
                  type="button"
                  class="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
                >
                  <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <button
                  @click="showMediaLibrary = true"
                  type="button"
                  class="mt-2 text-sm text-purple-600 hover:text-purple-700"
                >
                  Upload Image
                </button>
              </div>
            </div>

            <!-- Publishing -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Publishing</h3>
              <div class="space-y-4">
                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    v-model="post.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
                <div v-if="post.status === 'scheduled'">
                  <label for="publishDate" class="block text-sm font-medium text-gray-700 mb-2">
                    Publish Date
                  </label>
                  <input
                    id="publishDate"
                    v-model="post.publishDate"
                    type="datetime-local"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                </div>
              </div>
            </div>

            <!-- Categories & Tags -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Organization</h3>
              <div class="space-y-4">
                <div>
                  <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    v-model="post.category"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    <option value="knitting">Knitting</option>
                    <option value="crochet">Crochet</option>
                    <option value="embroidery">Embroidery</option>
                    <option value="sewing">Sewing</option>
                    <option value="quilting">Quilting</option>
                    <option value="crafts">General Crafts</option>
                  </select>
                </div>
                <div>
                  <label for="difficulty" class="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    id="difficulty"
                    v-model="post.difficulty"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Not specified</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    id="tags"
                    v-model="tagsInput"
                    type="text"
                    placeholder="Add tags..."
                    @keydown.enter.prevent="addTag"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span
                      v-for="(tag, index) in post.tags"
                      :key="index"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {{ tag }}
                      <button
                        @click="removeTag(index)"
                        type="button"
                        class="ml-1 text-gray-600 hover:text-gray-800"
                      >
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Settings -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    v-model="post.allowComments"
                    type="checkbox"
                    class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">Allow comments</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="post.featured"
                    type="checkbox"
                    class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  >
                  <span class="ml-2 text-sm text-gray-700">Featured post</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="successMessage" class="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span class="text-green-800">{{ successMessage }}</span>
      </div>
    </div>

    <div v-if="errorMessage" class="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <span class="text-red-800">{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const post = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  category: '',
  difficulty: '',
  tags: [],
  status: 'draft',
  publishDate: '',
  allowComments: true,
  featured: false,
  seo: {
    metaTitle: '',
    metaDescription: '',
    keywords: []
  }
})

const tagsInput = ref('')
const keywordsInput = ref('')
const showMediaLibrary = ref(false)
const isSaving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const generatedSlug = computed(() => {
  return post.value.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
})

const isValid = computed(() => {
  return post.value.title && post.value.content && post.value.category
})

watch(generatedSlug, (newSlug) => {
  post.value.slug = newSlug
})

const addTag = () => {
  if (tagsInput.value.trim() && !post.value.tags.includes(tagsInput.value.trim())) {
    post.value.tags.push(tagsInput.value.trim())
    tagsInput.value = ''
  }
}

const removeTag = (index) => {
  post.value.tags.splice(index, 1)
}

const addKeyword = () => {
  const keywords = keywordsInput.value.split(',').map(k => k.trim()).filter(k => k)
  keywords.forEach(keyword => {
    if (!post.value.seo.keywords.includes(keyword)) {
      post.value.seo.keywords.push(keyword)
    }
  })
  keywordsInput.value = ''
}

const removeKeyword = (index) => {
  post.value.seo.keywords.splice(index, 1)
}

const saveDraft = async () => {
  isSaving.value = true
  post.value.status = 'draft'
  
  try {
    const response = await $fetch('/api/admin/posts', {
      method: 'POST',
      body: post.value
    })
    
    if (response.success) {
      successMessage.value = 'Draft saved successfully!'
      setTimeout(() => {
        router.push(`/admin/posts/edit/${response.post.id}`)
      }, 1500)
    }
  } catch (error) {
    errorMessage.value = error.data?.message || 'Failed to save draft'
    setTimeout(() => errorMessage.value = '', 5000)
  } finally {
    isSaving.value = false
  }
}

const publishPost = async () => {
  if (!isValid.value) {
    errorMessage.value = 'Please fill in all required fields'
    setTimeout(() => errorMessage.value = '', 5000)
    return
  }
  
  isSaving.value = true
  post.value.status = 'published'
  
  try {
    const response = await $fetch('/api/admin/posts', {
      method: 'POST',
      body: post.value
    })
    
    if (response.success) {
      successMessage.value = 'Post published successfully!'
      setTimeout(() => {
        router.push('/admin/posts')
      }, 1500)
    }
  } catch (error) {
    errorMessage.value = error.data?.message || 'Failed to publish post'
    setTimeout(() => errorMessage.value = '', 5000)
  } finally {
    isSaving.value = false
  }
}
</script>