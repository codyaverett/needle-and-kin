import jwt from 'jsonwebtoken'
import type { JWTPayload } from '~/server/types/auth'

interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  createdAt: string
  updatedAt?: string
  likes: number
  isLiked?: boolean
  replies?: Comment[]
  isAuthor?: boolean
  isEdited: boolean
}

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'id')
  
  if (!postId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID is required'
    })
  }
  
  // Check if user is authenticated (optional for reading comments)
  let userId: string | null = null
  const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JWTPayload
      userId = decoded.id
    } catch {
      // User not authenticated, but that's okay for reading comments
    }
  }
  
  // Mock comments data
  const mockComments: Comment[] = [
    {
      id: 'comment-1',
      postId,
      userId: '2',
      userName: 'Jane Doe',
      userAvatar: '/avatars/sarah.jpg',
      content: 'This is such a beautiful pattern! I love the color combinations you used. Can\'t wait to try it myself.',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      likes: 12,
      isLiked: userId === '1',
      isAuthor: userId === '2',
      isEdited: false,
      replies: [
        {
          id: 'comment-1-reply-1',
          postId,
          userId: '1',
          userName: 'Admin',
          userAvatar: '/avatars/default.jpg',
          content: 'Thank you so much! Feel free to ask if you have any questions about the pattern.',
          createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
          likes: 5,
          isLiked: false,
          isAuthor: userId === '1',
          isEdited: false
        }
      ]
    },
    {
      id: 'comment-2',
      postId,
      userId: '3',
      userName: 'Mary Smith',
      userAvatar: '/avatars/maria.jpg',
      content: 'I tried this pattern last weekend and it turned out great! Here are a few tips for beginners:\n\n1. Make sure to use the recommended yarn weight\n2. Take your time with the first few rows\n3. Don\'t be afraid to restart if something doesn\'t look right',
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(), // Edited 1 day ago
      likes: 24,
      isLiked: userId === '1' || userId === '2',
      isAuthor: userId === '3',
      isEdited: true,
      replies: []
    },
    {
      id: 'comment-3',
      postId,
      userId: '4',
      userName: 'Emily Johnson',
      userAvatar: '/avatars/emily.jpg',
      content: 'What size needles did you use? The pattern mentions size 8 but your gauge looks tighter.',
      createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      likes: 3,
      isLiked: false,
      isAuthor: userId === '4',
      isEdited: false,
      replies: [
        {
          id: 'comment-3-reply-1',
          postId,
          userId: '1',
          userName: 'Admin',
          userAvatar: '/avatars/default.jpg',
          content: 'Good catch! I actually used size 7 needles for this project. I\'ll update the pattern notes.',
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          likes: 2,
          isLiked: false,
          isAuthor: userId === '1',
          isEdited: false
        },
        {
          id: 'comment-3-reply-2',
          postId,
          userId: '4',
          userName: 'Emily Johnson',
          userAvatar: '/avatars/emily.jpg',
          content: 'Thank you! That makes much more sense now.',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          likes: 1,
          isLiked: false,
          isAuthor: userId === '4',
          isEdited: false
        }
      ]
    }
  ]
  
  // Sort comments by date (newest first by default)
  const sortBy = getQuery(event).sort as string || 'newest'
  
  if (sortBy === 'oldest') {
    mockComments.reverse()
  } else if (sortBy === 'popular') {
    mockComments.sort((a, b) => b.likes - a.likes)
  }
  
  return {
    success: true,
    postId,
    comments: mockComments,
    totalComments: mockComments.length,
    totalReplies: mockComments.reduce((acc, comment) => acc + (comment.replies?.length || 0), 0)
  }
})