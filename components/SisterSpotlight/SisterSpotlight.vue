<template>
  <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 shadow-lg">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Project Image -->
      <div class="lg:w-1/2">
        <div class="relative rounded-lg overflow-hidden shadow-md">
          <img 
            :src="collaboration.mainImage || '/placeholder-project.jpg'" 
            :alt="`${collaboration.projectTitle} collaboration`"
            class="w-full h-64 lg:h-80 object-cover"
          />
          <div class="absolute top-4 left-4">
            <span class="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Sister Collaboration
            </span>
          </div>
        </div>
      </div>
      
      <!-- Project Details -->
      <div class="lg:w-1/2 flex flex-col justify-center">
        <div class="mb-6">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            {{ collaboration.projectTitle }}
          </h2>
          <p class="text-lg text-gray-600 mb-4">
            {{ collaboration.description }}
          </p>
          <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
              {{ collaboration.duration }}
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ collaboration.skillLevel }}
            </span>
          </div>
        </div>
        
        <!-- Sisters Info -->
        <div class="grid md:grid-cols-2 gap-4 mb-6">
          <div v-for="sister in collaboration.sisters" :key="sister.name" 
               class="bg-white rounded-lg p-4 shadow-sm">
            <div class="flex items-center gap-3 mb-2">
              <img 
                :src="sister.avatar || '/avatars/placeholder.jpg'" 
                :alt="sister.name"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 class="font-semibold text-gray-900">{{ sister.name }}</h4>
                <p class="text-sm text-gray-500">{{ sister.role }}</p>
              </div>
            </div>
            <p class="text-sm text-gray-600">{{ sister.contribution }}</p>
          </div>
        </div>
        
        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-6">
          <span 
            v-for="tag in collaboration.tags" 
            :key="tag"
            class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
          >
            {{ tag }}
          </span>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button 
            v-if="collaboration.tutorialUrl"
            @click="$emit('viewTutorial', collaboration.tutorialUrl)"
            class="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            View Tutorial
          </button>
          <button 
            v-if="collaboration.behindScenesUrl"
            @click="$emit('viewBehindScenes', collaboration.behindScenesUrl)"
            class="border border-purple-600 text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
          >
            Behind the Scenes
          </button>
        </div>
      </div>
    </div>
    
    <!-- Process Photos -->
    <div v-if="collaboration.processImages?.length" class="mt-8">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">Collaboration Process</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="(image, index) in collaboration.processImages" 
          :key="index"
          class="relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <img 
            :src="image.src" 
            :alt="image.caption || `Process step ${index + 1}`"
            class="w-full h-32 object-cover"
          />
          <div v-if="image.caption" 
               class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
            {{ image.caption }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  collaboration: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.projectTitle && value.description && value.sisters && Array.isArray(value.sisters)
    }
  }
})

defineEmits(['viewTutorial', 'viewBehindScenes'])
</script>