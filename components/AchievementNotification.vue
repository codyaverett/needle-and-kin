<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-500"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="isVisible"
        class="fixed top-20 right-4 z-50 max-w-sm"
      >
        <div
          :class="[
            'bg-white rounded-lg shadow-2xl overflow-hidden',
            rarityBorderClass
          ]"
        >
          <div class="relative">
            <div
              :class="[
                'h-2',
                rarityGradientClass
              ]"
            />
            <div
              v-if="achievement.rarity === 'legendary'"
              class="absolute inset-0 h-2"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 animate-shimmer" />
            </div>
          </div>

          <div class="p-6">
            <div class="flex items-center gap-4">
              <div class="relative">
                <div class="absolute inset-0 animate-ping rounded-full" :class="rarityPingClass" />
                <AchievementBadge
                  :achievement="achievement"
                  size="lg"
                  :show-progress="false"
                  :hoverable="false"
                  :animate="false"
                />
              </div>

              <div class="flex-grow">
                <p class="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Achievement Unlocked!
                </p>
                <h3 class="text-xl font-bold text-gray-900 mt-1">
                  {{ achievement.name }}
                </h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ achievement.description }}
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between mt-4 pt-4 border-t">
              <div class="flex items-center gap-3">
                <span :class="rarityTextClass" class="text-sm font-semibold capitalize">
                  {{ achievement.rarity }}
                </span>
                <span class="text-sm text-gray-500">•</span>
                <span class="text-sm font-semibold text-yellow-600">
                  +{{ achievement.points }} points
                </span>
              </div>
              
              <button
                @click="handleShare"
                class="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
              >
                Share
              </button>
            </div>

            <div
              v-if="achievement.rarity === 'legendary'"
              class="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg"
            >
              <p class="text-sm font-medium text-yellow-900">
                🎉 Legendary achievement! You're among the elite few!
              </p>
            </div>
          </div>

          <button
            @click="close"
            class="absolute top-2 right-2 p-1 rounded-full bg-white bg-opacity-90 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mt-4 flex justify-center">
          <div class="flex gap-1">
            <span
              v-for="i in 5"
              :key="i"
              :class="[
                'w-2 h-2 rounded-full transition-all duration-300',
                i === 1 ? 'bg-gray-600' : 'bg-gray-300'
              ]"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Achievement } from '~/types/projects';

const props = defineProps<{
  achievement: Achievement;
  duration?: number;
}>();

const emit = defineEmits<{
  close: [];
  share: [achievement: Achievement];
}>();

const isVisible = ref(false);

const rarityBorderClass = computed(() => {
  switch (props.achievement.rarity) {
    case 'common':
      return 'border-2 border-gray-300';
    case 'rare':
      return 'border-2 border-blue-400';
    case 'epic':
      return 'border-2 border-purple-400';
    case 'legendary':
      return 'border-2 border-yellow-400';
    default:
      return 'border-2 border-gray-300';
  }
});

const rarityGradientClass = computed(() => {
  switch (props.achievement.rarity) {
    case 'common':
      return 'bg-gradient-to-r from-gray-300 to-gray-400';
    case 'rare':
      return 'bg-gradient-to-r from-blue-300 to-blue-500';
    case 'epic':
      return 'bg-gradient-to-r from-purple-300 to-purple-500';
    case 'legendary':
      return 'bg-gradient-to-r from-yellow-300 to-orange-400';
    default:
      return 'bg-gradient-to-r from-gray-300 to-gray-400';
  }
});

const rarityPingClass = computed(() => {
  switch (props.achievement.rarity) {
    case 'common':
      return 'bg-gray-400 opacity-30';
    case 'rare':
      return 'bg-blue-400 opacity-30';
    case 'epic':
      return 'bg-purple-400 opacity-30';
    case 'legendary':
      return 'bg-yellow-400 opacity-30';
    default:
      return 'bg-gray-400 opacity-30';
  }
});

const rarityTextClass = computed(() => {
  switch (props.achievement.rarity) {
    case 'common':
      return 'text-gray-600';
    case 'rare':
      return 'text-blue-600';
    case 'epic':
      return 'text-purple-600';
    case 'legendary':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
});

const close = () => {
  isVisible.value = false;
  setTimeout(() => {
    emit('close');
  }, 300);
};

const handleShare = () => {
  emit('share', props.achievement);
};

onMounted(() => {
  isVisible.value = true;
  
  if (props.duration) {
    setTimeout(() => {
      close();
    }, props.duration);
  }
});
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>