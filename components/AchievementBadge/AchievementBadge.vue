<template>
  <div
    :class="[
      'relative group',
      size === 'sm' ? 'w-12 h-12' : size === 'md' ? 'w-16 h-16' : 'w-20 h-20'
    ]"
  >
    <div
      :class="[
        'relative w-full h-full rounded-full flex items-center justify-center transition-all duration-300',
        achievement.unlockedAt
          ? rarityClass
          : 'bg-gray-200 opacity-50',
        hoverable && achievement.unlockedAt ? 'group-hover:scale-110' : ''
      ]"
    >
      <div
        v-if="achievement.unlockedAt && showAnimation"
        class="absolute inset-0 rounded-full animate-ping"
        :class="rarityPingClass"
      />
      
      <div
        :class="[
          'text-2xl',
          achievement.unlockedAt ? '' : 'grayscale opacity-50'
        ]"
      >
        {{ achievement.icon }}
      </div>

      <div
        v-if="achievement.rarity === 'legendary' && achievement.unlockedAt"
        class="absolute inset-0 rounded-full"
      >
        <div class="absolute inset-0 rounded-full animate-pulse opacity-50 bg-gradient-to-r from-yellow-400 to-orange-400" />
        <svg
          class="absolute inset-0 w-full h-full animate-spin-slow"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="url(#gradient)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-dasharray="5 10"
            opacity="0.5"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FCD34D" />
              <stop offset="100%" stop-color="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>

    <div
      v-if="showProgress && achievement.maxProgress"
      class="absolute -bottom-2 left-0 right-0"
    >
      <div class="bg-gray-200 rounded-full h-1.5 mx-2">
        <div
          :style="{ width: `${progressPercentage}%` }"
          class="bg-teal-600 h-1.5 rounded-full transition-all duration-500"
        />
      </div>
    </div>

    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showTooltip"
        class="absolute z-10 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg"
      >
        <div class="font-semibold mb-1">{{ achievement.name }}</div>
        <div class="text-gray-300">{{ achievement.description }}</div>
        <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
          <span :class="rarityTextClass" class="text-xs font-medium capitalize">
            {{ achievement.rarity }}
          </span>
          <span class="text-yellow-400">{{ achievement.points }} pts</span>
        </div>
        <div
          v-if="achievement.unlockedAt"
          class="text-gray-400 text-xs mt-1"
        >
          Unlocked {{ formatDate(achievement.unlockedAt) }}
        </div>
        <div
          v-else-if="achievement.maxProgress"
          class="text-gray-400 text-xs mt-1"
        >
          Progress: {{ achievement.progress || 0 }}/{{ achievement.maxProgress }}
        </div>
        <div class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div class="w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Achievement } from '~/types/projects';

const props = withDefaults(defineProps<{
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  hoverable?: boolean;
  animate?: boolean;
}>(), {
  size: 'md',
  showProgress: true,
  hoverable: true,
  animate: true
});

const showTooltip = ref(false);
const showAnimation = ref(false);

const progressPercentage = computed(() => {
  if (!props.achievement.maxProgress) return 0;
  return Math.round(((props.achievement.progress || 0) / props.achievement.maxProgress) * 100);
});

const rarityClass = computed(() => {
  switch (props.achievement.rarity) {
    case 'common':
      return 'bg-gray-300 border-2 border-gray-400';
    case 'rare':
      return 'bg-blue-400 border-2 border-blue-500';
    case 'epic':
      return 'bg-purple-400 border-2 border-purple-500';
    case 'legendary':
      return 'bg-gradient-to-br from-yellow-400 to-orange-400 border-2 border-yellow-500';
    default:
      return 'bg-gray-300 border-2 border-gray-400';
  }
});

const rarityPingClass = computed(() => {
  switch (props.achievement.rarity) {
    case 'common':
      return 'bg-gray-400';
    case 'rare':
      return 'bg-blue-400';
    case 'epic':
      return 'bg-purple-400';
    case 'legendary':
      return 'bg-yellow-400';
    default:
      return 'bg-gray-400';
  }
});

const rarityTextClass = computed(() => {
  switch (props.achievement.rarity) {
    case 'common':
      return 'text-gray-400';
    case 'rare':
      return 'text-blue-400';
    case 'epic':
      return 'text-purple-400';
    case 'legendary':
      return 'text-yellow-400';
    default:
      return 'text-gray-400';
  }
});

const formatDate = (date: Date) => {
  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return d.toLocaleDateString();
};

onMounted(() => {
  if (props.animate && props.achievement.unlockedAt) {
    const unlockedDate = new Date(props.achievement.unlockedAt);
    const now = new Date();
    const diffMinutes = (now.getTime() - unlockedDate.getTime()) / (1000 * 60);
    
    if (diffMinutes < 5) {
      showAnimation.value = true;
      setTimeout(() => {
        showAnimation.value = false;
      }, 3000);
    }
  }
});

const mouseEnter = () => {
  if (props.hoverable) {
    showTooltip.value = true;
  }
};

const mouseLeave = () => {
  showTooltip.value = false;
};
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 10s linear infinite;
}
</style>