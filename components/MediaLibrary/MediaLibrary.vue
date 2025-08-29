<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden">
      <!-- Backdrop -->
      <div
        @click="close"
        class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
      ></div>

      <!-- Modal -->
      <div class="fixed inset-0 overflow-hidden">
        <div class="flex items-center justify-center min-h-full p-4">
          <div class="relative bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900">Media Library</h2>
                <button
                  @click="close"
                  class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <!-- Tabs -->
              <div class="mt-4 flex space-x-6 border-b border-gray-200 -mb-px">
                <button
                  @click="activeTab = 'library'"
                  :class="[
                    'pb-3 text-sm font-medium border-b-2 transition-colors',
                    activeTab === 'library'
                      ? 'text-purple-600 border-purple-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  ]"
                >
                  Media Library
                </button>
                <button
                  @click="activeTab = 'upload'"
                  :class="[
                    'pb-3 text-sm font-medium border-b-2 transition-colors',
                    activeTab === 'upload'
                      ? 'text-purple-600 border-purple-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  ]"
                >
                  Upload Files
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-auto">
              <!-- Library Tab -->
              <div v-if="activeTab === 'library'" class="p-6">
                <!-- Filters -->
                <div class="mb-4 flex flex-wrap gap-3">
                  <div class="flex-1 min-w-[200px]">
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search media..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                  </div>
                  <select
                    v-model="filterType"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                    <option value="document">Documents</option>
                  </select>
                  <select
                    v-model="sortBy"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="size">Size</option>
                  </select>
                </div>

                <!-- Media Grid -->
                <div v-if="filteredMedia.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div
                    v-for="item in filteredMedia"
                    :key="item.id"
                    @click="selectMedia(item)"
                    :class="[
                      'relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all',
                      selectedMedia?.id === item.id
                        ? 'border-purple-500 ring-2 ring-purple-200'
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <!-- Image -->
                    <div v-if="item.type === 'image'" class="aspect-square">
                      <img
                        :src="item.thumbnail || item.url"
                        :alt="item.name"
                        class="w-full h-full object-cover"
                      >
                    </div>
                    
                    <!-- Video -->
                    <div v-else-if="item.type === 'video'" class="aspect-square bg-gray-100 flex items-center justify-center">
                      <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </div>
                    
                    <!-- Document -->
                    <div v-else class="aspect-square bg-gray-100 flex items-center justify-center">
                      <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    
                    <!-- Selection Overlay -->
                    <div
                      v-if="selectedMedia?.id === item.id"
                      class="absolute inset-0 bg-purple-600 bg-opacity-20 flex items-center justify-center"
                    >
                      <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    
                    <!-- Hover Overlay -->
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-end">
                      <div class="p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity w-full">
                        <p class="text-xs truncate">{{ item.name }}</p>
                        <p class="text-xs">{{ formatFileSize(item.size) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-12">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <p class="mt-2 text-sm text-gray-600">No media files found</p>
                </div>
              </div>

              <!-- Upload Tab -->
              <div v-if="activeTab === 'upload'" class="p-6">
                <MediaUpload
                  :accept="accept"
                  :multiple="true"
                  :auto-upload="false"
                  @uploaded="handleUploaded"
                  @error="handleError"
                />
              </div>
            </div>

            <!-- Footer (when media is selected) -->
            <div v-if="selectedMedia" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <!-- Preview -->
                  <div class="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      v-if="selectedMedia.type === 'image'"
                      :src="selectedMedia.thumbnail || selectedMedia.url"
                      :alt="selectedMedia.name"
                      class="w-full h-full object-cover"
                    >
                    <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                      <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Details -->
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ selectedMedia.name }}</p>
                    <p class="text-xs text-gray-500">
                      {{ selectedMedia.dimensions ? `${selectedMedia.dimensions.width} × ${selectedMedia.dimensions.height} • ` : '' }}
                      {{ formatFileSize(selectedMedia.size) }}
                    </p>
                    <input
                      v-model="selectedMedia.alt"
                      type="text"
                      placeholder="Alt text (for accessibility)"
                      class="mt-1 text-xs px-2 py-1 border border-gray-300 rounded"
                    >
                  </div>
                </div>
                
                <!-- Actions -->
                <div class="flex items-center space-x-3">
                  <button
                    @click="selectedMedia = null"
                    class="px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    @click="insertMedia"
                    class="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                  >
                    Insert
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  multiple: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'select'])

const activeTab = ref('library')
const searchQuery = ref('')
const filterType = ref('')
const sortBy = ref('newest')
const selectedMedia = ref(null)

// Mock media library data
const mediaLibrary = ref([
  {
    id: '1',
    name: 'hero-image.jpg',
    type: 'image',
    url: '/images/hero-image.jpg',
    thumbnail: '/images/hero-image-thumb.jpg',
    size: 245678,
    dimensions: { width: 1920, height: 1080 },
    createdAt: '2024-12-20T10:00:00'
  },
  {
    id: '2',
    name: 'pattern-1.png',
    type: 'image',
    url: '/images/pattern-1.png',
    thumbnail: '/images/pattern-1-thumb.png',
    size: 123456,
    dimensions: { width: 800, height: 600 },
    createdAt: '2024-12-22T14:30:00'
  },
  {
    id: '3',
    name: 'tutorial-video.mp4',
    type: 'video',
    url: '/videos/tutorial.mp4',
    size: 5242880,
    duration: 180,
    createdAt: '2024-12-25T09:15:00'
  },
  {
    id: '4',
    name: 'knitting-guide.pdf',
    type: 'document',
    url: '/documents/knitting-guide.pdf',
    size: 1048576,
    pages: 24,
    createdAt: '2024-12-26T11:20:00'
  }
])

const filteredMedia = computed(() => {
  let result = [...mediaLibrary.value]
  
  // Filter by search query
  if (searchQuery.value) {
    result = result.filter(item =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  // Filter by type
  if (filterType.value) {
    result = result.filter(item => item.type === filterType.value)
  }
  
  // Sort
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'name':
        return a.name.localeCompare(b.name)
      case 'size':
        return b.size - a.size
      default:
        return 0
    }
  })
  
  return result
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const selectMedia = (item) => {
  selectedMedia.value = item === selectedMedia.value ? null : { ...item, alt: '' }
}

const insertMedia = () => {
  if (selectedMedia.value) {
    emit('select', selectedMedia.value)
    close()
  }
}

const handleUploaded = (files) => {
  // Add uploaded files to media library
  files.forEach(file => {
    mediaLibrary.value.unshift({
      id: Date.now().toString(),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
      url: file.url,
      thumbnail: file.thumbnail || file.url,
      size: file.size,
      createdAt: new Date().toISOString()
    })
  })
  
  // Switch to library tab
  activeTab.value = 'library'
}

const handleError = (errors) => {
  console.error('Upload errors:', errors)
}

const close = () => {
  selectedMedia.value = null
  emit('close')
}
</script>