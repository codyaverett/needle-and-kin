import MakerStory from './MakerStory.vue';

export default {
  title: 'Community/MakerStory',
  component: MakerStory,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Personal narrative component for featuring community members and their crafting journeys. Showcases their story, projects, inspiration, and advice for fellow makers.',
      },
    },
  },
  argTypes: {
    maker: {
      description: 'Maker profile object with story, projects, and personal details',
      control: 'object',
    },
    showContact: {
      description: 'Whether to show contact button',
      control: 'boolean',
    },
    showFollow: {
      description: 'Whether to show follow button',
      control: 'boolean',
    },
    onViewProject: {
      description: 'Callback when featured project is clicked',
      action: 'viewProject',
    },
    onVisitSocial: {
      description: 'Callback when social media link is clicked',
      action: 'visitSocial',
    },
    onContact: {
      description: 'Callback when contact button is clicked',
      action: 'contact',
    },
    onFollow: {
      description: 'Callback when follow button is clicked',
      action: 'follow',
    },
  },
};

// Mock maker data
const experiencedMaker = {
  name: "Elena Rodriguez",
  tagline: "Traditional techniques meet modern creativity",
  location: "Santa Fe, New Mexico",
  role: "Master Embroiderer & Heritage Craft Preservationist",
  avatar: "/avatars/elena.jpg",
  coverImage: "/makers/elena-studio.jpg",
  yearsOfExperience: 25,
  projectsCompleted: 150,
  storyTitle: "From Grandmother's Lessons to Global Recognition",
  story: [
    "My journey with embroidery began when I was seven years old, sitting beside my grandmother Esperanza as she worked on intricate Mexican florals for our family's traditional clothing. What started as a way to spend quiet afternoons together became my life's passion.",
    "After studying textile arts in college, I spent several years traveling through Central and South America, learning traditional embroidery techniques from indigenous artisans. Each region taught me something new—from the bold geometric patterns of Peruvian textiles to the delicate whitework of Colombian needlework.",
    "Today, I focus on preserving these traditional techniques while finding ways to make them relevant for contemporary makers. My work has been featured in museums, and I teach workshops internationally, but my favorite moments are still those quiet times at my embroidery hoop, connecting with generations of makers who came before me."
  ],
  specialties: ["Traditional Mexican Embroidery", "Indigenous Techniques", "Heritage Preservation", "Contemporary Applications"],
  featuredProjects: [
    {
      id: 1,
      title: "Heritage Floral Table Runner",
      technique: "Mexican Floral Embroidery",
      image: "/projects/elena-runner.jpg"
    },
    {
      id: 2,
      title: "Modern Geometric Wall Art",
      technique: "Peruvian-Inspired Patterns",
      image: "/projects/elena-geometric.jpg"
    },
    {
      id: 3,
      title: "Wedding Mantilla Recreation",
      technique: "Spanish Whitework",
      image: "/projects/elena-mantilla.jpg"
    }
  ],
  inspiration: {
    quote: "Every stitch carries the stories of the women who came before us. When I embroider, I'm not just creating something beautiful—I'm keeping alive the knowledge, dreams, and resilience of my ancestors.",
    details: [
      "I find inspiration in the natural landscapes of the Southwest—the way morning light hits red rock formations influences my color choices.",
      "Museum collections of historical textiles fuel my research into forgotten techniques.",
      "Working with modern makers who bring fresh perspectives to traditional crafts energizes my teaching."
    ]
  },
  advice: [
    "Don't rush your learning. Traditional embroidery techniques have been refined over centuries—give yourself time to truly understand each stitch.",
    "Seek out authentic sources when learning cultural techniques. Understanding the history and meaning behind patterns enriches your work.",
    "Start a stitch journal. Document new techniques, color combinations, and ideas. Your future self will thank you."
  ],
  socialLinks: [
    { platform: "Instagram", url: "https://instagram.com/elenaembroidery" },
    { platform: "Blog", url: "https://elenaembroidery.com/blog" },
    { platform: "Etsy Shop", url: "https://etsy.com/shop/elenaheritage" }
  ]
};

