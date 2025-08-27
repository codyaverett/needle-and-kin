<template>
  <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
    <!-- Header -->
    <div class="text-center mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-gray-600">{{ subtitle }}</p>
    </div>
    
    <!-- Main Counter Display -->
    <div class="text-center mb-8">
      <div class="relative">
        <!-- Progress Ring (if target is set) -->
        <div v-if="target > 0" class="absolute inset-0 flex items-center justify-center">
          <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <!-- Background circle -->
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              stroke-width="6"
            />
            <!-- Progress circle -->
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              :stroke="progressColor"
              stroke-width="6"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="progressOffset"
              class="transition-all duration-500 ease-out"
            />
          </svg>
        </div>
        
        <!-- Counter Number -->
        <div :class="[
          'relative z-10 flex items-center justify-center',
          target > 0 ? 'w-32 h-32' : 'w-24 h-24'
        ]">
          <span :class="[
            'font-bold select-none',
            target > 0 ? 'text-4xl' : 'text-3xl',
            countColor
          ]">
            {{ currentCount }}
          </span>
        </div>
      </div>
      
      <!-- Target Display -->
      <div v-if="target > 0" class="mt-4">
        <div class="text-sm text-gray-600">
          Goal: {{ target }} {{ unit }}
        </div>
        <div class="text-xs text-gray-500 mt-1">
          {{ remainingCount }} remaining
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            :style="{ width: progressPercentage + '%' }"
            :class="['h-2 rounded-full transition-all duration-500', progressBarColor]"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- Counter Controls -->
    <div class="flex items-center justify-center gap-4 mb-6">
      <!-- Decrease Button -->
      <button
        @click="decrease"
        :disabled="currentCount <= 0"
        :class="[
          'w-14 h-14 rounded-full text-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
          currentCount <= 0 
            ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
            : 'bg-red-100 text-red-600 hover:bg-red-200 active:scale-95 focus:ring-red-500'
        ]"
      >
        −
      </button>
      
      <!-- Count Display -->
      <div class="flex flex-col items-center mx-4">
        <div class="text-xs text-gray-500 uppercase tracking-wide mb-1">{{ unit }}</div>
        <div class="text-2xl font-bold text-gray-800 tabular-nums min-w-[3rem] text-center">
          {{ currentCount }}
        </div>
      </div>
      
      <!-- Increase Button -->
      <button
        @click="increase"
        :disabled="target > 0 && currentCount >= target"
        :class="[
          'w-14 h-14 rounded-full text-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
          target > 0 && currentCount >= target
            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
            : 'bg-green-100 text-green-600 hover:bg-green-200 active:scale-95 focus:ring-green-500'
        ]"
      >
        +
      </button>
    </div>
    
    <!-- Quick Actions -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="increment in quickIncrements"
        :key="increment"
        @click="addCount(increment)"
        :disabled="target > 0 && (currentCount + increment) > target"
        class="flex-1 px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        +{{ increment }}
      </button>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex flex-col gap-3">
      <div class="flex gap-2">
        <button
          @click="reset"
          class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Reset
        </button>
        
        <button
          v-if="showSave"
          @click="$emit('save', currentCount)"
          class="flex-1 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
        >
          Save
        </button>
      </div>
      
      <!-- Goal Achievement -->
      <div v-if="target > 0 && currentCount >= target" class="text-center p-3 bg-green-100 rounded-lg">
        <div class="flex items-center justify-center gap-2">
          <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span class="text-green-800 font-medium">Goal Achieved! 🎉</span>
        </div>
      </div>
    </div>
    
    <!-- Statistics (if enabled) -->
    <div v-if="showStats && stats" class="mt-6 pt-4 border-t border-gray-200">
      <h4 class="text-sm font-semibold text-gray-700 mb-3">Session Stats</h4>
      <div class="grid grid-cols-2 gap-4 text-center">
        <div>
          <div class="text-lg font-bold text-gray-900">{{ stats.totalIncrements || 0 }}</div>
          <div class="text-xs text-gray-500">Total Adds</div>
        </div>
        <div>
          <div class="text-lg font-bold text-gray-900">{{ formatTime(stats.duration || 0) }}</div>
          <div class="text-xs text-gray-500">Duration</div>
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
    default: 'Stitch Counter'
  },
  subtitle: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Number,
    default: 0
  },
  target: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'stitches'
  },
  quickIncrements: {
    type: Array,
    default: () => [5, 10, 20]
  },
  showSave: {
    type: Boolean,
    default: false
  },
  showStats: {
    type: Boolean,
    default: false
  },
  stats: {
    type: Object,
    default: () => ({
      totalIncrements: 0,
      duration: 0 // in seconds
    })
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'reset', 'goalAchieved'])

const currentCount = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const remainingCount = computed(() => {
  if (props.target <= 0) return 0
  return Math.max(0, props.target - currentCount.value)
})

const progressPercentage = computed(() => {
  if (props.target <= 0) return 0
  return Math.min(100, Math.round((currentCount.value / props.target) * 100))
})

const circumference = computed(() => 2 * Math.PI * 45) // radius is 45

const progressOffset = computed(() => {
  const progress = progressPercentage.value / 100
  return circumference.value * (1 - progress)
})

const progressColor = computed(() => {
  const percentage = progressPercentage.value
  if (percentage < 25) return '#ef4444' // red
  if (percentage < 50) return '#f59e0b' // yellow
  if (percentage < 75) return '#3b82f6' // blue
  return '#10b981' // green
})

const progressBarColor = computed(() => {
  const percentage = progressPercentage.value
  if (percentage < 25) return 'bg-red-400'
  if (percentage < 50) return 'bg-yellow-400'
  if (percentage < 75) return 'bg-blue-400'
  return 'bg-green-400'
})

const countColor = computed(() => {
  if (props.target > 0 && currentCount.value >= props.target) return 'text-green-600'
  return 'text-gray-800'
})

const increase = () => {
  if (props.target > 0 && currentCount.value >= props.target) return
  const newCount = currentCount.value + 1
  currentCount.value = newCount
  
  if (props.target > 0 && newCount >= props.target) {
    emit('goalAchieved', newCount)
  }
}

const decrease = () => {
  if (currentCount.value <= 0) return
  currentCount.value = Math.max(0, currentCount.value - 1)
}

const addCount = (amount) => {
  if (props.target > 0 && (currentCount.value + amount) > props.target) return
  const newCount = currentCount.value + amount
  currentCount.value = newCount
  
  if (props.target > 0 && newCount >= props.target) {
    emit('goalAchieved', newCount)
  }
}

const reset = () => {
  currentCount.value = 0
  emit('reset')
}

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}
</script>