import { defineEventHandler, getRouterParam, createError } from 'h3';
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
        description: 'Cast on 120 stitches and work 2x2 ribbing for 3 inches. This creates the bottom edge of your cardigan.',
        duration: '30 minutes',
        tips: [
          'Use a stretchy cast-on method for better flexibility',
          'Count your stitches carefully to ensure even ribbing'
        ]
      },
      {
        id: '2',
        number: 2,
        title: 'Begin cable pattern',
        description: 'Start the main cable pattern following the chart. Work in established pattern for 12 inches.',
        duration: '2 hours',
        tips: [
          'Use stitch markers to separate pattern repeats',
          'Keep cable needle handy for cable crosses'
        ]
      },
      {
        id: '3',
        number: 3,
        title: 'Shape armholes',
        description: 'Decrease for armholes when piece measures 14 inches. Bind off 4 stitches at beginning of next 2 rows.',
        duration: '1 hour'
      },
      {
        id: '4',
        number: 4,
        title: 'Work sleeves',
        description: 'Pick up stitches around armhole and work sleeves in the round, decreasing gradually.',
        duration: '3 hours'
      },
      {
        id: '5',
        number: 5,
        title: 'Add button bands',
        description: 'Pick up stitches along front edges and work button bands in seed stitch.',
        duration: '1 hour'
      },
      {
        id: '6',
        number: 6,
        title: 'Finishing',
        description: 'Weave in all ends, block the cardigan, and sew on buttons.',
        duration: '1 hour',
        tips: [
          'Block to measurements for best results',
          'Space buttons evenly for professional finish'
        ]
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
  }
];

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  const project = mockProjects.find(p => p.id === id);
  
  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Project not found'
    });
  }
  
  project.views++;
  
  return project;
});