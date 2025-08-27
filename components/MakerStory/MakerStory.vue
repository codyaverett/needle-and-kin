<template>
  <article class="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl">
    <!-- Header Image -->
    <div v-if="maker.coverImage" class="relative h-64 bg-gray-200">
      <img 
        :src="maker.coverImage" 
        :alt="`${maker.name}'s crafting space`"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div class="absolute bottom-4 left-4 text-white">
        <h1 class="text-2xl font-bold mb-1">{{ maker.name }}'s Story</h1>
        <p class="text-lg opacity-90">{{ maker.tagline }}</p>
      </div>
    </div>
    
    <!-- Content -->
    <div class="p-8">
      <!-- Profile Section -->
      <div class="flex flex-col md:flex-row gap-6 mb-8">
        <!-- Avatar and Basic Info -->
        <div class="md:w-1/3">
          <div class="text-center md:text-left">
            <img 
              :src="maker.avatar || '/avatars/placeholder.jpg'"
              :alt="maker.name"
              class="w-24 h-24 rounded-full object-cover mx-auto md:mx-0 mb-4 border-4 border-purple-200"
            />
            <h2 v-if="!maker.coverImage" class="text-2xl font-bold text-gray-900 mb-2">{{ maker.name }}</h2>
            <p class="text-purple-600 font-medium mb-2">{{ maker.location }}</p>
            <p class="text-gray-600 text-sm mb-4">{{ maker.role }}</p>
            
            <!-- Quick Stats -->
            <div class="grid grid-cols-2 gap-4 text-center md:text-left">
              <div v-if="maker.yearsOfExperience">
                <div class="text-2xl font-bold text-purple-600">{{ maker.yearsOfExperience }}</div>
                <div class="text-xs text-gray-500">Years Crafting</div>
              </div>
              <div v-if="maker.projectsCompleted">
                <div class="text-2xl font-bold text-pink-600">{{ maker.projectsCompleted }}+</div>
                <div class="text-xs text-gray-500">Projects</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Story Content -->
        <div class="md:w-2/3">
          <div class="prose prose-gray max-w-none">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ maker.storyTitle || "My Crafting Journey" }}</h3>
            
            <div v-for="(paragraph, index) in maker.story" :key="index" class="mb-4">
              <p class="text-gray-700 leading-relaxed">{{ paragraph }}</p>
            </div>
          </div>
          
          <!-- Specialties -->
          <div v-if="maker.specialties?.length" class="mt-6">
            <h4 class="font-semibold text-gray-900 mb-3">Specializes In</h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="specialty in maker.specialties" 
                :key="specialty"
                class="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium"
              >
                {{ specialty }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Featured Projects -->
      <div v-if="maker.featuredProjects?.length" class="mb-8">
        <h3 class="text-xl font-semibold text-gray-900 mb-6">Featured Projects</h3>
        <div class="grid md:grid-cols-3 gap-6">
          <div 
            v-for="project in maker.featuredProjects" 
            :key="project.id"
            class="group cursor-pointer"
            @click="$emit('viewProject', project)"
          >
            <div class="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img 
                :src="project.image"
                :alt="project.title"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="absolute bottom-3 left-3 right-3 text-white">
                  <h4 class="font-semibold text-sm mb-1">{{ project.title }}</h4>
                  <p class="text-xs opacity-90">{{ project.technique }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Inspiration Section -->
      <div v-if="maker.inspiration" class="mb-8">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">What Inspires Me</h3>
        <blockquote class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-l-4 border-purple-400">
          <p class="text-gray-700 italic text-lg leading-relaxed mb-4">
            "{{ maker.inspiration.quote }}"
          </p>
          <div v-if="maker.inspiration.details" class="space-y-2">
            <p v-for="detail in maker.inspiration.details" :key="detail" class="text-gray-600 text-sm">
              {{ detail }}
            </p>
          </div>
        </blockquote>
      </div>
      
      <!-- Advice Section -->
      <div v-if="maker.advice" class="mb-8">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Advice for Fellow Makers</h3>
        <div class="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div class="flex items-start gap-3">
            <svg class="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
            <div>
              <div v-for="tip in maker.advice" :key="tip" class="mb-3 last:mb-0">
                <p class="text-gray-800 font-medium">{{ tip }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Social Links and Contact -->
      <div class="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200">
        <div v-if="maker.socialLinks?.length" class="flex gap-4 mb-4 sm:mb-0">
          <a 
            v-for="social in maker.socialLinks"
            :key="social.platform"
            :href="social.url"
            @click="$emit('visitSocial', social)"
            class="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/>
            </svg>
            <span class="text-sm">{{ social.platform }}</span>
          </a>
        </div>
        
        <div class="flex gap-3">
          <button
            v-if="showContact"
            @click="$emit('contact', maker)"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Get in Touch
          </button>
          
          <button
            v-if="showFollow"
            @click="$emit('follow', maker)"
            class="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors"
          >
            Follow Updates
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  maker: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.name && value.story && Array.isArray(value.story)
    }
  },
  showContact: {
    type: Boolean,
    default: true
  },
  showFollow: {
    type: Boolean,
    default: true
  }
})

defineEmits(['viewProject', 'visitSocial', 'contact', 'follow'])
</script>