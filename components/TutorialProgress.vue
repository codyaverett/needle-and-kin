<template>
  <div class="bg-gray-50 rounded-lg p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-gray-900">Tutorial Progress</h3>
      <span class="text-sm text-gray-600">
        {{ completedStepsCount }}/{{ tutorial.steps.length }} steps completed
      </span>
    </div>

    <div class="relative mb-4">
      <div class="bg-gray-200 rounded-full h-2">
        <div
          :style="{ width: `${progressPercentage}%` }"
          class="bg-teal-600 h-2 rounded-full transition-all duration-500"
        />
      </div>
    </div>

    <div class="space-y-1 max-h-48 overflow-y-auto">
      <button
        v-for="(step, index) in tutorial.steps"
        :key="step.id"
        @click="$emit('step-selected', index)"
        :class="[
          'w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-3',
          currentStep === index
            ? 'bg-teal-100 text-teal-900'
            : completedSteps.includes(index)
            ? 'bg-white text-gray-600 hover:bg-gray-100'
            : 'bg-white text-gray-900 hover:bg-gray-100'
        ]"
      >
        <div
          :class="[
            'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
            completedSteps.includes(index)
              ? 'bg-green-500 text-white'
              : currentStep === index
              ? 'bg-teal-600 text-white'
              : 'bg-gray-300 text-gray-600'
          ]"
        >
          <svg
            v-if="completedSteps.includes(index)"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span v-else>{{ index + 1 }}</span>
        </div>

        <div class="flex-grow min-w-0">
          <p
            :class="[
              'text-sm font-medium truncate',
              completedSteps.includes(index) ? 'line-through' : ''
            ]"
          >
            {{ step.title }}
          </p>
          <p
            v-if="step.duration"
            class="text-xs text-gray-500"
          >
            {{ step.duration }}
          </p>
        </div>

        <svg
          v-if="currentStep === index"
          class="w-4 h-4 text-teal-600 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <div v-if="allCompleted" class="mt-4 p-3 bg-green-100 rounded-lg">
      <div class="flex items-center gap-2 text-green-800">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-medium">Congratulations! Tutorial completed!</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Tutorial } from '~/types/projects';

const props = defineProps<{
  tutorial: Tutorial;
  currentStep: number;
  completedSteps: number[];
}>();

const emit = defineEmits<{
  'step-selected': [stepIndex: number];
}>();

const completedStepsCount = computed(() => props.completedSteps.length);

const progressPercentage = computed(() => {
  if (props.tutorial.steps.length === 0) return 0;
  return Math.round((completedStepsCount.value / props.tutorial.steps.length) * 100);
});

const allCompleted = computed(() => {
  return completedStepsCount.value === props.tutorial.steps.length;
});
</script>