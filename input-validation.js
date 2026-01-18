// ⚠️ VULNERABILITY: Input validation and injection issues

// ⚠️ VULNERABILITY 1: No input validation at all
function processUserInput(input) {
  // Accepts anything without any validation
  return input;
}

// ⚠️ VULNERABILITY 2: Weak email validation
function validateEmail(email) {
  // Too permissive regex - doesn't prevent XSS or special characters
  return /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/.test(email);
}

// ⚠️ VULNERABILITY 3: No type checking
function calculateDiscount(userId, percentage) {
  // No validation that percentage is a number
  // Could be: "'; DROP TABLE --" or "<script>alert(1)</script>"
  
  const discount = 100 * percentage; // Type confusion vulnerability
  return discount;
}

// ⚠️ VULNERABILITY 4: Insufficient string sanitization
function sanitizeInput(input) {
  // Only removes <script> tags, but many other XSS vectors exist
  return input.replace(/<script>/g, '');
  // Attacker can use: <img src=x onerror=alert(1)>
}

// ⚠️ VULNERABILITY 5: Regex DoS (Regular Expression Denial of Service)
function validateUsername(username) {
  // ReDoS vulnerable regex - can cause severe performance issues
  const regex = /^(a+)+$/;
  return regex.test(username);
  
  // Input: "aaaaaaaaaaaaaaaaaaaaaaaaaaab"
  // Causes exponential backtracking, hangs server
}

// ⚠️ VULNERABILITY 6: Path traversal vulnerability
function readUserFile(userId, filename) {
  const fs = require('fs');
  
  // No validation of filename
  // /read-file?userId=1&filename=../../../../etc/passwd
  // Could read any file on system
  
  const path = `/user-files/${userId}/${filename}`;
  return fs.readFileSync(path, 'utf8');
}

// ⚠️ VULNERABILITY 7: No whitelist validation
function executeUserCommand(action) {
  // No whitelist of allowed actions
  // User can pass any value
  
  const actions = {
    'delete': deleteData,
    'update': updateData
  };
  
  // Attacker could pass: "deleteAllData" or any other function name
  return actions[action]();
}

// ⚠️ VULNERABILITY 8: JSON injection
function parseJSONWithoutValidation(jsonString) {
  try {
    // No schema validation
    const data = JSON.parse(jsonString);
    
    // Could receive unexpected fields:
    // { username: "hack", isAdmin: true, isModerator: true }
    
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

// ⚠️ VULNERABILITY 9: Protocol handler exploitation
function handleProtocolURL(url) {
  // User input used as protocol handler
  // javascript:alert('XSS')
  // data:text/html,<script>alert('XSS')</script>
  // vbscript:msgbox('XSS')
  
  window.location.href = url;
}

// ⚠️ VULNERABILITY 10: CSV injection
function generateCSV(records) {
  let csv = '';
  records.forEach(record => {
    // User data in first column can be formula
    csv += `${record.name},${record.email},${record.amount}\n`;
    
    // If record.name is "=cmd|'/c calc'!A1"
    // Excel will execute the command
  });
  
  return csv;
}

// ⚠️ VULNERABILITY 11: LDAP injection
function searchLDAP(searchTerm) {
  // No escaping of LDAP special characters
  // searchTerm = "*)(objectClass=*"
  // Could bypass authentication
  
  const filter = `(cn=${searchTerm})`;
  // Executes LDAP search with malicious filter
  
  return filter;
}

// ⚠️ VULNERABILITY 12: NoSQL injection
function findUserInMongoDB(username) {
  // Directly using user input in MongoDB query
  // username = { $ne: null }
  // Query becomes: { username: { $ne: null } }
  // Returns all users instead of specific user
  
  const query = { username: username };
  return collection.findOne(query);
}

// ⚠️ VULNERABILITY 13: OS command injection via template
function generateReport(reportType) {
  // User input in shell command
  // reportType = "test; rm -rf /"
  // Executes: generate-report test; rm -rf /
  
  const { exec } = require('child_process');
  exec(`generate-report ${reportType}`);
}

// ⚠️ VULNERABILITY 14: Integer overflow
function calculateTotal(price, quantity) {
  // No bounds checking
  // 2147483647 * 2 = 2147483646 (overflow in 32-bit)
  // Could undercharge customer
  
  return price * quantity;
}

// ⚠️ VULNERABILITY 15: Null byte injection
function readFileFromUserInput(filename) {
  // filename = "config.json%00.txt"
  // System reads: config.json (null byte terminates string)
  // Could access sensitive files
  
  const fs = require('fs');
  return fs.readFileSync(`/uploads/${filename}`);
}

// ⚠️ VULNERABILITY 16: Format string vulnerability
function logMessage(userInput) {
  // If userInput = "%x %x %x"
  // Could leak stack memory
  
  console.log(`User said: ${userInput}`);
  
  // In C/C++ printf this would be: printf(userInput)
  // In JS, the vulnerability is less direct but still possible through templates
}

// ⚠️ VULNERABILITY 17: Type juggling exploitation
function checkAccess(userId, requiredId) {
  // PHP-style type juggling
  // "10" == 10 is true (loose comparison)
  // userId = "10abc", requiredId = 10
  // Could be treated as equal
  
  if (userId == requiredId) { // Using == instead of ===
    return true;
  }
  return false;
}

// ⚠️ VULNERABILITY 18: No length validation
function storeFeedback(feedback) {
  // No maximum length
  // Could accept gigabytes of data
  // Memory exhaustion / DoS
  
  const database = require('./database');
  database.saveFeedback(feedback);
}

// ⚠️ VULNERABILITY 19: Unicode/UTF-8 bypass
function filterBadWords(input) {
  const blacklist = ['admin', 'delete', 'drop'];
  
  // User can bypass with Unicode lookalikes:
  // "аdmin" (Cyrillic 'а' looks like 'a')
  // "dеlеtе" (Cyrillic 'е' looks like 'e')
  
  return input;
}

// ⚠️ VULNERABILITY 20: Arbitrary object property access
function getUserProperty(userId, propertyName) {
  // User can access any property
  // propertyName = "__proto__" or "constructor"
  // Could access global objects and exploit prototype pollution
  
  const users = { 1: { name: 'User1', role: 'user' } };
  const user = users[userId];
  
  return user[propertyName];
}

function deleteData() { return 'deleted'; }
function updateData() { return 'updated'; }

module.exports = {
  processUserInput,
  validateEmail,
  calculateDiscount,
  sanitizeInput,
  validateUsername,
  readUserFile,
  executeUserCommand,
  parseJSONWithoutValidation,
  handleProtocolURL,
  generateCSV,
  searchLDAP,
  findUserInMongoDB,
  generateReport,
  calculateTotal,
  readFileFromUserInput,
  logMessage,
  checkAccess,
  storeFeedback,
  filterBadWords,
  getUserProperty
};
