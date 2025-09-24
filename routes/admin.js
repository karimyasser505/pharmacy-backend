const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { getSQL, allSQL, runSQL } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists at project root
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    const filename = `${Date.now()}_${base}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

router.use(requireAuth);

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `/uploads/${file.filename}`;
    await runSQL('INSERT INTO files (filename, originalname, mimetype, size, url) VALUES (?, ?, ?, ?, ?)', 
      [file.filename, file.originalname, file.mimetype, file.size, url]);
    res.json({ ok: true, url });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helpers
function jsonOrText(v) { return typeof v === 'string' ? v : JSON.stringify(v || []); }
function now() { return new Date().toISOString(); }

// CRUD factories
function createCrud(table, fields) {
  router.get(`/${table}`, async (req, res) => {
    try {
      const rows = await allSQL(`SELECT * FROM ${table} ORDER BY id DESC`);
      res.json(rows);
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get(`/${table}/:id`, async (req, res) => {
    try {
      const row = await getSQL(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
      if (!row) return res.status(404).json({ error: 'Not found' });
      res.json(row);
    } catch (err) {
      console.error(`Error fetching ${table} item:`, err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post(`/${table}`, async (req, res) => {
    try {
      const data = fields.reduce((acc, f) => { acc[f] = req.body?.[f]; return acc; }, {});
      
      // Add created_at for new items
      data.created_at = now();
      
      // special handling
      if (table === 'publications') {
        data.keywords = jsonOrText(data.keywords);
        data.authors = jsonOrText(data.authors);
      }
      if (table === 'news') {
        data.published = req.body?.published ? 1 : 0;
        data.updated_at = now();
      }
      if (['events','graduates','publications'].includes(table)) {
        data.updated_at = now();
      }

      const cols = Object.keys(data);
      const placeholders = cols.map(() => '?').join(',');
      const stmt = `INSERT INTO ${table} (${cols.join(',')}) VALUES (${placeholders})`;
      const info = await runSQL(stmt, cols.map(c => data[c]));
      res.json({ ok: true, id: info.lastID });
    } catch (err) {
      console.error(`Error creating ${table}:`, err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.put(`/${table}/:id`, async (req, res) => {
    try {
      const existing = await getSQL(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
      if (!existing) return res.status(404).json({ error: 'Not found' });
      
      const data = fields.reduce((acc, f) => { acc[f] = req.body?.[f] ?? existing[f]; return acc; }, {});
      if (table === 'publications') {
        data.keywords = jsonOrText(data.keywords);
        data.authors = jsonOrText(data.authors);
      }
      if (table === 'news') {
        data.published = req.body?.published != null ? (req.body.published ? 1 : 0) : existing.published;
        data.updated_at = now();
      }
      if (['events','graduates','publications'].includes(table)) {
        data.updated_at = now();
      }

      const cols = Object.keys(data);
      const assignments = cols.map(c => `${c} = ?`).join(',');
      const stmt = `UPDATE ${table} SET ${assignments} WHERE id = ?`;
      await runSQL(stmt, [...cols.map(c => data[c]), req.params.id]);
      res.json({ ok: true });
    } catch (err) {
      console.error(`Error updating ${table}:`, err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete(`/${table}/:id`, async (req, res) => {
    try {
      await runSQL(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
      res.json({ ok: true });
    } catch (err) {
      console.error(`Error deleting ${table}:`, err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

createCrud('news', ['title','excerpt','body','date','image_url','published','created_at','updated_at']);
createCrud('publications', ['title','journal','year','keywords','authors','doi','created_at','updated_at']);
createCrud('lectures', ['title','description','type','mode','date','time','location','instructor','pdf_path','video_url','created_at','updated_at']);
createCrud('graduates', ['name','cohort','specialty','email','thesis','current_position','avatar_url','created_at','updated_at']);

// Files management
router.get('/files', async (req, res) => {
  try {
    const rows = await allSQL('SELECT * FROM files ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching files:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/files/:id', async (req, res) => {
  try {
    const file = await getSQL('SELECT * FROM files WHERE id = ?', [req.params.id]);
    if (!file) return res.status(404).json({ error: 'File not found' });
    
    // Delete file from filesystem
    const filePath = path.join(uploadsDir, file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete from database
    await runSQL('DELETE FROM files WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
