/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: [
    "../components/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)"
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite');
    const vue = await import('@vitejs/plugin-vue');
    
    return mergeConfig(config, {
      plugins: [vue.default()],
      css: {
        postcss: {
          plugins: [
            require('tailwindcss'),
            require('autoprefixer'),
          ],
        },
      },
      resolve: {
        alias: {
          '@': process.cwd(),
          '~': process.cwd(),
          'vue': 'vue/dist/vue.esm-bundler.js',
        },
      },
      optimizeDeps: {
        include: ['vue'],
      },
    });
  },
};

export default config;