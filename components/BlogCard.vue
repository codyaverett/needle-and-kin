<template>
  <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <img 
      :src="post.image || '/placeholder-image.jpg'" 
      :alt="post.title"
      class="w-full h-48 object-cover"
    />
    <div class="p-6">
      <div class="flex items-center text-sm text-gray-500 mb-2">
        <time :datetime="post.publishedAt">{{ formatDate(post.publishedAt) }}</time>
        <span class="mx-2">•</span>
        <span>{{ post.readTime || '5 min read' }}</span>
      </div>
      <h3 class="text-xl font-semibold mb-3 text-gray-900">
        <NuxtLink :to="`/blog/${post.slug}`" class="hover:text-purple-600 transition-colors">
          {{ post.title }}
        </NuxtLink>
      </h3>
      <p class="text-gray-600 mb-4 line-clamp-3">
        {{ post.excerpt }}
      </p>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <img 
            :src="post.author.avatar || '/default-avatar.jpg'" 
            :alt="post.author.name"
            class="w-8 h-8 rounded-full"
          />
          <span class="text-sm text-gray-700">{{ post.author.name }}</span>
        </div>
        <NuxtLink 
          :to="`/blog/${post.slug}`" 
          class="text-purple-600 hover:text-purple-800 font-medium text-sm"
        >
          Read More →
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  post: {
    type: Object,
    required: true
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>