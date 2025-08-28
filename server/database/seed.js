import bcrypt from 'bcryptjs'
import { db, statements } from './index.js'

// Helper to generate unique IDs
const generateId = (prefix) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

async function seedDatabase() {
  console.log('🌱 Starting database seed...')
  
  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('Clearing existing data...')
  db.exec(`
    DELETE FROM post_tags;
    DELETE FROM user_favorites;
    DELETE FROM user_follows;
    DELETE FROM comments;
    DELETE FROM posts;
    DELETE FROM tags;
    DELETE FROM sessions;
    DELETE FROM user_preferences;
    DELETE FROM site_content;
    DELETE FROM users;
  `)
  
  // Seed Users
  console.log('Creating users...')
  
  const users = [
    {
      id: 'admin-001',
      email: 'admin@needleandkin.com',
      username: 'admin',
      password: await bcrypt.hash('ChangeMe123!', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      bio: 'Site administrator',
      mustChangePassword: true
    },
    {
      id: 'author-001',
      email: 'sarah@example.com',
      username: 'sarahknits',
      password: await bcrypt.hash('Demo123!', 10),
      firstName: 'Sarah',
      lastName: 'Mitchell',
      role: 'author',
      bio: 'Knitting enthusiast with 15 years of experience'
    },
    {
      id: 'author-002',
      email: 'emily@example.com',
      username: 'emilycrochets',
      password: await bcrypt.hash('Demo123!', 10),
      firstName: 'Emily',
      lastName: 'Chen',
      role: 'author',
      bio: 'Crochet designer and teacher'
    },
    {
      id: 'author-003',
      email: 'maria@example.com',
      username: 'mariastitches',
      password: await bcrypt.hash('Demo123!', 10),
      firstName: 'Maria',
      lastName: 'Rodriguez',
      role: 'author',
      bio: 'Embroidery artist and instructor'
    },
    {
      id: 'user-001',
      email: 'user@example.com',
      username: 'craftlover',
      password: await bcrypt.hash('Demo123!', 10),
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'user',
      bio: 'Love all things crafty!'
    }
  ]
  
  for (const user of users) {
    statements.createUser.run(
      user.id,
      user.email,
      user.username,
      user.password,
      user.firstName,
      user.lastName,
      user.role,
      `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=${user.role === 'admin' ? '9333ea' : 'db2777'}&color=fff`,
      user.bio,
      user.mustChangePassword ? 1 : 0,
      1, // is_active
      1  // email_verified (for demo purposes)
    )
  }
  
  // Seed Tags
  console.log('Creating tags...')
  const tags = [
    'beginner', 'tutorial', 'basics', 'advanced', 'cables', 'patterns',
    'granny squares', 'blankets', 'amigurumi', 'toys', 'florals',
    'hand stitching', 'decorative', 'modern', 'contemporary', 'art',
    'patchwork', 'paper piecing', 'precision', 'garments', 'dressmaking',
    'intermediate', 'loom', 'textiles', 'tapestry', 'wall art'
  ]
  
  const tagIds = {}
  for (const tagName of tags) {
    const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-')
    statements.createTag.run(tagName, tagSlug)
    const tag = statements.getTagByName.get(tagName)
    tagIds[tagName] = tag.id
  }
  
  // Seed Posts
  console.log('Creating posts...')
  const posts = [
    {
      slug: 'getting-started-with-knitting',
      title: 'Getting Started with Knitting',
      excerpt: 'Learn the basics of knitting with our comprehensive guide for beginners.',
      content: `<h2>Welcome to the World of Knitting!</h2>
<p>Knitting is a wonderful craft that has been passed down through generations...</p>`,
      image: 'https://picsum.photos/800/400?random=1',
      category: 'knitting',
      difficulty: 'beginner',
      readTime: 8,
      authorId: 'author-001',
      tags: ['beginner', 'tutorial', 'basics'],
      featured: true,
      views: 1234,
      likes: 89
    },
    {
      slug: 'advanced-cable-patterns',
      title: 'Advanced Cable Knitting Patterns',
      excerpt: 'Take your knitting to the next level with these intricate cable patterns.',
      content: `<h2>Mastering Complex Cable Patterns</h2>
<p>Cable knitting creates beautiful, textured designs...</p>`,
      image: 'https://picsum.photos/800/400?random=2',
      category: 'knitting',
      difficulty: 'advanced',
      readTime: 12,
      authorId: 'author-001',
      tags: ['advanced', 'cables', 'patterns'],
      views: 892,
      likes: 124
    },
    {
      slug: 'crochet-granny-squares',
      title: 'Classic Granny Squares: A Timeless Crochet Pattern',
      excerpt: 'Master the art of granny squares with this comprehensive guide.',
      content: `<h2>The Timeless Granny Square</h2>
<p>Granny squares are one of the most versatile crochet patterns...</p>`,
      image: 'https://picsum.photos/800/400?random=3',
      category: 'crochet',
      difficulty: 'beginner',
      readTime: 6,
      authorId: 'author-002',
      tags: ['granny squares', 'blankets', 'beginner'],
      views: 1567,
      likes: 203
    },
    {
      slug: 'amigurumi-basics',
      title: 'Amigurumi for Beginners: Cute Crochet Creatures',
      excerpt: 'Create adorable crocheted animals and characters with these simple patterns.',
      content: `<h2>Introduction to Amigurumi</h2>
<p>Amigurumi is the Japanese art of knitting or crocheting small creatures...</p>`,
      image: 'https://picsum.photos/800/400?random=4',
      category: 'crochet',
      difficulty: 'beginner',
      readTime: 7,
      authorId: 'author-002',
      tags: ['amigurumi', 'toys', 'beginner'],
      views: 2134,
      likes: 342
    },
    {
      slug: 'embroidery-florals',
      title: 'Creating Beautiful Floral Embroidery',
      excerpt: 'Learn to embroider stunning floral designs with these techniques.',
      content: `<h2>The Art of Floral Embroidery</h2>
<p>Floral embroidery has been a favorite subject for needleworkers...</p>`,
      image: 'https://picsum.photos/800/400?random=5',
      category: 'embroidery',
      difficulty: 'intermediate',
      readTime: 10,
      authorId: 'author-003',
      tags: ['florals', 'hand stitching', 'decorative'],
      views: 945,
      likes: 156
    },
    {
      slug: 'modern-embroidery-art',
      title: 'Modern Embroidery: Contemporary Designs',
      excerpt: 'Explore modern embroidery styles and create contemporary art pieces.',
      content: `<h2>Contemporary Embroidery Art</h2>
<p>Modern embroidery breaks traditional boundaries...</p>`,
      image: 'https://picsum.photos/800/400?random=6',
      category: 'embroidery',
      difficulty: 'intermediate',
      readTime: 9,
      authorId: 'author-003',
      tags: ['modern', 'contemporary', 'art'],
      views: 723,
      likes: 98
    },
    {
      slug: 'quilting-basics',
      title: 'Quilting Basics: Your First Quilt Project',
      excerpt: 'Everything you need to know to start your quilting journey.',
      content: `<h2>Beginning Your Quilting Journey</h2>
<p>Quilting is a beautiful way to combine fabric, design, and stitching...</p>`,
      image: 'https://picsum.photos/800/400?random=7',
      category: 'quilting',
      difficulty: 'beginner',
      readTime: 15,
      authorId: 'author-001',
      tags: ['beginner', 'patchwork', 'basics'],
      views: 1823,
      likes: 267
    },
    {
      slug: 'paper-piecing-techniques',
      title: 'Foundation Paper Piecing: Precision Quilting',
      excerpt: 'Master the art of paper piecing for perfect quilt blocks every time.',
      content: `<h2>Precision Through Paper Piecing</h2>
<p>Foundation paper piecing is a technique that ensures perfect points...</p>`,
      image: 'https://picsum.photos/800/400?random=8',
      category: 'quilting',
      difficulty: 'advanced',
      readTime: 12,
      authorId: 'author-001',
      tags: ['paper piecing', 'precision', 'advanced'],
      views: 567,
      likes: 89
    },
    {
      slug: 'sewing-essentials',
      title: 'Sewing Essentials: Building Your Skills',
      excerpt: 'Essential sewing techniques every crafter should know.',
      content: `<h2>Essential Sewing Skills</h2>
<p>Whether you're making clothes or home decor, these skills are fundamental...</p>`,
      image: 'https://picsum.photos/800/400?random=9',
      category: 'sewing',
      difficulty: 'beginner',
      readTime: 8,
      authorId: 'author-002',
      tags: ['basics', 'tutorial', 'beginner'],
      views: 2456,
      likes: 334
    },
    {
      slug: 'garment-construction',
      title: 'Garment Construction: Making Your First Dress',
      excerpt: 'Step-by-step guide to constructing your first garment from scratch.',
      content: `<h2>Your First Garment Project</h2>
<p>Making your own clothes is deeply satisfying...</p>`,
      image: 'https://picsum.photos/800/400?random=10',
      category: 'sewing',
      difficulty: 'intermediate',
      readTime: 20,
      authorId: 'author-002',
      tags: ['garments', 'dressmaking', 'intermediate'],
      views: 1234,
      likes: 178
    },
    {
      slug: 'weaving-on-a-loom',
      title: 'Introduction to Loom Weaving',
      excerpt: 'Learn the ancient art of weaving on a simple frame loom.',
      content: `<h2>The Ancient Art of Weaving</h2>
<p>Weaving is one of humanity's oldest crafts...</p>`,
      image: 'https://picsum.photos/800/400?random=11',
      category: 'weaving',
      difficulty: 'beginner',
      readTime: 11,
      authorId: 'author-003',
      tags: ['loom', 'basics', 'textiles'],
      views: 892,
      likes: 112
    },
    {
      slug: 'tapestry-weaving',
      title: 'Tapestry Weaving: Creating Wall Art',
      excerpt: 'Create beautiful woven wall hangings with tapestry techniques.',
      content: `<h2>Tapestry as Art</h2>
<p>Tapestry weaving allows you to paint with yarn...</p>`,
      image: 'https://picsum.photos/800/400?random=12',
      category: 'weaving',
      difficulty: 'intermediate',
      readTime: 14,
      authorId: 'author-003',
      tags: ['tapestry', 'wall art', 'decorative'],
      views: 678,
      likes: 94
    }
  ]
  
  for (const post of posts) {
    const result = statements.createPost.run(
      post.slug,
      post.title,
      post.excerpt,
      post.content,
      post.image,
      post.category,
      post.difficulty,
      new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date in last 30 days
      post.readTime,
      post.authorId,
      post.featured ? 1 : 0,
      1 // published
    )
    
    const postId = result.lastInsertRowid
    
    // Add tags
    for (const tagName of post.tags) {
      if (tagIds[tagName]) {
        statements.addPostTag.run(postId, tagIds[tagName])
      }
    }
    
    // Set initial views
    if (post.views) {
      db.prepare('UPDATE posts SET views = ? WHERE id = ?').run(post.views, postId)
    }
    if (post.likes) {
      db.prepare('UPDATE posts SET likes = ? WHERE id = ?').run(post.likes, postId)
    }
  }
  
  // Seed Comments
  console.log('Creating comments...')
  const comments = [
    {
      postId: 1,
      userId: 'user-001',
      content: 'Great tutorial! This really helped me get started.',
      approved: true
    },
    {
      postId: 1,
      userId: 'author-002',
      content: 'Wonderful introduction to knitting!',
      approved: true
    },
    {
      postId: 3,
      userId: 'user-001',
      content: 'I love granny squares! Thanks for the clear instructions.',
      approved: true
    }
  ]
  
  for (const comment of comments) {
    statements.createComment.run(
      comment.postId,
      comment.userId,
      null, // parent_id
      comment.content,
      comment.approved ? 1 : 0
    )
  }
  
  // Seed Site Content
  console.log('Creating site content...')
  const siteContent = {
    hero: {
      title: 'Welcome to Needle & Kin',
      subtitle: 'A Blog About Crafting, Creativity, and Connection',
      description: 'Join us on a journey through the world of handmade crafts, where every stitch tells a story and every project brings us closer together.',
      ctaText: 'Explore Our Blog',
      ctaLink: '/blog'
    },
    about: {
      title: 'About Needle & Kin',
      description: 'We are two sisters passionate about crafting and creativity. Through this blog, we share our love for handmade projects, tutorials, and the stories behind them.'
    }
  }
  
  for (const [section, content] of Object.entries(siteContent)) {
    statements.updateSiteContent.run(
      generateId('content'),
      section,
      JSON.stringify(content),
      'admin-001'
    )
  }
  
  // Add some user favorites
  console.log('Creating user favorites...')
  statements.addFavorite.run('user-001', 1)
  statements.addFavorite.run('user-001', 3)
  statements.addFavorite.run('author-002', 1)
  
  console.log('✅ Database seeded successfully!')
  console.log(`
Summary:
- ${users.length} users created
- ${posts.length} posts created
- ${tags.length} tags created
- ${comments.length} comments created

Default admin credentials:
Email: admin@needleandkin.com
Password: ChangeMe123!
  `)
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Seed failed:', err)
      process.exit(1)
    })
}