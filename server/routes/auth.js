const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET  = process.env.JWT_SECRET  || 'signal-dev-secret';
const JWT_EXPIRES = '7d';

const users = [];

function hashPassword(pw) {
  return crypto.createHash('sha256').update(pw + 'signal_salt').digest('hex');
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

function safeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password, name = '' } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }
  if (users.find(u => u.email === email.toLowerCase().trim())) {
    return res.status(409).json({ error: 'An account with that email already exists.' });
  }

  const user = {
    id: crypto.randomUUID(),
    email: email.toLowerCase().trim(),
    name: name.trim(),
    passwordHash: hashPassword(password),
    role: 'free',
    isPremium: false,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  const token = signToken(user);

  res.status(201).json({ token, user: safeUser(user) });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = users.find(u => u.email === email.toLowerCase().trim());

  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = signToken(user);
  res.json({ token, user: safeUser(user) });
});

// GET /api/auth/me — return current user from token
router.get('/me', (req, res) => {
  const auth = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Not authenticated.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user: safeUser(user) });
  } catch {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
});

module.exports = router;
