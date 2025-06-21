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
      const { title, isCompleted } = req.body;
      // Only ADMIN can update isCompleted
      if (typeof isCompleted !== 'undefined' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Only ADMIN can update completion status' });
      }
      const fields = [];
      const values = [];
      if (title) {
        fields.push('title = ?');
        values.push(title);
      }
      if (typeof isCompleted !== 'undefined') {
        fields.push('isCompleted = ?');
        values.push(isCompleted);
      }
      if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
      values.push(id);
      db.query(`UPDATE todo SET ${fields.join(', ')} WHERE id = ?`, values, (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ id, title, isCompleted });
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
