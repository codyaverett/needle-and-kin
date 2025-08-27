import SisterComparison from './SisterComparison.vue';

export default {
  title: 'Community/SisterComparison',
  component: SisterComparison,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Side-by-side comparison component showcasing different approaches to the same craft by two sisters, highlighting the beauty of different techniques and perspectives.',
      },
    },
  },
  argTypes: {
    comparison: {
      description: 'Comparison data object with both sisters approaches',
      control: 'object',
    },
    onViewTutorial: {
      description: 'Callback when tutorial button is clicked',
      action: 'viewTutorial',
    },
    onDownloadPattern: {
      description: 'Callback when download pattern button is clicked',
      action: 'downloadPattern',
    },
  },
};

// Mock data for stories
const beginnerVsAdvanced = {
  title: "The Same Scarf, Two Different Journeys",
  description: "Both sisters decided to knit the same scarf pattern, but their different skill levels led to unique approaches and beautiful results.",
  tutorialUrl: "/tutorials/scarf-comparison",
  patternUrl: "/patterns/winter-scarf.pdf",
  sister1: {
    name: "Emma Chen", 
    approach: "Beginner",
    subtitle: "First-time cable knitter",
    avatar: "/avatars/emma.jpg",
    resultImage: "/projects/scarf-beginner.jpg",
    techniques: [
      "Basic cable knit stitch",
      "Simple color blocking",
      "Machine-finished edges"
    ],
    materials: [
      "Worsted weight wool",
      "Size 8 needles",
      "Cable needle",
      "Stitch markers"
    ],
    reasoning: "I focused on mastering the basic cable technique first, choosing simpler construction methods to build confidence. The machine-finished edges saved time and ensured a professional look.",
    timeSpent: "3 weeks",
    difficulty: "3/5"
  },
  sister2: {
    name: "Sarah Chen",
    approach: "Advanced", 
    subtitle: "Experienced pattern modifier",
    avatar: "/avatars/sarah.jpg",
    resultImage: "/projects/scarf-advanced.jpg",
    techniques: [
      "Complex cable variations",
      "Intarsia colorwork", 
      "Hand-finished seaming",
      "Custom fringe details"
    ],
    materials: [
      "Alpaca wool blend",
      "Multiple needle sizes",
      "Cable needles set",
      "Tapestry needles"
    ],
    reasoning: "I wanted to challenge myself by adding complex cable variations and intricate colorwork. The hand-finished details give it a truly artisanal quality that machine methods can't achieve.",
    timeSpent: "5 weeks", 
    difficulty: "5/5"
  },
  insights: [
    {
      title: "Skill Level Doesn't Define Beauty",
      description: "Both scarves turned out gorgeous in their own way. Emma's clean, simple execution shows that mastering basics creates stunning results."
    },
    {
      title: "Personal Style Matters", 
      description: "Sarah's love for intricate details and Emma's preference for clean lines both shine through in their individual interpretations."
    },
    {
      title: "Learning Together is Powerful",
      description: "Having a crafting partner at a different skill level created opportunities for teaching, learning, and mutual inspiration."
    }
  ]
};

const traditionalVsModern = {
  title: "Embroidery Styles: Traditional Meets Contemporary",
  description: "The same flower pattern interpreted through traditional hand embroidery versus modern mixed-media techniques.",
  tutorialUrl: "/tutorials/embroidery-comparison",
  sister1: {
    name: "Maria Rodriguez",
    approach: "Traditional",
    subtitle: "Heritage technique specialist", 
    avatar: "/avatars/maria.jpg",
    resultImage: "/projects/embroidery-traditional.jpg",
    techniques: [
      "French knots",
      "Satin stitch",
      "Chain stitch",
      "Seed stitch filling"
    ],
    materials: [
      "Cotton embroidery floss",
      "Linen fabric",
      "Wooden hoop",
      "Steel needles"
    ],
    reasoning: "I wanted to honor the traditional techniques passed down in our family. These time-tested methods create texture and depth that can't be replicated with modern shortcuts.",
    timeSpent: "2 weeks",
    difficulty: "4/5"
  },
  sister2: {
    name: "Lisa Rodriguez",
    approach: "Modern",
    subtitle: "Mixed-media innovator",
    avatar: "/avatars/lisa-r.jpg", 
    resultImage: "/projects/embroidery-modern.jpg",
    techniques: [
      "Thread painting",
      "Fabric collage",
      "Beaded accents",
      "Metallic highlights"
    ],
    materials: [
      "Silk threads",
      "Canvas base",
      "Glass beads",
      "Metallic threads"
    ],
    reasoning: "I love how contemporary materials and techniques can give fresh life to classic motifs. The mixed-media approach creates visual interest and dimension.",
    timeSpent: "10 days",
    difficulty: "3/5"
  },
  insights: [
    {
      title: "Heritage Has Its Place",
      description: "Traditional techniques carry cultural significance and create timeless beauty that connects us to our crafting ancestors."
    },
    {
      title: "Innovation Inspires",
      description: "Modern approaches can breathe new life into classic patterns and appeal to contemporary aesthetic sensibilities."
    }
  ]
};

