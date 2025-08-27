import ProgressTracker from './ProgressTracker.vue';

export default {
  title: 'Learning/ProgressTracker',
  component: ProgressTracker,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Interactive progress tracking component for tutorials and learning journeys. Helps users track their completion of multi-step crafting projects with resources, time estimates, and completion certificates.',
      },
    },
  },
  argTypes: {
    title: {
      description: 'Title of the learning track or tutorial',
      control: 'text',
    },
    description: {
      description: 'Optional description of the learning track',
      control: 'text',
    },
    steps: {
      description: 'Array of step objects with completion tracking',
      control: 'object',
    },
    allowReset: {
      description: 'Whether users can reset individual completed steps',
      control: 'boolean',
    },
    showActions: {
      description: 'Whether to show action buttons in footer',
      control: 'boolean',
    },
    showResetAll: {
      description: 'Whether to show reset all progress button',
      control: 'boolean',
    },
    showCertificate: {
      description: 'Whether to show certificate button when completed',
      control: 'boolean',
    },
    showShare: {
      description: 'Whether to show share progress button',
      control: 'boolean',
    },
    onMarkComplete: {
      description: 'Callback when step is marked complete',
      action: 'markComplete',
    },
    onMarkIncomplete: {
      description: 'Callback when step is reset',
      action: 'markIncomplete',
    },
    onOpenResource: {
      description: 'Callback when resource is opened',
      action: 'openResource',
    },
    onOpenTutorial: {
      description: 'Callback when tutorial is opened',
      action: 'openTutorial',
    },
    onResetAll: {
      description: 'Callback when all progress is reset',
      action: 'resetAll',
    },
    onGenerateCertificate: {
      description: 'Callback when certificate is generated',
      action: 'generateCertificate',
    },
    onShareProgress: {
      description: 'Callback when progress is shared',
      action: 'shareProgress',
    },
  },
};

// Mock steps data
const embroiderySteps = [
  {
    id: 1,
    title: "Gather Materials",
    description: "Collect all necessary supplies for your embroidery project",
    isCompleted: true,
    isActive: false,
    timeEstimate: "15 minutes",
    details: [
      "Embroidery hoop (6-8 inches)",
      "Cotton embroidery floss",
      "Fabric (linen or cotton)",
      "Needles and scissors"
    ],
    resources: [
      { title: "Materials List", url: "/resources/embroidery-materials" },
      { title: "Shopping Guide", url: "/guides/where-to-buy" }
    ]
  },
  {
    id: 2,
    title: "Prepare Your Fabric",
    description: "Cut fabric to size and secure in embroidery hoop",
    isCompleted: true,
    isActive: false,
    timeEstimate: "10 minutes",
    details: [
      "Cut fabric 2 inches larger than hoop",
      "Place fabric in hoop with grain straight", 
      "Tighten hoop evenly for proper tension"
    ],
    notes: "Proper fabric tension is crucial for even stitches",
    tutorialUrl: "/tutorials/fabric-prep"
  },
  {
    id: 3,
    title: "Learn Basic Stitches", 
    description: "Master the fundamental embroidery stitches",
    isCompleted: false,
    isActive: true,
    timeEstimate: "45 minutes",
    details: [
      "Running stitch",
      "Back stitch", 
      "French knots",
      "Satin stitch"
    ],
    resources: [
      { title: "Stitch Library", url: "/stitches/basic" },
      { title: "Video Tutorial", url: "/videos/basic-stitches" }
    ],
    tutorialUrl: "/tutorials/basic-stitches"
  },
  {
    id: 4,
    title: "Create Your First Motif",
    description: "Apply your new skills to create a simple flower design",
    isCompleted: false,
    isActive: false, 
    timeEstimate: "1-2 hours",
    details: [
      "Transfer pattern to fabric",
      "Start with outline stitches",
      "Fill with satin stitch",
      "Add French knot centers"
    ],
    resources: [
      { title: "Flower Pattern", url: "/patterns/simple-flower" }
    ]
  },
  {
    id: 5,
    title: "Finish and Display",
    description: "Complete your embroidery and prepare for display",
    isCompleted: false,
    isActive: false,
    timeEstimate: "30 minutes", 
    details: [
      "Remove from hoop carefully",
      "Press lightly with iron",
      "Frame or mount as desired",
      "Sign and date your work"
    ],
    resources: [
      { title: "Finishing Guide", url: "/guides/finishing" },
      { title: "Framing Options", url: "/guides/framing" }
    ]
  }
];

