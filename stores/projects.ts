import { defineStore } from 'pinia';
import type { Project } from '~/types/projects';

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  filters: {
    category: string | null;
    difficulty: string | null;
    status: string | null;
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

export const useProjectsStore = defineStore('projects', {
  state: (): ProjectsState => ({
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
    filters: {
      category: null,
      difficulty: null,
      status: null,
      search: '',
      sortBy: 'recent'
    },
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0
    }
  }),

  getters: {
    filteredProjects: (state) => state.projects,
    
    userProjects: (state) => (userId: string) => 
      state.projects.filter(p => p.userId === userId),
    
    featuredProjects: (state) => 
      state.projects.filter(p => p.likes > 50).slice(0, 4),
    
    completedProjects: (state) =>
      state.projects.filter(p => p.status === 'completed'),
    
    inProgressProjects: (state) =>
      state.projects.filter(p => p.status === 'in_progress')
  },

  actions: {
    async fetchProjects() {
      this.loading = true;
      this.error = null;
      
      try {
        const query = new URLSearchParams();
        if (this.filters.category) query.append('category', this.filters.category);
        if (this.filters.difficulty) query.append('difficulty', this.filters.difficulty);
        if (this.filters.status) query.append('status', this.filters.status);
        if (this.filters.search) query.append('search', this.filters.search);
        query.append('sortBy', this.filters.sortBy);
        query.append('page', this.pagination.page.toString());
        query.append('limit', this.pagination.limit.toString());
        
        const { data } = await $fetch(`/api/projects?${query.toString()}`);
        
        this.projects = data.projects;
        this.pagination = {
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages
        };
      } catch (error) {
        this.error = 'Failed to fetch projects';
        console.error('Error fetching projects:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchProject(id: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const project = await $fetch(`/api/projects/${id}`);
        this.currentProject = project;
        return project;
      } catch (error) {
        this.error = 'Failed to fetch project';
        console.error('Error fetching project:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createProject(projectData: Partial<Project>) {
      this.loading = true;
      this.error = null;
      
      try {
        const { data } = await $fetch('/api/projects', {
          method: 'POST',
          body: projectData
        });
        
        this.projects.unshift(data.project);
        return data.project;
      } catch (error) {
        this.error = 'Failed to create project';
        console.error('Error creating project:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProject(id: string, updates: Partial<Project>) {
      this.loading = true;
      this.error = null;
      
      try {
        const { data } = await $fetch(`/api/projects/${id}`, {
          method: 'PUT',
          body: updates
        });
        
        const index = this.projects.findIndex(p => p.id === id);
        if (index !== -1) {
          this.projects[index] = { ...this.projects[index], ...updates };
        }
        
        if (this.currentProject?.id === id) {
          this.currentProject = { ...this.currentProject, ...updates };
        }
        
        return data;
      } catch (error) {
        this.error = 'Failed to update project';
        console.error('Error updating project:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async toggleLike(projectId: string) {
      try {
        const { data } = await $fetch(`/api/projects/${projectId}/like`, {
          method: 'POST'
        });
        
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
          project.likes = data.likes;
        }
        
        if (this.currentProject?.id === projectId) {
          this.currentProject.likes = data.likes;
        }
        
        return data;
      } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
      }
    },

    updateFilters(filters: Partial<ProjectsState['filters']>) {
      this.filters = { ...this.filters, ...filters };
      this.pagination.page = 1;
      this.fetchProjects();
    },

    changePage(page: number) {
      this.pagination.page = page;
      this.fetchProjects();
    },

    resetFilters() {
      this.filters = {
        category: null,
        difficulty: null,
        status: null,
        search: '',
        sortBy: 'recent'
      };
      this.pagination.page = 1;
      this.fetchProjects();
    }
  }
});