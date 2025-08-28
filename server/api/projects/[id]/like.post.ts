import { defineEventHandler, getRouterParam, createError } from 'h3';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const projectLikes = new Map<string, Set<string>>();

export default defineEventHandler(async (event) => {
  const authHeader = event.node.req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    });
  }
  
  const token = authHeader.substring(7);
  const projectId = getRouterParam(event, 'id');
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;
    
    if (!projectLikes.has(projectId)) {
      projectLikes.set(projectId, new Set());
    }
    
    const likes = projectLikes.get(projectId)!;
    
    if (likes.has(userId)) {
      likes.delete(userId);
      return {
        success: true,
        liked: false,
        likes: likes.size
      };
    } else {
      likes.add(userId);
      return {
        success: true,
        liked: true,
        likes: likes.size
      };
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    });
  }
});