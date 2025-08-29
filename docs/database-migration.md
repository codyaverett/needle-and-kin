# Database Migration Guide

## Overview
This document describes the migration from hardcoded mock data to a database-driven system using Prisma ORM with SQLite for development and the option to use PostgreSQL in production.

## Database Setup

### Prerequisites
- Node.js 18+ installed
- pnpm package manager

### Initial Setup

1. **Install Dependencies**
   ```bash
   pnpm add prisma @prisma/client
   ```

2. **Environment Configuration**
   Create or update `.env` file:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"  # SQLite for development
   # DATABASE_URL="postgresql://user:password@localhost:5432/needleandkin"  # PostgreSQL for production
   
   # JWT Secret
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   ```

3. **Initialize Database**
   ```bash
   # Run migrations
   pnpm db:migrate
   
   # Seed the database with initial data
   pnpm db:seed
   ```

## Database Schema

### Core Models

#### User Management
- **User**: Core user account information
- **UserPreferences**: User settings and preferences
- **CraftingProfile**: User's crafting experience and interests
- **Session**: Authentication sessions

#### Content Models
- **Post**: Blog posts with full content management
- **Project**: User crafting projects with materials and steps
- **Comment**: Comments on posts with nested replies
- **Tutorial**: Instructional content for crafts

#### Engagement Models
- **PostLike**, **ProjectLike**, **ActivityLike**: Like tracking
- **Follow**: User following system
- **Notification**: User notifications
- **Activity**: User activity feed

#### Site Management
- **SiteContent**: Dynamic site content (homepage, about, etc.)
- **AppSettings**: Application configuration
- **Statistics**: Cached statistics for performance

## Migration Commands

### Development
```bash
# Create a new migration
pnpm exec prisma migrate dev --name migration_name

# Reset database (warning: deletes all data)
pnpm db:reset

# View database in Prisma Studio
pnpm db:studio

# Seed the database
pnpm db:seed
```

### Production
```bash
# Deploy migrations
pnpm exec prisma migrate deploy

# Generate Prisma Client
pnpm exec prisma generate
```

## API Migration Status

### ✅ Completed Migrations
- `/api/about` - Fetches from `SiteContent` table
- `/api/site-content` - Fetches from `SiteContent` table
- `/api/contact-info` - Fetches from `SiteContent` table
- `/api/posts/index` - Fetches from `Post` table with pagination
- `/api/posts/[slug]` - Fetches single post with related posts
- `/api/projects/index` - Fetches from `Project` table with filtering

### 🚧 Pending Migrations
- User authentication endpoints
- Admin management endpoints
- Comments and interactions
- Newsletter subscriptions
- Notifications system
- Activities feed
- Achievements system

## Data Structure Changes

### JSON Fields
Several fields store JSON data as strings:
- `tags` - Array of tag strings
- `materials` - Array of material objects
- `steps` - Array of step objects
- `favoriteCategories` - Array of category strings
- `images` - Array of image URLs

### Example Usage
```javascript
// Parsing JSON fields
const post = await prisma.post.findUnique({ where: { slug } })
const tags = JSON.parse(post.tags)

// Storing JSON fields
await prisma.post.create({
  data: {
    title: 'New Post',
    tags: JSON.stringify(['knitting', 'tutorial'])
  }
})
```

## Testing

### Test Database Setup
For testing, use a separate database:
```env
DATABASE_URL="file:./test.db"
```

### Running Tests
```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage
```

## Performance Considerations

1. **Indexes**: Critical fields are automatically indexed (slug, email, username)
2. **Pagination**: All list endpoints support pagination
3. **Eager Loading**: Use `include` to reduce N+1 queries
4. **View Counts**: Incremented asynchronously to avoid blocking

## Backup and Recovery

### Backup Database
```bash
# SQLite
cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db

# PostgreSQL
pg_dump needleandkin > backup-$(date +%Y%m%d).sql
```

### Restore Database
```bash
# SQLite
cp prisma/backup-20240101.db prisma/dev.db

# PostgreSQL
psql needleandkin < backup-20240101.sql
```

## Troubleshooting

### Common Issues

1. **Migration Conflicts**
   ```bash
   pnpm exec prisma migrate resolve --applied migration_name
   ```

2. **Schema Out of Sync**
   ```bash
   pnpm exec prisma db push --force-reset
   ```

3. **Client Generation Issues**
   ```bash
   pnpm exec prisma generate --clear
   ```

## Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` for templates
2. **Use parameterized queries** - Prisma handles this automatically
3. **Validate input data** - Add validation before database operations
4. **Limit query results** - Always use pagination for lists
5. **Secure sensitive data** - Hash passwords, encrypt PII

## Future Enhancements

1. **Full-text search** - Implement search with PostgreSQL
2. **Database migrations CI/CD** - Automate migration deployment
3. **Read replicas** - Scale read operations
4. **Database monitoring** - Add performance tracking
5. **Automated backups** - Schedule regular backups