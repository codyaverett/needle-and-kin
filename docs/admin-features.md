# Admin Features Documentation

## Overview
The Needle & Kin admin panel provides comprehensive tools for managing content, settings, and users.

## Admin Pages

### 1. Dashboard (`/admin`)
- Overview statistics (users, posts, views, comments)
- Recent activity feed
- Quick actions

### 2. Blog Posts Management (`/admin/posts`)
- Create, edit, and delete blog posts
- Manage post categories and tags
- Preview posts before publishing
- Set featured images and SEO metadata

### 3. User Management (`/admin/users`)
- View and manage user accounts
- Change user roles (admin, author, user)
- Reset user passwords
- View user activity

### 4. Content Management (`/admin/content`)
**New Feature!** Manage static site content without code changes.

#### Sections:
- **Hero Section**: Homepage hero title, subtitle, and call-to-action
- **About Page**: 
  - Hero content
  - Story paragraphs (dynamic add/remove)
  - Mission values with icons
  - Team information
  - Call-to-action buttons
- **Features**: Homepage feature cards with icons and descriptions
- **Footer**: Footer text, copyright, and social media links

#### API Endpoints:
- `GET /api/admin/content` - Retrieve current content
- `POST /api/admin/content` - Save content updates

### 5. Settings Management (`/admin/settings`)
**New Feature!** Comprehensive application settings management.

#### Settings Categories:

##### General Settings
- Site name and URL
- Contact and support emails
- Default language and timezone
- Site description

##### Email Configuration
- SMTP server settings (host, port, credentials)
- From email and name
- TLS/SSL configuration
- Test connection functionality

##### Security Settings
- Two-factor authentication (2FA) requirements
- Account lockout policies
- Password expiry settings
- Session timeout configuration
- Remember me duration

##### SEO Settings
- Meta title templates
- Default meta descriptions and images
- Keywords management
- Social media integration (Twitter, Facebook)
- Sitemap and robots.txt generation

##### Analytics & Tracking
- Google Analytics integration
- Google Tag Manager
- Facebook Pixel
- Hotjar tracking
- GDPR compliance options

#### API Endpoints:
- `GET /api/admin/settings` - Retrieve current settings
- `POST /api/admin/settings` - Save settings updates
- `POST /api/admin/settings/test-email` - Test email configuration

## Security Features

### Authentication
- Admin-only middleware protection
- Session-based authentication
- Return URL handling for unauthorized access

### Data Protection
- Password masking in API responses
- Sensitive data encryption
- Role-based access control

## Technical Implementation

### Frontend
- Vue 3 composition API
- Pinia state management
- Tailwind CSS styling
- Responsive design

### Backend
- Nuxt 3 server API routes
- File-based data persistence (development)
- Database ready (production)

### Dependencies
- `nodemailer` - Email functionality
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens

## Usage

### Accessing Admin Panel
1. Navigate to `/login`
2. Use admin credentials:
   - Email: `admin@needleandkin.com`
   - Password: `ChangeMe123!`
3. Access admin features from `/admin`

### Managing Content
1. Navigate to `/admin/content`
2. Select content section tab
3. Edit fields as needed
4. Click "Save Changes" to persist

### Configuring Settings
1. Navigate to `/admin/settings`
2. Update settings in each category
3. Test email configuration if needed
4. Click "Save Settings" to apply

## Development Notes

### Adding New Admin Pages
1. Create page in `/pages/admin/`
2. Add `definePageMeta` with admin layout and middleware
3. Update navigation in `/layouts/admin.vue`
4. Create corresponding API endpoints in `/server/api/admin/`

### Data Storage
- Development: JSON files in `/server/data/`
- Production: Database integration recommended

### Email Testing
- Development: Simulated email testing
- Production: Actual SMTP connection with nodemailer

## Future Enhancements
- Real-time content preview
- Version control for content changes
- Bulk user operations
- Advanced analytics dashboard
- Email template management
- Backup and restore functionality