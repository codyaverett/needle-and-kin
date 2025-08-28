import { defineEventHandler, readBody, createError } from 'h3';
import jwt from 'jsonwebtoken';
import type { Project } from '~/types/projects';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default defineEventHandler(async (event) => {
  const authHeader = event.node.req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const body = await readBody(event);
    
    if (!body.title || !body.description || !body.category || !body.difficulty) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      });
    }
    
    const newProject: Project = {
      id: Date.now().toString(),
      userId: decoded.userId,
      username: decoded.username || 'Anonymous',
      userAvatar: decoded.avatar,
      title: body.title,
      description: body.description,
      images: body.images || [],
      coverImage: body.coverImage || body.images?.[0] || '',
      category: body.category,
      difficulty: body.difficulty,
      materials: body.materials || [],
      steps: body.steps || [],
      progress: body.progress || 0,
      status: body.status || 'planning',
      tags: body.tags || [],
      likes: 0,
      views: 0,
      estimatedTime: body.estimatedTime,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return {
      success: true,
      project: newProject
    };
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    });
  }
});