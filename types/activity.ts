export type ActivityType = 
  | 'posted'
  | 'liked'
  | 'commented'
  | 'followed'
  | 'created_project'
  | 'completed_tutorial'
  | 'joined_group'
  | 'earned_achievement'
  | 'shared'
  | 'updated_profile'

export interface ActivityUser {
  id: string
  username: string
  name: string
  avatar?: string
  isVerified?: boolean
}

export interface ActivityTarget {
  id: string
  type: 'post' | 'project' | 'tutorial' | 'user' | 'group' | 'achievement'
  title?: string
  slug?: string
  excerpt?: string
  image?: string
  url?: string
}

export interface ActivityMetadata {
  likesCount?: number
  commentsCount?: number
  sharesCount?: number
  viewsCount?: number
  comment?: string
  achievement?: {
    name: string
    icon: string
    description: string
  }
  project?: {
    progress: number
    category: string
  }
  group?: {
    memberCount: number
    isPrivate: boolean
  }
  [key: string]: any
}

export interface Activity {
  id: string
  type: ActivityType
  user: ActivityUser
  target?: ActivityTarget
  metadata?: ActivityMetadata
  isLiked?: boolean
  likesCount: number
  commentsCount: number
  createdAt: Date | string
  updatedAt?: Date | string
}

export interface ActivityFilter {
  types?: ActivityType[]
  userIds?: string[]
  targetTypes?: ActivityTarget['type'][]
  dateFrom?: Date | string
  dateTo?: Date | string
  following?: boolean
}

export interface ActivityStats {
  totalActivities: number
  todayActivities: number
  weekActivities: number
  monthActivities: number
  typeBreakdown: Record<ActivityType, number>
}

export interface ActivityFeedOptions {
  page?: number
  limit?: number
  filter?: ActivityFilter
  sort?: 'recent' | 'popular' | 'relevant'
}

export interface SocialShareOptions {
  platform: 'facebook' | 'twitter' | 'pinterest' | 'whatsapp' | 'email' | 'copy'
  url: string
  title?: string
  description?: string
  image?: string
  hashtags?: string[]
}

export interface FollowRelationship {
  followerId: string
  followingId: string
  createdAt: Date | string
}

export interface UserConnection {
  user: ActivityUser
  relationship: 'following' | 'follower' | 'mutual'
  followedAt?: Date | string
  mutualFollowers?: ActivityUser[]
  commonInterests?: string[]
}