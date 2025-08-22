<template>
  <div>
    <section class="bg-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-center mb-8">Our Blog</h1>
        <p class="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Explore our collection of crafting tutorials, creative inspiration, and stories from the maker community.
        </p>
      </div>
    </section>

    <section class="py-12">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap gap-4 mb-8">
          <button 
            @click="selectedTag = ''"
            :class="['px-4 py-2 rounded-full text-sm font-medium transition-colors', 
                     selectedTag === '' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
          >
            All Posts
          </button>
          <button 
            v-for="tag in availableTags" 
            :key="tag"
            @click="selectedTag = tag"
            :class="['px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize', 
                     selectedTag === tag ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
          >
            {{ tag }}
          </button>
        </div>

        <div v-if="posts?.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <BlogCard 
            v-for="post in posts" 
            :key="post.id"
            :post="post"
          />
        </div>

        <div v-else-if="response" class="text-center py-12">
          <p class="text-gray-500">No posts found for the selected tag.</p>
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-500">Loading posts...</p>
        </div>

        <div v-if="totalPages > 1" class="flex justify-center space-x-2">
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="currentPage = page"
            :class="['px-4 py-2 rounded-lg font-medium transition-colors',
                     currentPage === page ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const selectedTag = ref('')
const currentPage = ref(1)

const { data: response } = await useFetch('/api/posts', {
  query: computed(() => ({
    tag: selectedTag.value,
    page: currentPage.value
  }))
})

const posts = computed(() => response.value?.data || [])
const totalPages = computed(() => response.value?.totalPages || 1)

const availableTags = ['embroidery', 'knitting', 'upcycling', 'cross-stitch', 'macrame', 'tutorial', 'beginner']

useHead({
  title: 'Blog - Needle & Kin',
  meta: [
    { name: 'description', content: 'Explore our crafting tutorials, creative inspiration, and maker community stories.' }
  ]
})
</script>