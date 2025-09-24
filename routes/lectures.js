const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const db = require('../db'); // استدعاء db.js الجديد اللي بيشتغل مع PostgreSQL

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/lectures');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'lecture-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'pdf' && file.mimetype === 'application/pdf') {
            cb(null, true);
        } else if (file.fieldname !== 'pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed for lecture materials'), false);
        }
    }
});

// Get all lectures
router.get('/', async (req, res) => {
    try {
        const query = `
      SELECT id, title, description, type, mode, date, time, location, instructor,
             pdf_path, video_url, created_at, updated_at
      FROM lectures
      ORDER BY date DESC, created_at DESC
    `;
        const rows = await db.allSQL(query);

        const lectures = rows.map(lecture => ({
            ...lecture,
            pdf_url: lecture.pdf_path ? `/uploads/lectures/${path.basename(lecture.pdf_path)}` : null
        }));

        res.json(lectures);
    } catch (err) {
        console.error('Error fetching lectures:', err);
        res.status(500).json({ error: 'Failed to fetch lectures' });
    }
});

// Get public lectures
router.get('/public', async (req, res) => {
    try {
        const query = `
      SELECT id, title, description, type, mode, date, time, location, instructor,
             pdf_path, video_url, created_at
      FROM lectures
      ORDER BY date ASC, time ASC
    `;
        const rows = await db.allSQL(query);

        const lectures = rows.map(lecture => ({
            ...lecture,
            pdf_url: lecture.pdf_path ? `/uploads/lectures/${path.basename(lecture.pdf_path)}` : null
        }));

        res.json(lectures);
    } catch (err) {
        console.error('Error fetching public lectures:', err);
        res.status(500).json({ error: 'Failed to fetch lectures' });
    }
});

// Get single lecture
router.get('/:id', async (req, res) => {
    try {
        const query = `
      SELECT id, title, description, type, mode, date, time, location, instructor,
             pdf_path, video_url, created_at, updated_at
      FROM lectures
      WHERE id = $1
    `;
        const lecture = await db.getSQL(query, [req.params.id]);

        if (!lecture) return res.status(404).json({ error: 'Lecture not found' });

        lecture.pdf_url = lecture.pdf_path ? `/uploads/lectures/${path.basename(lecture.pdf_path)}` : null;

        res.json(lecture);
    } catch (err) {
        console.error('Error fetching lecture:', err);
        res.status(500).json({ error: 'Failed to fetch lecture' });
    }
});

// Create new lecture
router.post('/', upload.single('pdf'), async (req, res) => {
    const { title, description, type, mode, date, time, location, instructor, video_url } = req.body;
    if (!title || !description || !type || !mode || !date || !location) {
        return res.status(400).json({ error: 'Missing required fields: title, description, type, mode, date, location' });
    }

    const pdfPath = req.file ? req.file.path : null;

    try {
        const query = `
      INSERT INTO lectures (title, description, type, mode, date, time, location, instructor,
                            pdf_path, video_url, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
      RETURNING id
    `;
        const result = await db.runSQL(query, [
            title, description, type, mode, date, time, location, instructor, pdfPath, video_url
        ]);

        res.status(201).json({ id: result.rows[0].id, message: 'Lecture created successfully' });
    } catch (err) {
        console.error('Error creating lecture:', err);
        if (pdfPath && fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
        res.status(500).json({ error: 'Failed to create lecture' });
    }
});

// Update lecture
router.put('/:id', upload.single('pdf'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, type, mode, date, time, location, instructor, video_url } = req.body;

        const currentLecture = await db.getSQL('SELECT pdf_path FROM lectures WHERE id = $1', [id]);
        if (!currentLecture) return res.status(404).json({ error: 'Lecture not found' });

        let pdfPath = currentLecture.pdf_path;
        if (req.file) {
            if (pdfPath && fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
            pdfPath = req.file.path;
        }

        const updateQuery = `
      UPDATE lectures
      SET title=$1, description=$2, type=$3, mode=$4, date=$5, time=$6,
          location=$7, instructor=$8, pdf_path=$9, video_url=$10, updated_at=CURRENT_TIMESTAMP
      WHERE id=$11
    `;
        await db.runSQL(updateQuery, [
            title, description, type, mode, date, time, location, instructor, pdfPath, video_url, id
        ]);

        res.json({ message: 'Lecture updated successfully' });
    } catch (err) {
        console.error('Error updating lecture:', err);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Failed to update lecture' });
    }
});

// Delete lecture
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const lecture = await db.getSQL('SELECT pdf_path FROM lectures WHERE id=$1', [id]);
        if (!lecture) return res.status(404).json({ error: 'Lecture not found' });

        await db.runSQL('DELETE FROM lectures WHERE id=$1', [id]);

        if (lecture.pdf_path && fs.existsSync(lecture.pdf_path)) fs.unlinkSync(lecture.pdf_path);

        res.json({ message: 'Lecture deleted successfully' });
    } catch (err) {
        console.error('Error deleting lecture:', err);
        res.status(500).json({ error: 'Failed to delete lecture' });
    }
});

// Serve uploaded files
router.use('/uploads', express.static(path.join(__dirname, '../uploads/lectures')));

module.exports = router;
