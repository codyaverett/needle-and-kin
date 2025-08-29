import AchievementBadge from './AchievementBadge.vue'

export default {
  title: 'Components/AchievementBadge',
  component: AchievementBadge,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg']
    },
    showProgress: {
      control: 'boolean'
    },
    hoverable: {
      control: 'boolean'
    },
    animate: {
      control: 'boolean'
    }
  }
}

export const Default = {
  args: {
    achievement: {
      id: '1',
      name: 'First Stitch',
      description: 'Complete your first stitch',
      icon: '🧵',
      category: 'skill',
      rarity: 'common',
      points: 10,
      requirement: {
        type: 'stitches',
        value: 1
      },
      unlockedAt: new Date(),
      progress: 1,
      maxProgress: 1
    },
    size: 'md',
    showProgress: true,
    hoverable: true,
    animate: true
  }
}

export const Example = {
  args: {
    achievement: {
      id: '2',
      name: 'Master Quilter',
      description: 'Complete 10 quilts',
      icon: '🏆',
      category: 'projects',
      rarity: 'legendary',
      points: 100,
      requirement: {
        type: 'quilts',
        value: 10
      },
      unlockedAt: new Date(),
      progress: 10,
      maxProgress: 10
    },
    size: 'lg',
    showProgress: true,
    hoverable: true,
    animate: true
  }
}

// TODO: Add more story variations for AchievementBadge
