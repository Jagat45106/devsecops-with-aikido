// ⚠️ VULNERABILITY: Database connection with hardcoded credentials
const mysql = require('mysql');

// ⚠️ VULNERABILITY 1: Hardcoded database credentials
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123', // NEVER hardcode passwords
  database: 'vulnerable_app',
  port: 3306
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

// ⚠️ VULNERABILITY 2: SQL Injection via direct string concatenation
function getUserByUsername(username) {
  // DANGEROUS: Directly concatenating user input
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  
  // Attack: username = "admin' --"
  // Query becomes: SELECT * FROM users WHERE username = 'admin' --'
  // The -- comments out the rest of the query
  
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });
}

// ⚠️ VULNERABILITY 3: SQL Injection in UPDATE statement
function updateUserProfile(userId, name, email) {
  // User input directly concatenated into query
  const query = `UPDATE users SET name = '${name}', email = '${email}' WHERE id = ${userId}`;
  
  // Attack: name = "'; DROP TABLE users; --"
  // Would execute: UPDATE users SET name = ''; DROP TABLE users; --'...
  
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });
}

// ⚠️ VULNERABILITY 4: UNION-based SQL Injection
function searchProducts(searchTerm) {
  const query = `SELECT id, name, price FROM products WHERE name LIKE '%${searchTerm}%'`;
  
  // Attack: searchTerm = "%' UNION SELECT username, password, '0' FROM users --"
  // Would return all usernames and passwords along with product results
  
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });
}

// ⚠️ VULNERABILITY 5: Time-based Blind SQL Injection
function authenticateUser(username, password) {
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  // Even if output isn't shown, attacker can infer data via timing
  // Attack: password = "' OR SLEEP(5) --"
  // If query takes 5 seconds, condition was true
  
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });
}

// ⚠️ VULNERABILITY 6: Second-order SQL Injection
function storeAndRetrieveUserData(userId, userInput) {
  // First query - store user input
  const storeQuery = `INSERT INTO cache VALUES ('${userInput}')`;
  
  // Later - retrieve and use in another query
  connection.query(storeQuery, (error, results) => {
    if (!error) {
      const retrieveQuery = `SELECT data FROM cache WHERE data = '${userInput}'`;
      // Vulnerability appears when malicious data is used in subsequent queries
    }
  });
}

// ⚠️ VULNERABILITY 7: No prepared statements or parameterized queries
// Even this simple function is vulnerable
function getProductById(productId) {
  // Should use: connection.query('SELECT * FROM products WHERE id = ?', [productId], ...)
  const query = `SELECT * FROM products WHERE id = ${productId}`;
  
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });
}

// ⚠️ VULNERABILITY 8: Error-based SQL Injection exposure
function queryWithErrorExposure(userInput) {
  const query = `SELECT * FROM users WHERE email = '${userInput}'`;
  
  connection.query(query, (error, results) => {
    if (error) {
      // Exposing detailed error messages reveals database structure
      console.log('Database Error:', error.message);
      console.log('SQL:', error.sql);
      // Never expose SQL errors to users!
    }
  });
}

// ⚠️ VULNERABILITY 9: Logic SQL Injection
function getOrdersByDateRange(startDate, endDate) {
  // User can manipulate date range logic
  const query = `SELECT * FROM orders WHERE created_at BETWEEN '${startDate}' AND '${endDate}'`;
  
  // Attack: startDate = "2020-01-01' OR '1'='1", endDate = "2020-01-01"
  // Returns all orders, not just the requested range
  
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });
}

// ⚠️ VULNERABILITY 10: Batch SQL Injection
function batchInsertData(dataArray) {
  dataArray.forEach((data) => {
    // If array is from user input, can contain malicious SQL
    const query = `INSERT INTO records (name, value) VALUES ('${data.name}', '${data.value}')`;
    connection.query(query);
  });
}

module.exports = {
  connection,
  getUserByUsername,
  updateUserProfile,
  searchProducts,
  authenticateUser,
  storeAndRetrieveUserData,
  getProductById,
  queryWithErrorExposure,
  getOrdersByDateRange,
  batchInsertData
};
