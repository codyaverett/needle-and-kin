import BlogCard from './BlogCard.vue';

export default {
  title: 'Components/BlogCard',
  component: BlogCard,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    post: {
      description: 'Blog post data object',
      control: 'object',
    },
  },
};

// Mock data for stories
const mockPost = {
  id: 1,
  title: "The Art of Hand-Stitched Embroidery",
  slug: "art-of-hand-stitched-embroidery",
  excerpt: "Discover the timeless beauty of hand embroidery and learn the basic stitches that will transform your fabric into works of art. From simple running stitches to intricate French knots, this guide will help you get started on your embroidery journey.",
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
};

const longPost = {
  ...mockPost,
  id: 2,
  title: "Advanced Embroidery Techniques: Creating Dimensional Flowers and Complex Patterns for Professional Results",
  excerpt: "Master advanced embroidery techniques with this comprehensive guide covering dimensional flowers, complex stitch combinations, thread blending, and professional finishing methods. Learn how to create stunning three-dimensional effects that will elevate your work to gallery-quality pieces. This detailed tutorial includes step-by-step instructions, troubleshooting tips, and expert advice from professional embroiderers.",
};

const shortPost = {
  ...mockPost,
  id: 3,
  title: "Quick Start Guide",
  excerpt: "Get started with embroidery basics.",
  readTime: "2 min read",
};

export const Default = {
  args: {
    post: mockPost,
  },
};

export const LongContent = {
  args: {
    post: longPost,
  },
  parameters: {
    docs: {
      description: {
        story: 'BlogCard component handling long titles and excerpts with proper truncation.',
      },
    },
  },
};

export const ShortContent = {
  args: {
    post: shortPost,
  },
  parameters: {
    docs: {
      description: {
        story: 'BlogCard component with minimal content.',
      },
    },
  },
};

export const WithoutImage = {
  args: {
    post: {
      ...mockPost,
      image: null,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'BlogCard component when no image is available (fallback handling).',
      },
    },
  },
};

export const DifferentAuthor = {
  args: {
    post: {
      ...mockPost,
      id: 4,
      title: "Creating Cozy Knit Scarves for Winter",
      excerpt: "Step-by-step guide to knitting your first scarf with soft, warm yarns perfect for the winter season.",
      image: "/blog/knitting-1.jpg",
      readTime: "12 min read",
      author: {
        name: "Maria Rodriguez",
        avatar: "/avatars/maria.jpg",
        bio: "Knitting instructor and pattern designer"
      },
      tags: ["knitting", "winter", "accessories"]
    },
  },
};

// Multiple cards layout story
export const GridLayout = {
  render: (args) => ({
    components: { BlogCard },
    setup() {
      const posts = [
        mockPost,
        {
          ...mockPost,
          id: 2,
          title: "Creating Cozy Knit Scarves for Winter",
          excerpt: "Step-by-step guide to knitting your first scarf with soft, warm yarns perfect for the winter season.",
          image: "/blog/knitting-1.jpg",
          readTime: "12 min read",
          author: {
            name: "Maria Rodriguez",
            avatar: "/avatars/maria.jpg",
            bio: "Knitting instructor and pattern designer"
          },
          tags: ["knitting", "winter", "accessories"]
        },
        {
          ...mockPost,
          id: 3,
          title: "Upcycling Old Clothes: Give New Life to Your Wardrobe",
          excerpt: "Learn creative techniques to transform worn-out clothing into stylish, unique pieces that reflect your personal style.",
          image: "/blog/upcycling-1.jpg",
          readTime: "6 min read",
          author: {
            name: "Emily Johnson",
            avatar: "/avatars/emily.jpg",
            bio: "Sustainable fashion advocate and designer"
          },
          tags: ["upcycling", "sustainability", "fashion"]
        },
      ];
      return { posts };
    },
    template: `
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <BlogCard v-for="post in posts" :key="post.id" :post="post" />
      </div>
    `,
  }),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Multiple BlogCard components in a responsive grid layout as used on the blog page.',
      },
    },
  },
};