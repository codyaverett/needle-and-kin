import { defineStore } from 'pinia';
import type { Tutorial, TutorialProgress } from '~/types/projects';

interface TutorialsState {
  tutorials: Tutorial[];
  currentTutorial: Tutorial | null;
  progress: Map<string, TutorialProgress>;
  loading: boolean;
  error: string | null;
  filters: {
    category: string | null;
    difficulty: string | null;
    search: string;
    sortBy: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const useTutorialsStore = defineStore('tutorials', {
  state: (): TutorialsState => ({
    tutorials: [],
    currentTutorial: null,
    progress: new Map(),
    loading: false,
    error: null,
    filters: {
      category: null,
      difficulty: null,
      search: '',
      sortBy: 'popular'
    },
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0
    }
  }),

  getters: {
    filteredTutorials: (state) => state.tutorials,
    
    beginnerTutorials: (state) =>
      state.tutorials.filter(t => t.difficulty === 'beginner'),
    
    popularTutorials: (state) =>
      state.tutorials.sort((a, b) => b.views - a.views).slice(0, 6),
    
    completedTutorials: (state) => {
      const completed: Tutorial[] = [];
      state.progress.forEach((prog, tutorialId) => {
        if (prog.completedAt) {
          const tutorial = state.tutorials.find(t => t.id === tutorialId);
          if (tutorial) completed.push(tutorial);
        }
      });
      return completed;
    },
    
    bookmarkedTutorials: (state) => {
      const bookmarked: Tutorial[] = [];
      state.progress.forEach((prog, tutorialId) => {
        if (prog.bookmarked) {
          const tutorial = state.tutorials.find(t => t.id === tutorialId);
          if (tutorial) bookmarked.push(tutorial);
        }
      });
      return bookmarked;
    },

    getTutorialProgress: (state) => (tutorialId: string): TutorialProgress | undefined => {
      return state.progress.get(tutorialId);
    }
  },

  actions: {
    async fetchTutorials() {
      this.loading = true;
      this.error = null;
      
      try {
        const query = new URLSearchParams();
        if (this.filters.category) query.append('category', this.filters.category);
        if (this.filters.difficulty) query.append('difficulty', this.filters.difficulty);
        if (this.filters.search) query.append('search', this.filters.search);
        query.append('sortBy', this.filters.sortBy);
        query.append('page', this.pagination.page.toString());
        query.append('limit', this.pagination.limit.toString());
        
        const { data } = await $fetch(`/api/tutorials?${query.toString()}`);
        
        this.tutorials = data.tutorials;
        this.pagination = {
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages
        };
      } catch (error) {
        this.error = 'Failed to fetch tutorials';
        console.error('Error fetching tutorials:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchTutorial(id: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const tutorial = await $fetch(`/api/tutorials/${id}`);
        this.currentTutorial = tutorial;
        return tutorial;
      } catch (error) {
        this.error = 'Failed to fetch tutorial';
        console.error('Error fetching tutorial:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    startTutorial(tutorialId: string, userId: string) {
      if (!this.progress.has(tutorialId)) {
        this.progress.set(tutorialId, {
          tutorialId,
          userId,
          currentStep: 0,
          completedSteps: [],
          startedAt: new Date(),
          bookmarked: false
        });
      }
    },

    updateStepProgress(tutorialId: string, stepIndex: number) {
      const progress = this.progress.get(tutorialId);
      if (progress) {
        if (!progress.completedSteps.includes(stepIndex)) {
          progress.completedSteps.push(stepIndex);
        }
        progress.currentStep = Math.min(stepIndex + 1, this.currentTutorial?.steps.length || 0);
        
        const tutorial = this.tutorials.find(t => t.id === tutorialId) || this.currentTutorial;
        if (tutorial && progress.completedSteps.length === tutorial.steps.length) {
          progress.completedAt = new Date();
          tutorial.completions++;
        }
        
        this.progress.set(tutorialId, progress);
      }
    },

    toggleBookmark(tutorialId: string, userId: string) {
      let progress = this.progress.get(tutorialId);
      
      if (!progress) {
        progress = {
          tutorialId,
          userId,
          currentStep: 0,
          completedSteps: [],
          startedAt: new Date(),
          bookmarked: true
        };
      } else {
        progress.bookmarked = !progress.bookmarked;
      }
      
      this.progress.set(tutorialId, progress);
    },

    async rateTutorial(tutorialId: string, rating: number) {
      try {
        const tutorial = this.tutorials.find(t => t.id === tutorialId) || this.currentTutorial;
        if (tutorial) {
          tutorial.rating = rating;
        }
      } catch (error) {
        console.error('Error rating tutorial:', error);
        throw error;
      }
    },

    updateFilters(filters: Partial<TutorialsState['filters']>) {
      this.filters = { ...this.filters, ...filters };
      this.pagination.page = 1;
      this.fetchTutorials();
    },

    changePage(page: number) {
      this.pagination.page = page;
      this.fetchTutorials();
    },

    resetFilters() {
      this.filters = {
        category: null,
        difficulty: null,
        search: '',
        sortBy: 'popular'
      };
      this.pagination.page = 1;
      this.fetchTutorials();
    }
  }
});