const express = require('express');
const bcrypt = require('bcryptjs');
const { getSQL } = require('../db');
const { signToken } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    console.log('Login attempt for username:', username);

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // PostgreSQL uses $1 instead of ?
    const user = await getSQL('SELECT * FROM users WHERE username = $1', [username]);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(user);
    console.log('Setting cookie with token:', token.substring(0, 20) + '...');

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production', // true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log('Cookie set successfully');
    return res.json({ ok: true, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  console.log('Logout request, clearing cookie');
  res.clearCookie('token');
  res.json({ ok: true });
});

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.token;
    console.log('Auth check - cookies:', req.cookies);
    console.log('Token from cookie:', token ? token.substring(0, 20) + '...' : 'none');

    if (!token) return res.json({ user: null });

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    console.log('Token verified, user:', payload);
    return res.json({ user: { id: payload.id, username: payload.username } });
  } catch (e) {
    console.error('Token verification failed:', e.message);
    return res.json({ user: null });
  }
});

module.exports = router;
