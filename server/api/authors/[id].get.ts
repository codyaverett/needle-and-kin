import jwt from 'jsonwebtoken'
import type { JWTPayload } from '~/server/types/auth'
import { posts } from '~/server/utils/blog-data'

interface AuthorProfile {
  id: string
  username: string
  firstName: string
  lastName: string
  fullName: string
  avatar: string
  bio: string
  role: string
  joinedAt: string
  email?: string // Only visible to authenticated users
  socialLinks?: {
    website?: string
    twitter?: string
    instagram?: string
    pinterest?: string
  }
  stats: {
    totalPosts: number
    totalViews: number
    totalLikes: number
    totalComments: number
    followers: number
    following: number
  }
  expertise: string[]
  isFollowing?: boolean // Only for authenticated users
  recentPosts?: any[]
}

// Mock follower data
const authorFollowers: Record<string, Set<string>> = {
  '1': new Set(['2', '3', '4']),
  '2': new Set(['1', '3', '5']),
  '3': new Set(['1', '2']),
  '4': new Set(['1']),
}

export default defineEventHandler(async (event) => {
  const authorId = getRouterParam(event, 'id')
  
  if (!authorId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Author ID is required'
    })
  }
  
  // Check if user is authenticated (optional for viewing authors)
  let userId: string | null = null
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload
      userId = decoded.id
    } catch {
      // User not authenticated, but that's okay for viewing authors
    }
  }
  
  // Mock author data
  const authors: Record<string, AuthorProfile> = {
    '1': {
      id: '1',
      username: 'sarahjohnson',
      firstName: 'Sarah',
      lastName: 'Johnson',
      fullName: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      bio: 'Professional knitter and content creator with over 15 years of experience. Specializing in intricate cable patterns and colorwork. I love sharing my passion for knitting with the community!',
      role: 'author',
      joinedAt: '2024-02-15T00:00:00Z',
      socialLinks: {
        website: 'https://sarahknits.com',
        instagram: '@sarahknits',
        pinterest: 'sarahknits',
        twitter: '@sarahknits'
      },
      stats: {
        totalPosts: 42,
        totalViews: 125000,
        totalLikes: 8900,
        totalComments: 2150,
        followers: authorFollowers['1']?.size || 0,
        following: 12
      },
      expertise: ['knitting', 'cables', 'colorwork', 'pattern design']
    },
    '2': {
      id: '2',
      username: 'emilychen',
      firstName: 'Emily',
      lastName: 'Chen',
      fullName: 'Emily Chen',
      avatar: '/avatars/emily.jpg',
      bio: 'Embroidery expert and instructor. Teaching traditional and modern embroidery techniques. Featured in Craft Magazine and winner of the 2023 National Embroidery Award.',
      role: 'author',
      joinedAt: '2024-03-10T00:00:00Z',
      socialLinks: {
        website: 'https://emilyembroidery.com',
        instagram: '@emilyembroidery',
        pinterest: 'emilyembroidery'
      },
      stats: {
        totalPosts: 28,
        totalViews: 89000,
        totalLikes: 6200,
        totalComments: 1450,
        followers: authorFollowers['2']?.size || 0,
        following: 8
      },
      expertise: ['embroidery', 'cross-stitch', 'needlepoint', 'pattern design']
    },
    '3': {
      id: '3',
      username: 'mariagarcia',
      firstName: 'Maria',
      lastName: 'Garcia',
      fullName: 'Maria Garcia',
      avatar: '/avatars/maria.jpg',
      bio: 'Sustainable crafting advocate and upcycling specialist. Transforming old materials into beautiful new creations. Join me in making crafting more eco-friendly!',
      role: 'author',
      joinedAt: '2024-04-01T00:00:00Z',
      socialLinks: {
        website: 'https://sustainablecrafts.com',
        instagram: '@mariacrafts'
      },
      stats: {
        totalPosts: 18,
        totalViews: 56000,
        totalLikes: 4100,
        totalComments: 890,
        followers: authorFollowers['3']?.size || 0,
        following: 15
      },
      expertise: ['sewing', 'upcycling', 'sustainable crafting', 'eco-friendly']
    },
    '4': {
      id: '4',
      username: 'lisaanderson',
      firstName: 'Lisa',
      lastName: 'Anderson',
      fullName: 'Lisa Anderson',
      avatar: '/avatars/lisa.jpg',
      bio: 'Crochet artist and instructor with a passion for lacework and intricate patterns. Teaching beginners to advanced techniques through detailed tutorials.',
      role: 'author',
      joinedAt: '2024-04-15T00:00:00Z',
      socialLinks: {
        instagram: '@lisacrochets',
        pinterest: 'lisacrochets'
      },
      stats: {
        totalPosts: 22,
        totalViews: 67000,
        totalLikes: 4800,
        totalComments: 1100,
        followers: authorFollowers['4']?.size || 0,
        following: 10
      },
      expertise: ['crochet', 'lacework', 'amigurumi', 'pattern design']
    }
  }
  
  const author = authors[authorId]
  
  if (!author) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Author not found'
    })
  }
  
  // Add email only for authenticated users
  if (userId) {
    author.email = `${author.username}@needleandkin.com`
    
    // Check if current user is following this author
    author.isFollowing = authorFollowers[authorId]?.has(userId) || false
  }
  
  // Get author's recent posts
  const authorPosts = posts.filter(post => 
    post.author.name === author.fullName
  )
  
  // Sort by date and limit to 6 recent posts
  const recentPosts = authorPosts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6)
    .map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      image: post.image,
      publishedAt: post.publishedAt,
      readTime: post.readTime,
      category: post.category,
      views: post.views,
      likes: post.likes
    }))
  
  author.recentPosts = recentPosts
  
  // Get query parameters
  const includeStats = getQuery(event).stats !== 'false'
  const includePosts = getQuery(event).posts !== 'false'
  
  // Build response based on query params
  const response: any = {
    success: true,
    author: {
      id: author.id,
      username: author.username,
      firstName: author.firstName,
      lastName: author.lastName,
      fullName: author.fullName,
      avatar: author.avatar,
      bio: author.bio,
      role: author.role,
      joinedAt: author.joinedAt,
      expertise: author.expertise,
      socialLinks: author.socialLinks
    }
  }
  
  if (userId) {
    response.author.email = author.email
    response.author.isFollowing = author.isFollowing
  }
  
  if (includeStats) {
    response.author.stats = author.stats
  }
  
  if (includePosts) {
    response.author.recentPosts = author.recentPosts
    response.author.totalPosts = authorPosts.length
  }
  
  return response
})