const mysql = require('mysql2');

function createDatabaseConnection() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change if needed
    password: 'GetMeMyRootData2025', // Change if needed
    database: 'myTodo',
    port: 3306
  });
}

module.exports = createDatabaseConnection;
