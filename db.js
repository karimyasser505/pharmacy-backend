const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbFile = path.join(dataDir, 'app.db');
const db = new sqlite3.Database(dbFile);

// Enable WAL mode for better performance
db.run('PRAGMA journal_mode = WAL');

// Create tables
const createTables = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  originalname TEXT,
  mimetype TEXT,
  size INTEGER,
  url TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,
  date TEXT,
  image_url TEXT,
  published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS publications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  journal TEXT,
  year INTEGER,
  keywords TEXT,
  authors TEXT,
  doi TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT,
  start_date TEXT,
  location TEXT,
  type TEXT,
  duration TEXT,
  image_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS graduates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  cohort INTEGER,
  specialty TEXT,
  email TEXT,
  thesis TEXT,
  current_position TEXT,
  avatar_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS internships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  duration TEXT NOT NULL,
  deadline TEXT,
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  status TEXT DEFAULT 'active',
  image_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  tags TEXT,
  views INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS did_you_know (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lectures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  mode TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  location TEXT NOT NULL,
  instructor TEXT,
  pdf_path TEXT,
  video_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  type TEXT,
  salary TEXT,
  deadline TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  date TEXT,
  image_url TEXT,
  published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
`;

// Helper function to run SQL with promises
function runSQL(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function getSQL(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function allSQL(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Create tables
db.serialize(() => {
  db.exec(createTables, (err) => {
    if (err) {
      console.error('Error creating tables:', err);
    } else {
      console.log('Database tables created successfully');
      seedAdmin();
    }
  });
});

async function seedAdmin() {
  try {
    const row = await getSQL('SELECT COUNT(*) as c FROM users');
    if (row.c === 0) {
      const hash = bcrypt.hashSync('admin123', 10);
      await runSQL('INSERT INTO users (username, password_hash) VALUES (?, ?)', ['admin', hash]);
      console.log('Seeded default admin user: username="admin" password="admin123" (please change it)');
    }

    // Seed sample internships
    const internshipCount = await getSQL('SELECT COUNT(*) as c FROM internships');
    if (internshipCount.c === 0) {
      const sampleInternships = [
        {
          title: 'تدريب صيدلة إكلينيكية',
          type: 'صيدلة إكلينيكية',
          duration: '3 أشهر',
          deadline: '2025-03-15',
          description: 'تدريب متخصص في الصيدلة الإكلينيكية في المستشفيات مع فرصة للعمل مع فريق طبي متخصص',
          requirements: 'خريج صيدلة، معرفة باللغة الإنجليزية، خبرة في العمل مع المرضى',
          benefits: 'راتب شهري، تأمين صحي، شهادة تدريب معتمدة',
          status: 'active'
        },
        {
          title: 'تدريب صيدلة صناعية',
          type: 'صيدلة صناعية',
          duration: '6 أشهر',
          deadline: '2025-04-01',
          description: 'تدريب في مجال تصنيع الأدوية ومراقبة الجودة في شركة أدوية رائدة',
          requirements: 'خريج صيدلة، معرفة بمعايير الجودة، خبرة في المختبرات',
          benefits: 'راتب شهري، تأمين صحي، فرصة للتوظيف الدائم',
          status: 'active'
        }
      ];

      for (const internship of sampleInternships) {
        await runSQL(`
          INSERT INTO internships (title, type, duration, deadline, description, requirements, benefits, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          internship.title, internship.type, internship.duration, internship.deadline,
          internship.description, internship.requirements, internship.benefits, internship.status
        ]);
      }

      console.log('Sample internships created');
    }

    // Seed sample lectures
    const lectureCount = await getSQL('SELECT COUNT(*) as c FROM lectures');
    if (lectureCount.c === 0) {
      const sampleLectures = [
        {
          title: 'محاضرة في الصيدلة الإكلينيكية',
          description: 'محاضرة تفاعلية حول أساسيات الصيدلة الإكلينيكية وتطبيقاتها العملية في المستشفيات',
          type: 'محاضرة تخصصية',
          mode: 'أونلاين',
          date: '2025-01-15',
          time: '10:00',
          location: 'رابط Zoom: https://zoom.us/j/123456789',
          instructor: 'د. أحمد محمد'
        }
      ];

      for (const lecture of sampleLectures) {
        await runSQL(`
          INSERT INTO lectures (title, description, type, mode, date, time, location, instructor)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          lecture.title, lecture.description, lecture.type, lecture.mode,
          lecture.date, lecture.time, lecture.location, lecture.instructor
        ]);
      }

      console.log('Sample lectures created');
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

// Export both the db instance and helper functions
module.exports = { db, runSQL, getSQL, allSQL };
