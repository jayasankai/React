// Express backend for managing todos in MySQL
const express = require('express');
const mysql = require('mysql2');
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

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Change if needed
  password: 'GetMeMyRootData2025', // Change if needed
  database: 'myTodo',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Get all todos
app.get('/api/todos', (req, res) => {
  db.query('SELECT * FROM todo', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Add a todo
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  db.query('INSERT INTO todo (title) VALUES (?)', [title], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, title });
  });
});

// Edit a todo
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  db.query('UPDATE todo SET title = ? WHERE id = ?', [title, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id, title });
  });
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM todo WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id });
  });
});

// JWT secret - change this to a strong secret in production
const JWT_SECRET = 'your_jwt_secret_key';

// User login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  db.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const user = results[0];
    // For demo: plain text password check. In production, use hashed passwords.
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', user: { id: user.id, username: user.username }, token });
  });
});

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Protect todo routes
app.get('/api/todos', authenticateToken, (req, res) => {
  db.query('SELECT * FROM todo', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/api/todos', authenticateToken, (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  db.query('INSERT INTO todo (title) VALUES (?)', [title], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, title });
  });
});

app.put('/api/todos/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  db.query('UPDATE todo SET title = ? WHERE id = ?', [title, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id, title });
  });
});

app.delete('/api/todos/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM todo WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id });
  });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
