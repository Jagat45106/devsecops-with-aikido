// VULNERABILITY: Hardcoded secrets and API keys exposed in code
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// ⚠️ VULNERABILITY 1: Hardcoded secrets in code
const DB_PASSWORD = 'admin123';
const API_SECRET_KEY = 'my-super-secret-key-exposed';
const JWT_SECRET = 'jwt-secret-key-12345';
const THIRD_PARTY_API_KEY = 'sk-1234567890abcdef';

// ⚠️ VULNERABILITY 2: Overly permissive CORS
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ⚠️ VULNERABILITY 3: Unvalidated user input leading to template injection
app.get('/greet', (req, res) => {
  const name = req.query.name;
  // Directly embedding user input without sanitization
  res.send(`<h1>Hello ${name}, welcome to our site!</h1>`);
});

// ⚠️ VULNERABILITY 4: SQL Injection
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // NEVER do this - directly concatenating user input into SQL
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  console.log('Executing query:', query);
  // If user enters: admin' OR '1'='1
  // Query becomes: SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = 'anything'
  // This bypasses authentication entirely

  if (username === 'admin' && password === 'password123') {
    res.json({ 
      message: 'Login successful',
      token: jwt.sign({ username: username, role: 'admin' }, JWT_SECRET)
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// ⚠️ VULNERABILITY 5: Sensitive data in URLs and logs
app.get('/api/transfer', (req, res) => {
  const from = req.query.from;
  const to = req.query.to;
  const amount = req.query.amount;
  const apiKey = req.query.apiKey;

  // Sensitive information exposed in URL and logs
  console.log(`Transferring ${amount} from ${from} to ${to} using key: ${apiKey}`);
  
  res.json({ 
    message: 'Transfer initiated',
    details: { from, to, amount, apiKey }
  });
});

// ⚠️ VULNERABILITY 6: Missing CSRF Protection
app.post('/api/delete-user', (req, res) => {
  const userId = req.body.userId;
  
  // No CSRF token validation - malicious site can make this request
  console.log(`Deleting user: ${userId}`);
  res.json({ message: `User ${userId} deleted` });
});

// ⚠️ VULNERABILITY 7: Server-Side Request Forgery (SSRF)
app.post('/api/fetch-url', (req, res) => {
  const url = req.body.url;

  // User can request any URL, including internal services
  axios.get(url)
    .then(response => {
      res.json({ 
        data: response.data,
        status: response.status
      });
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
});

// ⚠️ VULNERABILITY 8: Weak/Broken Authentication
app.post('/api/forgot-password', (req, res) => {
  const email = req.body.email;
  
  // Reset token is too simple and predictable
  const resetToken = Math.random().toString(36).substring(7);
  
  console.log(`Password reset token for ${email}: ${resetToken}`);
  res.json({ 
    message: 'Reset link sent',
    resetToken: resetToken // Should never expose token in response
  });
});

// ⚠️ VULNERABILITY 9: Insecure Deserialization
app.post('/api/deserialize', (req, res) => {
  const data = req.body.data;
  
  try {
    // Dangerous - eval is never safe
    const result = eval(data);
    res.json({ result: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ⚠️ VULNERABILITY 10: Insufficient Logging & Monitoring
app.get('/api/admin-action', (req, res) => {
  const action = req.query.action;
  
  // Critical action with no proper logging or audit trail
  console.log(`Admin action: ${action}`);
  res.json({ message: 'Action performed' });
});

// ⚠️ VULNERABILITY 11: API Key exposed in response
app.get('/api/config', (req, res) => {
  res.json({
    apiKey: THIRD_PARTY_API_KEY,
    databasePassword: DB_PASSWORD,
    jwtSecret: JWT_SECRET,
    environment: 'production'
  });
});

// ⚠️ VULNERABILITY 12: Unprotected file upload
app.post('/api/upload', (req, res) => {
  const filename = req.body.filename;
  const content = req.body.content;
  
  // No file type validation, size limits, or path traversal prevention
  // Could allow: ../../../etc/passwd or shell.php
  res.json({ 
    message: 'File uploaded',
    path: `/uploads/${filename}`
  });
});

// ⚠️ VULNERABILITY 13: Information Disclosure
app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  
  // No authorization checks - anyone can view any user's data
  res.json({
    id: userId,
    email: 'user@example.com',
    ssn: '123-45-6789',
    creditCard: '4111-1111-1111-1111',
    apiToken: 'sk-' + Math.random().toString(36).substring(7)
  });
});

// ⚠️ VULNERABILITY 14: Missing rate limiting
app.post('/api/brute-force-login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  // No rate limiting - attackers can brute force passwords
  if (username === 'admin' && password === 'secretPass123') {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`⚠️ VULNERABLE Server running on http://localhost:${PORT}`);
  console.log('⚠️ This application contains intentional security vulnerabilities for educational purposes only');
  console.log(`Database password exposed: ${DB_PASSWORD}`);
  console.log(`JWT Secret exposed: ${JWT_SECRET}`);
});

module.exports = app;
