// Client-side security utilities for NeoNest

/**
 * CSRF Token Manager for client-side requests
 */
class CSRFTokenManager {
  constructor() {
    this.token = null;
    this.sessionToken = null;
  }

  /**
   * Generate a new CSRF token pair
   */
  generateTokens() {
    // Generate random tokens
    this.token = this.generateRandomToken();
    this.sessionToken = this.generateRandomToken();
    
    // Store in sessionStorage for the session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('csrf_token', this.token);
      sessionStorage.setItem('session_token', this.sessionToken);
    }
  }

  /**
   * Get current CSRF tokens
   */
  getTokens() {
    if (!this.token || !this.sessionToken) {
      // Try to restore from sessionStorage
      if (typeof window !== 'undefined') {
        this.token = sessionStorage.getItem('csrf_token');
        this.sessionToken = sessionStorage.getItem('session_token');
      }
      
      // Generate new tokens if none exist
      if (!this.token || !this.sessionToken) {
        this.generateTokens();
      }
    }
    
    return {
      csrfToken: this.token,
      sessionToken: this.sessionToken
    };
  }

  /**
   * Generate a random token
   */
  generateRandomToken() {
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback for environments without crypto API
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Clear tokens (for logout)
   */
  clearTokens() {
    this.token = null;
    this.sessionToken = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('csrf_token');
      sessionStorage.removeItem('session_token');
    }
  }
}

// Create singleton instance
const csrfManager = new CSRFTokenManager();

/**
 * Secure fetch wrapper that includes CSRF tokens and other security headers
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @returns {Promise} Fetch response
 */
export async function secureFetch(url, options = {}) {
  const { csrfToken, sessionToken } = csrfManager.getTokens();
  
  // Prepare secure headers
  const secureHeaders = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...options.headers
  };

  // Add CSRF tokens for state-changing requests
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method?.toUpperCase())) {
    secureHeaders['X-CSRF-Token'] = csrfToken;
    secureHeaders['X-Session-Token'] = sessionToken;
  }

  // Add authorization header if token exists
  const authToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (authToken) {
    secureHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  const secureOptions = {
    ...options,
    headers: secureHeaders,
    credentials: 'same-origin' // Include cookies for same-origin requests
  };

  try {
    const response = await fetch(url, secureOptions);
    
    // Handle common security responses
    if (response.status === 403 && response.headers.get('X-CSRF-Error')) {
      // CSRF token expired, generate new ones and retry
      csrfManager.generateTokens();
      const retryHeaders = { ...secureHeaders };
      const { csrfToken: newCsrf, sessionToken: newSession } = csrfManager.getTokens();
      retryHeaders['X-CSRF-Token'] = newCsrf;
      retryHeaders['X-Session-Token'] = newSession;
      
      return await fetch(url, { ...secureOptions, headers: retryHeaders });
    }
    
    return response;
  } catch (error) {
    console.error('Secure fetch error:', error);
    throw error;
  }
}

/**
 * Input sanitization for client-side use
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
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
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength score
 */
export function validatePassword(password) {
  const result = {
    isValid: false,
    strength: 0,
    feedback: []
  };

  if (!password) {
    result.feedback.push('Password is required');
    return result;
  }

  if (password.length < 8) {
    result.feedback.push('Password must be at least 8 characters long');
  } else {
    result.strength += 1;
  }

  if (!/[a-z]/.test(password)) {
    result.feedback.push('Password must contain lowercase letters');
  } else {
    result.strength += 1;
  }

  if (!/[A-Z]/.test(password)) {
    result.feedback.push('Password must contain uppercase letters');
  } else {
    result.strength += 1;
  }

  if (!/\d/.test(password)) {
    result.feedback.push('Password must contain numbers');
  } else {
    result.strength += 1;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.feedback.push('Password must contain special characters');
  } else {
    result.strength += 1;
  }

  result.isValid = result.strength >= 3 && password.length >= 8;
  return result;
}

/**
 * Initialize security on page load
 */
export function initializeSecurity() {
  // Generate initial CSRF tokens
  csrfManager.generateTokens();
  
  // Set up security headers for all requests
  if (typeof window !== 'undefined') {
    // Override default fetch to include security measures
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
      return secureFetch(url, options);
    };
  }
}

/**
 * Clear all security tokens (for logout)
 */
export function clearSecurityTokens() {
  csrfManager.clearTokens();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    sessionStorage.clear();
  }
}

// Auto-initialize on module load
if (typeof window !== 'undefined') {
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSecurity);
  } else {
    initializeSecurity();
  }
}

export { csrfManager };