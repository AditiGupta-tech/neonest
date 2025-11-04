import jwt from 'jsonwebtoken';
import { csrfProtection } from './csrf.js';

// Input validation utility
function validateInput(input, type = 'string', maxLength = 1000) {
  if (!input) return false;
  if (typeof input !== type) return false;
  if (type === 'string' && input.length > maxLength) return false;
  // Basic XSS prevention
  if (type === 'string' && /<script|javascript:|data:|vbscript:/i.test(input)) return false;
  return true;
}

export async function authenticateToken(req) {
  // Check CSRF protection for non-GET requests
  if (req.method !== 'GET') {
    const csrfCheck = await csrfProtection(req);
    if (csrfCheck.error) {
      return Response.json({ error: csrfCheck.error }, { status: csrfCheck.status });
    }
  }

  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json({ error: 'Authorization token missing or malformed' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  // Validate token format
  if (!validateInput(token, 'string', 500)) {
    return Response.json({ error: 'Invalid token format' }, { status: 400 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { user: decoded }; 
  } catch (error) {
    return { error: 'Invalid or expired token' };
  }
}

// Enhanced authentication with input validation
export async function authenticateWithValidation(req) {
  try {
    const result = await authenticateToken(req);
    return result;
  } catch (error) {
    console.error('Authentication error:', error);
    return Response.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export { validateInput };
