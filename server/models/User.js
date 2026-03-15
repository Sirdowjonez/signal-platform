// User model stub
// Swap the stub store for a real Mongoose model when MongoDB is connected:
//
//   const mongoose = require('mongoose');
//   const UserSchema = new mongoose.Schema({ ... });
//   module.exports = mongoose.model('User', UserSchema);

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'signal-dev-secret';
const JWT_EXPIRES_IN = '7d';

const users = [];
let nextId = 1;

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'signal_salt').digest('hex');
}

const User = {
  schema: {
    id: 'number',
    email: 'string',
    passwordHash: 'string',
    name: 'string',
    role: 'string',              // 'free' | 'basic' | 'pro' | 'admin'
    stripeCustomerId: 'string',
    subscriptionId: 'string',
    subscriptionStatus: 'string', // 'active' | 'canceled' | 'past_due'
    createdAt: 'date',
    updatedAt: 'date',
  },

  create({ email, password, name = '', role = 'free' }) {
    if (!email || !password) throw new Error('Email and password are required.');
    if (User.findByEmail(email)) throw new Error('Email already in use.');

    const now = new Date();
    const user = {
      id: nextId++,
      email: email.toLowerCase().trim(),
      passwordHash: hashPassword(password),
      name,
      role,
      stripeCustomerId: null,
      subscriptionId: null,
      subscriptionStatus: null,
      createdAt: now,
      updatedAt: now,
    };
    users.push(user);
    return User.safeView(user);
  },

  findByEmail(email) {
    return users.find(u => u.email === email.toLowerCase().trim()) || null;
  },

  findById(id) {
    return users.find(u => u.id === Number(id)) || null;
  },

  verifyPassword(user, password) {
    return user.passwordHash === hashPassword(password);
  },

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  },

  updateSubscription(id, { stripeCustomerId, subscriptionId, subscriptionStatus, role }) {
    const user = users.find(u => u.id === Number(id));
    if (!user) return null;
    if (stripeCustomerId !== undefined) user.stripeCustomerId = stripeCustomerId;
    if (subscriptionId !== undefined) user.subscriptionId = subscriptionId;
    if (subscriptionStatus !== undefined) user.subscriptionStatus = subscriptionStatus;
    if (role !== undefined) user.role = role;
    user.updatedAt = new Date();
    return User.safeView(user);
  },

  // Strip sensitive fields before sending to client
  safeView(user) {
    const { passwordHash, ...safe } = user;
    return safe;
  },
};

module.exports = User;
