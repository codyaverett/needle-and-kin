import MaterialsList from './MaterialsList.vue';

export default {
  title: 'Tutorial/MaterialsList',
  component: MaterialsList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Interactive shopping and supply list component for craft projects. Features progress tracking, alternative suggestions, purchase links, and cost estimation.',
      },
    },
  },
  argTypes: {
    materials: {
      description: 'Array of material objects with details and purchase information',
      control: 'object',
    },
    projectTitle: {
      description: 'Title of the project these materials are for',
      control: 'text',
    },
    showCheckboxes: {
      description: 'Whether to show checkboxes for marking items as acquired',
      control: 'boolean',
    },
    showProgress: {
      description: 'Whether to show progress bar and completion stats',
      control: 'boolean',
    },
    showAddToCart: {
      description: 'Whether to show add to cart buttons',
      control: 'boolean',
    },
    showActions: {
      description: 'Whether to show action buttons in footer',
      control: 'boolean',
    },
    showPrintList: {
      description: 'Whether to show print list button',
      control: 'boolean',
    },
    showEmailList: {
      description: 'Whether to show email list button',
      control: 'boolean',
    },
    totalCost: {
      description: 'Total estimated cost for all materials',
      control: 'text',
    },
    onToggleMaterial: {
      description: 'Callback when material checkbox is toggled',
      action: 'toggleMaterial',
    },
    onVisitStore: {
      description: 'Callback when store link is clicked',
      action: 'visitStore',
    },
    onAddToCart: {
      description: 'Callback when add to cart is clicked',
      action: 'addToCart',
    },
    onPrintList: {
      description: 'Callback when print list is clicked',
      action: 'printList',
    },
    onEmailList: {
      description: 'Callback when email list is clicked',
      action: 'emailList',
    },
    onViewCostBreakdown: {
      description: 'Callback when cost breakdown is clicked',
      action: 'viewCostBreakdown',
    },
  },
};

// Mock materials data
const embroideryMaterials = [
  {
    id: 1,
    name: "Embroidery Hoop (6 inch)",
    quantity: "1",
    details: "Wood or bamboo",
    estimatedPrice: "$8.99",
    isChecked: false,
    notes: "Choose bamboo for sustainability",
    purchaseLinks: [
      { store: "Craft Store", url: "https://example.com/hoop" },
      { store: "Amazon", url: "https://amazon.com/hoop" }
    ],
    alternatives: ["8 inch hoop for larger designs", "Plastic hoop (budget option)"]
  },
  {
    id: 2,
    name: "DMC Cotton Embroidery Floss",
    quantity: "6 skeins",
    details: "Colors: 310 (Black), 817 (Red), 699 (Green), 972 (Yellow), 794 (Blue), 3078 (Pale Yellow)",
    estimatedPrice: "$12.50",
    isChecked: true,
    purchaseLinks: [
      { store: "Jo-Ann Fabrics", url: "https://joann.com/dmc-floss" },
      { store: "Michael's", url: "https://michaels.com/dmc" }
    ],
    alternatives: ["Anchor floss (similar quality)", "Madeira floss (premium option)"]
  },
  {
    id: 3,
    name: "Linen Fabric",
    quantity: "8x8 inches",
    details: "Natural color, 28-count",
    estimatedPrice: "$15.00",
    isChecked: false,
    notes: "28-count provides good stitch definition for beginners",
    purchaseLinks: [
      { store: "Fabric.com", url: "https://fabric.com/linen" }
    ]
  },
  {
    id: 4,
    name: "Embroidery Needles",
    quantity: "Pack of 12",
    details: "Sizes 24-26 (sharp point)",
    estimatedPrice: "$4.99",
    isChecked: false,
    alternatives: ["Tapestry needles (blunt point)", "Gold-plated needles (premium)"]
  },
  {
    id: 5,
    name: "Small Sharp Scissors",
    quantity: "1 pair",
    details: "4 inch embroidery scissors",
    estimatedPrice: "$12.00",
    isChecked: true,
    notes: "Keep these dedicated to thread work only",
    purchaseLinks: [
      { store: "Gingher", url: "https://gingher.com/scissors" }
    ]
  }
];

