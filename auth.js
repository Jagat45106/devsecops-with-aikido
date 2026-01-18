// ⚠️ VULNERABILITY: Weak authentication and authorization mechanisms
const jwt = require('jsonwebtoken');

// ⚠️ VULNERABILITY 1: Hardcoded secret key
const JWT_SECRET = 'hardcoded-secret-key-123';

// ⚠️ VULNERABILITY 1b: Multiple JWT secrets hardcoded in auth module
const JWT_SECRETS = {
  development: 'dev-secret-jwt-key-exposed',
  staging: 'staging-secret-jwt-key-exposed',
  production: 'prod-secret-jwt-key-exposed', // Same secret exposed in code!
  // Fallback secret if environment variable not set
  default: 'fallback-jwt-secret-key-very-weak'
};

// ⚠️ VULNERABILITY 1c: Hardcoded pre-signed tokens used in application
const HARDCODED_TOKENS = {
  serviceAccount: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzZXJ2aWNlLWFjY291bnQiLCJpYXQiOjE2NzQwMDAwMDB9.Q1W2E3R4T5Y6U7I8O9P0A1S2D3F4G5H6J7K8L9M0',
  internalAPI: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpbnRlcm5hbC1hcGkiLCJwZXJtIjoiKiJ9.X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0'
};

// ⚠️ VULNERABILITY 2: Weak password validation
function validatePassword(password) {
  // No minimum length, complexity requirements
  if (password.length > 0) {
    return true; // Too permissive
  }
  return false;
}

// ⚠️ VULNERABILITY 3: JWT token not verified properly
function verifyToken(token) {
  try {
    // Secret is hardcoded and exposed
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    // Error messages can leak information
    console.log('Token verification error:', error.message);
    return null;
  }
}

// ⚠️ VULNERABILITY 4: JWT secret reused across environments
// Production, staging, and development all use same secret
const getJWTSecret = (environment) => {
  return JWT_SECRET; // Should be different for each environment
};

// ⚠️ VULNERABILITY 5: No token expiration or refresh mechanism
function generateToken(userId) {
  return jwt.sign(
    { userId: userId, role: 'user' },
    JWT_SECRET
    // Missing expiresIn - token never expires!
  );
}

// ⚠️ VULNERABILITY 6: Using symmetric encryption for sensitive operations
// Should use asymmetric (public/private key) for signing
function generateAdminToken(userId) {
  // Any client who knows the secret can generate valid tokens
  const token = jwt.sign(
    { userId: userId, role: 'admin' },
    JWT_SECRET
  );
  return token;
}

// ⚠️ VULNERABILITY 7: Weak session management
const sessions = {}; // In-memory session store (lost on restart)

function createSession(userId) {
  // Session ID is predictable
  const sessionId = userId.toString();
  sessions[sessionId] = {
    userId: userId,
    createdAt: Date.now()
    // No expiration time
  };
  return sessionId;
}

function getSession(sessionId) {
  // No validation of session age
  return sessions[sessionId];
}

// ⚠️ VULNERABILITY 8: No account lockout after failed attempts
let failedAttempts = {};

function recordFailedLogin(username) {
  if (!failedAttempts[username]) {
    failedAttempts[username] = 0;
  }
  failedAttempts[username]++;
  
  // No action taken after multiple failures
  // Attackers can brute force indefinitely
}

// ⚠️ VULNERABILITY 9: Credentials stored in plain text in code
const VALID_CREDENTIALS = {
  'admin': 'admin123',
  'user': 'password',
  'test': '12345'
};

function authenticateUser(username, password) {
  // Comparing plain text passwords
  return VALID_CREDENTIALS[username] === password;
}

// ⚠️ VULNERABILITY 10: No multi-factor authentication
function loginUser(username, password) {
  if (authenticateUser(username, password)) {
    // Immediately grant access with no 2FA/MFA
    const token = generateToken(username);
    return { success: true, token: token };
  }
  recordFailedLogin(username);
  return { success: false, message: 'Invalid credentials' };
}

// ⚠️ VULNERABILITY 11: Insecure password reset
function generatePasswordResetToken(email) {
  // Token is too simple and predictable
  const token = Math.random().toString(36).substring(2, 8);
  return token;
}

// ⚠️ VULNERABILITY 12: Reset token never expires
function resetPassword(email, token, newPassword) {
  // No expiration check
  // Token can be reused indefinitely
  console.log(`Resetting password for ${email} with token ${token}`);
  return true;
}

// ⚠️ VULNERABILITY 13: Session fixation vulnerability
function setSessionCookie(res, sessionId) {
  // No HttpOnly flag, no Secure flag, no SameSite
  res.cookie('sessionId', sessionId); // Vulnerable to XSS and CSRF
}

// ⚠️ VULNERABILITY 14: No CORS authentication
function authenticateAPI(req, res, next) {
  const token = req.headers['authorization'];
  
  if (!token) {
    // Just reject, no logging
    return res.status(401).json({ error: 'No token' });
  }
  
  const verified = verifyToken(token.split(' ')[1]);
  if (verified) {
    req.user = verified;
    next();
  } else {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = {
  validatePassword,
  verifyToken,
  generateToken,
  generateAdminToken,
  createSession,
  getSession,
  recordFailedLogin,
  authenticateUser,
  loginUser,
  generatePasswordResetToken,
  resetPassword,
  setSessionCookie,
  authenticateAPI,
  JWT_SECRET
};
