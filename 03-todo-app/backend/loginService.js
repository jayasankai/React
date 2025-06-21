const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key';

function loginService(db) {
  return {
    login: (req, res) => {
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
    }
  };
}

module.exports = loginService;