const knittingMaterials = [
  {
    id: 1,
    name: "Worsted Weight Yarn",
    quantity: "4 skeins",
    details: "100% Merino Wool, approx 200yds each",
    estimatedPrice: "$48.00",
    isChecked: false,
    purchaseLinks: [
      { store: "LoveCrafts", url: "https://lovecrafts.com/yarn" },
      { store: "Local Yarn Shop", url: "#" }
    ],
    alternatives: ["Acrylic blend (budget-friendly)", "Alpaca wool (luxury option)"],
    notes: "Choose machine-washable wool for practicality"
  },
  {
    id: 2,
    name: "Knitting Needles",
    quantity: "1 pair",
    details: "US Size 8 (5.0mm), 14-inch straight",
    estimatedPrice: "$18.00",
    isChecked: false,
    alternatives: ["Circular needles (more versatile)", "Bamboo needles (lightweight)"],
    purchaseLinks: [
      { store: "ChiaoGoo", url: "https://chiaogoo.com/needles" }
    ]
  },
  {
    id: 3,
    name: "Cable Needle",
    quantity: "1 set",
    details: "Short double-pointed, various sizes",
    estimatedPrice: "$8.00",
    isChecked: true,
    notes: "Essential for cable knitting techniques"
  },
  {
    id: 4,
    name: "Stitch Markers",
    quantity: "10",
    details: "Split ring or closed ring markers",
    estimatedPrice: "$6.00",
    isChecked: false,
    alternatives: ["Safety pins (budget option)", "Removable markers (for pattern adjustments)"]
  },
  {
    id: 5,
    name: "Tapestry Needle",
    quantity: "1",
    details: "Large eye, blunt point for seaming",
    estimatedPrice: "$3.00",
    isChecked: false,
    notes: "For sewing seams and weaving in ends"
  }
];

const quickProjectMaterials = [
  {
    id: 1,
    name: "Embroidery Thread",
    quantity: "3 colors",
    details: "Any craft thread or floss",
    estimatedPrice: "$5.00",
    isChecked: false,
    alternatives: ["Crochet thread", "Thin yarn"]
  },
  {
    id: 2,
    name: "Safety Pins",
    quantity: "4",
    details: "Medium size",
    estimatedPrice: "$2.00",
    isChecked: true,
    notes: "Available in most households"
  }
];

export const EmbroideryProject = {
  args: {
    materials: embroideryMaterials,
    projectTitle: "Garden Sampler Embroidery",
    showCheckboxes: true,
    showProgress: true,
    showAddToCart: true,
    showActions: true,
    showPrintList: true,
    showEmailList: true,
    totalCost: "$61.48",
  },
};

export const KnittingProject = {
  args: {
    materials: knittingMaterials,
    projectTitle: "Cable Knit Scarf",
    showCheckboxes: true,
    showProgress: true,
    showAddToCart: true,
    showActions: true,
    totalCost: "$83.00",
  },
  parameters: {
    docs: {
      description: {
        story: 'Materials list for a knitting project with yarn and needle requirements.',
      },
    },
  },
};

export const QuickProject = {
  args: {
    materials: quickProjectMaterials,
    projectTitle: "Friendship Bracelets",
    showCheckboxes: true,
    showProgress: true,
    showAddToCart: false,
    showActions: true,
    totalCost: "$7.00",
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple materials list for a quick weekend project.',
      },
    },
  },
};

export const WithoutProgress = {
  args: {
    materials: embroideryMaterials,
    projectTitle: "Advanced Embroidery Sampler",
    showCheckboxes: false,
    showProgress: false,
    showAddToCart: true,
    showActions: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Materials list without progress tracking, suitable for reference-only viewing.',
      },
    },
  },
};

export const MinimalView = {
  args: {
    materials: knittingMaterials,
    showCheckboxes: false,
    showProgress: false,
    showAddToCart: false,
    showActions: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal materials list with just the essential information.',
      },
    },
  },
};

export const ShoppingFocused = {
  args: {
    materials: embroideryMaterials.map(material => ({
      ...material,
      isChecked: false // Reset all to unchecked for shopping
    })),
    projectTitle: "Shopping List for Garden Embroidery",
    showCheckboxes: true,
    showProgress: true,
    showAddToCart: true,
    showActions: true,
    showPrintList: true,
    showEmailList: true,
    totalCost: "$61.48",
  },
  parameters: {
    docs: {
      description: {
        story: 'Materials list optimized for shopping, with purchase links and cost tracking.',
      },
    },
  },
};

