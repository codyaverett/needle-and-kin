<template>
  <div :class="[
    'inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all',
    badgeClasses,
    size === 'sm' ? 'px-2 py-1 text-xs' : '',
    size === 'lg' ? 'px-4 py-3 text-base' : ''
  ]">
    <!-- Skill Level Icon -->
    <div class="flex items-center gap-1">
      <svg 
        v-for="i in 3" 
        :key="i"
        :class="[
          'w-3 h-3',
          size === 'sm' ? 'w-2.5 h-2.5' : '',
          size === 'lg' ? 'w-4 h-4' : '',
          i <= levelNumber ? 'fill-current' : 'fill-current opacity-30'
        ]" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    </div>
    
    <!-- Level Text -->
    <span>{{ levelText }}</span>
    
    <!-- Optional Craft Type -->
    <span v-if="craftType" :class="[
      'px-2 py-0.5 rounded text-xs bg-black bg-opacity-20',
      size === 'sm' ? 'px-1.5 py-0.5 text-xs' : ''
    ]">
      {{ craftType }}
    </span>
    
    <!-- Optional Time Estimate -->
    <div v-if="timeEstimate" class="flex items-center gap-1 text-xs opacity-90">
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
      </svg>
      <span>{{ timeEstimate }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  level: {
    type: String,
    required: true,
    validator: (value) => ['beginner', 'intermediate', 'advanced'].includes(value.toLowerCase())
  },
  craftType: {
    type: String,
    default: ''
  },
  timeEstimate: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outline', 'subtle'].includes(value)
  },
  showIcon: {
    type: Boolean,
    default: true
  }
})

const levelNumber = computed(() => {
  const levels = {
    beginner: 1,
    intermediate: 2,
    advanced: 3
  }
  return levels[props.level.toLowerCase()] || 1
})

const levelText = computed(() => {
  const level = props.level.toLowerCase()
  return level.charAt(0).toUpperCase() + level.slice(1)
})

const badgeClasses = computed(() => {
  const level = props.level.toLowerCase()
  const variant = props.variant
  
  const baseClasses = {
    beginner: {
      default: 'bg-green-100 text-green-800 border border-green-200',
      outline: 'border-2 border-green-500 text-green-700 bg-transparent',
      subtle: 'bg-green-50 text-green-700'
    },
    intermediate: {
      default: 'bg-yellow-100 text-yellow-800 border border-yellow-200', 
      outline: 'border-2 border-yellow-500 text-yellow-700 bg-transparent',
      subtle: 'bg-yellow-50 text-yellow-700'
    },
    advanced: {
      default: 'bg-red-100 text-red-800 border border-red-200',
      outline: 'border-2 border-red-500 text-red-700 bg-transparent', 
      subtle: 'bg-red-50 text-red-700'
    }
  }
  
  return baseClasses[level]?.[variant] || baseClasses.beginner.default
})
</script>