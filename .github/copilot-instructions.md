# Copilot Instructions: Vulnerable Web App

## Project Overview

This is an **intentionally vulnerable** educational web application demonstrating 130+ security vulnerabilities across OWASP Top 10 and CWE/SANS Top 25. It's a teaching tool for security training, not production code.

**Key Constraint**: When suggesting improvements or fixes, maintain the vulnerabilities while explicitly documenting them with `⚠️ VULNERABILITY` comments. The goal is to demonstrate flaws, not to hide them.

## Architecture

- **Entry Point**: [server.js](server.js) - Express.js application with vulnerable endpoints
- **Database Layer**: [database.js](database.js) - MySQL connections without prepared statements
- **Authentication**: [auth.js](auth.js) - JWT/weak password validation with hardcoded secrets
- **Configuration**: [config.js](config.js) - Centralized secrets exposed in code
- **Vulnerability Modules**: Separate files for specific attack vectors:
  - [xss-vulnerabilities.js](xss-vulnerabilities.js) - Reflected, Stored, DOM XSS examples
  - [csrf-ssrf-vulnerabilities.js](csrf-ssrf-vulnerabilities.js) - CSRF bypasses, SSRF, XXE, IDOR
  - [api-vulnerabilities.js](api-vulnerabilities.js) - Missing authentication, weak API keys
  - [input-validation.js](input-validation.js) - ReDoS, path traversal, NoSQL injection
  - [data-handling.js](data-handling.js) - Plaintext passwords, weak hashing
- **Frontend**: [frontend.html](frontend.html) - HTML page with DOM injection vulnerabilities
- **Middleware**: [middleware.js](middleware.js) - Logging and error handling issues

## Critical Patterns & Conventions

### 1. Vulnerability Documentation
Every vulnerable code section must be clearly marked:
```javascript
// ⚠️ VULNERABILITY N: [Type] - [Brief description]
// Detailed explanation of why this is vulnerable and attack vector
const exposed = 'hardcoded-secret';
```

### 2. Module Organization
- Each file focuses on a vulnerability category
- Functions are named to indicate what they demonstrate: `getUserByUsername()` (SQL injection), `verifyToken()` (weak JWT verification)
- Code comments explain both the vulnerability AND the exploit

### 3. Hardcoded Credentials Pattern
Used throughout for educational purposes:
- Database passwords in [database.js](database.js#L4)
- JWT secrets in [server.js](server.js#L15), [auth.js](auth.js#L4)
- API keys in [config.js](config.js#L11-L18)
- **Never refactor these to env variables** without preserving the vulnerability for teaching purposes

### 4. Direct String Concatenation for SQL
Standard pattern for SQL injection demonstrations:
```javascript
const query = `SELECT * FROM users WHERE username = '${username}'`;
```
Attack vectors documented in comments (e.g., `admin' --` comments out rest of query)

### 5. Overly Permissive Security
- CORS: `app.use(cors())` in [server.js](server.js#L19) - allows all origins
- Error messages leak information intentionally
- Debug mode enabled in [config.js](config.js#L23-L25)

## Development Workflow

### Running the App
```bash
npm install  # Install dependencies
npm start    # Run on http://localhost:3000
npm run dev  # Run with nodemon for file-watch reloading
```

### Adding New Vulnerabilities
1. Create or extend a file in the vulnerability category (e.g., `csrf-ssrf-vulnerabilities.js`)
2. Document with `⚠️ VULNERABILITY` header and exploit explanation
3. Reference it in [README.md](README.md) coverage table
4. Update vulnerability count in documentation

### Key Dependencies
- **express** ^4.18.0 - Web framework
- **mysql** ^2.18.1 - Database driver (no prepared statements by design)
- **jsonwebtoken** ^9.0.0 - JWT handling (weak implementation)
- **axios** ^1.3.0 - HTTP client for SSRF demonstrations
- **cors** ^2.8.5 - Permissive CORS setup

## File-Specific Knowledge

### [server.js](server.js)
- Lines 14-17: Hardcoded secrets (never use `.env` for teaching app)
- Lines 19: Overly permissive CORS
- Lines 25-28: XSS via unvalidated template literal
- Lines 31-42: SQL injection in login endpoint

### [auth.js](auth.js)
- Line 6: No secret rotation across environments
- Lines 9-14: Weak password validation (only checks length > 0)
- Lines 17-24: JWT verification without proper error handling

### [config.js](config.js)
- Lines 5-8: Database credentials hardcoded
- Lines 11-18: Multiple API keys exposed
- Lines 23-25: Debug mode in production configuration

## Common Tasks & Approaches

**Explaining a vulnerability**: Cross-reference the file location, quote the vulnerable code, explain the attack vector with example payload, and document the impact.

**Adding new endpoints**: Follow [server.js](server.js) pattern with `⚠️ VULNERABILITY` comment, the flawed implementation, and an inline comment showing the attack.

**Extending database functions**: Use string concatenation in [database.js](database.js) to demonstrate SQL injection variations.

## When to Preserve vs. Refactor

**Always Preserve**:
- Hardcoded secrets and credentials
- String concatenation in SQL queries
- Missing input validation
- Weak authentication logic
- Overly permissive CORS/error messages

**Safe to Improve**:
- Code comments and documentation
- README structure and examples
- Vulnerability descriptions (make more detailed)
- Frontend.html markup (keep vulnerabilities, improve clarity)