export const InteractiveDemo = {
  render: (args) => ({
    components: { MaterialsList },
    setup() {
      const materials = [...embroideryMaterials];
      
      const handleToggleMaterial = (materialId) => {
        console.log('Toggling material:', materialId);
        const material = materials.find(m => m.id === materialId);
        if (material) {
          material.isChecked = !material.isChecked;
        }
      };
      
      const handleVisitStore = (url, store) => {
        console.log('Visiting store:', store, url);
        alert(`Would open ${store} at: ${url}`);
      };
      
      const handleAddToCart = (material) => {
        console.log('Adding to cart:', material);
        alert(`Added "${material.name}" to cart`);
      };
      
      const handlePrintList = () => {
        console.log('Printing materials list');
        alert('Would print the materials list');
      };
      
      const handleEmailList = () => {
        console.log('Emailing materials list');
        alert('Would open email composer with materials list');
      };
      
      const handleViewCostBreakdown = () => {
        console.log('Viewing cost breakdown');
        alert('Would show detailed cost breakdown');
      };
      
      return { 
        materials,
        handleToggleMaterial,
        handleVisitStore,
        handleAddToCart,
        handlePrintList,
        handleEmailList,
        handleViewCostBreakdown
      };
    },
    template: `
      <div>
        <div class="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded">
          <h4 class="font-semibold text-indigo-800 mb-2">Interactive Demo</h4>
          <p class="text-sm text-indigo-700 mb-2">
            Try the interactive features:
          </p>
          <ul class="text-sm text-indigo-700 space-y-1">
            <li>• Check off materials as you acquire them</li>
            <li>• Click store links to visit suppliers</li>
            <li>• Use "Add to Cart" buttons for quick shopping</li>
            <li>• Try the action buttons (Print, Email, Cost Breakdown)</li>
            <li>• Expand alternative options for materials</li>
          </ul>
        </div>
        
        <MaterialsList 
          :materials="materials"
          projectTitle="Interactive Garden Embroidery"
          :showCheckboxes="true"
          :showProgress="true"
          :showAddToCart="true"
          :showActions="true"
          :showPrintList="true"
          :showEmailList="true"
          totalCost="$61.48"
          @toggleMaterial="handleToggleMaterial"
          @visitStore="handleVisitStore"
          @addToCart="handleAddToCart"
          @printList="handlePrintList"
          @emailList="handleEmailList"
          @viewCostBreakdown="handleViewCostBreakdown"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration with working checkboxes, store links, and action buttons.',
      },
    },
  },
};

export const AlternativesShowcase = {
  render: () => ({
    components: { MaterialsList },
    setup() {
      const materialsWithAlternatives = [
        {
          id: 1,
          name: "Premium Embroidery Thread",
          quantity: "8 skeins",
          details: "High-quality silk blend",
          estimatedPrice: "$32.00",
          isChecked: false,
          showAlternatives: false,
          alternatives: [
            "Cotton embroidery floss (budget option - $12)",
            "Metallic thread (special effects - $18)", 
            "Variegated thread (color-changing - $24)",
            "Glow-in-the-dark thread (novelty - $28)"
          ],
          notes: "Silk blend provides superior shine and durability",
          purchaseLinks: [
            { store: "Premium Threads Co", url: "https://example.com" }
          ]
        },
        {
          id: 2, 
          name: "Professional Embroidery Hoop",
          quantity: "1",
          details: "8-inch beechwood with brass hardware",
          estimatedPrice: "$45.00",
          isChecked: false,
          showAlternatives: false,
          alternatives: [
            "Plastic hoop (basic option - $6)",
            "Bamboo hoop (eco-friendly - $12)",
            "Scroll frame (large projects - $85)",
            "Q-Snap frame (no-hoop alternative - $15)"
          ],
          notes: "Professional quality ensures even tension"
        }
      ];
      
      return { materialsWithAlternatives };
    },
    template: `
      <div>
        <div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <strong>Showcase:</strong> Click "alternatives" links below each material to see different options and price points.
        </div>
        
        <MaterialsList 
          :materials="materialsWithAlternatives"
          projectTitle="Professional Embroidery Project"
          totalCost="$77.00"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of materials with extensive alternative options and price comparisons.',
      },
    },
  },
};