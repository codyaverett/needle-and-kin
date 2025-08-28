export interface Material {
  id: string;
  name: string;
  quantity: string;
  unit?: string;
  optional?: boolean;
  link?: string;
}

export interface ProjectStep {
  id: string;
  number: number;
  title: string;
  description: string;
  images?: string[];
  duration?: string;
  tips?: string[];
}

export interface Project {
  id: string;
  userId: string;
  username?: string;
  userAvatar?: string;
  title: string;
  description: string;
  images: string[];
  coverImage: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  materials: Material[];
  steps: ProjectStep[];
  progress: number;
  status: 'planning' | 'in_progress' | 'completed';
  tags: string[];
  likes: number;
  views: number;
  estimatedTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: TutorialStep[];
  materials: Material[];
  estimatedTime: string;
  skillsLearned: string[];
  prerequisites: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes: number;
  views: number;
  completions: number;
  rating?: number;
  tags: string[];
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TutorialStep {
  id: string;
  number: number;
  title: string;
  content: string;
  images?: string[];
  videoUrl?: string;
  duration?: string;
  tips?: string[];
  checkpoints?: string[];
}

export interface TutorialProgress {
  tutorialId: string;
  userId: string;
  currentStep: number;
  completedSteps: number[];
  startedAt: Date;
  completedAt?: Date;
  bookmarked: boolean;
}

export type AchievementCategory = 
  | 'participation'
  | 'creation' 
  | 'social'
  | 'learning'
  | 'streak';

export type AchievementRarity = 
  | 'common'
  | 'rare'
  | 'epic'
  | 'legendary';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number;
  requirement: {
    type: string;
    value: number;
  };
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number;
  showcased: boolean;
}