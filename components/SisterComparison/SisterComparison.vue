<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 text-center">
      <h2 class="text-2xl font-bold mb-2">{{ comparison.title }}</h2>
      <p class="text-purple-100">{{ comparison.description }}</p>
    </div>
    
    <!-- Comparison Grid -->
    <div class="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
      <!-- Sister 1 Approach -->
      <div class="p-6">
        <div class="text-center mb-6">
          <div class="relative inline-block mb-4">
            <img 
              :src="comparison.sister1.avatar || '/avatars/placeholder.jpg'"
              :alt="comparison.sister1.name"
              class="w-16 h-16 rounded-full object-cover mx-auto border-4 border-purple-200"
            />
            <div class="absolute -bottom-1 -right-1 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              {{ comparison.sister1.approach }}
            </div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900">{{ comparison.sister1.name }}</h3>
          <p class="text-gray-600 text-sm">{{ comparison.sister1.subtitle }}</p>
        </div>
        
        <!-- Result Image -->
        <div class="mb-4">
          <img 
            :src="comparison.sister1.resultImage"
            :alt="`${comparison.sister1.name}'s approach result`"
            class="w-full h-48 object-cover rounded-lg shadow-sm"
          />
        </div>
        
        <!-- Approach Details -->
        <div class="space-y-4">
          <div v-if="comparison.sister1.techniques?.length">
            <h4 class="font-semibold text-gray-900 mb-2">Techniques Used</h4>
            <ul class="space-y-1">
              <li v-for="technique in comparison.sister1.techniques" :key="technique" 
                  class="text-sm text-gray-600 flex items-center gap-2">
                <svg class="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                {{ technique }}
              </li>
            </ul>
          </div>
          
          <div v-if="comparison.sister1.materials?.length">
            <h4 class="font-semibold text-gray-900 mb-2">Key Materials</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="material in comparison.sister1.materials" :key="material"
                    class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                {{ material }}
              </span>
            </div>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-2">Why This Approach?</h4>
            <p class="text-sm text-gray-700">{{ comparison.sister1.reasoning }}</p>
          </div>
          
          <!-- Stats -->
          <div class="grid grid-cols-2 gap-4 text-center">
            <div v-if="comparison.sister1.timeSpent" class="bg-gray-50 p-3 rounded-lg">
              <div class="text-lg font-semibold text-gray-900">{{ comparison.sister1.timeSpent }}</div>
              <div class="text-xs text-gray-500">Time Spent</div>
            </div>
            <div v-if="comparison.sister1.difficulty" class="bg-gray-50 p-3 rounded-lg">
              <div class="text-lg font-semibold text-gray-900">{{ comparison.sister1.difficulty }}</div>
              <div class="text-xs text-gray-500">Difficulty</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sister 2 Approach -->
      <div class="p-6">
        <div class="text-center mb-6">
          <div class="relative inline-block mb-4">
            <img 
              :src="comparison.sister2.avatar || '/avatars/placeholder.jpg'"
              :alt="comparison.sister2.name"
              class="w-16 h-16 rounded-full object-cover mx-auto border-4 border-pink-200"
            />
            <div class="absolute -bottom-1 -right-1 bg-pink-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              {{ comparison.sister2.approach }}
            </div>
          </div>
          <h3 class="text-xl font-semibold text-gray-900">{{ comparison.sister2.name }}</h3>
          <p class="text-gray-600 text-sm">{{ comparison.sister2.subtitle }}</p>
        </div>
        
        <!-- Result Image -->
        <div class="mb-4">
          <img 
            :src="comparison.sister2.resultImage"
            :alt="`${comparison.sister2.name}'s approach result`"
            class="w-full h-48 object-cover rounded-lg shadow-sm"
          />
        </div>
        
        <!-- Approach Details -->
        <div class="space-y-4">
          <div v-if="comparison.sister2.techniques?.length">
            <h4 class="font-semibold text-gray-900 mb-2">Techniques Used</h4>
            <ul class="space-y-1">
              <li v-for="technique in comparison.sister2.techniques" :key="technique" 
                  class="text-sm text-gray-600 flex items-center gap-2">
                <svg class="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                {{ technique }}
              </li>
            </ul>
          </div>
          
          <div v-if="comparison.sister2.materials?.length">
            <h4 class="font-semibold text-gray-900 mb-2">Key Materials</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="material in comparison.sister2.materials" :key="material"
                    class="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">
                {{ material }}
              </span>
            </div>
          </div>
          
          <div class="bg-pink-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-900 mb-2">Why This Approach?</h4>
            <p class="text-sm text-gray-700">{{ comparison.sister2.reasoning }}</p>
          </div>
          
          <!-- Stats -->
          <div class="grid grid-cols-2 gap-4 text-center">
            <div v-if="comparison.sister2.timeSpent" class="bg-gray-50 p-3 rounded-lg">
              <div class="text-lg font-semibold text-gray-900">{{ comparison.sister2.timeSpent }}</div>
              <div class="text-xs text-gray-500">Time Spent</div>
            </div>
            <div v-if="comparison.sister2.difficulty" class="bg-gray-50 p-3 rounded-lg">
              <div class="text-lg font-semibold text-gray-900">{{ comparison.sister2.difficulty }}</div>
              <div class="text-xs text-gray-500">Difficulty</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bottom Insights -->
    <div v-if="comparison.insights" class="p-6 bg-gray-50 border-t">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">What We Learned</h3>
      <div class="grid md:grid-cols-2 gap-4">
        <div v-for="insight in comparison.insights" :key="insight.title" 
             class="bg-white p-4 rounded-lg shadow-sm">
          <h4 class="font-medium text-gray-900 mb-2">{{ insight.title }}</h4>
          <p class="text-sm text-gray-600">{{ insight.description }}</p>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div v-if="comparison.tutorialUrl || comparison.patternUrl" 
         class="p-6 border-t bg-white text-center">
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button 
          v-if="comparison.tutorialUrl"
          @click="$emit('viewTutorial', comparison.tutorialUrl)"
          class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          View Full Tutorial
        </button>
        <button 
          v-if="comparison.patternUrl"
          @click="$emit('downloadPattern', comparison.patternUrl)"
          class="border border-purple-600 text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
        >
          Download Pattern
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  comparison: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.title && 
             value.sister1 && value.sister1.name && 
             value.sister2 && value.sister2.name
    }
  }
})

defineEmits(['viewTutorial', 'downloadPattern'])
</script>