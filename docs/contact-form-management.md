# Contact Form Management

## Overview

The contact form system allows visitors to submit inquiries through the website, which are stored in the database and can be managed by administrators through a dedicated admin interface.

## Features

### For Users
- Submit contact forms with name, email, subject, and message
- Optional newsletter subscription during form submission
- Form validation for required fields and email format
- Success confirmation after submission

### For Administrators
- View all contact submissions in a paginated list
- Filter submissions by status (Unread, Read, Responded, Archived)
- Search submissions by name, email, subject, or message content
- View detailed submission information
- Respond to submissions directly from the admin panel
- Add internal admin notes to submissions
- Delete submissions when needed
- Automatic status tracking (unread → read → responded)

## Database Schema

### ContactSubmission Model

```prisma
model ContactSubmission {
  id                String    @id @default(cuid())
  name              String
  email             String
  subject           String
  message           String
  newsletter        Boolean   @default(false)
  
  status            String    @default("unread") // unread, read, responded, archived
  adminNotes        String?
  responseMessage   String?
  respondedAt       DateTime?
  respondedBy       String?
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

## API Endpoints

### Public Endpoints

#### POST /api/contact
Submit a new contact form

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about services",
  "message": "I would like to know more about...",
  "newsletter": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "submissionId": "clxyz123...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Admin Endpoints (Authentication Required)

#### GET /api/admin/contact-submissions
Retrieve paginated list of contact submissions

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `status` (string): Filter by status (unread, read, responded, archived)
- `search` (string): Search in name, email, subject, or message

**Response:**
```json
{
  "submissions": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  },
  "counts": {
    "all": 45,
    "unread": 12,
    "read": 15,
    "responded": 10,
    "archived": 8
  }
}
```

#### PATCH /api/admin/contact-submissions/[id]
Update a contact submission

**Request Body:**
```json
{
  "status": "read",
  "adminNotes": "Follow up needed",
  "responseMessage": "Thank you for your inquiry...",
  "sendEmail": true
}
```

#### DELETE /api/admin/contact-submissions/[id]
Delete a contact submission

## Admin Interface

### Accessing Contact Submissions

1. Log in to the admin panel at `/admin`
2. Click on "Contact Forms" in the sidebar navigation
3. The contact submissions page displays all submissions with filtering and search capabilities

### Managing Submissions

#### Viewing Submissions
- Click the eye icon to view full submission details
- Submissions are automatically marked as "read" when viewed
- Admin notes can be added for internal reference

#### Responding to Submissions
- Click the reply icon to open the response modal
- Type your response message
- Choose whether to send an email notification to the user
- The submission status automatically changes to "responded"

#### Filtering and Searching
- Use the status tabs to filter by: All, Unread, Read, Responded, or Archived
- Use the search bar to find submissions by name, email, subject, or message content
- Results are paginated for better performance

## Newsletter Integration

When users opt-in for the newsletter during contact form submission:
- Their email is automatically added to the NewsletterSubscription table
- If they already exist, their subscription status is updated to "active"
- The subscription includes their name for personalized communications

## Security Considerations

- All admin endpoints require authentication via JWT token
- Only users with "admin" role can access contact submissions
- Input validation prevents SQL injection and XSS attacks
- Email format validation ensures valid email addresses
- Rate limiting should be implemented in production

## Email Notifications

### Current Status
The system is prepared for email integration but currently logs to console. To enable email notifications:

1. Install an email service package (e.g., nodemailer, @sendgrid/mail)
2. Configure email credentials in environment variables
3. Implement email sending in the TODO sections of the API endpoints

### Future Enhancements
- Email notification to admin when new submission received
- Confirmation email to user upon submission
- Response email to user when admin replies
- Email templates for consistent branding

## Testing

Tests are located in `/server/api/__tests__/contact-db.test.ts` and cover:
- Contact form submission and database storage
- Newsletter subscription handling
- Admin authentication and authorization
- Pagination and filtering
- Status updates and response handling
- Error handling for invalid data

Run tests with:
```bash
pnpm test contact-db
```

## Maintenance

### Database Cleanup
Consider implementing periodic cleanup of old submissions:
- Archive submissions older than 6 months
- Delete archived submissions older than 1 year
- Export submissions before deletion for record keeping

### Performance Optimization
- Index the `status` and `createdAt` fields for faster queries
- Implement caching for frequently accessed submissions
- Consider full-text search for large databases

## Troubleshooting

### Common Issues

1. **Submissions not appearing in admin panel**
   - Check database connection
   - Verify admin authentication
   - Check browser console for API errors

2. **Email notifications not sending**
   - Verify email service configuration
   - Check email service API limits
   - Review server logs for errors

3. **Search not returning results**
   - Ensure search term matches partial content
   - Check for case sensitivity issues
   - Verify database collation settings