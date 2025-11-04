import crypto from 'crypto';

// Generate CSRF token
export function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Verify CSRF token
export function verifyCSRFToken(token, sessionToken) {
  if (!token || !sessionToken) {
    return false;
  }
  return crypto.timingSafeEqual(
    Buffer.from(token, 'hex'),
    Buffer.from(sessionToken, 'hex')
  );
}

// CSRF middleware for API routes
export async function csrfProtection(req) {
  const method = req.method;
  
  // Skip CSRF check for GET requests
  if (method === 'GET') {
    return { success: true };
  }

  const csrfToken = req.headers.get('x-csrf-token');
  const sessionToken = req.headers.get('x-session-token');

  if (!csrfToken || !sessionToken) {
    return {
      error: 'CSRF token missing',
      status: 403
    };
  }

  if (!verifyCSRFToken(csrfToken, sessionToken)) {
    return {
      error: 'Invalid CSRF token',
      status: 403
    };
  }

  return { success: true };
}

// Enhanced authentication with CSRF protection
export async function authenticateWithCSRF(req) {
  // First check CSRF protection
  const csrfCheck = await csrfProtection(req);
  if (csrfCheck.error) {
    return csrfCheck;
  }

  // Then check authentication
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      error: 'Authorization token missing or malformed',
      status: 401
    };
  }

  const token = authHeader.split(' ')[1];

  try {
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { user: decoded, success: true };
  } catch (error) {
    return {
      error: 'Invalid or expired token',
      status: 401
    };
  }
}