import AppFooter from './AppFooter.vue';

export default {
  title: 'Layout/AppFooter',
  component: AppFooter,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Site footer with company information, navigation links, and social media icons.',
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Default footer appearance with all sections.',
      },
    },
  },
};

export const Mobile = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Footer appearance on mobile devices with stacked layout.',
      },
    },
  },
};

export const Tablet = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Footer appearance on tablet devices.',
      },
    },
  },
};

// Story showing footer at bottom of page
export const AtBottomOfPage = {
  render: () => ({
    components: { AppFooter },
    template: `
      <div class="min-h-screen flex flex-col">
        <div class="flex-1 bg-gray-50 p-8">
          <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl font-bold mb-6">Page Content</h1>
            <p class="text-lg text-gray-700 mb-4">
              This demonstrates how the footer appears at the bottom of a page with content above it.
            </p>
            <p class="text-gray-600">
              The footer maintains its dark theme and provides a clear visual separation from the main content.
            </p>
          </div>
        </div>
        <AppFooter />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Footer positioned at the bottom of a page with content above it.',
      },
    },
  },
};

// Story showing current year display
export const CurrentYear = {
  render: () => ({
    components: { AppFooter },
    setup() {
      const currentYear = new Date().getFullYear();
      return { currentYear };
    },
    template: `
      <div>
        <AppFooter />
        <div class="p-4 bg-blue-50 border border-blue-200 rounded mt-4">
          <p class="text-sm text-blue-800">
            <strong>Dynamic Year:</strong> The footer automatically displays the current year (${new Date().getFullYear()}) in the copyright notice.
          </p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Footer showing dynamic copyright year functionality.',
      },
    },
  },
};

// Story showing social media hover effects
export const SocialMediaInteractions = {
  render: () => ({
    components: { AppFooter },
    template: `
      <div>
        <AppFooter />
        <div class="p-4 bg-green-50 border border-green-200 rounded mt-4">
          <p class="text-sm text-green-800">
            <strong>Interactive Elements:</strong> Hover over the social media icons in the footer to see the hover effects.
          </p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Footer demonstrating interactive hover effects on social media icons and links.',
      },
    },
  },
};