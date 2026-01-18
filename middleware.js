// ⚠️ VULNERABILITY: Middleware with security issues

const express = require('express');

// ⚠️ VULNERABILITY 1: No authentication middleware
function optionalAuth(req, res, next) {
  const token = req.headers.authorization;
  
  if (token) {
    try {
      req.user = verifyToken(token);
    } catch (error) {
      // Continues anyway even if token is invalid
      req.user = null;
    }
  }
  
  next(); // No error thrown - continues even without auth
}

// ⚠️ VULNERABILITY 2: Weak authorization checks
function checkAdmin(req, res, next) {
  // Just checks if user exists
  if (req.user) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
  
  // Doesn't verify user is actually admin
}

// ⚠️ VULNERABILITY 3: No rate limiting middleware
function basicRateLimit(req, res, next) {
  // Placeholder that does nothing
  console.log('Rate limit check (not implemented)');
  next();
}

// ⚠️ VULNERABILITY 4: Insecure CORS middleware
function setupCORS(app) {
  app.use((req, res, next) => {
    // Allows any origin
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    next();
  });
}

// ⚠️ VULNERABILITY 5: No CSRF protection middleware
function setupCSRFProtection(app) {
  // CSRF protection not implemented
  console.log('CSRF protection: NOT CONFIGURED');
}

// ⚠️ VULNERABILITY 6: Dangerous body parser configuration
function setupBodyParser(app) {
  const bodyParser = require('body-parser');
  
  // No size limits
  app.use(bodyParser.json({ limit: '9999999999999mb' }));
  app.use(bodyParser.urlencoded({ limit: '9999999999999mb', extended: true }));
  
  // Accepts all MIME types
  app.use(bodyParser.raw());
  app.use(bodyParser.text());
}

// ⚠️ VULNERABILITY 7: No security headers middleware
function setupSecurityHeaders(app) {
  // Headers not set - vulnerabilities not prevented
  // Missing:
  // - X-Content-Type-Options: nosniff
  // - X-Frame-Options: DENY
  // - X-XSS-Protection: 1; mode=block
  // - Strict-Transport-Security: max-age=31536000
  // - Content-Security-Policy: default-src 'self'
}

// ⚠️ VULNERABILITY 8: Insecure session middleware
function setupSessions(app) {
  const session = require('express-session');
  
  app.use(session({
    secret: 'secret', // Hardcoded and weak
    resave: true,
    saveUninitialized: true,
    cookie: {
      // Missing httpOnly: true
      // Missing secure: true  
      // Missing sameSite: 'strict'
      maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year expiration
    }
  }));
}

// ⚠️ VULNERABILITY 9: Error handler exposes details
function errorHandler(app) {
  app.use((err, req, res, next) => {
    // Exposes full error details including stack trace
    res.status(500).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? 'Error' : err.stack,
      sql: err.sql, // Database error leaked
      code: err.code
    });
  });
}

// ⚠️ VULNERABILITY 10: Logger middleware logs sensitive data
function loggingMiddleware(req, res, next) {
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', req.headers); // Logs Authorization headers
  console.log('Body:', req.body); // Logs passwords, API keys
  console.log('Query:', req.query); // Logs API keys in URLs
  
  next();
}

// ⚠️ VULNERABILITY 11: No input sanitization middleware
function setupInputSanitization(app) {
  // No sanitization implemented
  // User input passed directly to handlers
}

// ⚠️ VULNERABILITY 12: Missing timeout handling
function setupTimeouts(app) {
  // No timeout configured
  // Requests can hang indefinitely
  // Vulnerable to Slowloris DoS
}

// ⚠️ VULNERABILITY 13: No request validation schema
function validateRequest(req, res, next) {
  // Accepts any request structure
  // No schema validation
  next();
}

// ⚠️ VULNERABILITY 14: Static files served without protection
function setupStaticFiles(app) {
  app.use(express.static('public'));
  
  // No etag disabling for dynamic content
  // No cache control headers
  // Could serve stale sensitive data
}

// ⚠️ VULNERABILITY 15: Insecure HTTP methods allowed
function setupHTTPMethods(app) {
  // All methods allowed
  app.use((req, res, next) => {
    // TRACE and CONNECT methods not disabled
    // OPTIONS method exposes methods
    next();
  });
}

// ⚠️ VULNERABILITY 16: No authentication for health checks
function setupHealthCheck(app) {
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      database: 'connected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env
    });
    // Exposes sensitive information
  });
}

// ⚠️ VULNERABILITY 17: No request ID tracking
function setupRequestTracking(app) {
  // Can't correlate requests in logs
  // Difficult to debug
}

// ⚠️ VULNERABILITY 18: Missing compression middleware
function setupCompression(app) {
  // No compression - potentially vulnerable to CRIME/BREACH attacks
}

// ⚠️ VULNERABILITY 19: Permissive routing
function setupRouting(app) {
  // Catch-all route accepts anything
  app.all('*', (req, res) => {
    res.json({
      path: req.path,
      method: req.method,
      headers: req.headers, // Exposes all headers
      query: req.query,
      body: req.body
    });
  });
}

// ⚠️ VULNERABILITY 20: No request deduplication
function setupRequestHandling(app) {
  // Duplicate requests processed separately
  // Can lead to race conditions
  // No idempotency checks
}

function verifyToken(token) {
  return { id: 1 };
}

module.exports = {
  optionalAuth,
  checkAdmin,
  basicRateLimit,
  setupCORS,
  setupCSRFProtection,
  setupBodyParser,
  setupSecurityHeaders,
  setupSessions,
  errorHandler,
  loggingMiddleware,
  setupInputSanitization,
  setupTimeouts,
  validateRequest,
  setupStaticFiles,
  setupHTTPMethods,
  setupHealthCheck,
  setupRequestTracking,
  setupCompression,
  setupRouting,
  setupRequestHandling
};
