# Vulnerable Web App - Educational Security Demo

⚠️ **INTENTIONALLY VULNERABLE** - For security training only. Never use in production.

## Quick Start

```bash
npm install
npm start
```

Server runs on `http://localhost:3000`

## Files Overview

| File | Vulnerabilities |
|------|-----------------|
| **server.js** | Hardcoded secrets, SQL injection, CSRF, SSRF, weak auth |
| **database.js** | SQL injection variations, no prepared statements |
| **auth.js** | Weak passwords, no token expiration, session fixation |
| **xss-vulnerabilities.js** | Reflected/Stored/DOM XSS, eval, template injection |
| **csrf-ssrf-vulnerabilities.js** | CSRF bypass, SSRF, XXE, open redirect, IDOR |
| **api-vulnerabilities.js** | Missing auth, weak API keys, no rate limiting |
| **config.js** | Hardcoded secrets, debug mode, bad CORS, no HTTPS |
| **data-handling.js** | Plain text passwords, weak hashing, bad encryption |
| **input-validation.js** | ReDoS, path traversal, NoSQL injection |
| **frontend.html** | No CSP, CSRF forms, DOM injection |
| **middleware.js** | No auth, sensitive logging, bad error handling |
| **dependencies.js** | Vulnerable packages, supply chain issues |

## Coverage: 130+ Vulnerabilities

- SQL Injection (10+)
- XSS (15+)
- Authentication/Authorization (30+)
- API Security (15+)
- Data Protection (20+)
- Input Validation (20+)
- Configuration (20+)
- Supply Chain (20+)

Covers **OWASP Top 10 & CWE/SANS Top 25**

## Key Security Principles

1. Never hardcode secrets → Use environment variables
2. Always validate input → Never trust user data
3. Use prepared statements → Prevent SQL injection
4. Sanitize output → Prevent XSS
5. Hash passwords → Never store plaintext
6. Use HTTPS → Encrypt data in transit
7. Implement rate limiting → Prevent brute force
8. Add CSRF protection → Token-based validation
9. Proper authentication/authorization → Verify identity & access
10. Keep dependencies updated → Security patches

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [OWASP WebGoat](https://github.com/WebGoat/WebGoat)
- [OWASP Juice Shop](https://github.com/juice-shop/juice-shop)

## ⚠️ Legal Notice

For educational purposes only. Unauthorized access to systems is illegal. Always get permission before testing.

##test
