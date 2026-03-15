const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const users = [];

router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'User already exists' });
  const user = { id: Date.now().toString(), email, name, password, isPremium: false, createdAt: new Date().toISOString() };
  users.push(user);
  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, isPremium: user.isPremium } });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, isPremium: user.isPremium } });
});

module.exports = router;
