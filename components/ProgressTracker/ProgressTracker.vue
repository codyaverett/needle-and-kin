<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">{{ title }}</h3>
          <p v-if="description" class="text-indigo-100 text-sm mt-1">{{ description }}</p>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold">{{ completedSteps }}/{{ totalSteps }}</div>
          <div class="text-sm opacity-90">{{ progressPercentage }}% Complete</div>
        </div>
      </div>
      
      <!-- Overall Progress Bar -->
      <div class="mt-4">
        <div class="bg-white/20 rounded-full h-3">
          <div 
            :style="{ width: progressPercentage + '%' }"
            class="bg-white rounded-full h-3 transition-all duration-500 ease-out"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- Steps List -->
    <div class="p-4">
      <div class="space-y-4">
        <div
          v-for="(step, index) in steps"
          :key="step.id || index"
          :class="[
            'flex items-start gap-4 p-3 rounded-lg transition-all',
            step.isCompleted ? 'bg-green-50' : step.isActive ? 'bg-blue-50' : 'bg-gray-50'
          ]"
        >
          <!-- Step Number/Status -->
          <div class="flex-shrink-0">
            <div 
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                step.isCompleted 
                  ? 'bg-green-500 text-white' 
                  : step.isActive 
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-600'
              ]"
            >
              <svg v-if="step.isCompleted" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </div>
          </div>
          
          <!-- Step Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 
                  :class="[
                    'font-medium',
                    step.isCompleted ? 'text-green-800' : step.isActive ? 'text-blue-800' : 'text-gray-900'
                  ]"
                >
                  {{ step.title }}
                </h4>
                <p v-if="step.description" class="text-sm text-gray-600 mt-1">
                  {{ step.description }}
                </p>
                
                <!-- Step Details -->
                <div v-if="step.details?.length" class="mt-2 space-y-1">
                  <div
                    v-for="detail in step.details"
                    :key="detail"
                    class="text-xs text-gray-500 flex items-center gap-1"
                  >
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    {{ detail }}
                  </div>
                </div>
                
                <!-- Time Estimate -->
                <div v-if="step.timeEstimate" class="mt-2 flex items-center gap-1 text-xs text-gray-500">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                  </svg>
                  <span>{{ step.timeEstimate }}</span>
                </div>
                
                <!-- Resources -->
                <div v-if="step.resources?.length" class="mt-3 flex flex-wrap gap-2">
                  <button
                    v-for="resource in step.resources"
                    :key="resource.title"
                    @click="$emit('openResource', resource)"
                    class="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                  >
                    {{ resource.title }}
                  </button>
                </div>
              </div>
              
              <!-- Step Actions -->
              <div class="flex flex-col gap-2 ml-4">
                <button
                  v-if="!step.isCompleted && step.isActive"
                  @click="$emit('markComplete', step.id || index)"
                  class="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                >
                  Mark Complete
                </button>
                
                <button
                  v-if="step.isCompleted && allowReset"
                  @click="$emit('markIncomplete', step.id || index)"
                  class="px-3 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500 transition-colors"
                >
                  Reset
                </button>
                
                <button
                  v-if="step.tutorialUrl"
                  @click="$emit('openTutorial', step.tutorialUrl)"
                  class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                >
                  Tutorial
                </button>
              </div>
            </div>
            
            <!-- Step Notes -->
            <div v-if="step.notes" class="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <div class="flex items-start gap-2">
                <svg class="w-3 h-3 mt-0.5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <span class="text-yellow-800">{{ step.notes }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer Actions -->
    <div v-if="showActions" class="p-4 bg-gray-50 border-t">
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          v-if="showResetAll && completedSteps > 0"
          @click="$emit('resetAll')"
          class="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Reset All Progress
        </button>
        
        <button
          v-if="showCertificate && progressPercentage === 100"
          @click="$emit('generateCertificate')"
          class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clip-rule="evenodd"/>
          </svg>
          Get Certificate
        </button>
        
        <button
          v-if="showShare"
          @click="$emit('shareProgress')"
          class="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
          </svg>
          Share Progress
        </button>
      </div>
    </div>
    
    <!-- Congratulations Message -->
    <div v-if="progressPercentage === 100" class="p-4 bg-green-100 border-t border-green-200">
      <div class="flex items-center gap-3">
        <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <div>
          <h4 class="font-semibold text-green-800">Congratulations! 🎉</h4>
          <p class="text-sm text-green-700">You've completed all steps in {{ title }}!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  steps: {
    type: Array,
    required: true,
    default: () => []
  },
  allowReset: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showResetAll: {
    type: Boolean,
    default: true
  },
  showCertificate: {
    type: Boolean,
    default: true
  },
  showShare: {
    type: Boolean,
    default: true
  }
})

defineEmits([
  'markComplete',
  'markIncomplete', 
  'openResource',
  'openTutorial',
  'resetAll',
  'generateCertificate',
  'shareProgress'
])

const completedSteps = computed(() => {
  return props.steps.filter(step => step.isCompleted).length
})

const totalSteps = computed(() => {
  return props.steps.length
})

const progressPercentage = computed(() => {
  if (totalSteps.value === 0) return 0
  return Math.round((completedSteps.value / totalSteps.value) * 100)
})
</script>