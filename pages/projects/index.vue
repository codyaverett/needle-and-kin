<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Community Projects</h1>
      <p class="text-gray-600">Discover amazing crafting projects from our creative community</p>
    </div>

    <ProjectGallery
      :projects="projectsStore.filteredProjects"
      :categories="categories"
      :show-load-more="hasMoreProjects"
      @load-more="loadMoreProjects"
    />

    <div
      v-if="projectsStore.loading"
      class="flex justify-center py-8"
    >
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProjectsStore } from '~/stores/projects';

const projectsStore = useProjectsStore();

const categories = ['Knitting', 'Sewing', 'Crochet', 'Embroidery', 'Quilting'];

const hasMoreProjects = computed(() => {
  return projectsStore.pagination.page < projectsStore.pagination.totalPages;
});

const loadMoreProjects = () => {
  projectsStore.changePage(projectsStore.pagination.page + 1);
};

onMounted(() => {
  projectsStore.fetchProjects();
});
</script>