# Needle & Kin - Architecture Documentation

## System Architecture Overview

The Needle & Kin blog is built using a modern JAMstack architecture with Nuxt 3, providing both server-side rendering (SSR) and static site generation capabilities.

## Frontend Architecture

### Framework Stack
- **Nuxt 3.18.1** - Vue.js meta-framework with SSR/SPA capabilities
- **Vue 3.4.0** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Nitro 2.12.4** - Server engine for universal deployment

### Layout System

#### Default Layout (`layouts/default.vue`)
The main layout wrapper that provides the structural foundation for all pages:

```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
```

**Features:**
- Responsive container system
- SEO meta tag management via `useHead()`
- Google Fonts integration (Inter font family)
- Consistent spacing and background styling

### Component Architecture

#### AppHeader.vue
**Purpose:** Primary navigation and site branding

**Features:**
- Responsive design with mobile hamburger menu
- Sticky positioning for improved UX
- Logo/brand display
- Navigation links (Home, Blog, About, Contact)
- Mobile-first responsive breakpoints

**Technical Details:**
- Uses `ref()` for mobile menu state management
- Implements proper ARIA accessibility patterns
- Tailwind CSS classes for styling and responsive behavior

#### AppFooter.vue
**Purpose:** Site footer with additional navigation and information

**Features:**
- Three-column responsive grid layout
- Company/site description
- Quick navigation links
- Social media icon placeholders
- Copyright information with dynamic year

**Technical Details:**
- Responsive grid that collapses on mobile
- SVG icons for social media (placeholder implementations)
- Dark theme (gray-900 background)

#### BlogCard.vue
**Purpose:** Reusable component for displaying blog post previews

**Props Structure:**
```typescript
interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  image: string
  publishedAt: string
  readTime: string
  author: {
    name: string
    avatar: string
    bio: string
  }
  tags: string[]
}
```

**Features:**
- Image with fallback handling
- Formatted publication date
- Read time estimation
- Author information with avatar
- Hover effects and transitions
- Responsive card layout
- Text truncation for excerpts (3-line clamp)

## Page Architecture

### Homepage (`pages/index.vue`)

**Layout Structure:**
1. **Hero Section** - Gradient background with call-to-action
2. **Latest Posts Section** - Grid of BlogCard components
3. **About Section** - Company/site introduction

**Data Fetching:**
```typescript
const { data: latestPosts } = await useFetch('/api/posts/latest')
```

**Features:**
- Server-side data fetching with proper hydration
- Responsive grid layouts (1 col mobile, 3 col desktop)
- Loading states and error handling
- Call-to-action buttons with proper contrast

### Blog Listing Page (`pages/blog/index.vue`)

**Layout Structure:**
1. **Header Section** - Page title and description
2. **Filter Section** - Tag-based filtering buttons
3. **Posts Grid** - BlogCard components in responsive grid
4. **Pagination** - Navigation between pages

**State Management:**
```typescript
const selectedTag = ref('')
const currentPage = ref(1)

const { data: response } = await useFetch('/api/posts', {
  query: computed(() => ({
    tag: selectedTag.value,
    page: currentPage.value
  }))
})
```

**Features:**
- Reactive filtering by tags
- Pagination controls
- Loading states
- Responsive grid (2 col tablet, 3 col desktop)
- Tag-based content filtering

### About Page (`pages/about.vue`)

**Layout Structure:**
1. **Hero Section** - Page header with gradient background
2. **Story Section** - Company history and mission
3. **Mission Cards** - Three-column grid with icons
4. **Team Section** - Team member profiles
5. **CTA Section** - Join community call-to-action

**Features:**
- Storytelling layout with image placeholders
- Icon-based mission statements
- Team member cards with avatars
- Responsive design with proper content hierarchy

### Contact Page (`pages/contact.vue`)

**Layout Structure:**
1. **Hero Section** - Page header with contact invitation
2. **Contact Form** - Full-featured form with validation
3. **Contact Methods** - Alternative ways to reach out
4. **FAQ Section** - Common questions and answers

**Form Features:**
```typescript
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
  newsletter: false
})

const handleSubmit = async () => {
  const response = await $fetch('/api/contact', {
    method: 'POST',
    body: form.value
  })
}
```

**Features:**
- Client-side form validation
- Server-side form submission
- Loading states and success/error feedback
- Newsletter subscription opt-in
- Responsive two-column layout
- Social media contact options

## Styling Architecture

### Tailwind CSS Configuration

**Global Styles (`assets/css/main.css`):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
}

@layer components {
  .container {
    @apply max-w-7xl mx-auto;
  }
}
```

### Design System

**Color Palette:**
- Primary: Purple-600 (#9333EA)
- Secondary: Pink-600 (#DB2777)
- Background: Gray-50 (#F9FAFB)
- Text: Gray-900 (#111827)
- Muted: Gray-600 (#4B5563)

**Typography Scale:**
- Headings: Font weights 600-700
- Body: Font weight 400
- Interactive: Font weight 500-600

**Spacing System:**
- Container: max-width 7xl (80rem)
- Padding: 4 (1rem) for mobile, increased for larger screens
- Margins: Consistent 8-12 scale for sections

**Responsive Breakpoints:**
- Mobile: Default (< 768px)
- Tablet: md: (≥ 768px)
- Desktop: lg: (≥ 1024px)

## SEO and Performance

### Meta Tag Management
Each page uses Nuxt's `useHead()` composable for:
- Dynamic page titles
- Meta descriptions
- Open Graph tags (ready for implementation)
- Structured data preparation

### Performance Optimizations
- **Server-Side Rendering:** Initial page load with full HTML
- **Hydration:** Client-side JavaScript takeover
- **Code Splitting:** Automatic with Nuxt 3
- **Image Optimization:** Ready for `@nuxt/image` integration
- **Font Loading:** Preconnect and display=swap for Google Fonts

### Accessibility Features
- Semantic HTML structure
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for images
- ARIA labels for interactive elements
- Focus management for mobile menu
- Screen reader considerations

## State Management

### Data Flow
1. **Server-Side:** API endpoints provide initial data
2. **Client-Side:** `useFetch` manages reactive data
3. **Component Props:** Data flows down through props
4. **Event Handling:** User interactions trigger state updates

### Reactivity Patterns
- `ref()` for component-level state
- `computed()` for derived values
- `useFetch()` for server data with automatic reactivity
- `watch()` for reactive side effects

## Development Workflow

### File Organization
```
Components: Single-file Vue components (.vue)
Pages: File-based routing in pages/ directory  
Layouts: Reusable layout templates
Server: API routes in server/api/
Assets: Static files and global styles
```

### TypeScript Integration
- Automatic type inference for Vue components
- Type-safe API responses
- Props validation with TypeScript interfaces
- IDE support with proper intellisense

This architecture provides a solid foundation for a scalable blog application with excellent developer experience and user performance.