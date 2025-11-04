import { URL } from 'url';

// Allowed domains for external requests
const ALLOWED_DOMAINS = [
  'api.openai.com',
  'generativelanguage.googleapis.com',
  'cloudinary.com',
  'res.cloudinary.com',
  'api.cloudinary.com'
];

// Blocked IP ranges (private networks)
const BLOCKED_IP_RANGES = [
  /^127\./, // localhost
  /^10\./, // private class A
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // private class B
  /^192\.168\./, // private class C
  /^169\.254\./, // link-local
  /^::1$/, // IPv6 localhost
  /^fc00:/, // IPv6 private
  /^fe80:/ // IPv6 link-local
];

/**
 * Validates if a URL is safe for external requests
 * @param {string} urlString - The URL to validate
 * @returns {Object} - {isValid: boolean, error?: string, url?: URL}
 */
export function validateURL(urlString) {
  try {
    if (!urlString || typeof urlString !== 'string') {
      return { isValid: false, error: 'Invalid URL format' };
    }

    // Basic URL validation
    const url = new URL(urlString);

    // Only allow HTTPS for external requests
    if (url.protocol !== 'https:') {
      return { isValid: false, error: 'Only HTTPS URLs are allowed' };
    }

    // Check if domain is in allowed list
    const hostname = url.hostname.toLowerCase();
    const isAllowedDomain = ALLOWED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );

    if (!isAllowedDomain) {
      return { isValid: false, error: 'Domain not in allowed list' };
    }

    // Check for blocked IP ranges
    const isBlockedIP = BLOCKED_IP_RANGES.some(range => range.test(hostname));
    if (isBlockedIP) {
      return { isValid: false, error: 'Access to private networks is not allowed' };
    }

    // Additional security checks
    if (url.username || url.password) {
      return { isValid: false, error: 'URLs with credentials are not allowed' };
    }

    return { isValid: true, url };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
}

/**
 * Safe fetch wrapper with URL validation
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise} - Fetch response or error
 */
export async function safeFetch(url, options = {}) {
  const validation = validateURL(url);
  
  if (!validation.isValid) {
    throw new Error(`URL validation failed: ${validation.error}`);
  }

  // Add security headers and timeout
  const secureOptions = {
    ...options,
    headers: {
      'User-Agent': 'NeoNest/1.0',
      ...options.headers
    },
    // Add timeout to prevent hanging requests
    signal: AbortSignal.timeout(30000) // 30 seconds
  };

  try {
    const response = await fetch(validation.url.toString(), secureOptions);
    return response;
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

/**
 * Sanitize and validate file upload URLs
 * @param {string} url - The upload URL
 * @returns {Object} - Validation result
 */
export function validateUploadURL(url) {
  const validation = validateURL(url);
  
  if (!validation.isValid) {
    return validation;
  }

  // Additional checks for upload URLs
  const allowedUploadDomains = ['cloudinary.com', 'res.cloudinary.com', 'api.cloudinary.com'];
  const hostname = validation.url.hostname.toLowerCase();
  
  const isAllowedUpload = allowedUploadDomains.some(domain => 
    hostname === domain || hostname.endsWith('.' + domain)
  );

  if (!isAllowedUpload) {
    return { isValid: false, error: 'Upload domain not allowed' };
  }

  return validation;
}