import ActivityCard from './ActivityCard.vue'

export default {
  title: 'Components/ActivityCard',
  component: ActivityCard,
  tags: ['autodocs'],
  argTypes: {
    showActions: {
      control: 'boolean'
    },
    compact: {
      control: 'boolean'
    }
  }
}

export const Default = {
  args: {
    activity: {
      id: '1',
      type: 'project_created',
      user: {
        id: 'user1',
        name: 'Jane Doe',
        username: 'janedoe',
        avatar: 'https://via.placeholder.com/40',
        isFollowing: false
      },
      target: {
        id: 'project1',
        type: 'project',
        title: 'My First Quilt',
        url: '/projects/1',
        image: 'https://via.placeholder.com/400x300'
      },
      metadata: {
        description: 'Started a new quilting project',
        tags: ['quilting', 'beginner'],
        projectType: 'quilt'
      },
      isLiked: false,
      likesCount: 5,
      commentsCount: 2,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    showActions: true,
    compact: false
  }
}

export const Example = {
  args: {
    activity: {
      id: '2',
      type: 'achievement_unlocked',
      user: {
        id: 'user2',
        name: 'John Smith',
        username: 'johnsmith',
        avatar: 'https://via.placeholder.com/40',
        isFollowing: true
      },
      metadata: {
        achievementName: 'Master Quilter',
        achievementIcon: '🏆',
        achievementRarity: 'legendary',
        points: 100
      },
      isLiked: true,
      likesCount: 15,
      commentsCount: 8,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    showActions: true,
    compact: false
  }
}

// TODO: Add more story variations for ActivityCard
