const path = require('path');
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// Ensure uploads dir exists at project root
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Initialize DB (creates tables and seeds admin)
const { db } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000; // ✅ خلي الافتراضي 3000 بدل 3001

// Make db available to routes
app.set('db', db);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static: uploads
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));

// 👉 Serve frontend static files (index.html, contact.html, etc.)
app.use('/', express.static(path.join(__dirname, '..')));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/public', require('./routes/public'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/pharma-hub', require('./routes/pharma-hub'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/did-you-know', require('./routes/did-you-know'));
app.use('/api/lectures', require('./routes/lectures'));

// Admin dashboard static
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));

// Test API page
app.use('/test-api.html', express.static(path.join(__dirname, 'test-api.html')));

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// ✅ Test route for Railway
app.get("/", (req, res) => {
  res.send("✅ Backend running on Railway!");
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Frontend running on http://localhost:${PORT}/`);
  console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
});


