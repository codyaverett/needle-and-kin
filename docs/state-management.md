# State Management Documentation

## Overview

Needle & Kin uses **Pinia** for state management, which is the official state management library for Vue 3 and the recommended replacement for Vuex in Nuxt 3 applications.

## Store Architecture

The application uses a modular store structure with three main stores:

### 1. Blog Store (`/stores/blog.js`)

Manages all blog-related state and operations.

#### State Properties
- `posts`: Array of blog posts
- `currentPost`: Currently viewed blog post
- `categories`: Available blog categories
- `selectedCategory`: Currently selected category filter ('all' by default)
- `searchQuery`: Current search query
- `currentPage`: Current pagination page
- `postsPerPage`: Number of posts per page (default: 9)
- `totalPosts`: Total number of posts
- `loading`: Loading state indicator
- `error`: Error state
- `favorites`: User's favorite posts
- `recentlyViewed`: Recently viewed posts
- `relatedPosts`: Related posts for current post
- `comments`: Comments for current post

#### Key Actions
- `fetchPosts()`: Fetch blog posts with optional filters
- `fetchPost(slug)`: Fetch individual blog post by slug
- `searchPosts(query)`: Search posts by query
- `setCategory(category)`: Set category filter
- `toggleFavorite(postId)`: Toggle post as favorite
- `postComment(postId, comment)`: Add comment to post

#### Key Getters
- `filteredPosts`: Posts filtered by search and category
- `paginatedPosts`: Current page of filtered posts
- `totalPages`: Total number of pages
- `popularPosts`: Top 5 posts by views
- `featuredPosts`: Featured posts only

### 2. User Store (`/stores/user.js`)

Manages user authentication and profile data.

#### State Properties
- `user`: Current user object
- `isAuthenticated`: Authentication status
- `profile`: User profile information
- `craftingProfile`: User's crafting preferences and skills

#### Key Actions
- `login(credentials)`: User login
- `logout()`: User logout
- `updateProfile(data)`: Update user profile
- `updateCraftingProfile(data)`: Update crafting preferences

### 3. UI Store (`/stores/ui.js`)

Manages UI state and preferences.

#### State Properties
- `sidebarOpen`: Sidebar visibility state
- `modalOpen`: Modal visibility state
- `theme`: Current theme ('light' or 'dark')
- `viewMode`: Blog view mode ('grid' or 'list')
- `notifications`: Active notifications array

#### Key Actions
- `toggleSidebar()`: Toggle sidebar visibility
- `setTheme(theme)`: Set application theme
- `setViewMode(mode)`: Set blog view mode
- `showNotification(notification)`: Display notification
- `showSuccess(message)`: Show success notification
- `showError(message)`: Show error notification

## Usage Examples

### Accessing Stores in Components

```vue
<script setup>
import { useBlogStore } from '~/stores/blog'
import { useUserStore } from '~/stores/user'
import { useUIStore } from '~/stores/ui'

const blogStore = useBlogStore()
const userStore = useUserStore()
const uiStore = useUIStore()

// Fetch posts on component mount
onMounted(async () => {
  await blogStore.fetchPosts()
})

// Access reactive state
const posts = computed(() => blogStore.paginatedPosts)
const isAuthenticated = computed(() => userStore.isAuthenticated)
</script>
```

### Filtering Blog Posts

```javascript
// Set category filter
blogStore.setCategory('knitting')

// Search posts
await blogStore.searchPosts('cable patterns')

// Clear all filters
blogStore.clearFilters()
```

### Managing Favorites

```javascript
// Toggle favorite
blogStore.toggleFavorite(postId)

// Check if post is favorite
const isFavorite = blogStore.isFavorite(postId)
```

### UI Notifications

```javascript
// Show success message
uiStore.showSuccess('Post created successfully!')

// Show error message
uiStore.showError('Failed to save changes')

// Custom notification
uiStore.showNotification({
  type: 'info',
  message: 'New posts available',
  duration: 5000
})
```

## Blog Categories

The blog supports the following categories:
- Knitting
- Crochet
- Embroidery
- Quilting
- Sewing
- Weaving

## API Integration

Stores interact with the following API endpoints:

- `GET /api/posts` - Fetch blog posts with pagination and filters
- `GET /api/posts/[slug]` - Fetch individual post
- `GET /api/posts/search` - Search posts
- `POST /api/posts/[id]/comments` - Add comment
- `POST /api/posts/[id]/views` - Increment view count
- `GET /api/authors` - Fetch authors list
- `GET /api/authors/[id]` - Fetch author details

## Local Storage

The following data is persisted to localStorage:
- User favorites (`blog_favorites`)
- Recently viewed posts (`blog_recently_viewed`)
- UI theme preference (`ui_theme`)
- View mode preference (`ui_view_mode`)

## Best Practices

1. **Always use actions** for async operations and mutations
2. **Use getters** for derived state instead of computing in components
3. **Handle errors** in actions and update error state accordingly
4. **Clear sensitive data** on logout
5. **Persist user preferences** to localStorage for better UX
6. **Use loading states** to provide feedback during async operations

## Migration from Vuex

If migrating from a Vuex-based application:
1. Replace `vuex` with `@pinia/nuxt` in dependencies
2. Convert modules to individual store files
3. Replace mutations with direct state modifications in actions
4. Update component imports from `mapState/mapActions` to `useStore` composition
5. Update Nuxt config to include Pinia module