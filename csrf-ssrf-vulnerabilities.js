// ⚠️ VULNERABILITY: CSRF, SSRF, XXE, and other exploitation vectors

// ⚠️ VULNERABILITY 1: CSRF - Missing CSRF token validation
function handleFormSubmission(req, res) {
  // No CSRF token check
  const accountAction = req.body.action;
  const targetAccount = req.body.account;
  
  // Malicious site can make this request:
  // <form action="http://bank.com/transfer" method="POST">
  //   <input name="action" value="transfer">
  //   <input name="account" value="attacker">
  // </form>
  
  res.json({ message: `Action ${accountAction} performed` });
}

// ⚠️ VULNERABILITY 2: CSRF token doesn't validate origin
function validateCSRFToken(token) {
  // Only checks if token exists, not where it came from
  return token && token.length > 0;
}

// ⚠️ VULNERABILITY 3: No SameSite cookie flag
function setSecureCookie(res) {
  // Missing SameSite attribute - vulnerable to CSRF
  res.cookie('sessionId', 'value');
  // Should be: res.cookie('sessionId', 'value', { httpOnly: true, secure: true, sameSite: 'strict' })
}

// ⚠️ VULNERABILITY 4: SSRF - Server-Side Request Forgery
async function fetchDataFromURL(userProvidedURL) {
  const axios = require('axios');
  
  try {
    // User can request any URL, including:
    // - Internal services: http://localhost:8080
    // - Metadata endpoints: http://169.254.169.254/latest/meta-data/
    // - Internal IPs: http://192.168.1.1
    // - File protocols: file:///etc/passwd
    const response = await axios.get(userProvidedURL);
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
}

// ⚠️ VULNERABILITY 5: SSRF without URL validation
function proxyRequest(req, res) {
  const targetUrl = req.query.url;
  
  // No whitelist, no validation
  // Attacker can reach internal services:
  // ?url=http://internal-api:8080/admin
  // ?url=http://169.254.169.254/latest/meta-data/iam/info
  
  fetch(targetUrl)
    .then(response => response.text())
    .then(data => res.send(data))
    .catch(error => res.status(400).send(error.message));
}

// ⚠️ VULNERABILITY 6: XXE (XML External Entity) injection
function parseXMLFromUser(xmlData) {
  const xml2js = require('xml2js');
  const parser = new xml2js.Parser({
    // DTD processing enabled - vulnerable to XXE
    strict: false,
    processingInstructions: true
  });
  
  // Attacker can submit:
  // <?xml version="1.0"?>
  // <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
  // <data>&xxe;</data>
  
  return parser.parseStringPromise(xmlData);
}

// ⚠️ VULNERABILITY 7: XXE - Billion laughs attack
function parseUntrustedXML(xmlContent) {
  // Even without file access, can cause DoS:
  // <!DOCTYPE lolz [
  //   <!ENTITY lol "lol">
  //   <!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;">
  //   <!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;">
  // ]>
  // <lolz>&lol3;</lolz>
  
  const xml = require('xml2js');
  return xml.parseStringSync(xmlContent);
}

// ⚠️ VULNERABILITY 8: Open Redirect
function redirectToExternalURL(req, res) {
  const redirectUrl = req.query.url;
  
  // No validation - attacker can redirect to phishing site
  // /redirect?url=https://phishing-bank.com
  
  res.redirect(redirectUrl);
}

// ⚠️ VULNERABILITY 9: Open Redirect via referer header
function redirectBasedOnReferer(req, res) {
  const referer = req.headers.referer;
  
  // Trusting user-controlled referer header
  if (referer) {
    res.redirect(referer);
  }
}

// ⚠️ VULNERABILITY 10: Insecure Direct Object Reference (IDOR)
function getUserData(req, res) {
  const userId = req.query.userId;
  
  // No authorization check - can access any user's data
  // /api/user?userId=2 returns user 2's data
  // /api/user?userId=9999 returns user 9999's data
  
  res.json({
    id: userId,
    email: `user${userId}@example.com`,
    phone: '555-0100',
    address: '123 Main St'
  });
}

// ⚠️ VULNERABILITY 11: IDOR in resource operations
function deleteUserPhoto(req, res) {
  const photoId = req.params.photoId;
  const userId = req.query.userId;
  
  // No check if user owns the photo
  // /delete-photo/123?userId=456 can delete any user's photo
  
  res.json({ message: `Photo ${photoId} deleted` });
}

// ⚠️ VULNERABILITY 12: Race condition in transaction
async function transferFunds(fromAccount, toAccount, amount) {
  const db = require('./database');
  
  // No locking mechanism
  // Two concurrent requests can both see balance before deduction
  // Race condition: User can spend same balance twice
  
  const balance = await db.getBalance(fromAccount);
  
  if (balance >= amount) {
    await db.deductBalance(fromAccount, amount);
    await db.addBalance(toAccount, amount);
    return { success: true };
  }
}

// ⚠️ VULNERABILITY 13: No input validation on file paths
function readFile(filePath) {
  const fs = require('fs');
  
  // Path traversal vulnerability
  // /read-file?path=../../../../etc/passwd
  // User can read any file on the system
  
  return fs.readFileSync(filePath, 'utf8');
}

// ⚠️ VULNERABILITY 14: Command injection
function executeSystemCommand(userInput) {
  const exec = require('child_process').exec;
  
  // Never concatenate user input into shell commands
  // user input: "test.txt; rm -rf /"
  // Executes: ping test.txt; rm -rf /
  
  exec(`ping -c 4 ${userInput}`, (error, stdout, stderr) => {
    if (error) console.log(error);
    return stdout;
  });
}

// ⚠️ VULNERABILITY 15: Unvalidated redirect in API response
function getNextPageURL(req, res) {
  const page = req.query.page;
  
  // Attacker controls next page URL
  res.json({
    data: [1, 2, 3],
    nextPage: `/api/list?page=${parseInt(page) + 1}&redirect=${req.query.redirect}`
  });
}

module.exports = {
  handleFormSubmission,
  validateCSRFToken,
  setSecureCookie,
  fetchDataFromURL,
  proxyRequest,
  parseXMLFromUser,
  parseUntrustedXML,
  redirectToExternalURL,
  redirectBasedOnReferer,
  getUserData,
  deleteUserPhoto,
  transferFunds,
  readFile,
  executeSystemCommand,
  getNextPageURL
};
