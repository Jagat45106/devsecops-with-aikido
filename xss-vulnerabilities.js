// ⚠️ VULNERABILITY: XSS, HTML Injection, and Frontend Security Issues
// This is vulnerable frontend/template code

// ⚠️ VULNERABILITY 1: Reflected XSS in search
function displaySearchResults(searchQuery) {
  // Direct injection of user input into HTML
  const resultsHtml = `
    <div class="search-results">
      <h2>Results for: ${searchQuery}</h2>
      <p>You searched for "${searchQuery}"</p>
    </div>
  `;
  document.getElementById('results').innerHTML = resultsHtml;
  
  // Attack: ?search=<img src=x onerror="alert('XSS')">
  // Would execute JavaScript in user's browser
}

// ⚠️ VULNERABILITY 2: Stored XSS - saving user comments without sanitization
function saveUserComment(commentText) {
  // Comment stored with malicious script
  const comment = `<div class="user-comment">${commentText}</div>`;
  
  // Later, when retrieved and displayed:
  // <div class="user-comment"><script>stealCookies()</script></div>
  // Script executes for all users viewing the page
  
  return comment;
}

// ⚠️ VULNERABILITY 3: DOM-based XSS
function processUserInput() {
  const userInput = document.getElementById('userInput').value;
  
  // Directly using unvalidated input in DOM manipulation
  document.body.innerHTML += `<div>${userInput}</div>`;
  
  // Or using eval:
  eval(`var result = ${userInput}`);
}

// ⚠️ VULNERABILITY 4: innerHTML with user content
function displayUserProfile(userData) {
  const profileHtml = `
    <div class="profile">
      <h1>${userData.name}</h1>
      <p>${userData.bio}</p>
      <img src="${userData.profilePic}" onerror="alert('XSS')">
    </div>
  `;
  
  // Using innerHTML allows script injection
  document.getElementById('profile').innerHTML = profileHtml;
}

// ⚠️ VULNERABILITY 5: Script tag injection
function loadExternalContent(url) {
  // User-controlled URL
  const script = document.createElement('script');
  script.src = url; // Could load malicious script from attacker's domain
  document.body.appendChild(script);
}

// ⚠️ VULNERABILITY 6: CSS injection
function applyUserStyling(cssInput) {
  const style = document.createElement('style');
  style.innerHTML = cssInput; // User can inject keylogger via CSS
  document.head.appendChild(style);
}

// ⚠️ VULNERABILITY 7: Event handler injection
function createButtonFromUserInput(buttonLabel) {
  const button = document.createElement('button');
  button.setAttribute('onclick', buttonLabel);
  // User input: "); alert('XSS'); ("
  // Results in: onclick=""); alert('XSS'); ("")"
  document.body.appendChild(button);
}

// ⚠️ VULNERABILITY 8: localStorage XSS
function storeUserData(userData) {
  // Storing user input without sanitization
  localStorage.setItem('userData', JSON.stringify(userData));
  
  // Later, displaying without encoding:
  const stored = JSON.parse(localStorage.getItem('userData'));
  document.getElementById('user').innerHTML = stored.name;
}

// ⚠️ VULNERABILITY 9: Unsafe JSON parsing
function processApiResponse(jsonString) {
  // Using eval or Function constructor is dangerous
  const data = eval('(' + jsonString + ')');
  
  // If JSON comes from untrusted source, can execute code
  // {"name":"test","code":"alert('XSS')"}
  
  return data;
}

// ⚠️ VULNERABILITY 10: URL parameter directly used
function redirectUser() {
  const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
  window.location.href = redirectUrl;
  
  // Attack: ?redirect=javascript:alert('XSS')
  // Attack: ?redirect=https://attacker.com
}

// ⚠️ VULNERABILITY 11: Template injection
function renderTemplate(template, data) {
  // Simple string replacement - vulnerable to template injection
  let html = template;
  for (let key in data) {
    html = html.replace(`{{${key}}}`, data[key]);
  }
  
  // If template is user-controlled, can inject:
  // {{constructor.prototype.toString.call([]).slice(2,-1)}}
  
  document.body.innerHTML = html;
}

// ⚠️ VULNERABILITY 12: No Content Security Policy (CSP) headers
// Server should return: Content-Security-Policy: script-src 'self'
// This file doesn't implement it, allowing inline scripts and external scripts

// ⚠️ VULNERABILITY 13: Unsafe regular expressions
function validateEmail(email) {
  const regex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
  // Regex is too permissive, doesn't prevent XSS in email field
  return regex.test(email);
}

// ⚠️ VULNERABILITY 14: Data attributes with user content
function createUserElement(userData) {
  const div = document.createElement('div');
  div.setAttribute('data-user', userData.userInput);
  
  // Can use data attribute for XSS in certain contexts
  // data-user="><script>alert('XSS')</script>"
  
  return div;
}

// ⚠️ VULNERABILITY 15: Dangerous function usage
function executeDynamicCode(userCode) {
  // Never use eval, Function constructor, or setTimeout with strings
  const result = new Function(userCode)();
  return result;
  
  // Users can: new Function('return fetch("https://attacker.com")')()
}

module.exports = {
  displaySearchResults,
  saveUserComment,
  processUserInput,
  displayUserProfile,
  loadExternalContent,
  applyUserStyling,
  createButtonFromUserInput,
  storeUserData,
  processApiResponse,
  redirectUser,
  renderTemplate,
  validateEmail,
  createUserElement,
  executeDynamicCode
};