const knittingSteps = [
  {
    id: 1,
    title: "Choose Your Yarn",
    description: "Select appropriate yarn weight and fiber for your project",
    isCompleted: true,
    isActive: false,
    timeEstimate: "20 minutes",
    details: [
      "Consider project requirements",
      "Check yarn weight and gauge",
      "Select complementary colors"
    ]
  },
  {
    id: 2, 
    title: "Cast On Stitches",
    description: "Create the foundation row of stitches",
    isCompleted: true,
    isActive: false,
    timeEstimate: "15 minutes",
    tutorialUrl: "/tutorials/cast-on"
  },
  {
    id: 3,
    title: "Knit Basic Rows",
    description: "Practice knit and purl stitches",
    isCompleted: false,
    isActive: true,
    timeEstimate: "1 hour",
    notes: "Keep tension consistent across all stitches"
  },
  {
    id: 4,
    title: "Follow Pattern",
    description: "Work through the specific stitch pattern",
    isCompleted: false,
    isActive: false,
    timeEstimate: "3-4 hours"
  },
  {
    id: 5,
    title: "Cast Off and Finish",
    description: "Bind off stitches and weave in ends",
    isCompleted: false,
    isActive: false,
    timeEstimate: "20 minutes"
  }
];

const quickProjectSteps = [
  {
    id: 1,
    title: "Cut Threads",
    description: "Cut embroidery threads to working length",
    isCompleted: true,
    isActive: false,
    timeEstimate: "5 minutes"
  },
  {
    id: 2,
    title: "Make Friendship Bracelet",
    description: "Braid threads into friendship bracelet pattern",
    isCompleted: true,
    isActive: false,
    timeEstimate: "30 minutes"
  },
  {
    id: 3,
    title: "Add Finishing Touches",
    description: "Tie off ends and add clasps if desired",
    isCompleted: true,
    isActive: false,
    timeEstimate: "10 minutes"
  }
];

export const EmbroideryTutorial = {
  args: {
    title: "Learn Embroidery Basics",
    description: "Complete beginner's guide to hand embroidery fundamentals",
    steps: embroiderySteps,
    allowReset: true,
    showActions: true,
    showResetAll: true,
    showCertificate: true,
    showShare: true,
  },
};

export const KnittingProgress = {
  args: {
    title: "Your First Knitting Project",
    description: "Step-by-step guide to knitting a simple scarf",
    steps: knittingSteps,
    allowReset: true,
    showActions: true,
    showResetAll: true,
    showCertificate: true,
    showShare: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress tracker for a knitting tutorial with different completion states.',
      },
    },
  },
};

export const CompletedProject = {
  args: {
    title: "Friendship Bracelets Workshop",
    description: "Quick and fun project perfect for beginners",
    steps: quickProjectSteps,
    allowReset: true,
    showActions: true,
    showResetAll: true,
    showCertificate: true,
    showShare: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Completed project showing congratulations message and certificate option.',
      },
    },
  },
};

export const MinimalView = {
  args: {
    title: "Quick Tutorial Tracker",
    steps: [
      { id: 1, title: "Step 1", isCompleted: true, isActive: false },
      { id: 2, title: "Step 2", isCompleted: false, isActive: true },
      { id: 3, title: "Step 3", isCompleted: false, isActive: false }
    ],
    allowReset: false,
    showActions: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal progress tracker without actions or reset functionality.',
      },
    },
  },
};

export const WithoutReset = {
  args: {
    title: "Linear Learning Path",
    description: "Sequential tutorial that cannot be reset",
    steps: embroiderySteps,
    allowReset: false,
    showActions: true,
    showResetAll: false,
    showCertificate: true,
    showShare: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress tracker without reset functionality for linear learning paths.',
      },
    },
  },
};

