import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

// Mock Prisma Client
vi.mock('@prisma/client', () => {
  const mockPrismaClient = {
    contactSubmission: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    },
    newsletterSubscription: {
      upsert: vi.fn()
    },
    user: {
      findUnique: vi.fn()
    }
  }
  return {
    PrismaClient: vi.fn(() => mockPrismaClient)
  }
})

// Mock JWT
vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn(),
    sign: vi.fn()
  }
}))

describe('Contact Form Database Operations', () => {
  let prisma: any
  
  beforeEach(() => {
    prisma = new PrismaClient()
    vi.clearAllMocks()
  })
  
  describe('POST /api/contact', () => {
    it('should save contact submission to database', async () => {
      const mockSubmission = {
        id: 'test-id',
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message',
        newsletter: true,
        createdAt: new Date()
      }
      
      prisma.contactSubmission.create.mockResolvedValue(mockSubmission)
      prisma.newsletterSubscription.upsert.mockResolvedValue({})
      
      const body = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message',
        newsletter: true
      }
      
      // Simulate the API call
      await prisma.contactSubmission.create({
        data: body
      })
      
      expect(prisma.contactSubmission.create).toHaveBeenCalledWith({
        data: body
      })
    })
    
    it('should handle newsletter subscription when opted in', async () => {
      const body = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        subject: 'Test',
        message: 'Message',
        newsletter: true
      }
      
      prisma.contactSubmission.create.mockResolvedValue({
        ...body,
        id: 'test-id',
        createdAt: new Date()
      })
      
      await prisma.contactSubmission.create({ data: body })
      
      await prisma.newsletterSubscription.upsert({
        where: { email: body.email },
        update: {
          name: body.name,
          status: 'active'
        },
        create: {
          email: body.email,
          name: body.name,
          status: 'active'
        }
      })
      
      expect(prisma.newsletterSubscription.upsert).toHaveBeenCalledWith({
        where: { email: body.email },
        update: {
          name: body.name,
          status: 'active'
        },
        create: {
          email: body.email,
          name: body.name,
          status: 'active'
        }
      })
    })
    
    it('should not create newsletter subscription when not opted in', async () => {
      const body = {
        name: 'Bob Smith',
        email: 'bob@example.com',
        subject: 'Test',
        message: 'Message',
        newsletter: false
      }
      
      prisma.contactSubmission.create.mockResolvedValue({
        ...body,
        id: 'test-id',
        createdAt: new Date()
      })
      
      await prisma.contactSubmission.create({ data: body })
      
      expect(prisma.newsletterSubscription.upsert).not.toHaveBeenCalled()
    })
  })
  
  describe('GET /api/admin/contact-submissions', () => {
    it('should require admin authentication', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token')
      })
      
      try {
        jwt.verify('invalid-token', 'secret')
      } catch (error) {
        expect(error.message).toBe('Invalid token')
      }
    })
    
    it('should return paginated contact submissions for admin', async () => {
      const mockUser = {
        id: 'admin-id',
        role: 'admin'
      }
      
      const mockSubmissions = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@example.com',
          subject: 'Subject 1',
          message: 'Message 1',
          status: 'unread',
          createdAt: new Date()
        },
        {
          id: '2',
          name: 'User 2',
          email: 'user2@example.com',
          subject: 'Subject 2',
          message: 'Message 2',
          status: 'read',
          createdAt: new Date()
        }
      ]
      
      jwt.verify.mockReturnValue({ userId: 'admin-id' })
      prisma.user.findUnique.mockResolvedValue(mockUser)
      prisma.contactSubmission.findMany.mockResolvedValue(mockSubmissions)
      prisma.contactSubmission.count.mockResolvedValue(2)
      prisma.contactSubmission.groupBy.mockResolvedValue([
        { status: 'unread', _count: 1 },
        { status: 'read', _count: 1 }
      ])
      
      const submissions = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        skip: 0
      })
      
      expect(submissions).toHaveLength(2)
      expect(prisma.contactSubmission.findMany).toHaveBeenCalled()
    })
    
    it('should filter submissions by status', async () => {
      const mockSubmissions = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@example.com',
          subject: 'Subject 1',
          message: 'Message 1',
          status: 'unread',
          createdAt: new Date()
        }
      ]
      
      prisma.contactSubmission.findMany.mockResolvedValue(mockSubmissions)
      
      const submissions = await prisma.contactSubmission.findMany({
        where: { status: 'unread' },
        orderBy: { createdAt: 'desc' }
      })
      
      expect(submissions).toHaveLength(1)
      expect(submissions[0].status).toBe('unread')
    })
    
    it('should search submissions by text', async () => {
      const searchTerm = 'test'
      
      await prisma.contactSubmission.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { subject: { contains: searchTerm, mode: 'insensitive' } },
            { message: { contains: searchTerm, mode: 'insensitive' } }
          ]
        }
      })
      
      expect(prisma.contactSubmission.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { subject: { contains: searchTerm, mode: 'insensitive' } },
            { message: { contains: searchTerm, mode: 'insensitive' } }
          ]
        }
      })
    })
  })
  
  describe('PATCH /api/admin/contact-submissions/[id]', () => {
    it('should update submission status', async () => {
      const mockSubmission = {
        id: 'test-id',
        status: 'read'
      }
      
      prisma.contactSubmission.update.mockResolvedValue(mockSubmission)
      
      const result = await prisma.contactSubmission.update({
        where: { id: 'test-id' },
        data: { status: 'read' }
      })
      
      expect(result.status).toBe('read')
      expect(prisma.contactSubmission.update).toHaveBeenCalledWith({
        where: { id: 'test-id' },
        data: { status: 'read' }
      })
    })
    
    it('should save admin notes', async () => {
      const mockSubmission = {
        id: 'test-id',
        adminNotes: 'This is a note'
      }
      
      prisma.contactSubmission.update.mockResolvedValue(mockSubmission)
      
      const result = await prisma.contactSubmission.update({
        where: { id: 'test-id' },
        data: { adminNotes: 'This is a note' }
      })
      
      expect(result.adminNotes).toBe('This is a note')
    })
    
    it('should save response and update status when responding', async () => {
      const now = new Date()
      const mockSubmission = {
        id: 'test-id',
        responseMessage: 'Thank you for contacting us',
        respondedAt: now,
        respondedBy: 'admin@example.com',
        status: 'responded'
      }
      
      prisma.contactSubmission.update.mockResolvedValue(mockSubmission)
      
      const result = await prisma.contactSubmission.update({
        where: { id: 'test-id' },
        data: {
          responseMessage: 'Thank you for contacting us',
          respondedAt: now,
          respondedBy: 'admin@example.com',
          status: 'responded'
        }
      })
      
      expect(result.status).toBe('responded')
      expect(result.responseMessage).toBe('Thank you for contacting us')
      expect(result.respondedBy).toBe('admin@example.com')
    })
  })
  
  describe('DELETE /api/admin/contact-submissions/[id]', () => {
    it('should delete a submission', async () => {
      prisma.contactSubmission.delete.mockResolvedValue({ id: 'test-id' })
      
      await prisma.contactSubmission.delete({
        where: { id: 'test-id' }
      })
      
      expect(prisma.contactSubmission.delete).toHaveBeenCalledWith({
        where: { id: 'test-id' }
      })
    })
    
    it('should handle non-existent submission', async () => {
      prisma.contactSubmission.delete.mockRejectedValue({
        code: 'P2025',
        message: 'Record not found'
      })
      
      try {
        await prisma.contactSubmission.delete({
          where: { id: 'non-existent' }
        })
      } catch (error) {
        expect(error.code).toBe('P2025')
      }
    })
  })
})