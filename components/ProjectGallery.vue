<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = selectedCategory === cat ? null : cat"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedCategory === cat
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <div class="flex items-center gap-4">
        <select
          v-model="selectedDifficulty"
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select
          v-model="sortBy"
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
          <option value="views">Most Viewed</option>
          <option value="completed">Recently Completed</option>
        </select>

        <div class="flex gap-2">
          <button
            @click="viewMode = 'grid'"
            :class="[
              'p-2 rounded-lg transition-colors',
              viewMode === 'grid'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
            aria-label="Grid view"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            @click="viewMode = 'list'"
            :class="[
              'p-2 rounded-lg transition-colors',
              viewMode === 'list'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
            aria-label="List view"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="filteredProjects.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
      <p class="text-gray-500">Try adjusting your filters or create the first project!</p>
      <NuxtLink
        to="/projects/create"
        class="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Project
      </NuxtLink>
    </div>

    <div
      v-else
      :class="[
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      ]"
    >
      <template v-if="viewMode === 'grid'">
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
        />
      </template>
      <template v-else>
        <ProjectListItem
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
        />
      </template>
    </div>

    <div v-if="showLoadMore" class="text-center mt-8">
      <button
        @click="loadMore"
        :disabled="loading"
        class="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
      >
        <span v-if="!loading">Load More Projects</span>
        <span v-else>Loading...</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Project } from '~/types/projects';

const props = withDefaults(defineProps<{
  projects: Project[];
  categories?: string[];
  initialLimit?: number;
  showLoadMore?: boolean;
}>(), {
  categories: () => ['Knitting', 'Sewing', 'Crochet', 'Embroidery', 'Quilting'],
  initialLimit: 12,
  showLoadMore: true
});

const emit = defineEmits<{
  loadMore: [];
}>();

const selectedCategory = ref<string | null>(null);
const selectedDifficulty = ref<string>('');
const sortBy = ref<string>('recent');
const viewMode = ref<'grid' | 'list'>('grid');
const loading = ref(false);

const filteredProjects = computed(() => {
  let filtered = [...props.projects];

  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.category === selectedCategory.value);
  }

  if (selectedDifficulty.value) {
    filtered = filtered.filter(p => p.difficulty === selectedDifficulty.value);
  }

  switch (sortBy.value) {
    case 'popular':
      filtered.sort((a, b) => b.likes - a.likes);
      break;
    case 'views':
      filtered.sort((a, b) => b.views - a.views);
      break;
    case 'completed':
      filtered = filtered.filter(p => p.status === 'completed');
      filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      break;
    case 'recent':
    default:
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  return filtered;
});

const loadMore = async () => {
  loading.value = true;
  emit('loadMore');
  setTimeout(() => {
    loading.value = false;
  }, 500);
};
</script>