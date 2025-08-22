# API Documentation - Needle & Kin Blog

## API Overview

The Needle & Kin blog uses Nuxt 3's built-in server API functionality to provide RESTful endpoints for blog content. All API routes are located in the `server/api/` directory and use Nitro's file-based routing system.

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

## Authentication
Currently, the API endpoints are public and do not require authentication. This is suitable for read-only blog content.

## Endpoints

### GET /api/posts/latest

**Purpose:** Retrieve the latest blog posts for homepage display

**Request:**
```http
GET /api/posts/latest
```

**Response Format:**
```typescript
interface LatestPostsResponse {
  data: BlogPost[]
  total: number
  page: number
  limit: number
}
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "The Art of Hand-Stitched Embroidery",
      "slug": "art-of-hand-stitched-embroidery",
      "excerpt": "Discover the timeless beauty of hand embroidery...",
      "content": "",
      "image": "/blog/embroidery-1.jpg",
      "publishedAt": "2024-01-15T10:00:00Z",
      "readTime": "8 min read",
      "author": {
        "name": "Sarah Chen",
        "avatar": "/avatars/sarah.jpg",
        "bio": "Master embroiderer with 15 years of experience"
      },
      "tags": ["embroidery", "tutorial", "beginner"]
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 10
}
```

**Implementation Details:**
- Returns the 3 most recent blog posts
- Posts are sorted by `publishedAt` date (newest first)
- Includes complete post metadata and author information
- File: `server/api/posts/latest.get.ts`

---

### GET /api/posts

**Purpose:** Retrieve all blog posts with filtering and pagination

**Request:**
```http
GET /api/posts?page=1&limit=10&tag=embroidery
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number for pagination |
| `limit` | number | No | 10 | Number of posts per page |
| `tag` | string | No | - | Filter posts by tag |

**Response Format:**
```typescript
interface PostsResponse {
  data: BlogPost[]
  total: number
  page: number
  limit: number
  totalPages: number
}
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "The Art of Hand-Stitched Embroidery",
      "slug": "art-of-hand-stitched-embroidery",
      "excerpt": "Discover the timeless beauty of hand embroidery...",
      "content": "",
      "image": "/blog/embroidery-1.jpg",
      "publishedAt": "2024-01-15T10:00:00Z",
      "readTime": "8 min read",
      "author": {
        "name": "Sarah Chen",
        "avatar": "/avatars/sarah.jpg",
        "bio": "Master embroiderer with 15 years of experience"
      },
      "tags": ["embroidery", "tutorial", "beginner"]
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

**Filtering Examples:**
- All posts: `/api/posts`
- Embroidery posts: `/api/posts?tag=embroidery`
- Second page: `/api/posts?page=2&limit=5`
- Beginner tutorials: `/api/posts?tag=beginner`

**Implementation Details:**
- Supports tag-based filtering
- Implements pagination with offset/limit
- Returns metadata for pagination controls
- File: `server/api/posts/index.get.ts`

---

### POST /api/contact

**Purpose:** Submit contact form data from the website

**Request:**
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "general",
  "message": "Hello, I love your tutorials!",
  "newsletter": true
}
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Full name of the contact |
| `email` | string | Yes | Valid email address |
| `subject` | string | Yes | Contact subject (general, tutorial, collaboration, feedback, technical, other) |
| `message` | string | Yes | Contact message content |
| `newsletter` | boolean | No | Newsletter subscription opt-in |

**Response Format:**
```typescript
interface ContactResponse {
  success: boolean
  message: string
  timestamp: string
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
```json
{
  "statusCode": 400,
  "statusMessage": "Missing required fields: name, email"
}
```

```json
{
  "statusCode": 400,
  "statusMessage": "Invalid email format"
}
```

**Implementation Details:**
- Validates all required fields
- Validates email format using regex
- Currently logs submission to console (development)
- Returns success/error status
- File: `server/api/contact.post.ts`

**Future Implementation:**
- Email service integration (SendGrid, Mailgun)
- Database storage of submissions
- Auto-responder emails
- Newsletter subscription handling

## Data Models

### BlogPost Interface

```typescript
interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  publishedAt: string // ISO 8601 date string
  readTime: string
  author: Author
  tags: string[]
}
```

### Author Interface

```typescript
interface Author {
  name: string
  avatar: string
  bio: string
}
```

## Mock Data

Currently, the API serves mock data for development and demonstration purposes. The dataset includes:

### Sample Posts
1. **The Art of Hand-Stitched Embroidery** - Embroidery tutorial for beginners
2. **Creating Cozy Knit Scarves for Winter** - Knitting guide for winter accessories
3. **Upcycling Old Clothes** - Sustainable fashion and upcycling techniques
4. **Beginner's Guide to Cross-Stitch** - Cross-stitch tutorial for newcomers
5. **Macrame Plant Hangers** - Home decor macrame project

### Available Tags
- `embroidery`
- `knitting` 
- `upcycling`
- `cross-stitch`
- `macrame`
- `tutorial`
- `beginner`
- `winter`
- `accessories`
- `sustainability`
- `fashion`
- `home-decor`
- `plants`

### Sample Authors
- **Sarah Chen** - Master embroiderer with 15 years of experience
- **Maria Rodriguez** - Knitting instructor and pattern designer
- **Emily Johnson** - Sustainable fashion advocate and designer
- **Lisa Thompson** - Macrame artist and home decor enthusiast

## Error Handling

### HTTP Status Codes
- `200 OK` - Successful request
- `400 Bad Request` - Invalid query parameters
- `404 Not Found` - Endpoint not found
- `500 Internal Server Error` - Server error

### Error Response Format
```json
{
  "error": {
    "message": "Invalid page parameter",
    "code": "INVALID_PARAMETER",
    "statusCode": 400
  }
}
```

## Rate Limiting
Currently no rate limiting is implemented. In production, consider implementing:
- Request rate limiting per IP
- API key authentication for write operations
- CORS configuration for cross-origin requests

## Future Enhancements

### Planned Endpoints
- `GET /api/posts/[slug]` - Individual post content
- `GET /api/tags` - List all available tags
- `GET /api/authors` - List all authors
- `POST /api/newsletter` - Newsletter subscription

### Implemented Endpoints
- `POST /api/contact` - Contact form submission (✅ Completed)

### Database Integration
The current mock data structure is designed to be easily replaceable with:
- Database ORM integration (Prisma, Drizzle)
- Headless CMS integration (Strapi, Sanity, Contentful)
- File-based content management (MDX, Markdown)

### Content Management
Future iterations may include:
- Admin API for content management
- Image upload and optimization
- Content versioning
- Publishing workflows
- SEO metadata management

## Development Notes

### File Structure
```
server/
└── api/
    └── posts/
        ├── index.get.ts     # Main posts endpoint
        └── latest.get.ts    # Latest posts endpoint
```

### Nitro Server Features Used
- File-based API routing
- Query parameter parsing with `getQuery()`
- TypeScript support
- Automatic JSON serialization
- Built-in error handling

### Testing the API
Use any HTTP client to test the endpoints:

```bash
# Get latest posts
curl http://localhost:3000/api/posts/latest

# Get all posts with pagination
curl "http://localhost:3000/api/posts?page=1&limit=5"

# Filter by tag
curl "http://localhost:3000/api/posts?tag=embroidery"

# Submit contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","subject":"general","message":"Test message","newsletter":true}'
```