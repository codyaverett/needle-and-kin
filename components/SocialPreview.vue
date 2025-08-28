<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div v-if="layout === 'twitter'" class="p-4">
      <div class="flex items-start space-x-3">
        <img
          v-if="author?.avatar"
          :src="author.avatar"
          :alt="author.name"
          class="h-12 w-12 rounded-full"
        />
        <div class="flex-1">
          <div class="flex items-center space-x-1">
            <span class="font-bold text-gray-900">{{ author?.name || 'Your Name' }}</span>
            <Icon v-if="author?.isVerified" name="mdi:check-circle" class="h-4 w-4 text-blue-500" />
            <span class="text-gray-500">@{{ author?.username || 'username' }} · now</span>
          </div>
          <p class="mt-2 text-gray-900">{{ description || 'Your post content will appear here...' }}</p>
          
          <div v-if="image" class="mt-3 rounded-xl overflow-hidden border border-gray-200">
            <img :src="image" :alt="title" class="w-full" />
            <div v-if="title" class="p-3 border-t border-gray-200">
              <p class="text-sm font-medium text-gray-900">{{ title }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ url }}</p>
            </div>
          </div>
          
          <div class="flex items-center justify-between mt-4 text-gray-500">
            <button class="hover:text-blue-500">
              <Icon name="mdi:comment-outline" class="h-5 w-5" />
            </button>
            <button class="hover:text-green-500">
              <Icon name="mdi:repeat" class="h-5 w-5" />
            </button>
            <button class="hover:text-red-500">
              <Icon name="mdi:heart-outline" class="h-5 w-5" />
            </button>
            <button class="hover:text-blue-500">
              <Icon name="mdi:share-variant" class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="layout === 'facebook'" class="bg-white">
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <img
            v-if="author?.avatar"
            :src="author.avatar"
            :alt="author.name"
            class="h-10 w-10 rounded-full"
          />
          <div>
            <p class="font-semibold text-gray-900">{{ author?.name || 'Your Name' }}</p>
            <p class="text-xs text-gray-500">Just now · <Icon name="mdi:earth" class="inline h-3 w-3" /></p>
          </div>
        </div>
      </div>
      
      <div v-if="description" class="px-4 py-3">
        <p class="text-gray-900">{{ description }}</p>
      </div>
      
      <div v-if="image" class="relative">
        <img :src="image" :alt="title" class="w-full" />
      </div>
      
      <div v-if="url" class="border border-gray-200 m-4">
        <img v-if="image && !description" :src="image" :alt="title" class="w-full h-48 object-cover" />
        <div class="p-3">
          <p class="text-xs text-gray-500 uppercase">{{ new URL(url).hostname }}</p>
          <p class="font-semibold text-gray-900 mt-1">{{ title || 'Page Title' }}</p>
          <p v-if="!description" class="text-sm text-gray-600 mt-1">{{ description || 'Page description...' }}</p>
        </div>
      </div>
      
      <div class="px-4 py-2 border-t border-gray-200 flex items-center justify-between text-gray-600">
        <button class="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded">
          <Icon name="mdi:thumb-up-outline" class="h-5 w-5" />
          <span class="text-sm">Like</span>
        </button>
        <button class="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded">
          <Icon name="mdi:comment-outline" class="h-5 w-5" />
          <span class="text-sm">Comment</span>
        </button>
        <button class="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded">
          <Icon name="mdi:share" class="h-5 w-5" />
          <span class="text-sm">Share</span>
        </button>
      </div>
    </div>

    <div v-else-if="layout === 'pinterest'" class="relative group cursor-pointer">
      <img
        :src="image || '/placeholder-image.jpg'"
        :alt="title"
        class="w-full"
      />
      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity">
        <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button class="px-4 py-2 bg-red-600 text-white rounded-full font-medium">
            Save
          </button>
        </div>
      </div>
      <div class="p-3">
        <p v-if="title" class="font-semibold text-gray-900">{{ title }}</p>
        <p v-if="description" class="text-sm text-gray-600 mt-1">{{ description }}</p>
        <div v-if="author" class="flex items-center mt-3">
          <img
            v-if="author.avatar"
            :src="author.avatar"
            :alt="author.name"
            class="h-8 w-8 rounded-full mr-2"
          />
          <span class="text-sm text-gray-700">{{ author.name }}</span>
        </div>
      </div>
    </div>

    <div v-else-if="layout === 'og'" class="border border-gray-200 rounded-lg overflow-hidden">
      <img
        v-if="image"
        :src="image"
        :alt="title"
        class="w-full h-48 object-cover"
      />
      <div class="p-4">
        <p class="text-xs text-gray-500 uppercase mb-1">{{ new URL(url).hostname }}</p>
        <h3 class="font-bold text-gray-900">{{ title || 'Page Title' }}</h3>
        <p class="text-sm text-gray-600 mt-1">{{ description || 'Page description will appear here...' }}</p>
      </div>
    </div>

    <div v-else class="p-4 bg-gray-50">
      <div class="aspect-w-16 aspect-h-9 bg-gray-200 rounded mb-4">
        <img
          v-if="image"
          :src="image"
          :alt="title"
          class="w-full h-full object-cover rounded"
        />
        <div v-else class="flex items-center justify-center">
          <Icon name="mdi:image" class="h-12 w-12 text-gray-400" />
        </div>
      </div>
      <h3 class="font-semibold text-gray-900">{{ title || 'Title' }}</h3>
      <p class="text-sm text-gray-600 mt-1">{{ description || 'Description' }}</p>
      <p class="text-xs text-gray-500 mt-2">{{ url }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Author {
  name: string
  username?: string
  avatar?: string
  isVerified?: boolean
}

const props = withDefaults(defineProps<{
  layout?: 'twitter' | 'facebook' | 'pinterest' | 'og' | 'default'
  title?: string
  description?: string
  image?: string
  url?: string
  author?: Author
}>(), {
  layout: 'default',
  url: 'https://needleandkin.com'
})
</script>