<template>
  <div>
    <section class="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold mb-6">{{ siteContent?.hero.title }}</h1>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          {{ siteContent?.hero.description }}
        </p>
        <NuxtLink :to="siteContent?.hero.cta.url" class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          {{ siteContent?.hero.cta.text }}
        </NuxtLink>
      </div>
    </section>

    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Latest Posts</h2>
        <div v-if="latestPosts?.length" class="grid md:grid-cols-3 gap-8">
          <BlogCard 
            v-for="post in latestPosts" 
            :key="post.id"
            :post="post"
          />
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-500">Loading latest posts...</p>
        </div>
        <div class="text-center mt-12">
          <NuxtLink to="/blog" class="text-purple-600 hover:text-purple-800 font-semibold">
            View All Posts →
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="bg-gray-100 py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">{{ siteContent?.aboutSection.title }}</h2>
        <p class="text-lg max-w-3xl mx-auto text-gray-700">
          {{ siteContent?.aboutSection.description }}
        </p>
        <NuxtLink :to="siteContent?.aboutSection.cta.url" class="inline-block mt-8 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
          {{ siteContent?.aboutSection.cta.text }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
const { data: latestPosts } = await useFetch('/api/posts/latest')
const { data: siteContent } = await useFetch('/api/site-content')
</script>