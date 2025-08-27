export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 9
  const category = query.category as string

  const allPosts = [
    {
      id: 1,
      slug: "getting-started-with-knitting",
      title: "Getting Started with Knitting",
      excerpt: "Learn the basics of knitting with our comprehensive guide for beginners.",
      content: "",
      image: "https://picsum.photos/400/300?random=1",
      publishedAt: "2024-01-15T10:00:00Z",
      readTime: "5 min read",
      author: {
        id: 1,
        name: "Sarah Mitchell",
        avatar: "https://picsum.photos/100/100?random=1",
        bio: "Knitting enthusiast with 15 years of experience"
      },
      category: "knitting",
      tags: ["beginner", "tutorial", "basics"],
      difficulty: "beginner",
      views: 1234,
      likes: 89
    },
    {
      id: 2,
      slug: "advanced-cable-patterns",
      title: "Advanced Cable Knitting Patterns",
      excerpt: "Take your knitting to the next level with these intricate cable patterns.",
      content: "",
      image: "https://picsum.photos/400/300?random=2",
      publishedAt: "2024-01-20T14:30:00Z",
      readTime: "8 min read",
      author: {
        id: 1,
        name: "Sarah Mitchell",
        avatar: "https://picsum.photos/100/100?random=1",
        bio: "Knitting enthusiast with 15 years of experience"
      },
      category: "knitting",
      tags: ["advanced", "cables", "patterns"],
      difficulty: "advanced",
      views: 892,
      likes: 124
    },
    {
      id: 3,
      slug: "crochet-granny-squares",
      title: "Classic Granny Squares: A Timeless Crochet Pattern",
      excerpt: "Master the art of granny squares with this comprehensive guide.",
      content: "",
      image: "https://picsum.photos/400/300?random=3",
      publishedAt: "2024-01-18T09:15:00Z",
      readTime: "6 min read",
      author: {
        id: 2,
        name: "Emily Chen",
        avatar: "https://picsum.photos/100/100?random=2",
        bio: "Crochet designer and teacher"
      },
      category: "crochet",
      tags: ["granny squares", "blankets", "beginner"],
      difficulty: "beginner",
      views: 1567,
      likes: 203
    },
    {
      id: 4,
      slug: "amigurumi-basics",
      title: "Amigurumi for Beginners: Cute Crochet Creatures",
      excerpt: "Create adorable crocheted animals and characters with these simple patterns.",
      content: "",
      image: "https://picsum.photos/400/300?random=4",
      publishedAt: "2024-01-22T16:00:00Z",
      readTime: "7 min read",
      author: {
        id: 2,
        name: "Emily Chen",
        avatar: "https://picsum.photos/100/100?random=2",
        bio: "Crochet designer and teacher"
      },
      category: "crochet",
      tags: ["amigurumi", "toys", "beginner"],
      difficulty: "beginner",
      views: 2134,
      likes: 342
    },
    {
      id: 5,
      slug: "embroidery-florals",
      title: "Creating Beautiful Floral Embroidery",
      excerpt: "Learn to embroider stunning floral designs with these techniques.",
      content: "",
      image: "https://picsum.photos/400/300?random=5",
      publishedAt: "2024-01-25T11:45:00Z",
      readTime: "10 min read",
      author: {
        id: 3,
        name: "Maria Rodriguez",
        avatar: "https://picsum.photos/100/100?random=3",
        bio: "Embroidery artist and instructor"
      },
      category: "embroidery",
      tags: ["florals", "hand stitching", "decorative"],
      difficulty: "intermediate",
      views: 945,
      likes: 156
    },
    {
      id: 6,
      slug: "modern-embroidery-art",
      title: "Modern Embroidery: Contemporary Designs",
      excerpt: "Explore modern embroidery styles and create contemporary art pieces.",
      content: "",
      image: "https://picsum.photos/400/300?random=6",
      publishedAt: "2024-01-12T13:00:00Z",
      readTime: "9 min read",
      author: {
        id: 3,
        name: "Maria Rodriguez",
        avatar: "https://picsum.photos/100/100?random=3",
        bio: "Embroidery artist and instructor"
      },
      category: "embroidery",
      tags: ["modern", "contemporary", "art"],
      difficulty: "intermediate",
      views: 723,
      likes: 98
    },
    {
      id: 7,
      slug: "quilting-basics",
      title: "Quilting Basics: Your First Quilt Project",
      excerpt: "Everything you need to know to start your quilting journey.",
      content: "",
      image: "https://picsum.photos/400/300?random=7",
      publishedAt: "2024-01-28T10:30:00Z",
      readTime: "15 min read",
      author: {
        id: 4,
        name: "Linda Thompson",
        avatar: "https://picsum.photos/100/100?random=4",
        bio: "Master quilter with 20+ years experience"
      },
      category: "quilting",
      tags: ["beginner", "patchwork", "basics"],
      difficulty: "beginner",
      views: 1823,
      likes: 267
    },
    {
      id: 8,
      slug: "paper-piecing-techniques",
      title: "Foundation Paper Piecing: Precision Quilting",
      excerpt: "Master the art of paper piecing for perfect quilt blocks every time.",
      content: "",
      image: "https://picsum.photos/400/300?random=8",
      publishedAt: "2024-01-30T15:00:00Z",
      readTime: "12 min read",
      author: {
        id: 4,
        name: "Linda Thompson",
        avatar: "https://picsum.photos/100/100?random=4",
        bio: "Master quilter with 20+ years experience"
      },
      category: "quilting",
      tags: ["paper piecing", "precision", "advanced"],
      difficulty: "advanced",
      views: 567,
      likes: 89
    },
    {
      id: 9,
      slug: "sewing-essentials",
      title: "Sewing Essentials: Building Your Skills",
      excerpt: "Essential sewing techniques every crafter should know.",
      content: "",
      image: "https://picsum.photos/400/300?random=9",
      publishedAt: "2024-02-01T09:00:00Z",
      readTime: "8 min read",
      author: {
        id: 5,
        name: "Jennifer Park",
        avatar: "https://picsum.photos/100/100?random=5",
        bio: "Fashion designer and sewing instructor"
      },
      category: "sewing",
      tags: ["basics", "techniques", "skills"],
      difficulty: "beginner",
      views: 2456,
      likes: 334
    },
    {
      id: 10,
      slug: "garment-construction",
      title: "Garment Construction: Making Your First Dress",
      excerpt: "Step-by-step guide to constructing your first garment from scratch.",
      content: "",
      image: "https://picsum.photos/400/300?random=10",
      publishedAt: "2024-02-03T14:00:00Z",
      readTime: "20 min read",
      author: {
        id: 5,
        name: "Jennifer Park",
        avatar: "https://picsum.photos/100/100?random=5",
        bio: "Fashion designer and sewing instructor"
      },
      category: "sewing",
      tags: ["garments", "dressmaking", "intermediate"],
      difficulty: "intermediate",
      views: 1234,
      likes: 178
    },
    {
      id: 11,
      slug: "weaving-on-a-loom",
      title: "Introduction to Loom Weaving",
      excerpt: "Learn the ancient art of weaving on a simple frame loom.",
      content: "",
      image: "https://picsum.photos/400/300?random=11",
      publishedAt: "2024-02-05T11:00:00Z",
      readTime: "11 min read",
      author: {
        id: 6,
        name: "Anna Martinez",
        avatar: "https://picsum.photos/100/100?random=6",
        bio: "Textile artist and weaving instructor"
      },
      category: "weaving",
      tags: ["loom", "basics", "textiles"],
      difficulty: "beginner",
      views: 892,
      likes: 112
    },
    {
      id: 12,
      slug: "tapestry-weaving",
      title: "Tapestry Weaving: Creating Wall Art",
      excerpt: "Create beautiful woven wall hangings with tapestry techniques.",
      content: "",
      image: "https://picsum.photos/400/300?random=12",
      publishedAt: "2024-02-07T12:30:00Z",
      readTime: "14 min read",
      author: {
        id: 6,
        name: "Anna Martinez",
        avatar: "https://picsum.photos/100/100?random=6",
        bio: "Textile artist and weaving instructor"
      },
      category: "weaving",
      tags: ["tapestry", "wall art", "decorative"],
      difficulty: "intermediate",
      views: 678,
      likes: 94
    }
  ]

  // Filter by category if provided
  let filteredPosts = allPosts
  if (category && category !== 'all') {
    filteredPosts = allPosts.filter(post => post.category === category)
  }

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

  return {
    data: paginatedPosts,
    total: filteredPosts.length,
    page,
    limit,
    totalPages: Math.ceil(filteredPosts.length / limit)
  }
})