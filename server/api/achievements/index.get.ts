import { defineEventHandler, getQuery } from 'h3';
import jwt from 'jsonwebtoken';
import type { Achievement } from '~/types/projects';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const allAchievements: Achievement[] = [
  {
    id: 'first-post',
    name: 'First Steps',
    description: 'Share your first project with the community',
    icon: '✨',
    category: 'participation',
    rarity: 'common',
    points: 10,
    requirement: {
      type: 'posts',
      value: 1
    },
    maxProgress: 1
  },
  {
    id: 'prolific-creator',
    name: 'Prolific Creator',
    description: 'Share 10 projects with the community',
    icon: '🎨',
    category: 'creation',
    rarity: 'rare',
    points: 50,
    requirement: {
      type: 'posts',
      value: 10
    },
    maxProgress: 10
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Follow 25 crafters in the community',
    icon: '🦋',
    category: 'social',
    rarity: 'common',
    points: 15,
    requirement: {
      type: 'following',
      value: 25
    },
    maxProgress: 25
  },
  {
    id: 'tutorial-master',
    name: 'Tutorial Master',
    description: 'Complete 5 tutorials',
    icon: '📚',
    category: 'learning',
    rarity: 'rare',
    points: 40,
    requirement: {
      type: 'tutorials_completed',
      value: 5
    },
    maxProgress: 5
  },
  {
    id: 'week-streak',
    name: 'Consistent Crafter',
    description: 'Log in for 7 consecutive days',
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
    points: 20,
    requirement: {
      type: 'login_streak',
      value: 7
    },
    maxProgress: 7
  },
  {
    id: 'legendary-artisan',
    name: 'Legendary Artisan',
    description: 'Complete 50 projects and earn 1000 likes',
    icon: '👑',
    category: 'creation',
    rarity: 'legendary',
    points: 200,
    requirement: {
      type: 'combined',
      value: 50
    },
    maxProgress: 50
  },
  {
    id: 'helpful-hand',
    name: 'Helpful Hand',
    description: 'Leave 50 helpful comments on other projects',
    icon: '🤝',
    category: 'social',
    rarity: 'epic',
    points: 75,
    requirement: {
      type: 'comments',
      value: 50
    },
    maxProgress: 50
  },
  {
    id: 'quick-learner',
    name: 'Quick Learner',
    description: 'Complete your first tutorial',
    icon: '🎓',
    category: 'learning',
    rarity: 'common',
    points: 15,
    requirement: {
      type: 'tutorials_completed',
      value: 1
    },
    maxProgress: 1
  }
];

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const authHeader = event.node.req.headers['authorization'];
  
  let userAchievements = [...allAchievements];
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      userAchievements = userAchievements.map(achievement => {
        const progress = Math.floor(Math.random() * (achievement.maxProgress || 1));
        const isUnlocked = progress >= (achievement.maxProgress || 1);
        
        return {
          ...achievement,
          progress,
          unlockedAt: isUnlocked ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined
        };
      });
    } catch (error) {
      console.error('Invalid token for achievements');
    }
  }
  
  if (query.category) {
    userAchievements = userAchievements.filter(a => a.category === query.category);
  }
  
  if (query.unlocked === 'true') {
    userAchievements = userAchievements.filter(a => a.unlockedAt);
  } else if (query.unlocked === 'false') {
    userAchievements = userAchievements.filter(a => !a.unlockedAt);
  }
  
  return {
    achievements: userAchievements,
    totalPoints: userAchievements.filter(a => a.unlockedAt).reduce((sum, a) => sum + a.points, 0),
    unlockedCount: userAchievements.filter(a => a.unlockedAt).length,
    totalCount: userAchievements.length
  };
});