const beginnerMaker = {
  name: "Jake Thompson",
  tagline: "Learning one stitch at a time",
  location: "Portland, Oregon",
  role: "Software Developer & Embroidery Enthusiast",
  avatar: "/avatars/jake.jpg",
  yearsOfExperience: 1,
  projectsCompleted: 12,
  storyTitle: "Finding Balance Through Needlework",
  story: [
    "I discovered embroidery during the pandemic when I was working from home and feeling overwhelmed by screen time. A friend suggested I try a 'mindful hobby,' and something about the idea of creating with my hands appealed to me.",
    "My first project was a disaster—uneven stitches, tangled threads, and a design that looked nothing like the tutorial. But there was something meditative about the rhythm of stitching that kept me coming back.",
    "Now, a year later, embroidery has become my favorite way to unwind after coding all day. There's something beautiful about the contrast between the precision of programming and the organic flow of hand stitching. My coworkers are always surprised when they see my latest project—it's opened up conversations about creativity and balance that I never expected."
  ],
  specialties: ["Modern Embroidery", "Geometric Patterns", "Tech-Inspired Designs"],
  featuredProjects: [
    {
      id: 1,
      title: "Circuit Board Sampler",
      technique: "Modern Line Work",
      image: "/projects/jake-circuit.jpg"
    },
    {
      id: 2,
      title: "Pixel Art Portrait",
      technique: "Cross-Stitch Adaptation",
      image: "/projects/jake-pixel.jpg"
    }
  ],
  inspiration: {
    quote: "Embroidery taught me that perfection isn't the goal—progress is. Every uneven stitch is part of the learning journey, and that's okay.",
    details: [
      "The intersection of technology and traditional crafts fascinates me—there are so many parallels between coding logic and pattern construction.",
      "Other makers in online communities who share their mistakes and learning processes inspire me to keep going when projects don't turn out as planned."
    ]
  },
  advice: [
    "Start simple and be patient with yourself. Your first project doesn't need to be museum-worthy.",
    "Join online communities—the embroidery community is incredibly welcoming to beginners.",
    "Don't be afraid to adapt patterns or try unconventional designs. Some of my favorite pieces came from 'happy accidents.'"
  ],
  socialLinks: [
    { platform: "Instagram", url: "https://instagram.com/jakestitch" },
    { platform: "GitHub", url: "https://github.com/jakethompson" }
  ]
};

const businessMaker = {
  name: "Sarah Kim",
  tagline: "Sustainable fashion through upcycling",
  location: "Toronto, Canada",
  role: "Fashion Designer & Sustainability Advocate",
  avatar: "/avatars/sarah-k.jpg",
  coverImage: "/makers/sarah-workshop.jpg",
  yearsOfExperience: 8,
  projectsCompleted: 200,
  storyTitle: "From Fast Fashion to Mindful Making",
  story: [
    "I started my career in fast fashion, but watching the environmental and human costs of the industry made me question everything. I began experimenting with upcycling old clothes as a creative outlet and a way to reduce waste.",
    "What began as weekend projects evolved into a full business when friends started asking me to transform their old clothes. Now I run workshops teaching people how to give new life to their wardrobes while building a more sustainable relationship with clothing.",
    "My work focuses on showing people that you don't need to be a master seamstress to make meaningful changes to your clothes. Simple techniques like visible mending, creative patching, and basic alterations can transform both your wardrobe and your perspective on consumption."
  ],
  specialties: ["Visible Mending", "Denim Upcycling", "Sustainable Fashion", "Creative Patching"],
  featuredProjects: [
    {
      id: 1,
      title: "Patchwork Jacket Collection",
      technique: "Mixed Media Upcycling",
      image: "/projects/sarah-jackets.jpg"
    },
    {
      id: 2,
      title: "Sashiko Jeans Series",
      technique: "Japanese Visible Mending",
      image: "/projects/sarah-sashiko.jpg"
    },
    {
      id: 3,
      title: "Embroidered Story Shirts",
      technique: "Narrative Embroidery",
      image: "/projects/sarah-stories.jpg"
    }
  ],
  inspiration: {
    quote: "Every piece of clothing has a story. Instead of throwing away 'broken' items, we can honor their journey by giving them new chapters through creative repair and transformation.",
    details: [
      "Japanese concepts like 'mottainai' (regret over waste) and 'wabi-sabi' (finding beauty in imperfection) heavily influence my approach to upcycling.",
      "Working with people to transform clothes that have sentimental value—wedding dresses, inherited pieces, first job outfits—reminds me why this work matters."
    ]
  },
  advice: [
    "Start with clothes you already love but can't wear anymore. The emotional connection will motivate you through the learning process.",
    "Document your transformations—before and after photos help you see how much you've learned and inspire others.",
    "Don't aim for invisibility in repairs. Visible mending can be just as beautiful as 'perfect' fixes, and it tells the story of the garment's life."
  ],
  socialLinks: [
    { platform: "Website", url: "https://sarahkimupcycling.com" },
    { platform: "YouTube", url: "https://youtube.com/sarahkimupcycle" },
    { platform: "Instagram", url: "https://instagram.com/sarahkimupcycle" }
  ]
};

