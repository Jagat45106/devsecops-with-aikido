// ⚠️ VULNERABILITY: API Security Issues and Broken Access Control

const express = require('express');
const router = express.Router();

// ⚠️ VULNERABILITY 1: Missing or weak API authentication
router.get('/api/v1/public-users', (req, res) => {
  // No authentication required - anyone can access
  res.json({
    users: [
      { id: 1, email: 'user1@example.com', phone: '555-0001' },
      { id: 2, email: 'user2@example.com', phone: '555-0002' }
    ]
  });
});

// ⚠️ VULNERABILITY 2: Weak API key validation
function validateAPIKey(apiKey) {
  // Checks only if key exists, not if it's valid
  return apiKey && apiKey.length > 0;
}

// ⚠️ VULNERABILITY 3: API key in URL parameters
router.get('/api/data', (req, res) => {
  const apiKey = req.query.apiKey;
  
  // API key exposed in:
  // - Browser history
  // - Server logs
  // - Proxy servers
  // - URL bar
  
  // Should be in Authorization header instead
  
  if (validateAPIKey(apiKey)) {
    res.json({ data: 'sensitive information' });
  }
});

// ⚠️ VULNERABILITY 4: No rate limiting on API
router.post('/api/brute-force-endpoint', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  // Can be called unlimited times per second
  // Attacker can brute force passwords:
  // for i in {1..1000000}: POST /api/brute-force-endpoint
  
  res.json({ authenticated: username === 'admin' && password === 'correct' });
});

// ⚠️ VULNERABILITY 5: Missing API versioning security
// Older API versions might have known vulnerabilities
router.get('/api/v1/users/:id', (req, res) => {
  const userId = req.params.id;
  // Old API version with bugs
  res.json({ id: userId, data: 'old version data' });
});

router.get('/api/v2/users/:id', (req, res) => {
  const userId = req.params.id;
  // New API version, also vulnerable to IDOR
  res.json({ id: userId, data: 'new version data' });
});

// ⚠️ VULNERABILITY 6: Broken function-level access control
router.post('/api/admin/delete-user', (req, res) => {
  const userId = req.body.userId;
  
  // No check if user is actually admin
  // Regular users can delete other users
  
  res.json({ message: `User ${userId} deleted` });
});

// ⚠️ VULNERABILITY 7: No request size limit
router.post('/api/upload-file', (req, res) => {
  const fileSize = req.body.file.length;
  
  // No size validation - DoS attack via huge file upload
  // Can crash server or fill disk space
  
  res.json({ message: 'File uploaded', size: fileSize });
});

// ⚠️ VULNERABILITY 8: Exposed API documentation with examples
router.get('/api/docs', (req, res) => {
  res.json({
    endpoints: [
      { 
        path: '/api/admin/delete-user',
        method: 'POST',
        example: 'curl -X POST /api/admin/delete-user -d "userId=1"'
      },
      {
        path: '/api/transfer-funds',
        method: 'POST',
        example: 'curl -X POST /api/transfer-funds -d "from=123&to=456&amount=1000"'
      }
    ]
  });
});

// ⚠️ VULNERABILITY 9: API version detection allowing exploitation
router.get('/api/version', (req, res) => {
  res.json({
    apiVersion: '1.0.0',
    framework: 'Express.js 4.18.0',
    nodeVersion: 'v16.13.0',
    knownVulnerabilities: [
      'SQL Injection in user search',
      'XSS in comment display'
    ]
  });
});

// ⚠️ VULNERABILITY 10: Inefficient object access control
router.get('/api/users/:id/settings', (req, res) => {
  const userId = req.params.id;
  const settingName = req.query.setting;
  
  // No validation of what settings user can access
  // /api/users/999/settings?setting=apiKey returns another user's API key
  // /api/users/999/settings?setting=password returns another user's password
  
  res.json({
    userId: userId,
    [settingName]: 'sensitive value'
  });
});

// ⚠️ VULNERABILITY 11: Mass assignment vulnerability
router.put('/api/user/profile', (req, res) => {
  const userId = req.user?.id;
  const updates = req.body;
  
  // User can modify any field, including role
  // Request: { name: "User", role: "admin", isActive: true }
  // Updates all fields from request body
  
  console.log(`Updating user ${userId} with:`, updates);
  res.json({ message: 'Profile updated', updates: updates });
});

// ⚠️ VULNERABILITY 12: No pagination leading to data exposure
router.get('/api/all-users', (req, res) => {
  // Returns all users without limit
  const allUsers = Array.from({ length: 100000 }, (_, i) => ({
    id: i,
    email: `user${i}@example.com`,
    ssn: `${Math.random().toString().slice(2, 11)}`
  }));
  
  res.json(allUsers); // Could be memory exhaustion / information disclosure
});

// ⚠️ VULNERABILITY 13: API lacks proper error handling
router.post('/api/process-payment', (req, res) => {
  try {
    const amount = req.body.amount;
    const result = performPayment(amount);
    res.json({ success: true, transactionId: result.id });
  } catch (error) {
    // Exposing full error details with stack trace
    res.status(500).json({
      error: error.message,
      stack: error.stack,
      database: error.databaseError
    });
  }
});

// ⚠️ VULNERABILITY 14: Time-based information leakage
router.post('/api/verify-code', (req, res) => {
  const code = req.body.code;
  const validCode = '123456';
  
  // Comparison time reveals code length and characters
  // Attacker can brute force by timing responses
  
  if (code === validCode) {
    res.json({ verified: true });
  } else {
    res.status(400).json({ error: 'Invalid code' });
  }
});

// ⚠️ VULNERABILITY 15: No API signature verification
router.post('/api/webhook', (req, res) => {
  const webhookData = req.body;
  
  // No signature verification
  // Attacker can craft fake webhook events
  // trigger false transactions, notifications, etc.
  
  processWebhookData(webhookData);
  res.json({ received: true });
});

function performPayment(amount) {
  return { id: Math.random().toString(36).substring(7) };
}

function processWebhookData(data) {
  console.log('Processing webhook:', data);
}

module.exports = router;
