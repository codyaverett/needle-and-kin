<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="p-6 border-b">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Community Showcase</h2>
      <p class="text-gray-600">Beautiful projects shared by our crafting community</p>
    </div>
    
    <!-- Filters -->
    <div v-if="showFilters" class="p-4 bg-gray-50 border-b">
      <div class="flex flex-wrap gap-3 items-center">
        <span class="text-sm font-medium text-gray-700">Filter by:</span>
        <button
          @click="selectedCraft = ''"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors',
            selectedCraft === '' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          All Crafts
        </button>
        <button
          v-for="craft in availableCrafts"
          :key="craft"
          @click="selectedCraft = craft"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize',
            selectedCraft === craft 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ craft }}
        </button>
      </div>
    </div>
    
    <!-- Projects Grid -->
    <div class="p-6">
      <div v-if="filteredProjects.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
        <p class="text-gray-500">No projects found for the selected filter.</p>
      </div>
      
      <div v-else :class="[
        'grid gap-6',
        layout === 'masonry' ? 'columns-1 md:columns-2 lg:columns-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      ]">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          :class="[
            'group cursor-pointer',
            layout === 'masonry' ? 'break-inside-avoid mb-6' : ''
          ]"
          @click="$emit('viewProject', project)"
        >
          <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200">
            <!-- Project Image -->
            <div class="relative overflow-hidden">
              <img
                :src="project.mainImage"
                :alt="project.title"
                class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              <!-- Overlay with craft type -->
              <div class="absolute top-3 left-3">
                <span class="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {{ project.craftType }}
                </span>
              </div>
              
              <!-- Favorite heart -->
              <button
                v-if="showFavorites"
                @click.stop="$emit('toggleFavorite', project.id)"
                :class="[
                  'absolute top-3 right-3 p-2 rounded-full transition-colors',
                  project.isFavorited 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-white/90 text-gray-400 hover:text-red-600'
                ]"
              >
                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                </svg>
              </button>
            </div>
            
            <!-- Project Details -->
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">{{ project.title }}</h3>
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ project.description }}</p>
              
              <!-- Maker Info -->
              <div class="flex items-center gap-3 mb-3">
                <img
                  :src="project.maker.avatar || '/avatars/placeholder.jpg'"
                  :alt="project.maker.name"
                  class="w-8 h-8 rounded-full object-cover"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ project.maker.name }}</p>
                  <p class="text-xs text-gray-500">{{ project.maker.location }}</p>
                </div>
              </div>
              
              <!-- Project Stats -->
              <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                  </svg>
                  {{ project.timeSpent }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  {{ project.difficulty }}/5
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                  </svg>
                  {{ project.likes || 0 }}
                </span>
              </div>
              
              <!-- Techniques Used -->
              <div v-if="project.techniques?.length" class="flex flex-wrap gap-1">
                <span
                  v-for="technique in project.techniques.slice(0, 3)"
                  :key="technique"
                  class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {{ technique }}
                </span>
                <span
                  v-if="project.techniques.length > 3"
                  class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  +{{ project.techniques.length - 3 }} more
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Load More Button -->
      <div v-if="showLoadMore && filteredProjects.length > 0" class="text-center mt-8">
        <button
          @click="$emit('loadMore')"
          class="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Load More Projects
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  projects: {
    type: Array,
    required: true,
    default: () => []
  },
  layout: {
    type: String,
    default: 'grid',
    validator: (value) => ['grid', 'masonry'].includes(value)
  },
  showFilters: {
    type: Boolean,
    default: true
  },
  showFavorites: {
    type: Boolean,
    default: true
  },
  showLoadMore: {
    type: Boolean,
    default: false
  }
})

defineEmits(['viewProject', 'toggleFavorite', 'loadMore'])

const selectedCraft = ref('')

const availableCrafts = computed(() => {
  const crafts = [...new Set(props.projects.map(project => project.craftType))]
  return crafts.sort()
})

const filteredProjects = computed(() => {
  if (!selectedCraft.value) {
    return props.projects
  }
  return props.projects.filter(project => project.craftType === selectedCraft.value)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>