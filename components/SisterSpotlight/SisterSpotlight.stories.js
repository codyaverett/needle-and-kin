import SisterSpotlight from './SisterSpotlight.vue';

export default {
  title: 'Community/SisterSpotlight',
  component: SisterSpotlight,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Featured section highlighting collaborative crafting projects between sisters, showcasing their unique partnership and shared creative journey.',
      },
    },
  },
  argTypes: {
    collaboration: {
      description: 'Collaboration project data object',
      control: 'object',
    },
    onViewTutorial: {
      description: 'Callback when tutorial button is clicked',
      action: 'viewTutorial',
    },
    onViewBehindScenes: {
      description: 'Callback when behind the scenes button is clicked',
      action: 'viewBehindScenes',
    },
  },
};

// Mock data for stories
const mockCollaboration = {
  projectTitle: "Matching Winter Mittens: A Sister Teaching Moment",
  description: "When experienced knitter Sarah taught her sister Emma the cable stitch technique, they decided to create matching mittens with a modern twist on traditional patterns. This project became a beautiful representation of knowledge sharing and creative collaboration.",
  mainImage: "/projects/sister-mittens.jpg",
  duration: "3 weekends",
  skillLevel: "Intermediate",
  tutorialUrl: "/tutorials/cable-mittens",
  behindScenesUrl: "/blog/sister-collaboration-mittens",
  sisters: [
    {
      name: "Sarah Chen",
      role: "Knitting Mentor",
      avatar: "/avatars/sarah.jpg",
      contribution: "Taught cable techniques and pattern reading, provided guidance on yarn selection and finishing touches."
    },
    {
      name: "Emma Chen",
      role: "Eager Student",
      avatar: "/avatars/emma.jpg", 
      contribution: "Learned cable knitting fundamentals, added modern color-blocking design elements to traditional patterns."
    }
  ],
  tags: ["knitting", "sister-collaboration", "teaching", "winter-accessories", "cable-knit"],
  processImages: [
    {
      src: "/process/mittens-planning.jpg",
      caption: "Planning the design together"
    },
    {
      src: "/process/mittens-yarn-selection.jpg", 
      caption: "Selecting complementary yarn colors"
    },
    {
      src: "/process/mittens-teaching.jpg",
      caption: "Sarah teaching Emma cable techniques"
    },
    {
      src: "/process/mittens-progress.jpg",
      caption: "Progress check and troubleshooting"
    }
  ]
};

const embroideryCollaboration = {
  projectTitle: "Modern Hoop Art: Blending Traditional and Contemporary Styles",
  description: "A unique collaboration where traditional embroidery master Maria mentored her sister Lisa in classical stitches, while Lisa introduced Maria to contemporary design aesthetics and mixed-media techniques.",
  mainImage: "/projects/sister-hoop-art.jpg",
  duration: "6 weeks",
  skillLevel: "Advanced Beginner",
  tutorialUrl: "/tutorials/modern-hoop-art",
  sisters: [
    {
      name: "Maria Rodriguez",
      role: "Traditional Expert",
      avatar: "/avatars/maria.jpg",
      contribution: "Shared family embroidery techniques passed down through generations, taught precision in traditional stitches."
    },
    {
      name: "Lisa Rodriguez", 
      role: "Modern Innovator",
      avatar: "/avatars/lisa-r.jpg",
      contribution: "Introduced contemporary color palettes, mixed-media elements, and modern design principles."
    }
  ],
  tags: ["embroidery", "modern-traditional", "family-techniques", "mixed-media", "hoop-art"],
  processImages: [
    {
      src: "/process/hoop-sketching.jpg",
      caption: "Sketching design concepts"
    },
    {
      src: "/process/hoop-stitch-samples.jpg",
      caption: "Traditional stitch samples"
    },
    {
      src: "/process/hoop-color-planning.jpg",
      caption: "Modern color palette selection"
    }
  ]
};

const quickProject = {
  projectTitle: "Weekend Friendship Bracelets",
  description: "A fun, quick collaboration perfect for bonding time. Both sisters learned new braiding techniques while creating matching friendship bracelets in just one weekend.",
  mainImage: "/projects/sister-bracelets.jpg", 
  duration: "1 weekend",
  skillLevel: "Beginner",
  tutorialUrl: "/tutorials/friendship-bracelets",
  behindScenesUrl: "/blog/weekend-sister-crafting",
  sisters: [
    {
      name: "Amy Johnson",
      role: "Color Coordinator", 
      avatar: "/avatars/amy.jpg",
      contribution: "Designed the color patterns and organized materials for efficient workflow."
    },
    {
      name: "Beth Johnson",
      role: "Technique Explorer",
      avatar: "/avatars/beth.jpg",
      contribution: "Researched and tested different braiding techniques, documented the process for tutorials."
    }
  ],
  tags: ["friendship-bracelets", "weekend-project", "beginner-friendly", "bonding-activity"],
  processImages: [
    {
      src: "/process/bracelets-materials.jpg",
      caption: "Organizing colorful threads"
    },
    {
      src: "/process/bracelets-braiding.jpg",
      caption: "Learning new braiding patterns"
    }
  ]
};

export const Default = {
  args: {
    collaboration: mockCollaboration,
  },
};

export const EmbroideryCollaboration = {
  args: {
    collaboration: embroideryCollaboration,
  },
  parameters: {
    docs: {
      description: {
        story: 'Sister collaboration featuring traditional embroidery techniques meeting contemporary design.',
      },
    },
  },
};

export const QuickWeekendProject = {
  args: {
    collaboration: quickProject,
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple weekend project perfect for sister bonding and skill sharing.',
      },
    },
  },
};

export const WithoutBehindScenes = {
  args: {
    collaboration: {
      ...mockCollaboration,
      behindScenesUrl: null,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Collaboration spotlight without behind-the-scenes content.',
      },
    },
  },
};

export const MinimalProcessPhotos = {
  args: {
    collaboration: {
      ...embroideryCollaboration,
      processImages: [
        {
          src: "/process/hoop-final.jpg",
          caption: "The finished collaboration"
        }
      ]
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Sister spotlight with minimal process documentation.',
      },
    },
  },
};

export const InteractiveDemo = {
  render: (_args) => ({
    components: { SisterSpotlight },
    setup() {
      const handleViewTutorial = (url) => {
        console.log('Opening tutorial:', url);
        alert(`Would navigate to tutorial: ${url}`);
      };
      
      const handleViewBehindScenes = (url) => {
        console.log('Opening behind the scenes:', url);
        alert(`Would navigate to behind the scenes: ${url}`);
      };
      
      return { 
        collaboration: mockCollaboration,
        handleViewTutorial,
        handleViewBehindScenes
      };
    },
    template: `
      <div>
        <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 class="font-semibold text-blue-800 mb-2">Interactive Demo</h4>
          <p class="text-sm text-blue-700 mb-2">
            Try clicking the action buttons to see the interaction handling:
          </p>
          <ul class="text-sm text-blue-700 space-y-1">
            <li>• "View Tutorial" opens the project tutorial</li>
            <li>• "Behind the Scenes" shows the collaboration story</li>
          </ul>
        </div>
        
        <SisterSpotlight 
          :collaboration="collaboration"
          @viewTutorial="handleViewTutorial"
          @viewBehindScenes="handleViewBehindScenes"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration of the SisterSpotlight component with working button handlers.',
      },
    },
  },
};