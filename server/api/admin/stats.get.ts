import { auth } from '~/server/utils/auth'
import { db } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  // Require admin role
  await auth.requireRole('admin')(event)
  
  // Get all users
  const users = db.users.list()
  const recentUsers = users
    .sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt))
    .slice(0, 5)
  
  // Get all posts (from the existing posts API data for now)
  const allPosts = [
    {
      id: 1,
      slug: "getting-started-with-knitting",
      title: "Getting Started with Knitting",
      publishedAt: "2024-01-15T10:00:00Z",
      author: { name: "Sarah Mitchell" },
      views: 1234
    },
    {
      id: 2,
      slug: "advanced-cable-patterns",
      title: "Advanced Cable Knitting Patterns",
      publishedAt: "2024-01-20T14:30:00Z",
      author: { name: "Sarah Mitchell" },
      views: 892
    },
    {
      id: 3,
      slug: "crochet-granny-squares",
      title: "Classic Granny Squares: A Timeless Crochet Pattern",
      publishedAt: "2024-01-18T09:15:00Z",
      author: { name: "Emily Chen" },
      views: 1567
    },
    {
      id: 4,
      slug: "amigurumi-basics",
      title: "Amigurumi for Beginners",
      publishedAt: "2024-01-22T16:00:00Z",
      author: { name: "Emily Chen" },
      views: 2134
    },
    {
      id: 5,
      slug: "embroidery-florals",
      title: "Creating Beautiful Floral Embroidery",
      publishedAt: "2024-01-25T11:45:00Z",
      author: { name: "Maria Rodriguez" },
      views: 945
    }
  ]
  
  const recentPosts = allPosts
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 5)
  
  // Calculate total views
  const totalViews = allPosts.reduce((sum, post) => sum + (post.views || 0), 0)
  
  // Mock comment count
  const totalComments = 42
  
  return {
    stats: {
      totalUsers: users.length,
      totalPosts: allPosts.length,
      totalViews,
      totalComments
    },
    recentPosts,
    recentUsers: recentUsers.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role,
      joinedAt: user.joinedAt
    }))
  }
})