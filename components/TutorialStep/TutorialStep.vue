<template>
  <div class="bg-white rounded-lg">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">
        Step {{ stepNumber }} of {{ totalSteps }}: {{ step.title }}
      </h2>
      <span
        v-if="isCompleted"
        class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Completed
      </span>
    </div>

    <div v-if="step.videoUrl" class="mb-6">
      <div class="aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          :src="step.videoUrl"
          class="w-full h-full"
          allowfullscreen
        />
      </div>
    </div>

    <div v-if="step.images && step.images.length > 0" class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <img
          v-for="(image, index) in step.images"
          :key="index"
          :src="image"
          :alt="`Step ${stepNumber} image ${index + 1}`"
          class="w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          @click="openImageModal(image)"
        >
      </div>
    </div>

    <div class="prose prose-gray max-w-none mb-6">
      <div v-html="step.content" />
    </div>

    <div v-if="step.tips && step.tips.length > 0" class="mb-6 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-semibold text-blue-900 mb-2 flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Pro Tips
      </h3>
      <ul class="list-disc list-inside text-sm text-blue-800 space-y-1">
        <li v-for="(tip, index) in step.tips" :key="index">
          {{ tip }}
        </li>
      </ul>
    </div>

    <div v-if="step.checkpoints && step.checkpoints.length > 0" class="mb-6">
      <h3 class="font-semibold text-gray-900 mb-3">Checkpoints</h3>
      <div class="space-y-2">
        <label
          v-for="(checkpoint, index) in step.checkpoints"
          :key="index"
          class="flex items-start gap-3 cursor-pointer group"
        >
          <input
            type="checkbox"
            v-model="checkedCheckpoints[index]"
            class="mt-0.5 w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
          >
          <span
            :class="[
              'text-sm',
              checkedCheckpoints[index] ? 'text-gray-500 line-through' : 'text-gray-700'
            ]"
          >
            {{ checkpoint }}
          </span>
        </label>
      </div>
    </div>

    <div v-if="step.duration" class="mb-6 flex items-center gap-2 text-sm text-gray-600">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Estimated time: {{ step.duration }}</span>
    </div>

    <div class="flex items-center justify-between pt-6 border-t">
      <button
        @click="$emit('previous')"
        :disabled="stepNumber === 1"
        class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Previous Step
      </button>

      <div class="flex items-center gap-3">
        <button
          v-if="!isCompleted"
          @click="markComplete"
          :disabled="!allCheckpointsComplete"
          class="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Mark as Complete
        </button>
        <span v-else class="text-green-600 font-medium">
          Step Completed!
        </span>

        <button
          @click="$emit('next')"
          :disabled="stepNumber === totalSteps"
          class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="selectedImage"
        @click="selectedImage = null"
        class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      >
        <img
          :src="selectedImage"
          class="max-w-full max-h-full rounded-lg"
          @click.stop
        >
        <button
          @click="selectedImage = null"
          class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TutorialStep } from '~/types/projects';

const props = defineProps<{
  step: TutorialStep;
  stepNumber: number;
  totalSteps: number;
  isCompleted: boolean;
}>();

const emit = defineEmits<{
  complete: [];
  next: [];
  previous: [];
}>();

const selectedImage = ref<string | null>(null);
const checkedCheckpoints = ref<boolean[]>(
  props.step.checkpoints?.map(() => false) || []
);

const allCheckpointsComplete = computed(() => {
  if (!props.step.checkpoints || props.step.checkpoints.length === 0) {
    return true;
  }
  return checkedCheckpoints.value.every(checked => checked);
});

const openImageModal = (image: string) => {
  selectedImage.value = image;
};

const markComplete = () => {
  emit('complete');
};
</script>