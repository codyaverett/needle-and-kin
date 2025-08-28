import { defineStore } from 'pinia';
import type { Achievement, UserAchievement } from '~/types/projects';

interface AchievementsState {
  achievements: Achievement[];
  userAchievements: Map<string, UserAchievement>;
  showcased: string[];
  loading: boolean;
  error: string | null;
  totalPoints: number;
  notifications: Achievement[];
}

export const useAchievementsStore = defineStore('achievements', {
  state: (): AchievementsState => ({
    achievements: [],
    userAchievements: new Map(),
    showcased: [],
    loading: false,
    error: null,
    totalPoints: 0,
    notifications: []
  }),

  getters: {
    unlockedAchievements: (state) =>
      state.achievements.filter(a => a.unlockedAt),
    
    lockedAchievements: (state) =>
      state.achievements.filter(a => !a.unlockedAt),
    
    achievementsByCategory: (state) => {
      const grouped = new Map<string, Achievement[]>();
      state.achievements.forEach(achievement => {
        const category = achievement.category;
        if (!grouped.has(category)) {
          grouped.set(category, []);
        }
        grouped.get(category)?.push(achievement);
      });
      return grouped;
    },
    
    showcasedAchievements: (state) =>
      state.achievements.filter(a => state.showcased.includes(a.id)),
    
    recentAchievements: (state) =>
      state.achievements
        .filter(a => a.unlockedAt)
        .sort((a, b) => {
          const dateA = new Date(a.unlockedAt!).getTime();
          const dateB = new Date(b.unlockedAt!).getTime();
          return dateB - dateA;
        })
        .slice(0, 5),
    
    progressAchievements: (state) =>
      state.achievements.filter(a => !a.unlockedAt && (a.progress || 0) > 0)
  },

  actions: {
    async fetchAchievements() {
      this.loading = true;
      this.error = null;
      
      try {
        const { data } = await $fetch('/api/achievements');
        
        this.achievements = data.achievements;
        this.totalPoints = data.totalPoints;
        
        data.achievements.forEach(achievement => {
          if (achievement.unlockedAt) {
            this.userAchievements.set(achievement.id, {
              userId: 'current-user',
              achievementId: achievement.id,
              unlockedAt: achievement.unlockedAt,
              progress: achievement.progress || 0,
              showcased: this.showcased.includes(achievement.id)
            });
          }
        });
      } catch (error) {
        this.error = 'Failed to fetch achievements';
        console.error('Error fetching achievements:', error);
      } finally {
        this.loading = false;
      }
    },

    updateProgress(achievementId: string, progress: number) {
      const achievement = this.achievements.find(a => a.id === achievementId);
      if (achievement) {
        achievement.progress = progress;
        
        if (achievement.maxProgress && progress >= achievement.maxProgress) {
          this.unlockAchievement(achievementId);
        }
      }
    },

    unlockAchievement(achievementId: string) {
      const achievement = this.achievements.find(a => a.id === achievementId);
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date();
        achievement.progress = achievement.maxProgress || 1;
        
        this.userAchievements.set(achievementId, {
          userId: 'current-user',
          achievementId,
          unlockedAt: achievement.unlockedAt,
          progress: achievement.progress,
          showcased: false
        });
        
        this.totalPoints += achievement.points;
        this.notifications.push(achievement);
        
        setTimeout(() => {
          const index = this.notifications.indexOf(achievement);
          if (index > -1) {
            this.notifications.splice(index, 1);
          }
        }, 5000);
      }
    },

    updateShowcase(showcasedIds: string[]) {
      this.showcased = showcasedIds;
      
      this.userAchievements.forEach((userAchievement, id) => {
        userAchievement.showcased = showcasedIds.includes(id);
      });
    },

    checkAchievementProgress(type: string, value: number) {
      this.achievements.forEach(achievement => {
        if (achievement.requirement.type === type && !achievement.unlockedAt) {
          const progress = Math.min(value, achievement.requirement.value);
          this.updateProgress(achievement.id, progress);
        }
      });
    },

    dismissNotification(achievementId: string) {
      const index = this.notifications.findIndex(a => a.id === achievementId);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    }
  }
});