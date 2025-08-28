export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let limit = 5
  if (query.limit !== undefined) {
    const parsed = parseInt(query.limit as string)
    if (isNaN(parsed) || parsed < 0) {
      limit = 5
    } else {
      limit = parsed
    }
  }
  
  const mockPosts = [
    {
      id: 1,
      title: "The Art of Hand-Stitched Embroidery",
      slug: "art-of-hand-stitched-embroidery",
      excerpt: "Discover the timeless beauty of hand embroidery and learn the basic stitches that will transform your fabric into works of art.",
      content: "",
      image: "/blog/embroidery-1.jpg",
      publishedAt: "2024-01-15T10:00:00Z",
      readTime: "8 min read",
      author: {
        name: "Sarah Chen",
        avatar: "/avatars/sarah.jpg",
        bio: "Master embroiderer with 15 years of experience"
      },
      tags: ["embroidery", "tutorial", "beginner"]
    },
    {
      id: 2,
      title: "Creating Cozy Knit Scarves for Winter",
      slug: "creating-cozy-knit-scarves-winter",
      excerpt: "Step-by-step guide to knitting your first scarf with soft, warm yarns perfect for the winter season.",
      content: "",
      image: "/blog/knitting-1.jpg",
      publishedAt: "2024-01-10T14:30:00Z",
      readTime: "12 min read",
      author: {
        name: "Maria Rodriguez",
        avatar: "/avatars/maria.jpg",
        bio: "Knitting instructor and pattern designer"
      },
      tags: ["knitting", "winter", "accessories"]
    },
    {
      id: 3,
      title: "Upcycling Old Clothes: Give New Life to Your Wardrobe",
      slug: "upcycling-old-clothes-new-life-wardrobe",
      excerpt: "Learn creative techniques to transform worn-out clothing into stylish, unique pieces that reflect your personal style.",
      content: "",
      image: "/blog/upcycling-1.jpg",
      publishedAt: "2024-01-05T09:15:00Z",
      readTime: "6 min read",
      author: {
        name: "Emily Johnson",
        avatar: "/avatars/emily.jpg",
        bio: "Sustainable fashion advocate and designer"
      },
      tags: ["upcycling", "sustainability", "fashion"]
    }
  ]
  
  // Add more mock posts with different categories and difficulty levels
  const allPosts = [
    ...mockPosts,
    {
      id: 4,
      title: "Introduction to Cross-Stitch Patterns",
      slug: "introduction-cross-stitch-patterns",
      excerpt: "Start your cross-stitch journey with simple patterns perfect for beginners.",
      image: "/blog/cross-stitch-1.jpg",
      publishedAt: "2024-01-03T11:00:00Z",
      readTime: "5 min read",
      category: "embroidery",
      difficulty: "beginner",
      views: 450,
      likes: 32,
      author: {
        id: 1,
        name: "Sarah Chen",
        avatar: "/avatars/sarah.jpg"
      },
      tags: ["cross-stitch", "embroidery", "beginner"]
    },
    {
      id: 5,
      title: "Advanced Lace Knitting Techniques",
      slug: "advanced-lace-knitting",
      excerpt: "Master intricate lace patterns with these advanced knitting techniques.",
      image: "/blog/lace-1.jpg",
      publishedAt: "2024-01-02T15:00:00Z",
      readTime: "15 min read",
      category: "knitting",
      difficulty: "advanced",
      views: 320,
      likes: 45,
      author: {
        id: 2,
        name: "Maria Rodriguez",
        avatar: "/avatars/maria.jpg"
      },
      tags: ["knitting", "lace", "advanced"]
    }
  ]
  
  // Add category and difficulty to the first 3 posts
  allPosts[0].category = 'embroidery'
  allPosts[0].difficulty = 'intermediate'
  allPosts[0].views = 1234
  allPosts[0].likes = 89
  allPosts[0].author.id = 1
  
  allPosts[1].category = 'knitting'
  allPosts[1].difficulty = 'beginner'
  allPosts[1].views = 892
  allPosts[1].likes = 124
  allPosts[1].author.id = 2
  
  allPosts[2].category = 'upcycling'
  allPosts[2].difficulty = 'beginner'
  allPosts[2].views = 1567
  allPosts[2].likes = 203
  allPosts[2].author.id = 3
  
  // Sort by publishedAt descending (newest first)
  const sortedPosts = allPosts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  
  // Apply limit
  const limitedPosts = limit === 0 ? [] : sortedPosts.slice(0, limit)

  return {
    data: limitedPosts,
    total: allPosts.length,
    limit
  }
})