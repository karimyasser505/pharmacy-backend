const express = require('express');
const { allSQL } = require('../db');

const router = express.Router();

function mapRow(row) {
  const mapped = { ...row };
  ['keywords', 'authors'].forEach(k => {
    if (mapped[k]) {
      try { mapped[k] = JSON.parse(mapped[k]); } catch { /* keep as text */ }
    }
  });
  return mapped;
}

router.get('/news', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '10', 10), 100);
    const rows = await allSQL('SELECT * FROM news WHERE published = 1 ORDER BY date DESC, id DESC LIMIT ?', [limit]);
    res.json(rows.map(mapRow));
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/publications', async (req, res) => {
  try {
    const rows = await allSQL('SELECT * FROM publications ORDER BY year DESC, id DESC');
    res.json(rows.map(mapRow));
  } catch (err) {
    console.error('Error fetching publications:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/lectures', async (req, res) => {
  try {
    const rows = await allSQL('SELECT * FROM lectures ORDER BY date DESC, id DESC');
    res.json(rows.map(mapRow));
  } catch (err) {
    console.error('Error fetching lectures:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/graduates', async (req, res) => {
  try {
    const rows = await allSQL('SELECT * FROM graduates ORDER BY cohort DESC, id DESC');
    res.json(rows.map(mapRow));
  } catch (err) {
    console.error('Error fetching graduates:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
