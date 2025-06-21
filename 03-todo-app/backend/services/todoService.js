function todoService(db) {
  return {
    getTodos: (req, res) => {
      db.query('SELECT * FROM todo', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
      });
    },
    addTodo: (req, res) => {
      const { title } = req.body;
      if (!title) return res.status(400).json({ error: 'Title is required' });
      db.query('INSERT INTO todo (title) VALUES (?)', [title], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ id: result.insertId, title });
      });
    },
    editTodo: (req, res) => {
      const { id } = req.params;
      const { title } = req.body;
      db.query('UPDATE todo SET title = ? WHERE id = ?', [title, id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ id, title });
      });
    },
    deleteTodo: (req, res) => {
      const { id } = req.params;
      db.query('DELETE FROM todo WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ id });
      });
    }
  };
}

module.exports = todoService;
