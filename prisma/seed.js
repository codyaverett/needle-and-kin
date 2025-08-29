import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create admin user
  const adminPassword = await bcrypt.hash('ChangeMe123!', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@needleandkin.com',
      username: 'admin',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
      emailVerified: true,
      mustChangePassword: true,
      bio: 'Site administrator',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=9333ea&color=fff',
      preferences: {
        create: {
          newsletter: false,
          emailNotifications: true,
          favoriteCategories: JSON.stringify([]),
          theme: 'light',
          language: 'en',
        }
      }
    }
  })

  console.log('Created admin user:', admin.email)

  // Create demo authors
  const demoPassword = await bcrypt.hash('Demo123!', 10)
  
  const sarah = await prisma.user.create({
    data: {
      email: 'sarah@example.com',
      username: 'sarahknits',
      password: demoPassword,
      firstName: 'Sarah',
      lastName: 'Mitchell',
      role: 'author',
      bio: 'Knitting enthusiast with 15 years of experience',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Mitchell&background=db2777&color=fff',
      isActive: true,
      emailVerified: true,
      preferences: {
        create: {
          newsletter: true,
          emailNotifications: true,
          favoriteCategories: JSON.stringify(['knitting']),
          theme: 'light',
          language: 'en',
        }
      },
      craftingProfile: {
        create: {
          skillLevel: 'expert',
          yearsOfExperience: 15,
          favoriteTools: JSON.stringify(['Knitting needles', 'Cable needles', 'Stitch markers']),
          favoriteProjects: JSON.stringify(['Sweaters', 'Scarves', 'Blankets']),
        }
      }
    }
  })

  const emily = await prisma.user.create({
    data: {
      email: 'emily@example.com',
      username: 'emilycrochets',
      password: demoPassword,
      firstName: 'Emily',
      lastName: 'Chen',
      role: 'author',
      bio: 'Crochet designer and teacher',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Chen&background=db2777&color=fff',
      isActive: true,
      emailVerified: true,
      preferences: {
        create: {
          newsletter: true,
          emailNotifications: true,
          favoriteCategories: JSON.stringify(['crochet']),
          theme: 'light',
          language: 'en',
        }
      },
      craftingProfile: {
        create: {
          skillLevel: 'expert',
          yearsOfExperience: 10,
          favoriteTools: JSON.stringify(['Crochet hooks', 'Yarn', 'Stitch markers']),
          favoriteProjects: JSON.stringify(['Amigurumi', 'Blankets', 'Hats']),
        }
      }
    }
  })

  const maria = await prisma.user.create({
    data: {
      email: 'maria@example.com',
      username: 'mariaembroiders',
      password: demoPassword,
      firstName: 'Maria',
      lastName: 'Rodriguez',
      role: 'author',
      bio: 'Embroidery artist and instructor',
      avatar: 'https://ui-avatars.com/api/?name=Maria+Rodriguez&background=db2777&color=fff',
      isActive: true,
      emailVerified: true,
      preferences: {
        create: {
          newsletter: true,
          emailNotifications: true,
          favoriteCategories: JSON.stringify(['embroidery']),
          theme: 'light',
          language: 'en',
        }
      }
    }
  })

  // Create demo user
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      username: 'craftlover',
      password: demoPassword,
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'user',
      bio: 'Love all things crafty!',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=6b7280&color=fff',
      isActive: true,
      emailVerified: true,
      preferences: {
        create: {
          newsletter: false,
          emailNotifications: true,
          favoriteCategories: JSON.stringify(['knitting', 'crochet']),
          theme: 'light',
          language: 'en',
        }
      }
    }
  })

  console.log('Created demo users')

  // Create site content
  const siteContent = [
    {
      key: 'homepage_hero',
      content: JSON.stringify({
        title: 'Welcome to Needle & Kin',
        description: 'Discover the art of crafting, creativity, and the beautiful connections we make through handmade treasures.',
        cta: {
          text: 'Explore Our Blog',
          url: '/blog'
        }
      })
    },
    {
      key: 'about_content',
      content: JSON.stringify({
        hero: {
          title: 'About Needle & Kin',
          description: 'Discover the story behind our crafting community and the passion that drives us to create, connect, and inspire.'
        },
        story: {
          title: 'Our Story',
          content: [
            "Needle & Kin was born from a simple belief: that every handmade creation carries within it a piece of the maker's heart. Founded in 2023, we started as a small collective of crafters who wanted to share not just techniques and tutorials, but the deeper connections that come from creating with our hands.",
            "What began as weekend crafting sessions among friends has grown into a vibrant community where makers of all skill levels come together to learn, share, and celebrate the art of handcrafting.",
            "We believe that in our digital world, there's something profoundly meaningful about slowing down, picking up a needle, thread, or yarn, and creating something beautiful with our own two hands."
          ]
        },
        mission: {
          title: 'Our Mission',
          values: [
            {
              icon: 'book',
              title: 'Educate',
              description: 'Provide clear, accessible tutorials and guides that make crafting approachable for beginners while offering inspiration for experienced makers.'
            },
            {
              icon: 'users',
              title: 'Connect',
              description: 'Foster a supportive community where crafters can share their work, ask questions, and find encouragement in their creative journey.'
            },
            {
              icon: 'lightbulb',
              title: 'Inspire',
              description: 'Celebrate the beauty of handmade items and inspire others to discover the joy and mindfulness that comes from creating with their hands.'
            }
          ]
        },
        team: {
          title: 'Meet Our Team',
          description: 'Our diverse team brings together decades of crafting experience, from traditional embroidery and knitting to modern upcycling and sustainable fashion.',
          members: [
            {
              name: 'Sarah Chen',
              role: 'Master Embroiderer & Tutorial Creator',
              avatar: '/avatars/sarah.jpg',
              bio: 'Master embroiderer with 15 years of experience'
            },
            {
              name: 'Maria Rodriguez',
              role: 'Knitting Instructor & Pattern Designer',
              avatar: '/avatars/maria.jpg',
              bio: 'Knitting instructor and pattern designer'
            },
            {
              name: 'Emily Johnson',
              role: 'Sustainable Fashion Advocate',
              avatar: '/avatars/emily.jpg',
              bio: 'Sustainable fashion advocate and designer'
            }
          ]
        },
        cta: {
          title: 'Join Our Community',
          description: "Whether you're just starting your crafting journey or you're a seasoned maker, there's a place for you in our community.",
          buttons: [
            {
              text: 'Read Our Blog',
              url: '/blog',
              type: 'primary'
            },
            {
              text: 'Get In Touch',
              url: '/contact',
              type: 'secondary'
            }
          ]
        }
      })
    },
    {
      key: 'contact_info',
      content: JSON.stringify({
        email: 'hello@needleandkin.com',
        phone: '+1 (555) 123-4567',
        address: {
          street: '123 Craft Lane',
          city: 'Creativille',
          state: 'CA',
          zip: '90210',
          country: 'USA'
        },
        social: {
          instagram: '@needleandkin',
          pinterest: 'needleandkin',
          youtube: 'NeedleAndKin',
          facebook: 'needleandkin'
        },
        hours: {
          weekday: '9:00 AM - 5:00 PM PST',
          weekend: '10:00 AM - 3:00 PM PST'
        }
      })
    }
  ]

  for (const content of siteContent) {
    await prisma.siteContent.create({ data: content })
  }

  console.log('Created site content')

  // Create blog posts
  const posts = [
    {
      slug: 'getting-started-with-knitting',
      title: 'Getting Started with Knitting',
      excerpt: 'Learn the basics of knitting with our comprehensive guide for beginners.',
      content: '# Getting Started with Knitting\n\nKnitting is a wonderful craft that allows you to create beautiful, functional items with just needles and yarn...',
      image: 'https://picsum.photos/400/300?random=1',
      authorId: sarah.id,
      category: 'knitting',
      tags: JSON.stringify(['beginner', 'tutorial', 'basics']),
      difficulty: 'beginner',
      readTime: '5 min read',
      published: true,
      publishedAt: new Date('2024-01-15T10:00:00Z'),
      views: 1234,
    },
    {
      slug: 'advanced-cable-patterns',
      title: 'Advanced Cable Knitting Patterns',
      excerpt: 'Take your knitting to the next level with these intricate cable patterns.',
      content: '# Advanced Cable Knitting Patterns\n\nCable knitting creates beautiful, textured designs that look complex but are actually quite achievable...',
      image: 'https://picsum.photos/400/300?random=2',
      authorId: sarah.id,
      category: 'knitting',
      tags: JSON.stringify(['advanced', 'cables', 'patterns']),
      difficulty: 'advanced',
      readTime: '8 min read',
      published: true,
      publishedAt: new Date('2024-01-20T14:30:00Z'),
      views: 892,
    },
    {
      slug: 'crochet-granny-squares',
      title: 'Classic Granny Squares: A Timeless Crochet Pattern',
      excerpt: 'Master the art of granny squares with this comprehensive guide.',
      content: '# Classic Granny Squares\n\nGranny squares are one of the most versatile and beloved crochet patterns...',
      image: 'https://picsum.photos/400/300?random=3',
      authorId: emily.id,
      category: 'crochet',
      tags: JSON.stringify(['granny squares', 'blankets', 'beginner']),
      difficulty: 'beginner',
      readTime: '6 min read',
      published: true,
      publishedAt: new Date('2024-01-18T09:15:00Z'),
      views: 1567,
    },
    {
      slug: 'amigurumi-basics',
      title: 'Amigurumi for Beginners: Cute Crochet Creatures',
      excerpt: 'Create adorable crocheted animals and characters with these simple patterns.',
      content: '# Amigurumi for Beginners\n\nAmigurumi is the Japanese art of crocheting small, stuffed creatures...',
      image: 'https://picsum.photos/400/300?random=4',
      authorId: emily.id,
      category: 'crochet',
      tags: JSON.stringify(['amigurumi', 'toys', 'beginner']),
      difficulty: 'beginner',
      readTime: '7 min read',
      published: true,
      publishedAt: new Date('2024-01-22T16:00:00Z'),
      views: 2134,
    },
    {
      slug: 'embroidery-florals',
      title: 'Creating Beautiful Floral Embroidery',
      excerpt: 'Learn to embroider stunning floral designs with these techniques.',
      content: '# Creating Beautiful Floral Embroidery\n\nFloral embroidery has been a beloved craft for centuries...',
      image: 'https://picsum.photos/400/300?random=5',
      authorId: maria.id,
      category: 'embroidery',
      tags: JSON.stringify(['florals', 'hand stitching', 'decorative']),
      difficulty: 'intermediate',
      readTime: '10 min read',
      published: true,
      publishedAt: new Date('2024-01-25T11:45:00Z'),
      views: 945,
    },
    {
      slug: 'modern-embroidery-art',
      title: 'Modern Embroidery: Contemporary Designs',
      excerpt: 'Explore modern embroidery styles and create contemporary art pieces.',
      content: '# Modern Embroidery\n\nModern embroidery breaks traditional boundaries and embraces contemporary design...',
      image: 'https://picsum.photos/400/300?random=6',
      authorId: maria.id,
      category: 'embroidery',
      tags: JSON.stringify(['modern', 'contemporary', 'art']),
      difficulty: 'intermediate',
      readTime: '9 min read',
      published: true,
      publishedAt: new Date('2024-01-12T13:00:00Z'),
      views: 723,
    },
  ]

  for (const postData of posts) {
    const post = await prisma.post.create({ data: postData })
    
    // Add some likes
    if (Math.random() > 0.5) {
      await prisma.postLike.create({
        data: {
          postId: post.id,
          userId: user.id
        }
      })
    }
  }

  console.log('Created blog posts')

  // Create projects
  const projects = [
    {
      userId: sarah.id,
      title: 'Cozy Winter Cardigan',
      description: 'A warm and stylish cardigan perfect for cold winter days. Features a classic cable knit pattern and comfortable fit.',
      coverImage: 'https://images.unsplash.com/photo-1576673442511-7e39b6545c87?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1576673442511-7e39b6545c87?w=800',
        'https://images.unsplash.com/photo-1592301933927-35b597393c0a?w=800'
      ]),
      category: 'Knitting',
      difficulty: 'intermediate',
      tags: JSON.stringify(['cardigan', 'cable-knit', 'winter', 'intermediate']),
      materials: JSON.stringify([
        { id: '1', name: 'Merino wool yarn', quantity: '1000', unit: 'grams' },
        { id: '2', name: 'Knitting needles', quantity: '1', unit: 'pair (size 8)' },
        { id: '3', name: 'Cable needle', quantity: '1', unit: 'piece' },
        { id: '4', name: 'Buttons', quantity: '6', unit: 'pieces' }
      ]),
      steps: JSON.stringify([
        {
          id: '1',
          number: 1,
          title: 'Cast on and ribbing',
          description: 'Cast on 120 stitches and work 2x2 ribbing for 3 inches',
          duration: '30 minutes'
        },
        {
          id: '2',
          number: 2,
          title: 'Begin cable pattern',
          description: 'Start the main cable pattern following the chart',
          duration: '2 hours'
        },
        {
          id: '3',
          number: 3,
          title: 'Shape armholes',
          description: 'Decrease for armholes when piece measures 14 inches',
          duration: '1 hour'
        }
      ]),
      progress: 65,
      status: 'in_progress',
      estimatedTime: '20 hours',
      views: 328,
    },
    {
      userId: emily.id,
      title: 'Rainbow Baby Blanket',
      description: 'A soft and colorful baby blanket featuring a rainbow stripe pattern. Makes a perfect gift for new parents!',
      coverImage: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800'
      ]),
      category: 'Crochet',
      difficulty: 'beginner',
      tags: JSON.stringify(['blanket', 'baby', 'rainbow', 'gift']),
      materials: JSON.stringify([
        { id: '1', name: 'Soft acrylic yarn', quantity: '800', unit: 'grams (various colors)' },
        { id: '2', name: 'Crochet hook', quantity: '1', unit: 'size H/8' }
      ]),
      steps: JSON.stringify([
        {
          id: '1',
          number: 1,
          title: 'Foundation chain',
          description: 'Create foundation chain of 150 stitches',
          duration: '15 minutes'
        },
        {
          id: '2',
          number: 2,
          title: 'Work stripe pattern',
          description: 'Follow the rainbow stripe pattern for 36 inches',
          duration: '10 hours'
        },
        {
          id: '3',
          number: 3,
          title: 'Add border',
          description: 'Finish with a decorative border around all edges',
          duration: '2 hours'
        }
      ]),
      progress: 30,
      status: 'in_progress',
      estimatedTime: '12 hours',
      views: 892,
    },
  ]

  for (const projectData of projects) {
    const project = await prisma.project.create({ data: projectData })
    
    // Add some likes
    if (Math.random() > 0.3) {
      await prisma.projectLike.create({
        data: {
          projectId: project.id,
          userId: user.id
        }
      })
    }
  }

  console.log('Created projects')

  // Create achievements
  const achievements = [
    {
      name: 'first_post',
      description: 'Published your first blog post',
      category: 'content',
      requirement: JSON.stringify({ posts: 1 }),
      points: 10,
      icon: '✍️'
    },
    {
      name: 'project_starter',
      description: 'Started your first crafting project',
      category: 'crafting',
      requirement: JSON.stringify({ projects: 1 }),
      points: 10,
      icon: '🎯'
    },
    {
      name: 'community_member',
      description: 'Joined the Needle & Kin community',
      category: 'community',
      requirement: JSON.stringify({ registered: true }),
      points: 5,
      icon: '👥'
    },
    {
      name: 'helpful_crafter',
      description: 'Left 10 helpful comments',
      category: 'community',
      requirement: JSON.stringify({ comments: 10 }),
      points: 20,
      icon: '💬'
    },
    {
      name: 'master_crafter',
      description: 'Completed 10 projects',
      category: 'crafting',
      requirement: JSON.stringify({ completed_projects: 10 }),
      points: 50,
      icon: '🏆'
    }
  ]

  for (const achievementData of achievements) {
    await prisma.achievement.create({ data: achievementData })
  }

  console.log('Created achievements')

  // Create tutorials
  const tutorials = [
    {
      title: 'Basic Knitting Stitches',
      description: 'Learn the fundamental knitting stitches that form the basis of all knitting projects.',
      content: '# Basic Knitting Stitches\n\n## Knit Stitch (Garter Stitch)\n\nThe knit stitch is the most basic stitch in knitting...',
      category: 'knitting',
      difficulty: 'beginner',
      duration: '30 minutes',
      tags: JSON.stringify(['basics', 'stitches', 'beginner']),
      published: true,
      featured: true,
      views: 5234,
    },
    {
      title: 'Reading Crochet Patterns',
      description: 'Understand crochet pattern abbreviations and symbols to follow any pattern with confidence.',
      content: '# Reading Crochet Patterns\n\n## Common Abbreviations\n\nCrochet patterns use standard abbreviations...',
      category: 'crochet',
      difficulty: 'beginner',
      duration: '45 minutes',
      tags: JSON.stringify(['patterns', 'reading', 'symbols']),
      published: true,
      views: 3456,
    },
    {
      title: 'Embroidery Hoop Techniques',
      description: 'Master the art of using embroidery hoops for perfect tension and beautiful results.',
      content: '# Embroidery Hoop Techniques\n\n## Choosing the Right Hoop\n\nThe right hoop size and material makes all the difference...',
      category: 'embroidery',
      difficulty: 'beginner',
      duration: '20 minutes',
      tags: JSON.stringify(['hoops', 'techniques', 'basics']),
      published: true,
      views: 2789,
    }
  ]

  for (const tutorialData of tutorials) {
    await prisma.tutorial.create({ data: tutorialData })
  }

  console.log('Created tutorials')

  // Create app settings
  const settings = [
    {
      key: 'site_name',
      value: JSON.stringify('Needle & Kin'),
      description: 'The name of the website'
    },
    {
      key: 'site_description',
      value: JSON.stringify('A blog about crafting, creativity, and connection through handmade art.'),
      description: 'Site meta description'
    },
    {
      key: 'contact_email',
      value: JSON.stringify('hello@needleandkin.com'),
      description: 'Main contact email'
    },
    {
      key: 'posts_per_page',
      value: JSON.stringify(9),
      description: 'Number of posts to display per page'
    },
    {
      key: 'enable_comments',
      value: JSON.stringify(true),
      description: 'Whether to enable comments on posts'
    },
    {
      key: 'enable_newsletter',
      value: JSON.stringify(true),
      description: 'Whether to enable newsletter subscriptions'
    }
  ]

  for (const setting of settings) {
    await prisma.appSettings.create({ data: setting })
  }

  console.log('Created app settings')

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })