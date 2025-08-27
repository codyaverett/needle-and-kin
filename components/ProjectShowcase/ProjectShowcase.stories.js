import ProjectShowcase from './ProjectShowcase.vue';

export default {
  title: 'Community/ProjectShowcase',
  component: ProjectShowcase,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Gallery component for displaying community-submitted crafting projects with filtering, favoriting, and detailed project information.',
      },
    },
  },
  argTypes: {
    projects: {
      description: 'Array of project objects to display',
      control: 'object',
    },
    layout: {
      description: 'Layout style for the project grid',
      control: 'radio',
      options: ['grid', 'masonry'],
    },
    showFilters: {
      description: 'Whether to show craft type filters',
      control: 'boolean',
    },
    showFavorites: {
      description: 'Whether to show favorite heart buttons',
      control: 'boolean',
    },
    showLoadMore: {
      description: 'Whether to show load more button',
      control: 'boolean',
    },
    onViewProject: {
      description: 'Callback when a project is clicked',
      action: 'viewProject',
    },
    onToggleFavorite: {
      description: 'Callback when favorite button is clicked',
      action: 'toggleFavorite',
    },
    onLoadMore: {
      description: 'Callback when load more button is clicked',
      action: 'loadMore',
    },
  },
};

// Mock projects data
const mockProjects = [
  {
    id: 1,
    title: "Sunrise Garden Embroidery Hoop",
    description: "A vibrant morning garden scene featuring French knots for texture and satin stitch flowers. Inspired by my grandmother's garden.",
    mainImage: "/showcase/embroidery-garden.jpg",
    craftType: "embroidery",
    timeSpent: "3 weeks",
    difficulty: 4,
    likes: 127,
    isFavorited: true,
    maker: {
      name: "Jennifer Walsh",
      avatar: "/avatars/jennifer.jpg",
      location: "Portland, OR"
    },
    techniques: ["French knots", "Satin stitch", "Chain stitch", "Seed stitch"]
  },
  {
    id: 2,
    title: "Cozy Cable Knit Baby Blanket",
    description: "Soft merino wool baby blanket with intricate cable patterns. Made for my newborn niece with lots of love.",
    mainImage: "/showcase/baby-blanket.jpg",
    craftType: "knitting",
    timeSpent: "2 months",
    difficulty: 5,
    likes: 89,
    isFavorited: false,
    maker: {
      name: "Rebecca Stone", 
      avatar: "/avatars/rebecca.jpg",
      location: "Denver, CO"
    },
    techniques: ["Cable knitting", "Seed stitch", "Stockinette", "Cast on techniques"]
  },
  {
    id: 3,
    title: "Upcycled Denim Patchwork Quilt",
    description: "Turned old family jeans into a memory quilt. Each patch tells a story of adventures and growth.",
    mainImage: "/showcase/denim-quilt.jpg",
    craftType: "upcycling",
    timeSpent: "6 weeks",
    difficulty: 3,
    likes: 156,
    isFavorited: true,
    maker: {
      name: "Maria Santos",
      avatar: "/avatars/maria-s.jpg", 
      location: "Austin, TX"
    },
    techniques: ["Patchwork", "Machine quilting", "Fabric preparation", "Binding"]
  },
  {
    id: 4,
    title: "Bohemian Macramé Wall Hanging",
    description: "Large statement piece using natural cotton cord. Perfect for bringing texture and warmth to modern spaces.",
    mainImage: "/showcase/macrame-wall.jpg",
    craftType: "macrame",
    timeSpent: "1 week",
    difficulty: 2,
    likes: 73,
    isFavorited: false,
    maker: {
      name: "Sophie Chen",
      avatar: "/avatars/sophie.jpg",
      location: "San Francisco, CA"
    },
    techniques: ["Square knots", "Spiral knots", "Mounting techniques"]
  },
  {
    id: 5,
    title: "Vintage Floral Cross-Stitch Sampler",
    description: "Recreation of a 1920s pattern found in my great-aunt's sewing box. Updated with modern color palette.",
    mainImage: "/showcase/cross-stitch-vintage.jpg",
    craftType: "cross-stitch",
    timeSpent: "4 weeks", 
    difficulty: 3,
    likes: 94,
    isFavorited: true,
    maker: {
      name: "Eleanor Price",
      avatar: "/avatars/eleanor.jpg",
      location: "Charleston, SC"
    },
    techniques: ["Cross-stitch", "Backstitch", "French knots", "Color blending"]
  },
  {
    id: 6,
    title: "Modern Geometric Embroidery Art",
    description: "Contemporary take on traditional embroidery with bold geometric shapes and metallic threads.",
    mainImage: "/showcase/geometric-embroidery.jpg", 
    craftType: "embroidery",
    timeSpent: "2 weeks",
    difficulty: 3,
    likes: 112,
    isFavorited: false,
    maker: {
      name: "Alex Kim",
      avatar: "/avatars/alex.jpg",
      location: "Seattle, WA" 
    },
    techniques: ["Modern embroidery", "Metallic threads", "Geometric design", "Color blocking"]
  },
  {
    id: 7,
    title: "Hand-Knitted Fair Isle Sweater",
    description: "Traditional Scottish Fair Isle pattern in contemporary colors. My first attempt at colorwork knitting!",
    mainImage: "/showcase/fair-isle-sweater.jpg",
    craftType: "knitting",
    timeSpent: "3 months",
    difficulty: 5,
    likes: 201,
    isFavorited: true,
    maker: {
      name: "Hannah McLeod",
      avatar: "/avatars/hannah.jpg",
      location: "Edinburgh, UK"
    },
    techniques: ["Fair Isle colorwork", "Circular knitting", "Steeks", "Blocking"]
  },
  {
    id: 8,
    title: "Repurposed Sweater Plant Hangers",
    description: "Gave new life to old wool sweaters by turning them into hanging planters. Sustainable and stylish!",
    mainImage: "/showcase/sweater-planters.jpg",
    craftType: "upcycling", 
    timeSpent: "2 days",
    difficulty: 1,
    likes: 67,
    isFavorited: false,
    maker: {
      name: "Grace Miller",
      avatar: "/avatars/grace.jpg",
      location: "Portland, ME"
    },
    techniques: ["Felting", "Cutting", "Sewing", "Upcycling"]
  }
];

