import { defineEventHandler, getRouterParam, createError } from 'h3';
import type { Tutorial } from '~/types/projects';

const mockTutorial: Tutorial = {
  id: '1',
  title: 'Learn to Knit: Your First Scarf',
  description: 'Complete beginner\'s guide to knitting your very first scarf. Learn basic stitches and techniques.',
  coverImage: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800',
  category: 'Knitting',
  difficulty: 'beginner',
  steps: [
    {
      id: '1',
      number: 1,
      title: 'Gathering Materials',
      content: '<p>Welcome to your knitting journey! In this first step, we\'ll gather all the materials you need. Don\'t worry about getting everything perfect - knitting is very forgiving!</p><p>You\'ll need:<ul><li>Yarn (worsted weight is best for beginners)</li><li>Knitting needles (size 8 recommended)</li><li>Scissors</li><li>Tapestry needle for weaving in ends</li></ul></p>',
      images: ['https://images.unsplash.com/photo-1589931760430-915a1e15ab0e?w=800'],
      duration: '10 minutes',
      tips: [
        'Choose a light-colored yarn for your first project so you can see your stitches clearly',
        'Bamboo needles are easier for beginners as they\'re less slippery than metal',
        'Buy a little extra yarn - better to have too much than run out!'
      ],
      checkpoints: [
        'All materials gathered',
        'Workspace prepared with good lighting',
        'Comfortable seating arranged'
      ]
    },
    {
      id: '2',
      number: 2,
      title: 'Making a Slip Knot',
      content: '<p>The slip knot is the foundation of your knitting. It\'s the very first loop that goes on your needle.</p><p>Steps:<ol><li>Make a loop with your yarn, leaving a 6-inch tail</li><li>Reach through the loop and grab the working yarn</li><li>Pull it through to create a new loop</li><li>Place this loop on your needle and gently tighten</li></ol></p>',
      videoUrl: 'https://example.com/slipknot-tutorial',
      duration: '5 minutes',
      checkpoints: [
        'Slip knot created successfully',
        'Knot is secure but not too tight',
        'Can slide easily on the needle'
      ]
    },
    {
      id: '3',
      number: 3,
      title: 'Cast On Stitches',
      content: '<p>Now we\'ll create our foundation row using the long-tail cast on method. This creates a stretchy, professional-looking edge.</p><p>We\'ll cast on 20 stitches for a narrow scarf, perfect for practice.</p>',
      images: ['https://images.unsplash.com/photo-1599558568771-a5d66c2b53f2?w=800'],
      duration: '20 minutes',
      tips: [
        'Keep your tension even - not too tight, not too loose',
        'Count your stitches carefully',
        'If you make a mistake, it\'s okay to start over!'
      ],
      checkpoints: [
        '20 stitches cast on',
        'Stitches are evenly spaced',
        'Edge looks neat and uniform'
      ]
    },
    {
      id: '4',
      number: 4,
      title: 'The Knit Stitch',
      content: '<p>Time to learn the fundamental knit stitch! This is the building block of all knitting.</p><p>Remember the rhyme: "In through the front door, around the back, peek through the window, and off jumps Jack!"</p>',
      duration: '30 minutes',
      tips: [
        'Hold your needles comfortably - don\'t grip too tightly',
        'Keep your yarn tension consistent',
        'Practice makes perfect - your first rows might look uneven and that\'s okay!'
      ],
      checkpoints: [
        'Completed at least 10 rows',
        'Stitches are becoming more even',
        'Comfortable with the knit stitch motion'
      ]
    },
    {
      id: '5',
      number: 5,
      title: 'Continue Knitting',
      content: '<p>Keep knitting every row (this creates the "garter stitch" pattern) until your scarf is as long as you want it!</p><p>A good length for a first scarf is about 4-5 feet.</p>',
      duration: '2-3 hours',
      checkpoints: [
        'Scarf is desired length',
        'Edges are relatively straight',
        'Feeling confident with the knit stitch'
      ]
    },
    {
      id: '6',
      number: 6,
      title: 'Binding Off',
      content: '<p>Time to finish your scarf! Binding off (also called casting off) secures your stitches so they won\'t unravel.</p>',
      duration: '15 minutes',
      tips: [
        'Keep your bind off loose - it should match the stretchiness of your cast on edge',
        'Cut your yarn leaving a 6-inch tail for weaving in'
      ],
      checkpoints: [
        'All stitches bound off',
        'Edge is secure',
        'Yarn cut with tail for weaving'
      ]
    },
    {
      id: '7',
      number: 7,
      title: 'Weaving in Ends',
      content: '<p>The final step! Use your tapestry needle to weave in the yarn tails at both ends of your scarf.</p>',
      duration: '10 minutes',
      checkpoints: [
        'All ends woven in securely',
        'Ends trimmed close to fabric',
        'Scarf is complete!'
      ]
    }
  ],
  materials: [
    { id: '1', name: 'Worsted weight yarn', quantity: '200', unit: 'grams' },
    { id: '2', name: 'Knitting needles', quantity: '1', unit: 'pair (size 8)' },
    { id: '3', name: 'Tapestry needle', quantity: '1', unit: 'piece' },
    { id: '4', name: 'Scissors', quantity: '1', unit: 'pair' }
  ],
  estimatedTime: '3-4 hours',
  skillsLearned: [
    'Making a slip knot',
    'Long-tail cast on',
    'Knit stitch',
    'Garter stitch pattern',
    'Binding off',
    'Weaving in ends'
  ],
  prerequisites: [],
  author: {
    id: 'author1',
    name: 'Emma Knits',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
  },
  likes: 234,
  views: 1892,
  completions: 156,
  rating: 4.8,
  tags: ['beginner', 'scarf', 'knitting-basics', 'first-project'],
  createdAt: new Date('2024-12-01'),
  updatedAt: new Date('2024-12-25')
};

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (id !== '1') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Tutorial not found'
    });
  }
  
  mockTutorial.views++;
  
  return mockTutorial;
});