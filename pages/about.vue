<template>
  <div>
    <section class="relative overflow-hidden h-[500px]">
      <!-- QuiltSimulation as background -->
      <div class="absolute inset-0 z-0">
        <QuiltSimulation />
      </div>
      
      <!-- Hero content with overlay -->
      <div class="relative z-10 h-full flex items-center justify-center bg-gradient-to-r from-purple-600/80 to-pink-600/80">
        <div class="container mx-auto px-4 text-center text-white">
          <h1 class="text-5xl font-bold mb-6 drop-shadow-lg">{{ aboutData?.hero.title }}</h1>
          <p class="text-xl max-w-2xl mx-auto drop-shadow-md">
            {{ aboutData?.hero.description }}
          </p>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 class="text-3xl font-bold mb-6">{{ aboutData?.story.title }}</h2>
              <p v-for="paragraph in aboutData?.story.content" :key="paragraph" class="text-lg text-gray-700 mb-6">
                {{ paragraph }}
              </p>
            </div>
            <div class="text-center">
              <div class="bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg shadow-lg w-full h-80 flex items-center justify-center">
                <div class="text-center text-gray-600">
                  <svg class="w-16 h-16 mx-auto mb-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p class="text-sm">Crafting Hands Image</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-8 mb-16">
            <h2 class="text-3xl font-bold mb-8 text-center">{{ aboutData?.mission.title }}</h2>
            <div class="grid md:grid-cols-3 gap-8">
              <div v-for="value in aboutData?.mission.values" :key="value.title" class="text-center">
                <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg v-if="value.icon === 'book'" class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  <svg v-else-if="value.icon === 'users'" class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <svg v-else-if="value.icon === 'lightbulb'" class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold mb-3">{{ value.title }}</h3>
                <p class="text-gray-600">{{ value.description }}</p>
              </div>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div class="text-center md:order-2">
              <div class="bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg shadow-lg w-full h-80 flex items-center justify-center">
                <div class="text-center text-gray-600">
                  <svg class="w-16 h-16 mx-auto mb-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <p class="text-sm">Team Photo</p>
                </div>
              </div>
            </div>
            <div class="md:order-1">
              <h2 class="text-3xl font-bold mb-6">{{ aboutData?.team.title }}</h2>
              <p class="text-lg text-gray-700 mb-6">
                {{ aboutData?.team.description }}
              </p>
              <div class="space-y-4">
                <div v-for="member in aboutData?.team.members" :key="member.name" class="flex items-center space-x-4">
                  <img :src="member.avatar" :alt="member.name" class="w-12 h-12 rounded-full object-cover">
                  <div>
                    <h4 class="font-semibold">{{ member.name }}</h4>
                    <p class="text-gray-600">{{ member.role }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-purple-600 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">{{ aboutData?.cta.title }}</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          {{ aboutData?.cta.description }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink 
            v-for="button in aboutData?.cta.buttons" 
            :key="button.text"
            :to="button.url" 
            :class="[
              'px-8 py-3 rounded-lg font-semibold transition-colors',
              button.type === 'primary' 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'border-2 border-white text-white hover:bg-white hover:text-purple-600'
            ]"
          >
            {{ button.text }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import QuiltSimulation from '~/components/QuiltSimulation/QuiltSimulation.vue';
const { data: aboutData } = await useFetch('/api/about')

useHead({
  title: 'About Us - Needle & Kin',
  meta: [
    { name: 'description', content: 'Learn about Needle & Kin, our mission to connect crafters, and the passionate team behind our crafting community.' }
  ]
})
</script>