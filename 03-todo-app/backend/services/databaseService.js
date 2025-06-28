const mysql = require('mysql2/promise');

// Create a connection pool for async/await usage and transactions
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Change if needed
  password: 'GetMeMyRootData2025', // Change if needed
  database: 'myTodo',
  port: 3306
});

module.exports = pool;
