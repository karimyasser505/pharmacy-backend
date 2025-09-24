const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

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
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'lecture-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'pdf' && file.mimetype === 'application/pdf') {
            cb(null, true);
        } else if (file.fieldname !== 'pdf') {
            cb(null, true); // Allow other fields
        } else {
            cb(new Error('Only PDF files are allowed for lecture materials'), false);
        }
    }
});

// Get all lectures
router.get('/', (req, res) => {
    const db = req.app.get('db');
    
    const query = `
        SELECT 
            id,
            title,
            description,
            type,
            mode,
            date,
            time,
            location,
            instructor,
            pdf_path,
            video_url,
            created_at,
            updated_at
        FROM lectures 
        ORDER BY date DESC, created_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching lectures:', err);
            return res.status(500).json({ error: 'Failed to fetch lectures' });
        }
        
        // Convert file paths to URLs
        const lectures = rows.map(lecture => ({
            ...lecture,
            pdf_url: lecture.pdf_path ? `/uploads/lectures/${path.basename(lecture.pdf_path)}` : null
        }));
        
        res.json(lectures);
    });
});

// Get public lectures (for frontend)
router.get('/public', (req, res) => {
    const db = req.app.get('db');
    
    const query = `
        SELECT 
            id,
            title,
            description,
            type,
            mode,
            date,
            time,
            location,
            instructor,
            pdf_path,
            video_url,
            created_at
        FROM lectures 
        WHERE 1=1
        ORDER BY date ASC, time ASC
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching public lectures:', err);
            return res.status(500).json({ error: 'Failed to fetch lectures' });
        }
        
        // Convert file paths to URLs
        const lectures = rows.map(lecture => ({
            ...lecture,
            pdf_url: lecture.pdf_path ? `/uploads/lectures/${path.basename(lecture.pdf_path)}` : null
        }));
        
        res.json(lectures);
    });
});

// Get single lecture
router.get('/:id', (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    
    const query = `
        SELECT 
            id,
            title,
            description,
            type,
            mode,
            date,
            time,
            location,
            instructor,
            pdf_path,
            video_url,
            created_at,
            updated_at
        FROM lectures 
        WHERE id = ?
    `;
    
    db.get(query, [id], (err, row) => {
        if (err) {
            console.error('Error fetching lecture:', err);
            return res.status(500).json({ error: 'Failed to fetch lecture' });
        }
        
        if (!row) {
            return res.status(404).json({ error: 'Lecture not found' });
        }
        
        // Convert file path to URL
        const lecture = {
            ...row,
            pdf_url: row.pdf_path ? `/uploads/lectures/${path.basename(row.pdf_path)}` : null
        };
        
        res.json(lecture);
    });
});

// Create new lecture
router.post('/', upload.single('pdf'), (req, res) => {
    const db = req.app.get('db');
    const {
        title,
        description,
        type,
        mode,
        date,
        time,
        location,
        instructor,
        video_url
    } = req.body;
    
    // Validate required fields
    if (!title || !description || !type || !mode || !date || !location) {
        return res.status(400).json({ 
            error: 'Missing required fields: title, description, type, mode, date, location' 
        });
    }
    
    const pdfPath = req.file ? req.file.path : null;
    
    const query = `
        INSERT INTO lectures (
            title, description, type, mode, date, time, 
            location, instructor, pdf_path, video_url, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;
    
    const values = [
        title, description, type, mode, date, time,
        location, instructor, pdfPath, video_url
    ];
    
    db.run(query, values, function(err) {
        if (err) {
            console.error('Error creating lecture:', err);
            // Clean up uploaded file if database insert fails
            if (pdfPath && fs.existsSync(pdfPath)) {
                fs.unlinkSync(pdfPath);
            }
            return res.status(500).json({ error: 'Failed to create lecture' });
        }
        
        res.status(201).json({ 
            id: this.lastID,
            message: 'Lecture created successfully' 
        });
    });
});

// Update lecture
router.put('/:id', upload.single('pdf'), (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    const {
        title,
        description,
        type,
        mode,
        date,
        time,
        location,
        instructor,
        video_url
    } = req.body;
    
    // First, get the current lecture to check for existing PDF
    const getQuery = 'SELECT pdf_path FROM lectures WHERE id = ?';
    db.get(getQuery, [id], (err, currentLecture) => {
        if (err) {
            console.error('Error fetching current lecture:', err);
            return res.status(500).json({ error: 'Failed to fetch lecture' });
        }
        
        if (!currentLecture) {
            return res.status(404).json({ error: 'Lecture not found' });
        }
        
        let pdfPath = currentLecture.pdf_path;
        
        // If new PDF is uploaded, update the path and delete old file
        if (req.file) {
            // Delete old PDF if it exists
            if (pdfPath && fs.existsSync(pdfPath)) {
                fs.unlinkSync(pdfPath);
            }
            pdfPath = req.file.path;
        }
        
        const updateQuery = `
            UPDATE lectures SET 
                title = ?, description = ?, type = ?, mode = ?, 
                date = ?, time = ?, location = ?, instructor = ?, 
                pdf_path = ?, video_url = ?, updated_at = datetime('now')
            WHERE id = ?
        `;
        
        const values = [
            title, description, type, mode, date, time,
            location, instructor, pdfPath, video_url, id
        ];
        
        db.run(updateQuery, values, function(err) {
            if (err) {
                console.error('Error updating lecture:', err);
                // Clean up new uploaded file if database update fails
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(500).json({ error: 'Failed to update lecture' });
            }
            
            res.json({ message: 'Lecture updated successfully' });
        });
    });
});

// Delete lecture
router.delete('/:id', (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    
    // First, get the lecture to find PDF path
    const getQuery = 'SELECT pdf_path FROM lectures WHERE id = ?';
    db.get(getQuery, [id], (err, lecture) => {
        if (err) {
            console.error('Error fetching lecture:', err);
            return res.status(500).json({ error: 'Failed to fetch lecture' });
        }
        
        if (!lecture) {
            return res.status(404).json({ error: 'Lecture not found' });
        }
        
        // Delete the lecture from database
        const deleteQuery = 'DELETE FROM lectures WHERE id = ?';
        db.run(deleteQuery, [id], function(err) {
            if (err) {
                console.error('Error deleting lecture:', err);
                return res.status(500).json({ error: 'Failed to delete lecture' });
            }
            
            // Delete PDF file if it exists
            if (lecture.pdf_path && fs.existsSync(lecture.pdf_path)) {
                fs.unlinkSync(lecture.pdf_path);
            }
            
            res.json({ message: 'Lecture deleted successfully' });
        });
    });
});

// Serve uploaded files
router.use('/uploads', express.static(path.join(__dirname, '../uploads/lectures')));

module.exports = router;
