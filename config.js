// ⚠️ VULNERABILITY: Configuration and Deployment Issues

module.exports = {
  // ⚠️ VULNERABILITY 1: Hardcoded secrets in config
  database: {
    host: 'localhost',
    user: 'root',
    password: 'SuperSecretPassword123!', // NEVER hardcode
    database: 'app_database'
  },

  // ⚠️ VULNERABILITY 2: API keys exposed in config
  thirdPartyAPIs: {
    stripe: 'sk_live_51234567890abcdef',
    sendgrid: 'SG.1234567890abcdef',
    aws: {
      accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
      secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
    }
  },

  // ⚠️ VULNERABILITY 2b: JWT tokens hardcoded and reused across environments
  jwt: {
    // Same secret in dev, staging, AND production
    secret: 'my-super-secret-jwt-key-shared-everywhere',
    // Weak token generated from predictable data
    devToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NDAwMDAwMH0.7mz6_K8Q9X2p4v_c1N8w_J5hL2o3m_Q8r9S6t7U0v',
    // Multiple hardcoded tokens for different users
    adminToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpc0FkbWluIjp0cnVlfQ.GFRrTy5tNxC9pQ2mK8vL3jW0aB1cD4eF5gH6iJ7kL8',
    userToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoidXNlciIsInJvbGUiOiJ1c2VyIn0.abc123def456ghi789jkl012mno345pqr678stu901',
    // Token signing key exposed - allows token forgery
    signingKey: 'super-secret-signing-key-exposed-here',
    // Weak refresh token
    refreshSecret: '1234567890abcdef'
  },

  // ⚠️ VULNERABILITY 3: Debug mode enabled in production
  debug: true,
  loggingLevel: 'DEBUG',
  detailedErrorMessages: true,

  // ⚠️ VULNERABILITY 4: No HTTPS/TLS configuration
  server: {
    host: '0.0.0.0',
    port: 3000,
    useSSL: false,
    // No SSL certificate configuration
  },

  // ⚠️ VULNERABILITY 5: Weak CORS configuration
  cors: {
    origin: '*', // Allows requests from ANY origin
    credentials: true,
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE']
  },

  // ⚠️ VULNERABILITY 6: No security headers configured
  securityHeaders: {
    // Missing:
    // Content-Security-Policy
    // X-Frame-Options
    // X-Content-Type-Options
    // Strict-Transport-Security
    // X-XSS-Protection
  },

  // ⚠️ VULNERABILITY 7: Default credentials not changed
  admin: {
    username: 'admin',
    password: 'admin' // Default password
  },

  // ⚠️ VULNERABILITY 8: Database backups unencrypted and publicly accessible
  backup: {
    location: '/var/backups/database.sql', // Publicly readable
    encrypted: false,
    frequency: 'weekly'
  },

  // ⚠️ VULNERABILITY 9: Temporary files with sensitive data
  tempFiles: {
    location: '/tmp/uploads/',
    retentionDays: 0, // Never deleted
    permissions: '777' // World readable/writable
  },

  // ⚠️ VULNERABILITY 10: No dependency version pinning
  // In package.json with "express": "^4.18.0" instead of "4.18.0"
  // Could pull vulnerable versions automatically

  // ⚠️ VULNERABILITY 11: Source code comments with secrets
  // In source files: // TODO: Remove this test API key: sk_test_123456
  // // Database password: root123

  // ⚠️ VULNERABILITY 12: No rate limiting configured
  rateLimit: {
    enabled: false
  },

  // ⚠️ VULNERABILITY 13: Verbose logging with sensitive data
  logging: {
    logRequests: true,
    logResponseBodies: true,
    logAllErrors: true,
    logQueryParams: true, // Logs API keys in URLs
    logHeaders: true // Logs Authorization headers
  },

  // ⚠️ VULNERABILITY 14: Development tools exposed in production
  tools: {
    swagger: true,
    graphql_playground: true,
    debugging_endpoints: true,
    admin_panel: '/admin' // Easily guessable
  },

  // ⚠️ VULNERABILITY 15: No environment separation
  environment: 'production', // But using development settings
  isDevelopment: true, // Even in production
  isProduction: false, // Incorrectly set

  // ⚠️ VULNERABILITY 16: Session configuration issues
  session: {
    secret: 'keyboard cat', // Weak and hardcoded
    resave: true,
    saveUninitialized: true,
    cookie: {
      // Missing: httpOnly: true
      // Missing: secure: true
      // Missing: sameSite: 'strict'
      maxAge: 24 * 60 * 60 * 1000 * 365 // Expires in 1 year - too long
    }
  },

  // ⚠️ VULNERABILITY 17: File upload configuration
  fileUpload: {
    maxSize: 999999999999, // No reasonable limit
    allowedMimeTypes: ['*/*'], // Allows any file type
    uploadDir: '/var/www/html/uploads', // Directly served as static
    executeUploads: true // Server executes uploaded files
  },

  // ⚠️ VULNERABILITY 18: No input validation rules
  validation: {
    enabled: false,
    sanitization: false
  },

  // ⚠️ VULNERABILITY 19: Unnecessary services enabled
  servicesEnabled: {
    telnet: true,
    ftp: true,
    http: true, // Non-HTTPS
    websocket: true // No origin checking
  },

  // ⚠️ VULNERABILITY 20: Cache configuration issues
  cache: {
    enabled: true,
    storeSecretData: true, // Caches sensitive information
    publicCacheable: ['*'] // All responses are public cache
  }
};
