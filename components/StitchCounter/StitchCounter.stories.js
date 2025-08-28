import StitchCounter from './StitchCounter.vue';

export default {
  title: 'Tools/StitchCounter',
  component: StitchCounter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Digital counter component for tracking repetitive crafting tasks like stitches, rows, or pattern repeats. Features goal tracking, quick increments, and session statistics.',
      },
    },
  },
  argTypes: {
    title: {
      description: 'Title displayed at the top of the counter',
      control: 'text',
    },
    subtitle: {
      description: 'Optional subtitle for additional context',
      control: 'text',
    },
    modelValue: {
      description: 'Current count value (v-model)',
      control: 'number',
    },
    target: {
      description: 'Optional target count for goal tracking',
      control: 'number',
    },
    unit: {
      description: 'Unit name for what is being counted',
      control: 'text',
    },
    quickIncrements: {
      description: 'Array of quick increment values',
      control: 'object',
    },
    showSave: {
      description: 'Whether to show save button',
      control: 'boolean',
    },
    showStats: {
      description: 'Whether to show session statistics',
      control: 'boolean',
    },
    stats: {
      description: 'Session statistics object',
      control: 'object',
    },
    'onUpdate:modelValue': {
      description: 'Callback when count value changes',
      action: 'update:modelValue',
    },
    onSave: {
      description: 'Callback when save button is clicked',
      action: 'save',
    },
    onReset: {
      description: 'Callback when reset button is clicked',
      action: 'reset',
    },
    onGoalAchieved: {
      description: 'Callback when target goal is reached',
      action: 'goalAchieved',
    },
  },
};

export const BasicCounter = {
  args: {
    title: 'Stitch Counter',
    modelValue: 15,
    unit: 'stitches',
    quickIncrements: [5, 10, 20],
    showSave: false,
    showStats: false,
  },
};

export const WithGoal = {
  args: {
    title: 'Row Counter',
    subtitle: 'Cable knit scarf pattern',
    modelValue: 45,
    target: 100,
    unit: 'rows',
    quickIncrements: [5, 10, 25],
    showSave: true,
    showStats: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Counter with target goal showing progress ring and completion tracking.',
      },
    },
  },
};

export const NearCompletion = {
  args: {
    title: 'Pattern Repeats',
    subtitle: 'Lace shawl border',
    modelValue: 18,
    target: 20,
    unit: 'repeats',
    quickIncrements: [1, 2, 5],
    showSave: true,
    showStats: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Counter close to target completion, showing nearly full progress.',
      },
    },
  },
};

export const Completed = {
  args: {
    title: 'French Knots',
    subtitle: 'Flower center details',
    modelValue: 50,
    target: 50,
    unit: 'knots',
    quickIncrements: [2, 5, 10],
    showSave: true,
    showStats: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Completed counter showing goal achievement message.',
      },
    },
  },
};

export const WithStatistics = {
  args: {
    title: 'Cross-Stitch Progress',
    subtitle: 'Sampler project tracking',
    modelValue: 234,
    target: 500,
    unit: 'stitches',
    quickIncrements: [10, 25, 50],
    showSave: true,
    showStats: true,
    stats: {
      totalIncrements: 28,
      duration: 3847 // seconds (1h 4m 7s)
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Counter with session statistics showing increments and duration.',
      },
    },
  },
};

export const CustomIncrements = {
  args: {
    title: 'Bead Counter',
    subtitle: 'Necklace pattern',
    modelValue: 87,
    target: 108,
    unit: 'beads',
    quickIncrements: [3, 6, 12], // Custom increments for bead patterns
    showSave: false,
    showStats: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Counter with custom quick increment values suitable for bead work.',
      },
    },
  },
};

export const LargeNumbers = {
  args: {
    title: 'Yarn Yardage',
    subtitle: 'Afghan project',
    modelValue: 1247,
    target: 2000,
    unit: 'yards',
    quickIncrements: [50, 100, 200],
    showSave: true,
    showStats: true,
    stats: {
      totalIncrements: 15,
      duration: 7200 // 2 hours
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Counter handling larger numbers with appropriate increment values.',
      },
    },
  },
};

export const MinimalCounter = {
  args: {
    title: 'Quick Count',
    modelValue: 0,
    unit: 'items',
    quickIncrements: [1, 5],
    showSave: false,
    showStats: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal counter setup for simple counting tasks.',
      },
    },
  },
};

export const InteractiveDemo = {
  render: (_args) => ({
    components: { StitchCounter },
    setup() {
      let count = 23;
      const sessionStats = {
        totalIncrements: 12,
        duration: 1847 // About 30 minutes
      };
      
      const handleUpdate = (newValue) => {
        console.log('Count updated to:', newValue);
        count = newValue;
        // Update stats
        sessionStats.totalIncrements++;
        sessionStats.duration += 5; // Simulate time passing
      };
      
      const handleSave = (currentCount) => {
        console.log('Saving count:', currentCount);
        alert(`Saved progress: ${currentCount} stitches`);
      };
      
      const handleReset = () => {
        console.log('Counter reset');
        sessionStats.totalIncrements = 0;
        sessionStats.duration = 0;
        alert('Counter has been reset');
      };
      
      const handleGoalAchieved = (finalCount) => {
        console.log('Goal achieved! Final count:', finalCount);
        alert(`🎉 Congratulations! You've completed ${finalCount} stitches!`);
      };
      
      return { 
        count,
        sessionStats,
        handleUpdate,
        handleSave,
        handleReset,
        handleGoalAchieved
      };
    },
    template: `
      <div>
        <div class="mb-6 p-4 bg-pink-50 border border-pink-200 rounded text-center">
          <h4 class="font-semibold text-pink-800 mb-2">Interactive Demo</h4>
          <p class="text-sm text-pink-700 mb-2">
            Try the interactive counter features:
          </p>
          <ul class="text-sm text-pink-700 text-left inline-block">
            <li>• Use +/- buttons to adjust count</li>
            <li>• Try quick increment buttons</li>
            <li>• Watch the progress ring fill up</li>
            <li>• Save your progress</li>
            <li>• Reach the goal for a surprise!</li>
          </ul>
        </div>
        
        <StitchCounter 
          title="Interactive Embroidery Counter"
          subtitle="Garden sampler project"
          :modelValue="count"
          :target="75"
          unit="stitches"
          :quickIncrements="[5, 10, 15]"
          :showSave="true"
          :showStats="true"
          :stats="sessionStats"
          @update:modelValue="handleUpdate"
          @save="handleSave"
          @reset="handleReset"
          @goalAchieved="handleGoalAchieved"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Interactive demonstration with working counter functionality and goal celebration.',
      },
    },
  },
};

export const MultipleCounters = {
  render: () => ({
    components: { StitchCounter },
    template: `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StitchCounter 
          title="Stitches"
          subtitle="Current row"
          :modelValue="45"
          :target="60"
          unit="stitches"
          :quickIncrements="[5, 10]"
        />
        
        <StitchCounter 
          title="Rows"
          subtitle="Total progress"
          :modelValue="12"
          :target="24"
          unit="rows"
          :quickIncrements="[1, 2, 4]"
        />
        
        <StitchCounter 
          title="Pattern Repeats"
          subtitle="Border design"
          :modelValue="7"
          :target="12"
          unit="repeats"
          :quickIncrements="[1, 2]"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Multiple counters for tracking different aspects of a complex project.',
      },
    },
  },
};