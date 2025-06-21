// Express backend for managing todos in MySQL
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

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

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
