<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
    <div class="relative aspect-[4/3] overflow-hidden">
      <img
        :src="project.coverImage || project.images[0] || '/placeholder-project.jpg'"
        :alt="project.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      >
      <div class="absolute top-2 right-2 flex gap-2">
        <span
          :class="difficultyClass"
          class="px-2 py-1 text-xs font-semibold rounded-full capitalize"
        >
          {{ project.difficulty }}
        </span>
        <span
          v-if="project.status === 'completed'"
          class="bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold rounded-full"
        >
          Completed
        </span>
      </div>
      <div v-if="project.progress > 0 && project.progress < 100" class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
        <div class="bg-gray-200 rounded-full h-2">
          <div
            :style="{ width: `${project.progress}%` }"
            class="bg-teal-500 h-2 rounded-full transition-all duration-300"
          />
        </div>
        <span class="text-white text-xs mt-1 block">{{ project.progress }}% Complete</span>
      </div>
    </div>

    <div class="p-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-gray-500 uppercase tracking-wide">{{ project.category }}</span>
        <div class="flex items-center gap-2 text-gray-500">
          <span class="flex items-center gap-1 text-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ project.views }}
          </span>
          <span class="flex items-center gap-1 text-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {{ project.likes }}
          </span>
        </div>
      </div>

      <NuxtLink :to="`/projects/${project.id}`" class="block group">
        <h3 class="font-bold text-lg mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
          {{ project.title }}
        </h3>
      </NuxtLink>

      <p class="text-gray-600 text-sm mb-3 line-clamp-2">
        {{ project.description }}
      </p>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img
            v-if="project.userAvatar"
            :src="project.userAvatar"
            :alt="project.username"
            class="w-6 h-6 rounded-full"
          >
          <div v-else class="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
            <span class="text-xs text-gray-600">{{ project.username?.charAt(0)?.toUpperCase() || 'U' }}</span>
          </div>
          <span class="text-sm text-gray-600">{{ project.username || 'Anonymous' }}</span>
        </div>

        <div v-if="project.estimatedTime" class="flex items-center gap-1 text-xs text-gray-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ project.estimatedTime }}
        </div>
      </div>

      <div v-if="project.tags.length > 0" class="mt-3 flex flex-wrap gap-1">
        <span
          v-for="tag in project.tags.slice(0, 3)"
          :key="tag"
          class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
        >
          {{ tag }}
        </span>
        <span v-if="project.tags.length > 3" class="text-xs text-gray-500">
          +{{ project.tags.length - 3 }} more
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Project } from '~/types/projects';

const props = defineProps<{
  project: Project;
}>();

const difficultyClass = computed(() => {
  switch (props.project.difficulty) {
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
</script>