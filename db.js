const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// إنشاء اتصال مع PostgreSQL باستخدام متغيرات Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Helper functions
async function runSQL(sql, params = []) {
  const result = await pool.query(sql, params);
  return { rowCount: result.rowCount, rows: result.rows };
}

async function getSQL(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows[0] || null;
}

async function allSQL(sql, params = []) {
  const result = await pool.query(sql, params);
  return result.rows;
}

// Create tables
const createTables = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  originalname TEXT,
  mimetype TEXT,
  size INTEGER,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,
  date DATE,
  image_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS publications (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  journal TEXT,
  year INTEGER,
  keywords TEXT,
  authors TEXT,
  doi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT,
  start_date DATE,
  location TEXT,
  type TEXT,
  duration TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS graduates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  cohort INTEGER,
  specialty TEXT,
  email TEXT,
  thesis TEXT,
  current_position TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS internships (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  duration TEXT NOT NULL,
  deadline DATE,
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  status TEXT DEFAULT 'active',
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  tags TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS did_you_know (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lectures (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  mode TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  location TEXT NOT NULL,
  instructor TEXT,
  pdf_path TEXT,
  video_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  salary TEXT,
  deadline DATE,
  experience TEXT,
  qualification TEXT,
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  deadline DATE,
  level TEXT,
  location TEXT,
  duration TEXT,
  field TEXT,
  prize TEXT,
  description TEXT NOT NULL,
  details TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  topics TEXT,
  speakers TEXT,
  activities TEXT,
  prizes TEXT,
  criteria TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

async function initDB() {
  try {
    await pool.query(createTables);
    console.log("✅ Tables created successfully");

    const row = await getSQL("SELECT COUNT(*)::int AS count FROM users");
    if (row.count === 0) {
      const hash = bcrypt.hashSync("admin123", 10);
      await runSQL(
        "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
        ["admin", hash]
      );
      console.log('👤 Default admin created: username="admin" password="admin123"');
    }
  } catch (err) {
    console.error("❌ Error initializing DB:", err);
  }
}

// Initialize
initDB();

module.exports = { runSQL, getSQL, allSQL, pool };
