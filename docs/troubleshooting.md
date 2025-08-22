# Troubleshooting Guide - Needle & Kin Blog

## Common Issues and Solutions

This document covers the main issues encountered during development and their solutions.

## 1. Hydration Mismatch - Blank Page on Initial Load

### Symptoms
- Homepage loads blank on first visit
- Content only appears after navigating to a non-existent page and using browser back
- Console errors related to hydration mismatch
- Vue hydration warnings in development mode

### Root Cause
Using `$fetch` instead of `useFetch` for data fetching in Vue components caused a mismatch between server-side rendered content and client-side hydrated content.

### Solution
**Before (Problematic):**
```vue
<script setup>
const { data: latestPosts } = await $fetch('/api/posts/latest')
</script>
```

**After (Fixed):**
```vue
<script setup>
const { data: latestPosts } = await useFetch('/api/posts/latest')
</script>
```

### Additional Changes Made
1. **Added loading states** to handle undefined data during hydration:
```vue
<template>
  <div v-if="latestPosts?.length" class="grid md:grid-cols-3 gap-8">
    <!-- Content -->
  </div>
  <div v-else class="text-center py-8">
    <p class="text-gray-500">Loading latest posts...</p>
  </div>
</template>
```

2. **Used computed properties** for reactive data handling:
```vue
<script setup>
const { data: response } = await useFetch('/api/posts', {
  query: computed(() => ({
    tag: selectedTag.value,
    page: currentPage.value
  }))
})

const posts = computed(() => response.value?.data || [])
const totalPages = computed(() => response.value?.totalPages || 1)
</script>
```

3. **Added null checks** with optional chaining:
```vue
<template>
  <div v-if="posts?.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    <!-- Safely access posts array -->
  </div>
</template>
```

### Files Modified
- `pages/index.vue` - Updated data fetching and loading states
- `pages/blog/index.vue` - Implemented reactive data pattern

---

## 2. Static HTML Override Issue

### Symptoms
- Application serves Vue CLI template HTML instead of Nuxt content
- Page shows webpack template variables like `<%= htmlWebpackPlugin.options.title %>`
- No Nuxt-generated content visible
- Console shows basic Vue CLI starter template

### Root Cause
A leftover `public/index.html` file from the previous Vue CLI setup was overriding Nuxt's dynamic HTML generation.

### Solution
**Remove the conflicting file:**
```bash
rm public/index.html
```

### Explanation
Nuxt 3 generates its own HTML structure dynamically based on:
- Layout components
- Page components  
- Meta tag configuration
- SSR/hydration requirements

The static `index.html` file was being served instead of allowing Nuxt to generate the proper HTML structure.

### Prevention
- Avoid placing `index.html` files in the `public/` directory
- The `public/` directory should only contain static assets like images, fonts, and favicon
- Let Nuxt handle HTML generation through its layout system

---

## 3. Package Management Configuration

### Issue
The project uses pnpm but some commands might default to npm, causing inconsistencies.

### Solution
Always use pnpm for this project:
```bash
# Development
pnpm dev

# Install packages
pnpm add package-name

# Build
pnpm build

# Generate static site
pnpm generate
```

### Configuration
The project is configured for pnpm as evidenced by:
- `pnpm-lock.yaml` file presence
- Faster installation and better dependency resolution
- More efficient disk space usage

---

## 4. Tailwind CSS Not Loading

### Symptoms
- Styles not applying
- Default browser styles visible
- Tailwind classes have no effect

### Solution Steps
1. **Verify Tailwind module installation:**
```bash
pnpm add @nuxtjs/tailwindcss
```

2. **Check `nuxt.config.ts` configuration:**
```typescript
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css']
})
```

3. **Ensure CSS file exists with proper imports:**
```css
/* assets/css/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. **Restart development server:**
```bash
pnpm dev
```

---

## 5. API Endpoint Not Found (404)

### Symptoms
- Browser shows 404 error for `/api/posts/latest`
- Network tab shows failed API requests
- Console errors about fetch failures

### Debugging Steps
1. **Verify file structure:**
```
server/
└── api/
    └── posts/
        ├── index.get.ts
        └── latest.get.ts
```

2. **Check file naming convention:**
- Files must end with `.get.ts` for GET requests
- File names determine the route structure
- `latest.get.ts` creates `/api/posts/latest` endpoint

3. **Verify export syntax:**
```typescript
export default defineEventHandler(async (event) => {
  // API logic here
  return { data: [] }
})
```

4. **Restart server after API changes:**
```bash
# Stop current server (Ctrl+C)
pnpm dev
```

---

## 6. Component Import Errors

### Symptoms
- "Component not found" errors
- TypeScript errors about missing components
- Blank spaces where components should render

### Solution
Nuxt 3 uses auto-imports for components in the `components/` directory.

**Verify component file structure:**
```
components/
├── AppHeader.vue
├── AppFooter.vue
└── BlogCard.vue
```

**Component usage (no import needed):**
```vue
<template>
  <div>
    <AppHeader />
    <BlogCard :post="post" />
    <AppFooter />
  </div>
</template>
```

**If auto-import fails:**
```vue
<script setup>
// Manual import as fallback
import BlogCard from '~/components/BlogCard.vue'
</script>
```

---

## 7. Development Server Port Conflicts

### Symptoms
- "Port 3000 is already in use" errors
- Server starts on alternative port (3001, 3002, etc.)

### Solutions
1. **Kill existing processes:**
```bash
# Find processes using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

2. **Use different port:**
```bash
pnpm dev --port 3001
```

3. **Configure default port in `nuxt.config.ts`:**
```typescript
export default defineNuxtConfig({
  devServer: {
    port: 3001
  }
})
```

---

## Debug Mode and Logging

### Enable Debug Mode
```bash
DEBUG=nuxt:* pnpm dev
```

### Useful Console Commands
```bash
# Check Nuxt version
npx nuxi info

# Analyze bundle
pnpm build --analyze

# Type check
npx nuxi typecheck
```

### Development Tools
- **Vue DevTools:** Browser extension for Vue debugging
- **Nuxt DevTools:** Built-in development panel (Shift + Option + D)
- **Network Tab:** Monitor API requests and responses
- **Console:** Check for hydration warnings and errors

## Best Practices for Prevention

1. **Always use `useFetch` for data fetching** in Vue components
2. **Add loading states** for all async operations
3. **Use optional chaining** when accessing potentially undefined data
4. **Keep `public/` directory clean** of HTML files
5. **Restart development server** after configuration changes
6. **Use pnpm consistently** for package management
7. **Follow Nuxt 3 conventions** for file structure and naming