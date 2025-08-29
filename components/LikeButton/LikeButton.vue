<template>
  <button
    @click="handleClick"
    :disabled="isLoading"
    :class="[
      'group relative inline-flex items-center space-x-1 transition-all duration-200',
      isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700',
      size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : '',
      showCount ? '' : 'p-2',
      className
    ]"
    :aria-label="`${isLiked ? 'Unlike' : 'Like'} this post`"
  >
    <!-- Heart Icon -->
    <svg
      :class="[
        'transition-all duration-200',
        size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5',
        isLiked ? 'fill-current scale-110' : 'group-hover:scale-110',
        isAnimating ? 'animate-heartbeat' : ''
      ]"
      :fill="isLiked ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>

    <!-- Like Count -->
    <span
      v-if="showCount"
      :class="[
        'font-medium transition-all duration-200',
        isLiked ? 'text-red-500' : '',
        size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
      ]"
    >
      {{ formatCount(localLikeCount) }}
    </span>

    <!-- Floating Hearts Animation -->
    <div
      v-if="showAnimation && isAnimating"
      class="absolute inset-0 pointer-events-none"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="absolute animate-float-heart"
        :style="{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 0.5}s`,
          fontSize: `${Math.random() * 10 + 10}px`
        }"
      >
        ❤️
      </div>
    </div>

    <!-- Tooltip -->
    <div
      v-if="showTooltip"
      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
    >
      {{ isLiked ? 'Unlike' : 'Like' }}
    </div>

    <!-- Ripple Effect -->
    <span
      v-if="showRipple"
      :class="[
        'absolute inset-0 rounded-full bg-current opacity-0',
        isAnimating ? 'animate-ripple' : ''
      ]"
    ></span>
  </button>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  postId: {
    type: [String, Number],
    required: true
  },
  initialLiked: {
    type: Boolean,
    default: false
  },
  initialCount: {
    type: Number,
    default: 0
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  showCount: {
    type: Boolean,
    default: true
  },
  showTooltip: {
    type: Boolean,
    default: false
  },
  showAnimation: {
    type: Boolean,
    default: true
  },
  showRipple: {
    type: Boolean,
    default: false
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

const emit = defineEmits(['like', 'unlike', 'require-auth'])

const isLiked = ref(props.initialLiked)
const localLikeCount = ref(props.initialCount)
const isLoading = ref(false)
const isAnimating = ref(false)

// Watch for prop changes
watch(() => props.initialLiked, (newVal) => {
  isLiked.value = newVal
})

watch(() => props.initialCount, (newVal) => {
  localLikeCount.value = newVal
})

const formatCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
}

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
  }, 600)

  // Optimistic UI update
  const wasLiked = isLiked.value
  isLiked.value = !isLiked.value
  localLikeCount.value += isLiked.value ? 1 : -1

  isLoading.value = true

  try {
    // Call API
    const response = await $fetch(`/api/posts/${props.postId}/likes`, {
      method: 'POST'
    })

    if (response.success) {
      // Update with server data
      isLiked.value = response.liked
      localLikeCount.value = response.likeCount

      // Emit event
      emit(response.liked ? 'like' : 'unlike', {
        postId: props.postId,
        liked: response.liked,
        count: response.likeCount
      })
    } else {
      // Revert on error
      isLiked.value = wasLiked
      localLikeCount.value += wasLiked ? 1 : -1
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    // Revert on error
    isLiked.value = wasLiked
    localLikeCount.value += wasLiked ? 1 : -1
    
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
@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1.1);
  }
}

@keyframes float-heart {
  0% {
    transform: translateY(0) scale(0);
    opacity: 1;
  }
  15% {
    transform: translateY(-20px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.animate-heartbeat {
  animation: heartbeat 0.6s ease-in-out;
}

.animate-float-heart {
  animation: float-heart 2s ease-out;
}

.animate-ripple {
  animation: ripple 0.6s ease-out;
}
</style>