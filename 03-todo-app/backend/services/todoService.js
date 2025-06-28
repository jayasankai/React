async function todoService(pool) {
  return {
    getTodos: async (req, res) => {
      try {
        const [results] = await pool.query('SELECT * FROM todo');
        res.json(results);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
    addTodo: async (req, res) => {
      const { title } = req.body;
      if (!title) return res.status(400).json({ error: 'Title is required' });
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        const [result] = await conn.query('INSERT INTO todo (title) VALUES (?)', [title]);
        // You can add more queries here as part of the transaction
        await conn.commit();
        res.json({ id: result.insertId, title });
      } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
      } finally {
        conn.release();
      }
    },
    editTodo: async (req, res) => {
      const { id } = req.params;
      const { title, isCompleted } = req.body;
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
      try {
        const [result] = await pool.query(`UPDATE todo SET ${fields.join(', ')} WHERE id = ?`, values);
        res.json({ id, title, isCompleted });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
    deleteTodo: async (req, res) => {
      const { id } = req.params;
      try {
        await pool.query('DELETE FROM todo WHERE id = ?', [id]);
        res.json({ id });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  };
}

module.exports = todoService;
