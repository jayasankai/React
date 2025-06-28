const { generateTokenAndRespond } = require('./authService');

function loginService(pool) {
  return {
    login: async (req, res) => {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
      try {
        const [results] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
        if (results.length === 0) {
          return res.status(401).json({ error: 'Invalid username or password' });
        }
        const user = results[0];
        // For demo: plain text password check. In production, use hashed passwords.
        if (user.password !== password) {
          return res.status(401).json({ error: 'Invalid username or password' });
        }
        generateTokenAndRespond(res, user);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  };
}

module.exports = loginService;
