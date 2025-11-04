# Security Implementation Guide for NeoNest

This document outlines the comprehensive security measures implemented to protect NeoNest users and data.

## 🔒 Security Features Implemented

### 1. Cross-Site Request Forgery (CSRF) Protection
- **Location**: `lib/csrf.js`
- **Implementation**: Token-based CSRF protection for all state-changing requests
- **Usage**: Automatically applied via security middleware

### 2. Cross-Site Scripting (XSS) Prevention
- **Components Fixed**: 
  - `app/components/TextToSpeech.js`
  - `app/components/SpeechRecognition.js`
- **Implementation**: Input sanitization and output encoding
- **Protection**: Prevents malicious script injection

### 3. Server-Side Request Forgery (SSRF) Prevention
- **Location**: `lib/urlValidator.js`
- **Implementation**: URL validation with allowlist approach
- **Features**:
  - Domain allowlisting
  - Private IP range blocking
  - Protocol validation (HTTPS only)

### 4. Input Validation & Sanitization
- **Location**: `lib/auth.js`, `lib/security.js`
- **Implementation**: Comprehensive input validation
- **Features**:
  - Type checking
  - Length validation
  - XSS pattern detection
  - SQL injection prevention

### 5. Rate Limiting
- **Location**: `lib/security.js`
- **Implementation**: In-memory rate limiting
- **Configuration**: 60 requests per minute per IP
- **Block Duration**: 15 minutes for violators

### 6. Enhanced Authentication
- **Location**: `app/api/auth/login/route.js`
- **Improvements**:
  - Generic error messages (security through obscurity)
  - Enhanced input validation
  - Secure JWT generation
  - Password data exclusion from responses

### 7. Security Headers
- **Implementation**: Added to all API responses
- **Headers**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`

## 🛠 How to Use Security Features

### For API Routes

```javascript
import { withSecurity } from '@/lib/security';

async function myAPIHandler(req) {
  // Your API logic here
  return Response.json({ success: true });
}

// Apply security middleware
export const POST = withSecurity(myAPIHandler);
```

### For Client-Side Requests

```javascript
import { secureFetch } from '@/lib/clientSecurity';

// Secure API call with automatic CSRF protection
const response = await secureFetch('/api/data', {
  method: 'POST',
  body: JSON.stringify({ data: 'example' })
});
```

### Input Validation

```javascript
import { validateAndSanitizeInput } from '@/lib/security';

// Validate user input
if (!validateAndSanitizeInput(userInput, 'string', 100)) {
  throw new Error('Invalid input');
}
```

### URL Validation for External Requests

```javascript
import { safeFetch } from '@/lib/urlValidator';

// Safe external API call
try {
  const response = await safeFetch('https://api.example.com/data');
} catch (error) {
  console.error('URL validation failed:', error.message);
}
```

## 🌐 Internationalization (i18n) Support

### Setup
- **Location**: `lib/i18n.js`
- **Supported Languages**: English, Spanish, Hindi
- **Usage**:

```javascript
import { t, setLanguage } from '@/lib/i18n';

// Set language
setLanguage('es');

// Translate text
const translatedText = t('login', 'Login');
```

### Adding New Languages

1. Edit `lib/i18n.js`
2. Add translations to the `translations` object
3. Update `getAvailableLanguages()` function

## 🔧 Configuration

### Environment Variables Required

```env
JWT_SECRET=your-super-secret-jwt-key-here
MONGODB_URI=your-mongodb-connection-string
```

### Security Configuration

The security middleware can be configured in `lib/security.js`:

```javascript
// Rate limiting configuration
this.maxRequestsPerMinute = 60;
this.blockDuration = 15 * 60 * 1000; // 15 minutes

// Allowed domains for external requests
const ALLOWED_DOMAINS = [
  'api.openai.com',
  'generativelanguage.googleapis.com',
  'cloudinary.com'
];
```

## 🚨 Security Best Practices

### 1. Input Handling
- Always validate and sanitize user inputs
- Use parameterized queries for database operations
- Implement proper error handling

### 2. Authentication
- Use strong JWT secrets
- Implement proper session management
- Add logout functionality that clears tokens

### 3. API Security
- Apply security middleware to all API routes
- Use HTTPS in production
- Implement proper CORS policies

### 4. Client-Side Security
- Use the provided `secureFetch` wrapper
- Sanitize user inputs before display
- Validate forms on both client and server side

## 🔍 Security Testing

### Manual Testing Checklist

- [ ] CSRF protection works for POST/PUT/DELETE requests
- [ ] XSS attempts are blocked and sanitized
- [ ] Rate limiting triggers after 60 requests/minute
- [ ] Invalid URLs are rejected by SSRF protection
- [ ] Authentication requires valid JWT tokens
- [ ] Input validation rejects malicious payloads

### Automated Testing

Consider implementing:
- Unit tests for security functions
- Integration tests for API endpoints
- Security scanning tools (OWASP ZAP, etc.)

## 📋 Security Incident Response

### If a Security Issue is Discovered

1. **Immediate Response**:
   - Document the issue
   - Assess the impact
   - Implement temporary mitigation

2. **Investigation**:
   - Check logs for exploitation attempts
   - Identify affected users/data
   - Determine root cause

3. **Resolution**:
   - Apply security patches
   - Update security measures
   - Notify affected users if necessary

4. **Prevention**:
   - Update security documentation
   - Improve testing procedures
   - Conduct security review

## 🔄 Regular Security Maintenance

### Monthly Tasks
- Review and update dependencies
- Check for new security vulnerabilities
- Update security configurations

### Quarterly Tasks
- Conduct security audits
- Review access controls
- Update security documentation

### Annual Tasks
- Comprehensive penetration testing
- Security training for developers
- Review and update security policies

## 📞 Security Contact

For security-related issues or questions:
- Create a GitHub issue with the `security` label
- Follow responsible disclosure practices
- Provide detailed information about vulnerabilities

## 🔗 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Guidelines](https://nextjs.org/docs/advanced-features/security-headers)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Note**: This security implementation provides a strong foundation, but security is an ongoing process. Regular updates and monitoring are essential for maintaining protection against evolving threats.