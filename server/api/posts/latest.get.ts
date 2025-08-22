export default defineEventHandler(async (event) => {
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

  return {
    data: mockPosts,
    total: mockPosts.length,
    page: 1,
    limit: 10
  }
})