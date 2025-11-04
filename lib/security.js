import { csrfProtection, generateCSRFToken } from './csrf.js';
import { validateURL, safeFetch } from './urlValidator.js';
import { validateInput } from './auth.js';

/**
 * Comprehensive security middleware for API routes
 * Combines CSRF protection, input validation, and rate limiting
 */
export class SecurityMiddleware {
  constructor() {
    this.rateLimitMap = new Map();
    this.maxRequestsPerMinute = 60;
    this.blockDuration = 15 * 60 * 1000; // 15 minutes
  }

  /**
   * Rate limiting implementation
   * @param {string} identifier - IP address or user ID
   * @returns {Object} Rate limit result
   */
  checkRateLimit(identifier) {
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window

    if (!this.rateLimitMap.has(identifier)) {
      this.rateLimitMap.set(identifier, []);
    }

    const requests = this.rateLimitMap.get(identifier);
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    this.rateLimitMap.set(identifier, recentRequests);

    // Check if rate limit exceeded
    if (recentRequests.length >= this.maxRequestsPerMinute) {
      return {
        allowed: false,
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter: 60
      };
    }

    // Add current request
    recentRequests.push(now);
    return { allowed: true };
  }

  /**
   * Sanitize request body to prevent XSS and injection attacks
   * @param {Object} body - Request body object
   * @returns {Object} Sanitized body
   */
  sanitizeRequestBody(body) {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized = {};
    
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        // Remove HTML tags and dangerous characters
        sanitized[key] = value
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/[<>\"'&]/g, (match) => {
            const entities = {
              '<': '&lt;',
              '>': '&gt;',
              '"': '&quot;',
              "'": '&#x27;',
              '&': '&amp;'
            };
            return entities[match] || match;
          })
          .trim();
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? this.sanitizeRequestBody({ temp: item }).temp : item
        );
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeRequestBody(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Validate request headers for security
   * @param {Request} req - Request object
   * @returns {Object} Validation result
   */
  validateHeaders(req) {
    const contentType = req.headers.get('content-type');
    const userAgent = req.headers.get('user-agent');
    const origin = req.headers.get('origin');

    // Check for suspicious user agents
    if (userAgent && /bot|crawler|spider|scraper/i.test(userAgent)) {
      return {
        valid: false,
        error: 'Automated requests not allowed'
      };
    }

    // Validate content type for POST/PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      if (!contentType || !contentType.includes('application/json')) {
        return {
          valid: false,
          error: 'Invalid content type'
        };
      }
    }

    return { valid: true };
  }

  /**
   * Main security check function
   * @param {Request} req - Request object
   * @returns {Object} Security check result
   */
  async performSecurityChecks(req) {
    try {
      // Get client identifier (IP address)
      const clientIP = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      'unknown';

      // Rate limiting
      const rateLimitResult = this.checkRateLimit(clientIP);
      if (!rateLimitResult.allowed) {
        return {
          passed: false,
          status: 429,
          error: rateLimitResult.error,
          headers: {
            'Retry-After': rateLimitResult.retryAfter.toString()
          }
        };
      }

      // Header validation
      const headerValidation = this.validateHeaders(req);
      if (!headerValidation.valid) {
        return {
          passed: false,
          status: 400,
          error: headerValidation.error
        };
      }

      // CSRF protection for state-changing requests
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        const csrfResult = await csrfProtection(req);
        if (csrfResult.error) {
          return {
            passed: false,
            status: csrfResult.status || 403,
            error: csrfResult.error
          };
        }
      }

      return { passed: true };
    } catch (error) {
      console.error('Security check error:', error);
      return {
        passed: false,
        status: 500,
        error: 'Security validation failed'
      };
    }
  }

  /**
   * Secure API wrapper that applies all security measures
   * @param {Function} handler - Original API handler
   * @returns {Function} Secured API handler
   */
  secureAPI(handler) {
    return async (req) => {
      try {
        // Perform security checks
        const securityResult = await this.performSecurityChecks(req);
        
        if (!securityResult.passed) {
          return Response.json(
            { error: securityResult.error },
            { 
              status: securityResult.status,
              headers: securityResult.headers || {}
            }
          );
        }

        // Sanitize request body if present
        if (req.body) {
          const body = await req.json();
          const sanitizedBody = this.sanitizeRequestBody(body);
          
          // Create new request with sanitized body
          const sanitizedReq = new Request(req.url, {
            method: req.method,
            headers: req.headers,
            body: JSON.stringify(sanitizedBody)
          });
          
          return await handler(sanitizedReq);
        }

        return await handler(req);
      } catch (error) {
        console.error('Secure API error:', error);
        return Response.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }
    };
  }
}

// Create singleton instance
const securityMiddleware = new SecurityMiddleware();

/**
 * Easy-to-use security wrapper for API routes
 * @param {Function} handler - API route handler
 * @returns {Function} Secured handler
 */
export function withSecurity(handler) {
  return securityMiddleware.secureAPI(handler);
}

/**
 * Generate CSRF token for client-side use
 * @returns {string} CSRF token
 */
export function getCSRFToken() {
  return generateCSRFToken();
}

/**
 * Validate and sanitize user input
 * @param {any} input - Input to validate
 * @param {string} type - Expected type
 * @param {number} maxLength - Maximum length for strings
 * @returns {boolean} Whether input is valid
 */
export function validateAndSanitizeInput(input, type = 'string', maxLength = 1000) {
  return validateInput(input, type, maxLength);
}

/**
 * Safe external request wrapper
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise} Fetch response
 */
export async function makeSecureRequest(url, options = {}) {
  return await safeFetch(url, options);
}

export { validateURL, securityMiddleware };