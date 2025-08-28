export type NotificationType = 
  | 'comment_reply'
  | 'post_like'
  | 'new_follower'
  | 'mention'
  | 'achievement_unlocked'
  | 'project_feedback'
  | 'group_invite'
  | 'system_announcement'

export interface NotificationMetadata {
  actionUrl?: string
  actionText?: string
  userId?: string
  userName?: string
  postId?: string
  postTitle?: string
  commentId?: string
  commentText?: string
  achievementId?: string
  achievementName?: string
  projectId?: string
  projectTitle?: string
  groupId?: string
  groupName?: string
  [key: string]: any
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  metadata?: NotificationMetadata
  createdAt: Date | string
  updatedAt: Date | string
}

export interface NotificationPreferences {
  email: Record<NotificationType, boolean>
  inApp: Record<NotificationType, boolean>
  digestMode: boolean
  digestFrequency: 'hourly' | 'daily' | 'weekly'
  quietHours: boolean
  quietStart: string
  quietEnd: string
}

export interface NewsletterSubscription {
  id: string
  userId?: string
  email: string
  categories: string[]
  frequency: 'daily' | 'weekly' | 'monthly'
  verified: boolean
  unsubscribeToken: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface NewsletterPreferences {
  subscribed: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
  categories: string[]
  emailTypes: {
    newPosts: boolean
    weeklyDigest: boolean
    projectIdeas: boolean
    communityUpdates: boolean
  }
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent?: string
  variables: string[]
  category: 'newsletter' | 'notification' | 'system'
  active: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface EmailQueueItem {
  id: string
  to: string
  subject: string
  templateId: string
  data: Record<string, any>
  status: 'pending' | 'processing' | 'sent' | 'failed'
  attempts: number
  error?: string
  scheduledFor?: Date | string
  sentAt?: Date | string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface NotificationStats {
  unreadCount: number
  totalCount: number
  typeBreakdown: Record<NotificationType, number>
  lastNotification?: Notification
}