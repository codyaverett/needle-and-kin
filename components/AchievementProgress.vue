<template>
  <div class="bg-white rounded-lg shadow-sm p-4">
    <div class="flex items-start gap-4">
      <AchievementBadge
        :achievement="achievement"
        :size="compact ? 'sm' : 'md'"
        :show-progress="false"
        :hoverable="false"
      />

      <div class="flex-grow">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="font-semibold text-gray-900">{{ achievement.name }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ achievement.description }}</p>
          </div>
          <div class="text-right">
            <span class="text-lg font-bold text-teal-600">
              {{ achievement.progress || 0 }}
            </span>
            <span class="text-sm text-gray-500">/{{ achievement.maxProgress }}</span>
          </div>
        </div>

        <div class="mt-3">
          <div class="bg-gray-200 rounded-full h-2">
            <div
              :style="{ width: `${progressPercentage}%` }"
              :class="[
                'h-2 rounded-full transition-all duration-500',
                progressBarClass
              ]"
            />
          </div>
          <div class="flex items-center justify-between mt-2">
            <span class="text-xs text-gray-500">
              {{ progressPercentage }}% Complete
            </span>
            <span
              v-if="achievement.points"
              class="text-xs font-medium text-yellow-600"
            >
              {{ achievement.points }} points
            </span>
          </div>
        </div>

        <div
          v-if="!achievement.unlockedAt && progressPercentage >= 75"
          class="mt-3 p-2 bg-yellow-50 rounded-lg"
        >
          <p class="text-xs text-yellow-800 font-medium">
            Almost there! {{ achievement.maxProgress - (achievement.progress || 0) }} more to unlock!
          </p>
        </div>

        <div
          v-if="showDetails"
          class="mt-3 pt-3 border-t border-gray-100"
        >
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">Category</span>
            <span class="font-medium capitalize">{{ achievement.category }}</span>
          </div>
          <div class="flex items-center justify-between text-sm mt-1">
            <span class="text-gray-500">Rarity</span>
            <span :class="rarityTextClass" class="font-medium capitalize">
              {{ achievement.rarity }}
            </span>
          </div>
          <div
            v-if="achievement.requirement"
            class="flex items-center justify-between text-sm mt-1"
          >
            <span class="text-gray-500">Requirement</span>
            <span class="font-medium">
              {{ achievement.requirement.type }}: {{ achievement.requirement.value }}
            </span>
          </div>
        </div>

        <div
          v-if="achievement.unlockedAt"
          class="mt-3 p-2 bg-green-50 rounded-lg"
        >
          <div class="flex items-center gap-2 text-green-800">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm font-medium">
              Unlocked {{ formatDate(achievement.unlockedAt) }}!
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Achievement } from '~/types/projects';

const props = withDefaults(defineProps<{
  achievement: Achievement;
  showDetails?: boolean;
  compact?: boolean;
}>(), {
  showDetails: false,
  compact: false
});

const progressPercentage = computed(() => {
  if (!props.achievement.maxProgress) return 0;
  const progress = Math.round(((props.achievement.progress || 0) / props.achievement.maxProgress) * 100);
  return Math.min(progress, 100);
});

const progressBarClass = computed(() => {
  if (props.achievement.unlockedAt) {
    return 'bg-green-500';
  }
  if (progressPercentage.value >= 75) {
    return 'bg-yellow-500';
  }
  if (progressPercentage.value >= 50) {
    return 'bg-teal-500';
  }
  return 'bg-gray-400';
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

const formatDate = (date: Date) => {
  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return d.toLocaleDateString();
};
</script>