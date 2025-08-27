import AppHeader from './AppHeader.vue';

export default {
  title: 'Layout/AppHeader',
  component: AppHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Main navigation header with responsive design and mobile menu functionality.',
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Default header appearance on desktop.',
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
        story: 'Header appearance on mobile devices with hamburger menu.',
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
        story: 'Header appearance on tablet devices.',
      },
    },
  },
};

// Interactive story showing mobile menu functionality
export const WithMobileMenuOpen = {
  render: () => ({
    components: { AppHeader },
    template: `
      <div>
        <AppHeader />
        <div class="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p class="text-sm text-yellow-800">
            <strong>Note:</strong> On mobile devices, click the hamburger menu (three lines) to see the mobile navigation menu.
          </p>
        </div>
      </div>
    `,
  }),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Interactive example showing mobile menu functionality. Click the menu button to see it in action.',
      },
    },
  },
};

// Story showing header with different background contexts
export const OnDarkBackground = {
  render: () => ({
    components: { AppHeader },
    template: `
      <div class="bg-gray-900 min-h-screen">
        <AppHeader />
        <div class="p-8 text-white">
          <h2 class="text-2xl font-bold mb-4">Header on Dark Background</h2>
          <p>This shows how the header looks against a dark background.</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    backgrounds: { 
      default: 'dark' 
    },
    docs: {
      description: {
        story: 'Header appearance when placed over a dark background.',
      },
    },
  },
};

export const OnColoredBackground = {
  render: () => ({
    components: { AppHeader },
    template: `
      <div class="bg-gradient-to-r from-purple-600 to-pink-600 min-h-screen">
        <AppHeader />
        <div class="p-8 text-white">
          <h2 class="text-2xl font-bold mb-4">Header on Colored Background</h2>
          <p>This shows how the header looks against the site's brand gradient.</p>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Header appearance when placed over the brand gradient background.',
      },
    },
  },
};