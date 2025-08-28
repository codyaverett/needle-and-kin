# Blog Functionality Documentation

## Overview

The Needle & Kin blog provides a comprehensive content management system for crafting tutorials, patterns, and community stories. It features category-based filtering, pagination, search, and individual post pages with related content.

## Features

### Blog Listing Page (`/blog`)
- Grid and list view modes
- Category filtering (single category selection)
- Search functionality with debounced input
- Pagination with dynamic page numbers
- Posts display with:
  - Featured image
  - Title and excerpt
  - Author information
  - Read time
  - Difficulty level
  - View and like counts

### Individual Blog Posts (`/blog/[slug]`)
- Full post content with rich HTML formatting
- Author bio section
- Post metadata (date, read time, views, likes)
- Related posts from same category
- Comment system
- Social sharing capabilities
- Newsletter subscription prompt
- Breadcrumb navigation

### Category Pages (`/blog/category/[category]`)
- Category-specific post listings
- Category statistics:
  - Total posts count
  - Number of contributors
  - Average difficulty level
  - Total views
- Skill level filtering (Beginner, Intermediate, Advanced)
- Sorting options:
  - Latest first
  - Most popular
  - Trending
  - By difficulty (ascending/descending)
- Newsletter subscription for category updates

## Blog Post Structure

Each blog post contains:
```javascript
{
  id: Number,
  slug: String,
  title: String,
  excerpt: String,
  content: String, // HTML content
  image: String,
  publishedAt: Date,
  readTime: String,
  author: {
    id: Number,
    name: String,
    avatar: String,
    bio: String
  },
  category: String, // One of: knitting, crochet, embroidery, quilting, sewing, weaving
  tags: Array<String>,
  difficulty: String, // beginner, intermediate, or advanced
  views: Number,
  likes: Number,
  featured: Boolean
}
```

## Components

### BlogCard Component
Reusable blog post card used in listings:
- Responsive image with aspect ratio
- Hover effects and transitions
- Difficulty badge
- Author avatar and name
- Publish date
- Read time indicator
- Category badge
- Favorite toggle button

### SkillLevelBadge Component
Visual indicator for post difficulty:
- Color-coded badges (green for beginner, yellow for intermediate, red for advanced)
- Consistent styling across the application
- Optional size variants

### AuthorCard Component
Author information display:
- Avatar image
- Name and bio
- Social links
- Post count
- Join date

## API Endpoints

### Posts Endpoints
- `GET /api/posts` - List posts with pagination and filters
  - Query params: `page`, `limit`, `category`, `search`
  - Returns: paginated posts array with metadata

- `GET /api/posts/[slug]` - Get single post by slug
  - Returns: full post data with related posts

- `GET /api/posts/[id]/related` - Get related posts
  - Returns: array of related posts from same category

- `GET /api/posts/search` - Search posts
  - Query param: `q` (search query)
  - Returns: filtered posts array

### Interactions
- `POST /api/posts/[id]/views` - Increment view count
- `POST /api/posts/[id]/likes` - Toggle like status
- `POST /api/posts/[id]/comments` - Add comment
- `GET /api/posts/[id]/comments` - Get comments

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
  - Body: `{ email, categories: [] }`

## State Management

The blog functionality is managed through the Blog Store (Pinia):

### Key State Properties
- `posts` - Array of all loaded posts
- `currentPost` - Currently viewed post
- `selectedCategory` - Active category filter
- `searchQuery` - Current search term
- `currentPage` - Current pagination page
- `postsPerPage` - Posts per page (default: 9)

### Computed Properties
- `filteredPosts` - Posts filtered by category and search
- `paginatedPosts` - Current page of filtered posts
- `popularPosts` - Top posts by view count
- `featuredPosts` - Featured posts only

### Actions
- `fetchPosts()` - Load posts from API
- `fetchPost(slug)` - Load individual post
- `setCategory(category)` - Apply category filter
- `searchPosts(query)` - Search posts
- `toggleFavorite(postId)` - Toggle favorite status

## User Interactions

### Viewing Posts
1. User navigates to `/blog`
2. Posts load automatically with default pagination
3. User can switch between grid/list views
4. Clicking a post navigates to `/blog/[slug]`

### Filtering by Category
1. User clicks category button
2. Store updates `selectedCategory`
3. Posts re-filter automatically
4. URL updates to reflect filter (optional)

### Searching
1. User types in search box
2. Debounced search triggers after 500ms
3. API search endpoint called
4. Results displayed with pagination reset

### Pagination
1. User clicks page number or prev/next
2. Store updates `currentPage`
3. New page of posts displays
4. Scroll to top of list

### Favoriting
1. User clicks heart icon (requires authentication)
2. Post ID added to favorites in localStorage
3. Visual feedback shows favorited state
4. Favorites persist across sessions

## Performance Optimizations

### Caching
- Posts cached in store to avoid redundant API calls
- Recently viewed posts stored in localStorage
- Favorites persisted locally

### Lazy Loading
- Images lazy-loaded with Nuxt Image component
- Related posts loaded only when needed
- Comments loaded on demand

### SEO
- Server-side rendering for initial page load
- Meta tags for social sharing
- Structured data for rich snippets
- Sitemap generation for all posts

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus management in modals
- Alt text for all images
- Proper heading hierarchy

## Mobile Responsiveness

- Touch-friendly interface
- Responsive grid layouts
- Mobile-optimized navigation
- Swipe gestures for image galleries
- Optimized font sizes and spacing

## Future Enhancements

Potential improvements to consider:
- Advanced search filters (date range, author)
- Post bookmarking and collections
- Reading progress indicator
- Print-friendly post layouts
- Offline reading capability
- RSS feed generation
- Email digest subscriptions
- User-generated content submissions
- Rating and review system
- Pattern difficulty calculator