import { defineEventHandler, readBody, getRouterParam, createError } from 'h3';
import jwt from 'jsonwebtoken';

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
  const id = getRouterParam(event, 'id');
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const body = await readBody(event);
    
    return {
      success: true,
      message: `Project ${id} updated successfully`,
      updates: body
    };
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    });
  }
});