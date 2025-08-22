export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const tag = query.tag as string

  const allPosts = [
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
    },
    {
      id: 4,
      title: "Beginner's Guide to Cross-Stitch",
      slug: "beginners-guide-cross-stitch",
      excerpt: "Start your cross-stitch journey with this comprehensive guide covering materials, basic techniques, and your first project.",
      content: "",
      image: "/blog/cross-stitch-1.jpg",
      publishedAt: "2024-01-01T16:00:00Z",
      readTime: "10 min read",
      author: {
        name: "Sarah Chen",
        avatar: "/avatars/sarah.jpg",
        bio: "Master embroiderer with 15 years of experience"
      },
      tags: ["cross-stitch", "tutorial", "beginner"]
    },
    {
      id: 5,
      title: "Macrame Plant Hangers: Bringing Nature Indoors",
      slug: "macrame-plant-hangers-nature-indoors",
      excerpt: "Learn the ancient art of macrame to create beautiful plant hangers that bring a touch of bohemian style to your home.",
      content: "",
      image: "/blog/macrame-1.jpg",
      publishedAt: "2023-12-28T11:45:00Z",
      readTime: "7 min read",
      author: {
        name: "Lisa Thompson",
        avatar: "/avatars/lisa.jpg",
        bio: "Macrame artist and home decor enthusiast"
      },
      tags: ["macrame", "home-decor", "plants"]
    }
  ]

  let filteredPosts = allPosts
  if (tag) {
    filteredPosts = allPosts.filter(post => post.tags.includes(tag))
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