const timeConstraints = {
  title: "One Pattern, Two Timelines",
  description: "How time constraints influenced approach and technique choices for the same cross-stitch pattern.",
  sister1: {
    name: "Amy Johnson",
    approach: "Weekend",
    subtitle: "Quick completion goal",
    avatar: "/avatars/amy.jpg",
    resultImage: "/projects/cross-stitch-quick.jpg", 
    techniques: [
      "Simplified color palette",
      "Larger stitch count",
      "Skip background details"
    ],
    materials: [
      "14-count Aida", 
      "6 thread colors",
      "Size 24 tapestry needle"
    ],
    reasoning: "With only a weekend available, I focused on the essential elements and used techniques that would give maximum visual impact in minimum time.",
    timeSpent: "2 days",
    difficulty: "2/5"
  },
  sister2: {
    name: "Beth Johnson", 
    approach: "Detailed",
    subtitle: "Perfectionist approach",
    avatar: "/avatars/beth.jpg",
    resultImage: "/projects/cross-stitch-detailed.jpg",
    techniques: [
      "Full color palette",
      "Fine stitch details",
      "Complete background",
      "French knot accents"
    ],
    materials: [
      "18-count Aida",
      "24 thread colors", 
      "Multiple needle sizes"
    ],
    reasoning: "I had more time available and wanted to capture every detail of the original pattern. The extra time investment creates a museum-quality piece.",
    timeSpent: "3 weeks",
    difficulty: "4/5"
  },
  insights: [
    {
      title: "Time Shapes Technique",
      description: "Available time directly influences technique choices, but both approaches can yield beautiful results."
    },
    {
      title: "Priorities Matter",
      description: "Identifying what matters most in a project helps guide decisions about where to invest time and energy."
    }
  ]
};

export const BeginnerVsAdvanced = {
  args: {
    comparison: beginnerVsAdvanced,
  },
};

export const TraditionalVsModern = {
  args: {
    comparison: traditionalVsModern,
  },
  parameters: {
    docs: {
      description: {
        story: 'Comparison of traditional heritage techniques versus contemporary mixed-media approaches.',
      },
    },
  },
};

export const TimeConstraints = {
  args: {
    comparison: timeConstraints,
  },
  parameters: {
    docs: {
      description: {
        story: 'How different time constraints influence crafting approaches and technique choices.',
      },
    },
  },
};

export const WithoutInsights = {
  args: {
    comparison: {
      ...beginnerVsAdvanced,
      insights: null,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Sister comparison without the insights section.',
      },
    },
  },
};

export const MinimalData = {
  args: {
    comparison: {
      title: "Simple Comparison",
      description: "A basic comparison with minimal data.",
      sister1: {
        name: "Sister One",
        approach: "Method A",
        subtitle: "First approach",
        avatar: "/avatars/placeholder.jpg",
        resultImage: "/projects/result1.jpg",
        reasoning: "This approach worked well for my style."
      },
      sister2: {
        name: "Sister Two", 
        approach: "Method B",
        subtitle: "Second approach",
        avatar: "/avatars/placeholder.jpg",
        resultImage: "/projects/result2.jpg",
        reasoning: "I preferred this technique for its simplicity."
      }
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal comparison data showing the basic component structure.',
      },
    },
  },
};

export const InteractiveDemo = {
  render: (args) => ({
    components: { SisterComparison },
    setup() {
      const handleViewTutorial = (url) => {
        console.log('Opening tutorial:', url);
        alert(`Would navigate to tutorial: ${url}`);
      };
      
      const handleDownloadPattern = (url) => {
        console.log('Downloading pattern:', url);
        alert(`Would download pattern from: ${url}`);
      };
      
      return { 
        comparison: beginnerVsAdvanced,
        handleViewTutorial,
        handleDownloadPattern
      };
    },
    template: `
      <div>
        <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded">
          <h4 class="font-semibold text-green-800 mb-2">Interactive Demo</h4>
          <p class="text-sm text-green-700 mb-2">
            Try clicking the action buttons to see the interaction handling:
          </p>
          <ul class="text-sm text-green-700 space-y-1">
            <li>• "View Full Tutorial" opens the detailed tutorial</li>
            <li>• "Download Pattern" initiates pattern download</li>
          </ul>
        </div>
        
        <SisterComparison 
          :comparison="comparison"
          @viewTutorial="handleViewTutorial"
          @downloadPattern="handleDownloadPattern"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration of the SisterComparison component with working button handlers.',
      },
    },
  },
};