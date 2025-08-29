<template>
  <button
    @click="handleToggle"
    :class="[
      'group relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
      isBookmarked
        ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    ]"
    :aria-label="isBookmarked ? 'Remove bookmark' : 'Add bookmark'"
  >
    <svg
      :class="[
        'w-5 h-5 transition-transform duration-200',
        isBookmarked ? 'scale-110' : 'group-hover:scale-110'
      ]"
      :fill="isBookmarked ? 'currentColor' : 'none'"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      />
    </svg>
    <span class="font-medium">
      {{ isBookmarked ? 'Bookmarked' : 'Bookmark' }}
    </span>

    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showTooltip"
        class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none"
      >
        {{ tooltipText }}
        <div class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div class="w-2 h-2 bg-gray-800 rotate-45" />
        </div>
      </div>
    </Transition>

    <div
      v-if="animating"
      class="absolute inset-0 pointer-events-none"
    >
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <svg
          class="w-6 h-6 text-teal-600 animate-ping"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  tutorialId: string;
  isBookmarked: boolean;
}>();

const emit = defineEmits<{
  toggle: [tutorialId: string, bookmarked: boolean];
}>();

const showTooltip = ref(false);
const animating = ref(false);

const tooltipText = computed(() => {
  return props.isBookmarked
    ? 'Remove from bookmarks'
    : 'Save for later';
});

const handleToggle = () => {
  animating.value = true;
  emit('toggle', props.tutorialId, !props.isBookmarked);
  
  setTimeout(() => {
    animating.value = false;
  }, 300);
  
  showTooltip.value = true;
  setTimeout(() => {
    showTooltip.value = false;
  }, 1500);
};
</script>