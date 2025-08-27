export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  
  // Mock blog post data
  const posts = {
    'getting-started-with-knitting': {
      id: 1,
      slug: 'getting-started-with-knitting',
      title: 'Getting Started with Knitting: A Beginner\'s Guide',
      excerpt: 'Learn the basics of knitting with our comprehensive guide for beginners.',
      content: `
        <h2>Welcome to the World of Knitting!</h2>
        <p>Knitting is a wonderful craft that has been passed down through generations. Whether you're looking to create cozy scarves, warm sweaters, or decorative items for your home, knitting offers endless possibilities for creativity and self-expression.</p>
        
        <h3>Essential Materials You'll Need</h3>
        <ul>
          <li><strong>Knitting Needles:</strong> Start with medium-weight needles (US size 8 or 5mm)</li>
          <li><strong>Yarn:</strong> Choose a smooth, medium-weight yarn in a light color</li>
          <li><strong>Scissors:</strong> For cutting yarn</li>
          <li><strong>Tapestry Needle:</strong> For weaving in ends</li>
          <li><strong>Stitch Markers:</strong> To mark important spots in your knitting</li>
        </ul>
        
        <h3>Basic Knitting Techniques</h3>
        <p>Before you begin your first project, you'll need to master these fundamental techniques:</p>
        
        <h4>1. Casting On</h4>
        <p>This is how you create the first row of stitches on your needle. The long-tail cast on is perfect for beginners.</p>
        
        <h4>2. The Knit Stitch</h4>
        <p>The most basic stitch in knitting. Once you master this, you can create garter stitch fabric.</p>
        
        <h4>3. The Purl Stitch</h4>
        <p>The reverse of the knit stitch. Combining knit and purl stitches creates stockinette stitch.</p>
        
        <h4>4. Binding Off</h4>
        <p>How to finish your knitting and secure the stitches so they don't unravel.</p>
        
        <h3>Your First Project: A Simple Dishcloth</h3>
        <p>A dishcloth is the perfect first project. It's small, practical, and helps you practice your stitches without the pressure of creating something wearable.</p>
        
        <h3>Tips for Success</h3>
        <ul>
          <li>Keep your tension consistent but not too tight</li>
          <li>Count your stitches regularly to catch mistakes early</li>
          <li>Don't be afraid to unravel and start over</li>
          <li>Practice a little bit every day</li>
          <li>Join a knitting group or online community for support</li>
        </ul>
        
        <h3>Common Mistakes and How to Fix Them</h3>
        <p>Everyone makes mistakes when learning to knit. Here are some common ones and how to fix them:</p>
        <ul>
          <li><strong>Dropped Stitches:</strong> Use a crochet hook to pick them back up</li>
          <li><strong>Too Many Stitches:</strong> You might be accidentally yarning over</li>
          <li><strong>Holes in Your Fabric:</strong> Check that you're not dropping stitches or creating accidental yarn overs</li>
        </ul>
        
        <h3>Next Steps</h3>
        <p>Once you've mastered the basics, you can move on to more advanced techniques like cables, colorwork, and lace knitting. The possibilities are endless!</p>
      `,
      image: 'https://picsum.photos/800/400?random=1',
      author: {
        id: 1,
        name: 'Sarah Mitchell',
        avatar: 'https://picsum.photos/100/100?random=1',
        bio: 'Knitting enthusiast with 15 years of experience'
      },
      category: 'knitting',
      tags: ['beginner', 'tutorial', 'knitting basics', 'how-to'],
      difficulty: 'beginner',
      readTime: 8,
      publishedAt: '2024-01-15',
      updatedAt: '2024-01-15',
      views: 1234,
      likes: 89,
      featured: true
    },
    'advanced-cable-patterns': {
      id: 2,
      slug: 'advanced-cable-patterns',
      title: 'Advanced Cable Knitting Patterns',
      excerpt: 'Take your knitting to the next level with these intricate cable patterns.',
      content: `
        <h2>Mastering Complex Cable Patterns</h2>
        <p>Cable knitting creates beautiful, textured designs that look far more complicated than they actually are. In this tutorial, we'll explore advanced cable techniques that will elevate your knitting projects.</p>
        
        <h3>Understanding Cable Notation</h3>
        <p>Before diving into complex patterns, it's essential to understand how to read cable charts and written instructions.</p>
        
        <h3>Essential Tools for Cable Knitting</h3>
        <ul>
          <li>Cable needles in various sizes</li>
          <li>Stitch markers</li>
          <li>Row counter</li>
          <li>Cable chart holder</li>
        </ul>
        
        <h3>Advanced Cable Techniques</h3>
        <p>Learn how to create traveling cables, complex braids, and Celtic knots in your knitting projects.</p>
      `,
      image: 'https://picsum.photos/800/400?random=2',
      author: {
        id: 1,
        name: 'Sarah Mitchell',
        avatar: 'https://picsum.photos/100/100?random=1'
      },
      category: 'knitting',
      tags: ['advanced', 'cables', 'patterns'],
      difficulty: 'advanced',
      readTime: 12,
      publishedAt: '2024-01-20',
      views: 892,
      likes: 124
    },
    'crochet-granny-squares': {
      id: 3,
      slug: 'crochet-granny-squares',
      title: 'Classic Granny Squares: A Timeless Crochet Pattern',
      excerpt: 'Master the art of granny squares with this comprehensive guide.',
      content: `
        <h2>The Timeless Granny Square</h2>
        <p>Granny squares are one of the most versatile and beloved crochet patterns. They can be used to create blankets, bags, clothing, and so much more.</p>
        
        <h3>Materials Needed</h3>
        <ul>
          <li>Worsted weight yarn in multiple colors</li>
          <li>Size H/8 (5mm) crochet hook</li>
          <li>Scissors</li>
          <li>Yarn needle</li>
        </ul>
        
        <h3>Basic Granny Square Pattern</h3>
        <p>Follow these step-by-step instructions to create your first granny square...</p>
      `,
      image: 'https://picsum.photos/800/400?random=3',
      author: {
        id: 2,
        name: 'Emily Chen',
        avatar: 'https://picsum.photos/100/100?random=2'
      },
      category: 'crochet',
      tags: ['crochet', 'granny squares', 'blankets', 'beginner'],
      difficulty: 'beginner',
      readTime: 6,
      publishedAt: '2024-01-18',
      views: 1567,
      likes: 203
    },
    'embroidery-florals': {
      id: 4,
      slug: 'embroidery-florals',
      title: 'Creating Beautiful Floral Embroidery',
      excerpt: 'Learn to embroider stunning floral designs with these techniques.',
      content: `
        <h2>The Art of Floral Embroidery</h2>
        <p>Floral embroidery has been a favorite subject for needleworkers throughout history. In this guide, we'll explore various techniques to create beautiful botanical designs.</p>
        
        <h3>Essential Stitches for Floral Embroidery</h3>
        <ul>
          <li>French Knots for flower centers</li>
          <li>Lazy Daisy for petals</li>
          <li>Stem Stitch for stems and vines</li>
          <li>Satin Stitch for filled petals</li>
        </ul>
      `,
      image: 'https://picsum.photos/800/400?random=4',
      author: {
        id: 3,
        name: 'Maria Rodriguez',
        avatar: 'https://picsum.photos/100/100?random=3'
      },
      category: 'embroidery',
      tags: ['embroidery', 'florals', 'hand stitching'],
      difficulty: 'intermediate',
      readTime: 10,
      publishedAt: '2024-01-22',
      views: 945,
      likes: 156
    },
    'quilting-basics': {
      id: 5,
      slug: 'quilting-basics',
      title: 'Quilting Basics: Your First Quilt Project',
      excerpt: 'Everything you need to know to start your quilting journey.',
      content: `
        <h2>Beginning Your Quilting Journey</h2>
        <p>Quilting is a beautiful way to combine fabric, design, and stitching to create functional art. This guide will walk you through creating your first quilt.</p>
        
        <h3>Essential Quilting Supplies</h3>
        <ul>
          <li>Rotary cutter and mat</li>
          <li>Quilting rulers</li>
          <li>Quality cotton fabrics</li>
          <li>Batting</li>
          <li>Thread</li>
        </ul>
      `,
      image: 'https://picsum.photos/800/400?random=5',
      author: {
        id: 4,
        name: 'Linda Thompson',
        avatar: 'https://picsum.photos/100/100?random=4'
      },
      category: 'quilting',
      tags: ['quilting', 'beginner', 'patchwork'],
      difficulty: 'beginner',
      readTime: 15,
      publishedAt: '2024-01-10',
      views: 1823,
      likes: 267
    }
  }
  
  const post = posts[slug]
  
  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: `Post not found: ${slug}`
    })
  }
  
  // Simulate fetching related posts
  const relatedPosts = Object.values(posts)
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      image: p.image,
      author: p.author,
      readTime: p.readTime,
      publishedAt: p.publishedAt
    }))
  
  return {
    ...post,
    relatedPosts
  }
})