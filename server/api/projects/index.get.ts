import { defineEventHandler, getQuery } from 'h3';
import type { Project } from '~/types/projects';

const mockProjects: Project[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'CraftyKnitter',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CraftyKnitter',
    title: 'Cozy Winter Cardigan',
    description: 'A warm and stylish cardigan perfect for cold winter days. Features a classic cable knit pattern and comfortable fit.',
    images: [
      'https://images.unsplash.com/photo-1576673442511-7e39b6545c87?w=800',
      'https://images.unsplash.com/photo-1592301933927-35b597393c0a?w=800'
    ],
    coverImage: 'https://images.unsplash.com/photo-1576673442511-7e39b6545c87?w=800',
    category: 'Knitting',
    difficulty: 'intermediate',
    materials: [
      { id: '1', name: 'Merino wool yarn', quantity: '1000', unit: 'grams' },
      { id: '2', name: 'Knitting needles', quantity: '1', unit: 'pair (size 8)' },
      { id: '3', name: 'Cable needle', quantity: '1', unit: 'piece' },
      { id: '4', name: 'Buttons', quantity: '6', unit: 'pieces' }
    ],
    steps: [
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
    ],
    progress: 65,
    status: 'in_progress',
    tags: ['cardigan', 'cable-knit', 'winter', 'intermediate'],
    likes: 42,
    views: 328,
    estimatedTime: '20 hours',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-27')
  },
  {
    id: '2',
    userId: 'user2',
    username: 'SewingBee',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SewingBee',
    title: 'Vintage Summer Dress',
    description: 'A beautiful vintage-inspired summer dress with a fitted bodice and full skirt. Perfect for garden parties!',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'
    ],
    coverImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
    category: 'Sewing',
    difficulty: 'beginner',
    materials: [
      { id: '1', name: 'Cotton fabric', quantity: '3', unit: 'yards' },
      { id: '2', name: 'Matching thread', quantity: '2', unit: 'spools' },
      { id: '3', name: 'Zipper', quantity: '1', unit: '20 inch' },
      { id: '4', name: 'Interfacing', quantity: '0.5', unit: 'yard' }
    ],
    steps: [
      {
        id: '1',
        number: 1,
        title: 'Cut fabric pieces',
        description: 'Cut out all pattern pieces from fabric',
        duration: '45 minutes'
      },
      {
        id: '2',
        number: 2,
        title: 'Sew bodice',
        description: 'Assemble and sew the bodice pieces together',
        duration: '2 hours'
      }
    ],
    progress: 100,
    status: 'completed',
    tags: ['dress', 'summer', 'vintage', 'beginner-friendly'],
    likes: 89,
    views: 512,
    estimatedTime: '8 hours',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-25')
  },
  {
    id: '3',
    userId: 'user3',
    username: 'CrochetQueen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CrochetQueen',
    title: 'Rainbow Baby Blanket',
    description: 'A soft and colorful baby blanket featuring a rainbow stripe pattern. Makes a perfect gift for new parents!',
    images: [
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800'
    ],
    coverImage: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
    category: 'Crochet',
    difficulty: 'beginner',
    materials: [
      { id: '1', name: 'Soft acrylic yarn', quantity: '800', unit: 'grams (various colors)' },
      { id: '2', name: 'Crochet hook', quantity: '1', unit: 'size H/8' }
    ],
    steps: [
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
    ],
    progress: 30,
    status: 'in_progress',
    tags: ['blanket', 'baby', 'rainbow', 'gift'],
    likes: 156,
    views: 892,
    estimatedTime: '12 hours',
    createdAt: new Date('2024-12-22'),
    updatedAt: new Date('2024-12-28')
  }
];

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  
  let filteredProjects = [...mockProjects];
  
  if (query.category) {
    filteredProjects = filteredProjects.filter(p => p.category === query.category);
  }
  
  if (query.difficulty) {
    filteredProjects = filteredProjects.filter(p => p.difficulty === query.difficulty);
  }
  
  if (query.status) {
    filteredProjects = filteredProjects.filter(p => p.status === query.status);
  }
  
  if (query.userId) {
    filteredProjects = filteredProjects.filter(p => p.userId === query.userId);
  }
  
  if (query.search) {
    const searchTerm = (query.search as string).toLowerCase();
    filteredProjects = filteredProjects.filter(p => 
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
  
  const sortBy = query.sortBy || 'recent';
  switch (sortBy) {
    case 'popular':
      filteredProjects.sort((a, b) => b.likes - a.likes);
      break;
    case 'views':
      filteredProjects.sort((a, b) => b.views - a.views);
      break;
    case 'recent':
    default:
      filteredProjects.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
  }
  
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 12;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  const paginatedProjects = filteredProjects.slice(start, end);
  
  return {
    projects: paginatedProjects,
    total: filteredProjects.length,
    page,
    limit,
    totalPages: Math.ceil(filteredProjects.length / limit)
  };
});