export const Default = {
  args: {
    projects: mockProjects,
    layout: 'grid',
    showFilters: true,
    showFavorites: true,
    showLoadMore: true,
  },
};

export const MasonryLayout = {
  args: {
    projects: mockProjects,
    layout: 'masonry',
    showFilters: true,
    showFavorites: true,
    showLoadMore: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Projects displayed in a Pinterest-style masonry layout.',
      },
    },
  },
};

export const NoFilters = {
  args: {
    projects: mockProjects,
    layout: 'grid',
    showFilters: false,
    showFavorites: true,
    showLoadMore: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Project showcase without filtering options.',
      },
    },
  },
};

export const MinimalView = {
  args: {
    projects: mockProjects,
    layout: 'grid',
    showFilters: false,
    showFavorites: false,
    showLoadMore: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal view with just project information, no interactive elements.',
      },
    },
  },
};

export const EmptyState = {
  args: {
    projects: [],
    layout: 'grid',
    showFilters: true,
    showFavorites: true,
    showLoadMore: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no projects are available.',
      },
    },
  },
};

export const SingleCraftType = {
  args: {
    projects: mockProjects.filter(p => p.craftType === 'embroidery'),
    layout: 'grid',
    showFilters: true,
    showFavorites: true,
    showLoadMore: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Showcase featuring only embroidery projects.',
      },
    },
  },
};

export const FewProjects = {
  args: {
    projects: mockProjects.slice(0, 3),
    layout: 'grid',
    showFilters: true,
    showFavorites: true,
    showLoadMore: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Showcase with only a few projects, showing load more functionality.',
      },
    },
  },
};

export const InteractiveDemo = {
  render: () => ({
    components: { ProjectShowcase },
    setup() {
      const projects = [...mockProjects];
      
      const handleViewProject = (project) => {
        console.log('Viewing project:', project);
        alert(`Would view project: "${project.title}" by ${project.maker.name}`);
      };
      
      const handleToggleFavorite = (projectId) => {
        console.log('Toggling favorite for project:', projectId);
        const project = projects.find(p => p.id === projectId);
        if (project) {
          project.isFavorited = !project.isFavorited;
          project.likes += project.isFavorited ? 1 : -1;
        }
      };
      
      const handleLoadMore = () => {
        console.log('Loading more projects...');
        alert('Would load more projects from the server');
      };
      
      return { 
        projects,
        handleViewProject,
        handleToggleFavorite,
        handleLoadMore
      };
    },
    template: `
      <div>
        <div class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded">
          <h4 class="font-semibold text-amber-800 mb-2">Interactive Demo</h4>
          <p class="text-sm text-amber-700 mb-2">
            Try the interactive features:
          </p>
          <ul class="text-sm text-amber-700 space-y-1">
            <li>• Click on projects to view details</li>
            <li>• Click heart icons to favorite/unfavorite</li>
            <li>• Use craft type filters to narrow results</li>
            <li>• Click "Load More Projects" to see loading behavior</li>
          </ul>
        </div>
        
        <ProjectShowcase 
          :projects="projects"
          layout="grid"
          :showFilters="true"
          :showFavorites="true" 
          :showLoadMore="true"
          @viewProject="handleViewProject"
          @toggleFavorite="handleToggleFavorite"
          @loadMore="handleLoadMore"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration with working favorites, filtering, and project viewing.',
      },
    },
  },
};