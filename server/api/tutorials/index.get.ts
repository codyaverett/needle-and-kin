import { defineEventHandler, getQuery } from 'h3';
import type { Tutorial } from '~/types/projects';

const mockTutorials: Tutorial[] = [
  {
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
        content: 'Let\'s start by gathering all the materials you\'ll need for your first knitting project.',
        images: ['https://images.unsplash.com/photo-1589931760430-915a1e15ab0e?w=800'],
        duration: '10 minutes',
        tips: ['Choose a light-colored yarn for your first project', 'Bamboo needles are easier for beginners'],
        checkpoints: ['Materials gathered', 'Workspace prepared']
      },
      {
        id: '2',
        number: 2,
        title: 'Making a Slip Knot',
        content: 'The slip knot is the foundation of your knitting. Here\'s how to create one.',
        videoUrl: 'https://example.com/slipknot-tutorial',
        duration: '5 minutes',
        checkpoints: ['Slip knot created', 'Knot is secure but not too tight']
      },
      {
        id: '3',
        number: 3,
        title: 'Cast On Stitches',
        content: 'We\'ll use the long-tail cast on method to create our foundation row.',
        images: ['https://images.unsplash.com/photo-1599558568771-a5d66c2b53f2?w=800'],
        duration: '20 minutes',
        tips: ['Keep tension even', 'Count your stitches carefully'],
        checkpoints: ['20 stitches cast on', 'Stitches are even']
      }
    ],
    materials: [
      { id: '1', name: 'Worsted weight yarn', quantity: '200', unit: 'grams' },
      { id: '2', name: 'Knitting needles', quantity: '1', unit: 'pair (size 8)' },
      { id: '3', name: 'Tapestry needle', quantity: '1', unit: 'piece' },
      { id: '4', name: 'Scissors', quantity: '1', unit: 'pair' }
    ],
    estimatedTime: '3 hours',
    skillsLearned: ['Cast on', 'Knit stitch', 'Bind off', 'Weaving in ends'],
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
    tags: ['beginner', 'scarf', 'knitting-basics'],
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-25')
  },
  {
    id: '2',
    title: 'Master the Granny Square',
    description: 'Learn how to crochet the classic granny square pattern, perfect for blankets and more!',
    coverImage: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800',
    category: 'Crochet',
    difficulty: 'beginner',
    steps: [
      {
        id: '1',
        number: 1,
        title: 'Magic Ring',
        content: 'Start with a magic ring (also called magic circle) for a tight center.',
        duration: '10 minutes',
        checkpoints: ['Magic ring created', 'Ring pulls tight']
      },
      {
        id: '2',
        number: 2,
        title: 'First Round',
        content: 'Work the first round of double crochets and chains.',
        duration: '15 minutes',
        checkpoints: ['12 double crochets completed', 'Four corner spaces created']
      }
    ],
    materials: [
      { id: '1', name: 'Cotton yarn', quantity: '100', unit: 'grams' },
      { id: '2', name: 'Crochet hook', quantity: '1', unit: 'size G/6' }
    ],
    estimatedTime: '1 hour',
    skillsLearned: ['Magic ring', 'Double crochet', 'Chain stitch', 'Color changes'],
    prerequisites: ['Basic crochet knowledge'],
    author: {
      id: 'author2',
      name: 'CrochetGuru',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CrochetGuru'
    },
    likes: 412,
    views: 3210,
    completions: 298,
    rating: 4.9,
    tags: ['granny-square', 'crochet', 'classic-pattern'],
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-26')
  }
];

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  
  let filteredTutorials = [...mockTutorials];
  
  if (query.category) {
    filteredTutorials = filteredTutorials.filter(t => t.category === query.category);
  }
  
  if (query.difficulty) {
    filteredTutorials = filteredTutorials.filter(t => t.difficulty === query.difficulty);
  }
  
  if (query.search) {
    const searchTerm = (query.search as string).toLowerCase();
    filteredTutorials = filteredTutorials.filter(t => 
      t.title.toLowerCase().includes(searchTerm) ||
      t.description.toLowerCase().includes(searchTerm) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
  
  const sortBy = query.sortBy || 'popular';
  switch (sortBy) {
    case 'recent':
      filteredTutorials.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case 'rating':
      filteredTutorials.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'completions':
      filteredTutorials.sort((a, b) => b.completions - a.completions);
      break;
    case 'popular':
    default:
      filteredTutorials.sort((a, b) => b.views - a.views);
      break;
  }
  
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 12;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  const paginatedTutorials = filteredTutorials.slice(start, end);
  
  return {
    tutorials: paginatedTutorials,
    total: filteredTutorials.length,
    page,
    limit,
    totalPages: Math.ceil(filteredTutorials.length / limit)
  };
});