export const ExperiencedMaker = {
  args: {
    maker: experiencedMaker,
    showContact: true,
    showFollow: true,
  },
};

export const BeginnerJourney = {
  args: {
    maker: beginnerMaker,
    showContact: true,
    showFollow: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Story of a beginner maker sharing their learning journey and encouraging others.',
      },
    },
  },
};

export const BusinessMaker = {
  args: {
    maker: businessMaker,
    showContact: true,
    showFollow: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Professional maker who turned crafting into a sustainable business and teaching platform.',
      },
    },
  },
};

export const MinimalProfile = {
  args: {
    maker: {
      name: "Alex Chen",
      location: "San Francisco, CA",
      role: "Weekend Crafter",
      avatar: "/avatars/alex.jpg",
      story: [
        "I started crafting as a way to disconnect from technology and create something tangible with my hands.",
        "My favorite projects are small, portable ones that I can work on during commutes or while traveling."
      ],
      specialties: ["Travel Crafts", "Portable Projects"]
    },
    showContact: false,
    showFollow: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal maker profile with essential information only.',
      },
    },
  },
};

export const WithoutCoverImage = {
  args: {
    maker: {
      ...beginnerMaker,
      coverImage: null
    },
    showContact: true,
    showFollow: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Maker story without cover image, showing alternative header layout.',
      },
    },
  },
};

export const InteractiveDemo = {
  render: (_args) => ({
    components: { MakerStory },
    setup() {
      const handleViewProject = (project) => {
        console.log('Viewing project:', project);
        alert(`Would view project: "${project.title}" using ${project.technique}`);
      };
      
      const handleVisitSocial = (social) => {
        console.log('Visiting social:', social);
        alert(`Would open ${social.platform} at: ${social.url}`);
      };
      
      const handleContact = (maker) => {
        console.log('Contacting maker:', maker);
        alert(`Would open contact form for ${maker.name}`);
      };
      
      const handleFollow = (maker) => {
        console.log('Following maker:', maker);
        alert(`Would follow ${maker.name} for updates`);
      };
      
      return { 
        maker: experiencedMaker,
        handleViewProject,
        handleVisitSocial,
        handleContact,
        handleFollow
      };
    },
    template: `
      <div>
        <div class="mb-6 p-4 bg-purple-50 border border-purple-200 rounded">
          <h4 class="font-semibold text-purple-800 mb-2">Interactive Demo</h4>
          <p class="text-sm text-purple-700 mb-2">
            Try the interactive features:
          </p>
          <ul class="text-sm text-purple-700 space-y-1">
            <li>• Click on featured projects to view details</li>
            <li>• Click social media links to visit profiles</li>
            <li>• Try the "Get in Touch" and "Follow Updates" buttons</li>
            <li>• Explore the full maker story and advice sections</li>
          </ul>
        </div>
        
        <MakerStory 
          :maker="maker"
          :showContact="true"
          :showFollow="true"
          @viewProject="handleViewProject"
          @visitSocial="handleVisitSocial"
          @contact="handleContact"
          @follow="handleFollow"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration with working project viewing, social links, and contact functionality.',
      },
    },
  },
};

export const DifferentJourneys = {
  render: () => ({
    components: { MakerStory },
    template: `
      <div class="space-y-12">
        <div>
          <h3 class="text-xl font-bold mb-4 text-center">Different Maker Journeys</h3>
          <p class="text-gray-600 text-center mb-8">
            Every maker has a unique story and perspective to share
          </p>
        </div>
        
        <MakerStory :maker="beginnerMaker" :showContact="false" :showFollow="false" />
        
        <div class="border-t pt-8">
          <MakerStory :maker="businessMaker" :showContact="false" :showFollow="false" />
        </div>
      </div>
    `,
    setup() {
      return { beginnerMaker, businessMaker };
    }
  }),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of different maker journeys and story types.',
      },
    },
  },
};