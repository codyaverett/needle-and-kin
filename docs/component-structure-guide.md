# Component Structure Guide

## Overview
This project enforces a consistent structure for all Vue components to ensure maintainability, testability, and documentation.

## Required Structure

Every component must follow this directory structure:

```
components/
├── ComponentName/
│   ├── ComponentName.vue          # Main component file
│   ├── __tests__/                 # Test directory
│   │   └── ComponentName.test.ts  # Test file(s)
│   ├── ComponentName.stories.js   # Storybook stories
│   └── index.js                   # Export file
```

## Automated Structure Validation

### Quick Context Building Script

Run this script to quickly validate and fix component structure:

```bash
./scripts/ensure-component-structure.sh
```

This script will:
1. **Organize components** - Move any standalone `.vue` files into proper directories
2. **Create test directories** - Add `__tests__/` folder if missing
3. **Generate test files** - Create basic test files with starter tests
4. **Generate Storybook stories** - Create story files with basic structure
5. **Create index files** - Add export files for clean imports
6. **Provide a summary** - Show which components were fixed and what's still needed

### What the Script Does

#### For Each Component:
- ✅ Ensures `components/ComponentName/ComponentName.vue` structure
- ✅ Creates `__tests__/` directory if missing
- ✅ Generates `ComponentName.test.ts` with basic tests if missing
- ✅ Creates `ComponentName.stories.js` with starter stories if missing
- ✅ Adds `index.js` for clean exports if missing

#### Generated Test Template:
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ComponentName from '../ComponentName.vue'

describe('ComponentName Component', () => {
  it('renders properly', () => {
    const wrapper = mount(ComponentName, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })
  
  // TODO: Add more specific tests
})
```

#### Generated Story Template:
```javascript
import ComponentName from './ComponentName.vue'

export default {
  title: 'Components/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: {
    // Define your argTypes here
  }
}

export const Default = {
  args: {
    // Default props
  }
}

// TODO: Add more story variations
```

## Benefits

### For Developers:
- **Quick context** - Run the script to understand component structure instantly
- **Consistency** - All components follow the same pattern
- **Testing** - Every component has at least basic tests
- **Documentation** - Storybook stories for visual documentation

### For Claude/AI:
- **Fast discovery** - Script provides immediate overview of all components
- **No duplicates** - Script identifies and fixes duplicate components
- **Clear structure** - Predictable file locations reduce search time
- **Test coverage** - Can quickly identify which components need more tests

## Usage Examples

### 1. Initial Setup
When setting up the project or after adding new components:
```bash
./scripts/ensure-component-structure.sh
```

### 2. After Creating a New Component
```bash
# Create your component
touch components/MyNewComponent.vue

# Run the structure script
./scripts/ensure-component-structure.sh

# Component will be organized with tests and stories
```

### 3. Checking Component Health
```bash
# Run to see current state of all components
./scripts/ensure-component-structure.sh

# Output shows:
# - Which components are properly structured ✓
# - Which need attention ⚠
# - What was automatically fixed
```

## Manual Component Creation

If creating a component manually, follow this structure:

```bash
# 1. Create component directory
mkdir -p components/MyComponent/__tests__

# 2. Create component file
touch components/MyComponent/MyComponent.vue

# 3. Create test file
touch components/MyComponent/__tests__/MyComponent.test.ts

# 4. Create story file
touch components/MyComponent/MyComponent.stories.js

# 5. Create index file
echo "export { default } from './MyComponent.vue';" > components/MyComponent/index.js
```

## Import Patterns

With this structure, components can be imported in multiple ways:

```javascript
// Direct import
import MyComponent from '~/components/MyComponent/MyComponent.vue'

// Via index file
import MyComponent from '~/components/MyComponent'

// Auto-import (Nuxt)
// Components are automatically available without imports
```

## Test Running

Run tests for all components:
```bash
pnpm test
```

Run tests for a specific component:
```bash
pnpm test MyComponent
```

## Storybook

View all component stories:
```bash
pnpm storybook
```

## Maintenance

The structure validation script should be run:
- After adding new components
- Before committing changes
- As part of CI/CD pipeline
- When onboarding new developers
- When AI assistants need context

## Summary

This standardized structure ensures:
- ✅ Every component is in its own directory
- ✅ Every component has tests
- ✅ Every component has documentation (Storybook)
- ✅ No duplicate components exist
- ✅ Quick context building for developers and AI