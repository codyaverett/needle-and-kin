<template>
  <div class="bg-white rounded-lg shadow-sm p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-lg">Project Progress</h3>
      <span class="text-sm text-gray-500">{{ completedSteps }} of {{ totalSteps }} steps</span>
    </div>

    <div class="relative">
      <div class="bg-gray-200 rounded-full h-3 mb-4">
        <div
          :style="{ width: `${progressPercentage}%` }"
          class="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full transition-all duration-500 relative"
        >
          <span
            v-if="progressPercentage > 0"
            class="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-teal-600 rounded-full"
          />
        </div>
      </div>

      <div class="flex justify-between text-sm mb-4">
        <span class="text-gray-600">Started {{ formatDate(project.createdAt) }}</span>
        <span class="font-semibold text-teal-600">{{ progressPercentage }}%</span>
      </div>
    </div>

    <div class="space-y-2 max-h-64 overflow-y-auto">
      <div
        v-for="(step, index) in project.steps"
        :key="step.id"
        class="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <button
          @click="toggleStep(index)"
          :class="[
            'flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200',
            completedStepsSet.has(index)
              ? 'bg-teal-600 border-teal-600'
              : currentStep === index
              ? 'border-teal-600 bg-white'
              : 'border-gray-300 bg-white hover:border-teal-400'
          ]"
          :aria-label="`Mark step ${index + 1} as ${completedStepsSet.has(index) ? 'incomplete' : 'complete'}`"
        >
          <svg
            v-if="completedStepsSet.has(index)"
            class="w-full h-full p-1 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        <div class="flex-grow">
          <div class="flex items-start justify-between">
            <div>
              <h4
                :class="[
                  'font-medium text-sm',
                  completedStepsSet.has(index) ? 'text-gray-500 line-through' : 'text-gray-900'
                ]"
              >
                Step {{ index + 1 }}: {{ step.title }}
              </h4>
              <p
                v-if="showDescriptions"
                :class="[
                  'text-xs mt-1',
                  completedStepsSet.has(index) ? 'text-gray-400' : 'text-gray-600'
                ]"
              >
                {{ step.description.substring(0, 100) }}{{ step.description.length > 100 ? '...' : '' }}
              </p>
            </div>
            <span
              v-if="step.duration"
              class="text-xs text-gray-500 flex items-center gap-1"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ step.duration }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t flex justify-between items-center">
      <button
        @click="showDescriptions = !showDescriptions"
        class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        {{ showDescriptions ? 'Hide' : 'Show' }} descriptions
      </button>

      <div class="flex gap-2">
        <button
          v-if="progressPercentage === 100"
          @click="markIncomplete"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
        >
          Mark Incomplete
        </button>
        <button
          v-else
          @click="markComplete"
          class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
        >
          Mark Complete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Project } from '~/types/projects';

const props = defineProps<{
  project: Project;
  completedSteps?: number[];
  currentStep?: number;
}>();

const emit = defineEmits<{
  updateProgress: [progress: number, completedSteps: number[]];
  stepToggled: [stepIndex: number, completed: boolean];
  projectCompleted: [];
}>();

const showDescriptions = ref(false);
const completedStepsSet = ref(new Set(props.completedSteps || []));
const currentStep = ref(props.currentStep || 0);

const totalSteps = computed(() => props.project.steps.length);
const completedSteps = computed(() => completedStepsSet.value.size);
const progressPercentage = computed(() => {
  if (totalSteps.value === 0) return 0;
  return Math.round((completedSteps.value / totalSteps.value) * 100);
});

const toggleStep = (index: number) => {
  if (completedStepsSet.value.has(index)) {
    completedStepsSet.value.delete(index);
    emit('stepToggled', index, false);
  } else {
    completedStepsSet.value.add(index);
    emit('stepToggled', index, true);
    
    if (currentStep.value === index && index < totalSteps.value - 1) {
      currentStep.value = index + 1;
    }
  }
  
  emit('updateProgress', progressPercentage.value, Array.from(completedStepsSet.value));
  
  if (completedSteps.value === totalSteps.value) {
    emit('projectCompleted');
  }
};

const markComplete = () => {
  for (let i = 0; i < totalSteps.value; i++) {
    completedStepsSet.value.add(i);
  }
  emit('updateProgress', 100, Array.from(completedStepsSet.value));
  emit('projectCompleted');
};

const markIncomplete = () => {
  completedStepsSet.value.clear();
  currentStep.value = 0;
  emit('updateProgress', 0, []);
};

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};
</script>