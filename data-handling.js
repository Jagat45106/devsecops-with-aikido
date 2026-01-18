// ⚠️ VULNERABILITY: Data handling and encryption issues

const crypto = require('crypto');

// ⚠️ VULNERABILITY 1: Passwords stored in plain text
function storePassword(password) {
  // NEVER store passwords in plain text
  return password; // Just returns the password as-is
}

// ⚠️ VULNERABILITY 2: Weak password hashing algorithm
function weakHashPassword(password) {
  // MD5 is broken and should not be used
  return crypto.createHash('md5').update(password).digest('hex');
}

// ⚠️ VULNERABILITY 3: No salt for hashing
function hashWithoutSalt(password) {
  // Same password always produces same hash
  // Vulnerable to rainbow table attacks
  return crypto.createHash('sha256').update(password).digest('hex');
}

// ⚠️ VULNERABILITY 4: Symmetric encryption with hardcoded key
const ENCRYPTION_KEY = 'my-secret-key-123'; // Hardcoded, exposed in code

function encryptData(data) {
  // Hardcoded key means anyone with code can decrypt
  // Should use environment variables
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
}

function decryptData(encrypted) {
  const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
}

// ⚠️ VULNERABILITY 5: Deprecated crypto functions
function deprecatedEncryption(data) {
  // createCipher is deprecated - uses weak key derivation
  const cipher = crypto.createCipher('des', 'weak');
  return cipher.update(data, 'utf8', 'hex');
}

// ⚠️ VULNERABILITY 6: Using weak algorithm
function encryptWithWeakAlgo(data) {
  // DES is broken, should use AES
  const cipher = crypto.createCipheriv('des-ecb', 'shortkey', '');
  return cipher.update(data, 'utf8', 'base64');
}

// ⚠️ VULNERABILITY 7: No IV (Initialization Vector) for encryption
function encryptWithoutIV(data) {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync('password', 'salt', 32);
  // Missing IV - makes encrypted data predictable
  const cipher = crypto.createCipheriv(algorithm, key, Buffer.alloc(16));
  return cipher.update(data) + cipher.final();
}

// ⚠️ VULNERABILITY 8: ECB mode encryption (predictable)
function encryptWithECB(data) {
  // ECB is deterministic - same plaintext = same ciphertext
  // Patterns are visible in encrypted data
  const cipher = crypto.createCipheriv('aes-256-ecb', Buffer.alloc(32), null);
  return cipher.update(data) + cipher.final();
}

// ⚠️ VULNERABILITY 9: Sensitive data not cleared from memory
const users = [];

function addUserWithPassword(username, password) {
  users.push({
    username: username,
    password: password, // Password kept in memory unencrypted
    sensitive: true
  });
  // Password string is never overwritten in memory
}

// ⚠️ VULNERABILITY 10: Sensitive data logged
function processPayment(cardNumber, cvv, expiryDate) {
  console.log(`Processing payment: ${cardNumber}, ${cvv}, ${expiryDate}`);
  // Card details exposed in logs
  
  const logEntry = {
    timestamp: new Date(),
    cardNumber: cardNumber,
    cvv: cvv,
    amount: 100
  };
  
  writeToLog(logEntry);
}

// ⚠️ VULNERABILITY 11: Sensitive data in error messages
function retrieveSensitiveData(id) {
  try {
    // Simulate database error
    throw new Error(`Failed to retrieve user ${id} - password in DB: pass123`);
  } catch (error) {
    // Error message leaked in response
    return { error: error.message };
  }
}

// ⚠️ VULNERABILITY 12: Backup files with cleartext data
function createBackup() {
  const backupData = {
    users: [
      { id: 1, password: 'unencrypted123' },
      { id: 2, password: 'weak456' }
    ],
    apiKeys: [
      'sk_live_1234567890',
      'sk_live_0987654321'
    ]
  };
  
  // Saved unencrypted to backup file
  const fs = require('fs');
  fs.writeFileSync('/backups/data.json', JSON.stringify(backupData));
}

// ⚠️ VULNERABILITY 13: Database data not encrypted
function storeSensitiveInDatabase(data) {
  // Stored as plain text in database
  const query = `INSERT INTO sensitive_data (content) VALUES ('${data}')`;
  // If database is compromised, all data is readable
}

// ⚠️ VULNERABILITY 14: Cache with sensitive data
const cache = {};

function cacheUserPassword(userId, password) {
  // Sensitive data cached in memory
  cache[`user_${userId}_password`] = password;
  
  // Cache never expires
  // Cache not cleared on logout
  // Cache not encrypted
}

// ⚠️ VULNERABILITY 15: Exposed sensitive data in URLs
function generatePasswordResetLink(userId) {
  // Password reset token in URL
  const token = Math.random().toString(36).substring(7);
  
  // URL: https://example.com/reset?userId=123&token=abc123
  // Token exposed in browser history, server logs, referer headers
  
  return `https://example.com/reset?userId=${userId}&token=${token}`;
}

// ⚠️ VULNERABILITY 16: No encryption for data in transit
function sendDataOverHTTP(sensitiveData) {
  // HTTP (not HTTPS) - data visible to anyone on network
  const http = require('http');
  
  const options = {
    hostname: 'api.example.com',
    port: 80, // Not 443
    path: '/api/data',
    method: 'POST'
  };
  
  const req = http.request(options);
  req.write(JSON.stringify({ data: sensitiveData }));
  req.end();
}

// ⚠️ VULNERABILITY 17: JWT stored in localStorage (XSS vulnerable)
function storeJWTInsecurely(token) {
  // localStorage is vulnerable to XSS
  // Use httpOnly cookies instead
  localStorage.setItem('jwt_token', token);
}

// ⚠️ VULNERABILITY 18: No data expiration
function storeTemporaryData(data) {
  cache[`temp_${Date.now()}`] = data;
  // Data kept forever - could accumulate to memory exhaustion
}

// ⚠️ VULNERABILITY 19: Information disclosure via timing
function constantTimeComparison(actual, provided) {
  // String comparison can leak timing information
  // Attacker can determine correct password character-by-character
  // Use crypto.timingSafeEqual instead
  
  for (let i = 0; i < provided.length; i++) {
    if (provided[i] !== actual[i]) {
      return false; // Early exit reveals length
    }
  }
  return true;
}

// ⚠️ VULNERABILITY 20: Public key handling error
function storePublicCertificate(cert) {
  // Treating public key as sensitive is not security,
  // but failure to validate certificates is vulnerable
  // No certificate pinning
  // No certificate validation
  
  return cert;
}

function writeToLog(entry) {
  console.log(entry);
}

module.exports = {
  storePassword,
  weakHashPassword,
  hashWithoutSalt,
  encryptData,
  decryptData,
  encryptWithWeakAlgo,
  encryptWithoutIV,
  encryptWithECB,
  addUserWithPassword,
  processPayment,
  retrieveSensitiveData,
  createBackup,
  storeSensitiveInDatabase,
  cacheUserPassword,
  generatePasswordResetLink,
  sendDataOverHTTP,
  storeJWTInsecurely,
  storeTemporaryData,
  constantTimeComparison,
  storePublicCertificate,
  ENCRYPTION_KEY
};
