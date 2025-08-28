<template>
  <button
    @click="handleClick"
    :disabled="isLoading"
    :class="[
      'group relative inline-flex items-center space-x-1 transition-all duration-200',
      isFavorited ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700',
      size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : '',
      className
    ]"
    :aria-label="`${isFavorited ? 'Remove from' : 'Add to'} favorites`"
  >
    <!-- Bookmark Icon -->
    <svg
      :class="[
        'transition-all duration-200',
        size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5',
        isFavorited ? 'fill-current' : '',
        isAnimating ? 'animate-bookmark' : ''
      ]"
      :fill="isFavorited ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      />
    </svg>

    <!-- Label -->
    <span
      v-if="showLabel"
      :class="[
        'font-medium transition-all duration-200',
        size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
      ]"
    >
      {{ isFavorited ? 'Saved' : 'Save' }}
    </span>

    <!-- Success Checkmark Animation -->
    <div
      v-if="showSuccessAnimation && justSaved"
      class="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div class="animate-checkmark bg-purple-600 rounded-full p-2">
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>

    <!-- Tooltip -->
    <div
      v-if="showTooltip && !showLabel"
      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
    >
      {{ isFavorited ? 'Remove from favorites' : 'Add to favorites' }}
    </div>
  </button>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  postId: {
    type: [String, Number],
    required: true
  },
  initialFavorited: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  showTooltip: {
    type: Boolean,
    default: true
  },
  showSuccessAnimation: {
    type: Boolean,
    default: true
  },
  authenticated: {
    type: Boolean,
    default: true
  },
  className: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['favorite', 'unfavorite', 'require-auth'])

const isFavorited = ref(props.initialFavorited)
const isLoading = ref(false)
const isAnimating = ref(false)
const justSaved = ref(false)

// Watch for prop changes
watch(() => props.initialFavorited, (newVal) => {
  isFavorited.value = newVal
})

const handleClick = async () => {
  // Check authentication
  if (!props.authenticated) {
    emit('require-auth')
    return
  }

  if (isLoading.value) return

  // Start animation
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 300)

  // Optimistic UI update
  const wasFavorited = isFavorited.value
  isFavorited.value = !isFavorited.value

  if (!wasFavorited && props.showSuccessAnimation) {
    justSaved.value = true
    setTimeout(() => {
      justSaved.value = false
    }, 1000)
  }

  isLoading.value = true

  try {
    // Call API
    const endpoint = isFavorited.value 
      ? `/api/posts/${props.postId}/favorite`
      : `/api/posts/${props.postId}/unfavorite`
    
    const response = await $fetch(endpoint, {
      method: 'POST'
    })

    if (response.success) {
      // Update with server data
      isFavorited.value = response.favorited

      // Emit event
      emit(response.favorited ? 'favorite' : 'unfavorite', {
        postId: props.postId,
        favorited: response.favorited
      })
    } else {
      // Revert on error
      isFavorited.value = wasFavorited
      justSaved.value = false
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    // Revert on error
    isFavorited.value = wasFavorited
    justSaved.value = false
    
    // Check if it's an auth error
    if (error.status === 401) {
      emit('require-auth')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes bookmark {
  0% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(0.9) rotate(-5deg);
  }
  75% {
    transform: scale(1.1) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

@keyframes checkmark {
  0% {
    transform: scale(0) rotate(45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(45deg);
    opacity: 1;
  }
  100% {
    transform: scale(0) rotate(45deg);
    opacity: 0;
  }
}

.animate-bookmark {
  animation: bookmark 0.3s ease-in-out;
}

.animate-checkmark {
  animation: checkmark 1s ease-in-out;
}
</style>