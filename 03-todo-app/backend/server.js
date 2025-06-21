// Express backend for managing todos in MySQL
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = 8000;

// Allow CORS for frontend origin explicitly to fix strict-origin-when-cross-origin error
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const createDatabaseConnection = require('./databaseService');
const db = createDatabaseConnection();

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

const loginService = require('./loginService')(db);
const todoService = require('./todoService')(db);
const { authenticateToken, JWT_SECRET } = require('./authService');

// User login
app.post('/api/login', loginService.login);

// Protect todo routes
app.get('/api/todos', authenticateToken, todoService.getTodos);
app.post('/api/todos', authenticateToken, todoService.addTodo);
app.put('/api/todos/:id', authenticateToken, todoService.editTodo);
app.delete('/api/todos/:id', authenticateToken, todoService.deleteTodo);

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
