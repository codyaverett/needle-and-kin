<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="relative">
        <img
          :src="tutorial.coverImage || '/placeholder-tutorial.jpg'"
          :alt="tutorial.title"
          class="w-full h-64 object-cover"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div class="flex items-center gap-3 mb-2">
            <span :class="difficultyClass" class="px-3 py-1 text-xs font-semibold rounded-full">
              {{ tutorial.difficulty }}
            </span>
            <span class="text-sm">{{ tutorial.category }}</span>
            <span v-if="tutorial.estimatedTime" class="text-sm flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ tutorial.estimatedTime }}
            </span>
          </div>
          <h1 class="text-3xl font-bold mb-2">{{ tutorial.title }}</h1>
          <p class="text-sm opacity-90">{{ tutorial.description }}</p>
        </div>
      </div>

      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <img
              v-if="tutorial.author.avatar"
              :src="tutorial.author.avatar"
              :alt="tutorial.author.name"
              class="w-10 h-10 rounded-full"
            >
            <div v-else class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span class="text-sm font-semibold text-gray-600">
                {{ tutorial.author.name.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ tutorial.author.name }}</p>
              <p class="text-sm text-gray-500">Tutorial Author</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ tutorial.completions }}</p>
              <p class="text-xs text-gray-500">Completed</p>
            </div>
            <div v-if="tutorial.rating" class="text-center">
              <div class="flex items-center gap-1">
                <svg
                  v-for="i in 5"
                  :key="i"
                  :class="[
                    'w-5 h-5',
                    i <= Math.round(tutorial.rating) ? 'text-yellow-400' : 'text-gray-300'
                  ]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ tutorial.rating.toFixed(1) }} rating</p>
            </div>
          </div>
        </div>

        <div v-if="tutorial.prerequisites.length > 0" class="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h3 class="font-semibold text-yellow-900 mb-2">Prerequisites</h3>
          <ul class="list-disc list-inside text-sm text-yellow-800 space-y-1">
            <li v-for="(prereq, index) in tutorial.prerequisites" :key="index">
              {{ prereq }}
            </li>
          </ul>
        </div>

        <div v-if="tutorial.materials.length > 0" class="mb-6">
          <h3 class="font-semibold text-gray-900 mb-3">Materials Needed</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="material in tutorial.materials"
              :key="material.id"
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div class="flex-grow">
                <p class="font-medium text-sm text-gray-900">
                  {{ material.name }}
                  <span v-if="material.optional" class="text-xs text-gray-500">(optional)</span>
                </p>
                <p class="text-xs text-gray-600">
                  {{ material.quantity }}
                  <span v-if="material.unit">{{ material.unit }}</span>
                </p>
              </div>
              <a
                v-if="material.link"
                :href="material.link"
                target="_blank"
                rel="noopener noreferrer"
                class="text-teal-600 hover:text-teal-700"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div v-if="tutorial.skillsLearned.length > 0" class="mb-6">
          <h3 class="font-semibold text-gray-900 mb-3">Skills You'll Learn</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(skill, index) in tutorial.skillsLearned"
              :key="index"
              class="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <TutorialProgress
          :tutorial="tutorial"
          :current-step="currentStepIndex"
          :completed-steps="completedSteps"
          @step-selected="selectStep"
        />

        <div class="mt-6 border-t pt-6">
          <TutorialStep
            :step="currentStep"
            :step-number="currentStepIndex + 1"
            :total-steps="tutorial.steps.length"
            :is-completed="completedSteps.includes(currentStepIndex)"
            @complete="markStepComplete"
            @next="nextStep"
            @previous="previousStep"
          />
        </div>

        <div class="mt-6 flex items-center justify-between">
          <TutorialBookmark
            :tutorial-id="tutorial.id"
            :is-bookmarked="isBookmarked"
            @toggle="toggleBookmark"
          />

          <div class="flex items-center gap-4">
            <button
              @click="$emit('rate', tutorial.id)"
              class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Rate Tutorial
            </button>

            <button
              v-if="allStepsCompleted"
              @click="$emit('complete', tutorial.id)"
              class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Complete Tutorial
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Tutorial, TutorialStep as TutorialStepType } from '~/types/projects';

const props = defineProps<{
  tutorial: Tutorial;
  progress?: {
    currentStep: number;
    completedSteps: number[];
    bookmarked: boolean;
  };
}>();

const emit = defineEmits<{
  stepComplete: [stepIndex: number];
  tutorialComplete: [];
  bookmark: [tutorialId: string];
  rate: [tutorialId: string];
  complete: [tutorialId: string];
}>();

const currentStepIndex = ref(props.progress?.currentStep || 0);
const completedSteps = ref<number[]>(props.progress?.completedSteps || []);
const isBookmarked = ref(props.progress?.bookmarked || false);

const currentStep = computed(() => props.tutorial.steps[currentStepIndex.value]);

const allStepsCompleted = computed(() => {
  return completedSteps.value.length === props.tutorial.steps.length;
});

const difficultyClass = computed(() => {
  switch (props.tutorial.difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
});

const selectStep = (index: number) => {
  currentStepIndex.value = index;
};

const markStepComplete = () => {
  if (!completedSteps.value.includes(currentStepIndex.value)) {
    completedSteps.value.push(currentStepIndex.value);
    emit('stepComplete', currentStepIndex.value);
  }
  if (currentStepIndex.value < props.tutorial.steps.length - 1) {
    nextStep();
  } else if (allStepsCompleted.value) {
    emit('tutorialComplete');
  }
};

const nextStep = () => {
  if (currentStepIndex.value < props.tutorial.steps.length - 1) {
    currentStepIndex.value++;
  }
};

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
  }
};

const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value;
  emit('bookmark', props.tutorial.id);
};
</script>