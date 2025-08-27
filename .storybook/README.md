# Storybook Configuration

This directory contains the Storybook configuration for the Needle & Kin project.

## Files

- **`main.js`** - Main Storybook configuration file
- **`preview.js`** - Global preview configuration and parameters

## Configuration Details

### Framework
- **Vue 3** with **Vite** builder for fast development
- **Tailwind CSS** integration for styling
- **TypeScript** support

### Addons
- **@storybook/addon-links** - Link between stories
- **@storybook/addon-docs** - Automatic documentation generation
- **@storybook/addon-a11y** - Accessibility testing

### Stories Location
Stories are automatically discovered from:
- `../components/**/*.stories.@(js|jsx|ts|tsx|mdx)`
- `../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)`

## Running Storybook

```bash
pnpm run storybook
```

This will start Storybook on http://localhost:6006

## Building Storybook

```bash
pnpm run build-storybook
```

This will build a static version of Storybook in the `storybook-static` directory.

## Features

### Tailwind CSS Support
All Tailwind CSS classes are available in stories thanks to the main.css import in preview.js.

### Multiple Backgrounds
Stories can be viewed against different background colors:
- Light (default)
- Dark  
- Gray

### Responsive Design
Stories can be viewed at different viewport sizes to test responsive behavior.

### Accessibility Testing
The a11y addon provides automated accessibility testing for all stories.

## Writing Stories

Stories should be placed next to their corresponding components with the `.stories.js` extension.

Example structure:
```
components/
├── BlogCard.vue
├── BlogCard.stories.js
├── AppHeader.vue
├── AppHeader.stories.js
└── ...
```

Each story file should export:
- A default export with component metadata
- Named exports for each story variant

See the existing story files for examples of best practices.