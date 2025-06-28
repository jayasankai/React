const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_jwt_secret_key";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  // Only allow 'auth-todos-token' to bypass JWT verification
  if (token === "auth-todos-token") {
    req.user = { id: 0, username: "auth-todos", role: "bypass" };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user; // user object includes role from JWT
    next();
  });
}

function generateTokenAndRespond(res, user) {
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    token,
  });
}

module.exports = { authenticateToken, JWT_SECRET, generateTokenAndRespond };
