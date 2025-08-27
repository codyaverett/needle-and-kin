import SkillLevelBadge from './SkillLevelBadge.vue';

export default {
  title: 'UI/SkillLevelBadge',
  component: SkillLevelBadge,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Visual indicator component for tutorial difficulty levels, craft types, and time estimates. Helps users quickly identify appropriate projects for their skill level.',
      },
    },
  },
  argTypes: {
    level: {
      description: 'Skill level difficulty',
      control: 'select',
      options: ['beginner', 'intermediate', 'advanced'],
    },
    craftType: {
      description: 'Optional craft type indicator',
      control: 'text',
    },
    timeEstimate: {
      description: 'Optional time estimate for the project',
      control: 'text',
    },
    size: {
      description: 'Badge size variant',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      description: 'Badge visual style variant',
      control: 'radio', 
      options: ['default', 'outline', 'subtle'],
    },
    showIcon: {
      description: 'Whether to show star level icons',
      control: 'boolean',
    },
  },
};

export const Beginner = {
  args: {
    level: 'beginner',
    craftType: 'embroidery',
    timeEstimate: '2-3 hours',
    size: 'md',
    variant: 'default',
    showIcon: true,
  },
};

export const Intermediate = {
  args: {
    level: 'intermediate',
    craftType: 'knitting',
    timeEstimate: '1-2 weeks',
    size: 'md',
    variant: 'default',
    showIcon: true,
  },
};

export const Advanced = {
  args: {
    level: 'advanced',
    craftType: 'macrame',
    timeEstimate: '3-4 weeks',
    size: 'md',
    variant: 'default',
    showIcon: true,
  },
};

export const SmallSize = {
  args: {
    level: 'beginner',
    craftType: 'cross-stitch',
    size: 'sm',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact size suitable for inline use or dense layouts.',
      },
    },
  },
};

export const LargeSize = {
  args: {
    level: 'advanced',
    craftType: 'quilting',
    timeEstimate: '2 months',
    size: 'lg',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size for prominent display or headers.',
      },
    },
  },
};

export const OutlineVariant = {
  args: {
    level: 'intermediate',
    craftType: 'upcycling',
    timeEstimate: 'Weekend project',
    variant: 'outline',
  },
  parameters: {
    docs: {
      description: {
        story: 'Outline variant for subtle emphasis or light backgrounds.',
      },
    },
  },
};

export const SubtleVariant = {
  args: {
    level: 'beginner',
    craftType: 'friendship bracelets',
    variant: 'subtle',
  },
  parameters: {
    docs: {
      description: {
        story: 'Subtle variant for minimal visual impact.',
      },
    },
  },
};

export const WithoutCraftType = {
  args: {
    level: 'advanced',
    timeEstimate: '1 month',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Badge without craft type, showing only skill level and time.',
      },
    },
  },
};

export const WithoutTimeEstimate = {
  args: {
    level: 'intermediate',
    craftType: 'embroidery',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Badge without time estimate, showing only skill level and craft type.',
      },
    },
  },
};

export const MinimalBadge = {
  args: {
    level: 'beginner',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal badge with only skill level information.',
      },
    },
  },
};

export const AllVariants = {
  render: () => ({
    components: { SkillLevelBadge },
    template: `
      <div class="space-y-8">
        <!-- Default Variants -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Default Variants</h3>
          <div class="flex flex-wrap gap-4">
            <SkillLevelBadge level="beginner" craftType="embroidery" timeEstimate="2 hours" />
            <SkillLevelBadge level="intermediate" craftType="knitting" timeEstimate="1 week" />
            <SkillLevelBadge level="advanced" craftType="macrame" timeEstimate="1 month" />
          </div>
        </div>
        
        <!-- Outline Variants -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Outline Variants</h3>
          <div class="flex flex-wrap gap-4">
            <SkillLevelBadge level="beginner" craftType="cross-stitch" variant="outline" />
            <SkillLevelBadge level="intermediate" craftType="upcycling" variant="outline" />
            <SkillLevelBadge level="advanced" craftType="quilting" variant="outline" />
          </div>
        </div>
        
        <!-- Subtle Variants -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Subtle Variants</h3>
          <div class="flex flex-wrap gap-4">
            <SkillLevelBadge level="beginner" craftType="friendship bracelets" variant="subtle" />
            <SkillLevelBadge level="intermediate" craftType="crochet" variant="subtle" />
            <SkillLevelBadge level="advanced" craftType="weaving" variant="subtle" />
          </div>
        </div>
        
        <!-- Sizes -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Size Variants</h3>
          <div class="flex flex-wrap items-center gap-4">
            <SkillLevelBadge level="intermediate" craftType="knitting" size="sm" />
            <SkillLevelBadge level="intermediate" craftType="knitting" size="md" />
            <SkillLevelBadge level="intermediate" craftType="knitting" size="lg" />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Overview of all badge variants, styles, and sizes.',
      },
    },
  },
};

export const InContext = {
  render: () => ({
    components: { SkillLevelBadge },
    template: `
      <div class="max-w-md">
        <!-- Tutorial Card Example -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <img src="/blog/embroidery-1.jpg" alt="Tutorial" class="w-full h-48 object-cover" />
          <div class="p-4">
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-lg font-semibold text-gray-900">French Knot Garden Tutorial</h3>
              <SkillLevelBadge level="intermediate" size="sm" />
            </div>
            <p class="text-gray-600 text-sm mb-3">
              Learn to create textured garden scenes using French knots and complementary stitches.
            </p>
            <div class="flex items-center gap-3">
              <SkillLevelBadge 
                level="intermediate" 
                craftType="embroidery" 
                timeEstimate="3-4 hours"
                size="sm"
                variant="subtle"
              />
            </div>
          </div>
        </div>
        
        <!-- Blog Post Example -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium">Related Tutorials</h4>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between py-2">
              <span class="text-sm">Basic Embroidery Stitches</span>
              <SkillLevelBadge level="beginner" size="sm" variant="outline" />
            </div>
            <div class="flex items-center justify-between py-2">
              <span class="text-sm">Advanced Texture Techniques</span>
              <SkillLevelBadge level="advanced" size="sm" variant="outline" />
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Examples of how skill level badges would appear in real tutorial cards and content.',
      },
    },
  },
};

export const CraftTypeShowcase = {
  render: () => ({
    components: { SkillLevelBadge },
    setup() {
      const craftTypes = [
        { craft: 'embroidery', level: 'beginner', time: '2-3 hours' },
        { craft: 'knitting', level: 'intermediate', time: '1-2 weeks' }, 
        { craft: 'macrame', level: 'beginner', time: 'Weekend' },
        { craft: 'cross-stitch', level: 'advanced', time: '1 month' },
        { craft: 'upcycling', level: 'intermediate', time: '3-5 days' },
        { craft: 'quilting', level: 'advanced', time: '2-3 months' },
        { craft: 'crochet', level: 'beginner', time: '4-6 hours' },
        { craft: 'weaving', level: 'intermediate', time: '2 weeks' },
      ];
      return { craftTypes };
    },
    template: `
      <div>
        <h3 class="text-lg font-semibold mb-4">Craft Types and Skill Levels</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SkillLevelBadge 
            v-for="item in craftTypes"
            :key="item.craft"
            :level="item.level"
            :craftType="item.craft"
            :timeEstimate="item.time"
          />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of different craft types with varying skill levels and time estimates.',
      },
    },
  },
};