export const DetailedSteps = {
  args: {
    title: "Advanced Embroidery Techniques",
    description: "Master complex stitches and advanced methods",
    steps: [
      {
        id: 1,
        title: "Master French Knots",
        description: "Learn to create perfect, consistent French knots",
        isCompleted: false,
        isActive: true,
        timeEstimate: "45 minutes",
        details: [
          "Wrap thread around needle 2-3 times",
          "Keep tension consistent",
          "Pull through close to entry point",
          "Practice on sample fabric first"
        ],
        resources: [
          { title: "Video Tutorial", url: "/videos/french-knots" },
          { title: "Common Mistakes", url: "/guides/french-knot-troubleshooting" },
          { title: "Practice Patterns", url: "/patterns/french-knot-practice" }
        ],
        tutorialUrl: "/tutorials/french-knots",
        notes: "French knots can be tricky at first - don't get discouraged!"
      },
      {
        id: 2,
        title: "Dimensional Flowers",
        description: "Create raised, textured flower designs",
        isCompleted: false,
        isActive: false,
        timeEstimate: "2 hours",
        details: [
          "Layer different stitch types",
          "Use varying thread weights",
          "Build up texture gradually"
        ],
        resources: [
          { title: "Dimensional Techniques", url: "/guides/3d-embroidery" }
        ]
      }
    ],
    allowReset: true,
    showActions: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress tracker with detailed steps including resources, notes, and time estimates.',
      },
    },
  },
};

export const InteractiveDemo = {
  render: (args) => ({
    components: { ProgressTracker },
    setup() {
      const steps = [...embroiderySteps];
      
      const handleMarkComplete = (stepId) => {
        console.log('Marking step complete:', stepId);
        const step = steps.find(s => s.id === stepId);
        if (step) {
          step.isCompleted = true;
          step.isActive = false;
          // Activate next step
          const currentIndex = steps.findIndex(s => s.id === stepId);
          if (currentIndex < steps.length - 1) {
            steps[currentIndex + 1].isActive = true;
          }
        }
      };
      
      const handleMarkIncomplete = (stepId) => {
        console.log('Resetting step:', stepId);
        const step = steps.find(s => s.id === stepId);
        if (step) {
          step.isCompleted = false;
          step.isActive = true;
          // Deactivate subsequent steps
          const currentIndex = steps.findIndex(s => s.id === stepId);
          for (let i = currentIndex + 1; i < steps.length; i++) {
            steps[i].isActive = false;
            steps[i].isCompleted = false;
          }
        }
      };
      
      const handleOpenResource = (resource) => {
        console.log('Opening resource:', resource);
        alert(`Would open resource: "${resource.title}" at ${resource.url}`);
      };
      
      const handleOpenTutorial = (url) => {
        console.log('Opening tutorial:', url);
        alert(`Would open tutorial at: ${url}`);
      };
      
      const handleResetAll = () => {
        console.log('Resetting all progress');
        steps.forEach((step, index) => {
          step.isCompleted = false;
          step.isActive = index === 0;
        });
      };
      
      const handleGenerateCertificate = () => {
        console.log('Generating certificate');
        alert('Would generate completion certificate');
      };
      
      const handleShareProgress = () => {
        console.log('Sharing progress');
        alert('Would open sharing options');
      };
      
      return { 
        steps,
        handleMarkComplete,
        handleMarkIncomplete,
        handleOpenResource,
        handleOpenTutorial,
        handleResetAll,
        handleGenerateCertificate,
        handleShareProgress
      };
    },
    template: `
      <div>
        <div class="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded">
          <h4 class="font-semibold text-emerald-800 mb-2">Interactive Demo</h4>
          <p class="text-sm text-emerald-700 mb-2">
            Try the interactive features:
          </p>
          <ul class="text-sm text-emerald-700 space-y-1">
            <li>• Click "Mark Complete" on active steps</li>
            <li>• Click "Reset" on completed steps</li>
            <li>• Open resources and tutorials</li>
            <li>• Try footer actions when available</li>
            <li>• Complete all steps to see the certificate option</li>
          </ul>
        </div>
        
        <ProgressTracker 
          title="Interactive Embroidery Tutorial"
          description="Complete beginner's guide with interactive tracking"
          :steps="steps"
          :allowReset="true"
          :showActions="true"
          :showResetAll="true"
          :showCertificate="true"
          :showShare="true"
          @markComplete="handleMarkComplete"
          @markIncomplete="handleMarkIncomplete"
          @openResource="handleOpenResource"
          @openTutorial="handleOpenTutorial"
          @resetAll="handleResetAll"
          @generateCertificate="handleGenerateCertificate"
          @shareProgress="handleShareProgress"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration with working progress tracking, step management, and resource access.',
      },
    },
  },
};