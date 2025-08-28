<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Learn & Create</h1>
      <p class="text-gray-600">Step-by-step tutorials to master new crafting skills</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="tutorial in tutorialsStore.filteredTutorials"
        :key="tutorial.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <NuxtLink :to="`/tutorials/${tutorial.id}`">
          <img
            :src="tutorial.coverImage"
            :alt="tutorial.title"
            class="w-full h-48 object-cover rounded-t-lg"
          >
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-gray-500 uppercase">{{ tutorial.category }}</span>
              <span
                :class="getDifficultyClass(tutorial.difficulty)"
                class="px-2 py-1 text-xs font-semibold rounded-full capitalize"
              >
                {{ tutorial.difficulty }}
              </span>
            </div>
            <h3 class="font-bold text-lg mb-2">{{ tutorial.title }}</h3>
            <p class="text-gray-600 text-sm mb-4">{{ tutorial.description }}</p>
            <div class="flex items-center justify-between text-sm text-gray-500">
              <span>{{ tutorial.estimatedTime }}</span>
              <div class="flex items-center gap-2">
                <span>{{ tutorial.completions }} completed</span>
                <span v-if="tutorial.rating" class="flex items-center gap-1">
                  ⭐ {{ tutorial.rating.toFixed(1) }}
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div
      v-if="tutorialsStore.loading"
      class="flex justify-center py-8"
    >
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTutorialsStore } from '~/stores/tutorials';

const tutorialsStore = useTutorialsStore();

const getDifficultyClass = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

onMounted(() => {
  tutorialsStore.fetchTutorials();
});
</script>