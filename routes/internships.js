const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all internships (public)
router.get('/public', async (req, res) => {
    try {
        const internships = await db.allSQL(`
            SELECT * FROM internships 
            WHERE status = 'active' 
            ORDER BY created_at DESC
        `);
        
        res.json(internships);
    } catch (error) {
        console.error('Error fetching internships:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all internships (admin)
router.get('/admin/all', async (req, res) => {
    try {
        const internships = await db.allSQL(`
            SELECT * FROM internships 
            ORDER BY created_at DESC
        `);
        
        res.json({ success: true, data: internships });
    } catch (error) {
        console.error('Error fetching internships:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Get single internship
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const internship = await db.getSQL('SELECT * FROM internships WHERE id = ?', [id]);
        
        if (!internship) {
            return res.status(404).json({ success: false, message: 'Internship not found' });
        }
        
        res.json({ success: true, data: internship });
    } catch (error) {
        console.error('Error fetching internship:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Create internship
router.post('/', async (req, res) => {
    try {
        const { title, type, duration, deadline, description, requirements, benefits, status } = req.body;
        
        console.log('➕ Creating new internship...');
        console.log('🎓 Internship data:', { title, type, duration, deadline, status });
        
        // Validation
        if (!title || !type || !duration || !description) {
            return res.status(400).json({ 
                success: false, 
                message: 'Title, type, duration, and description are required' 
            });
        }
        
        const query = `
            INSERT INTO internships (title, type, duration, deadline, description, requirements, benefits, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const internshipStatus = status || 'active';
        
        const result = await db.runSQL(query, [
            title, type, duration, deadline || null, description, 
            requirements || null, benefits || null, internshipStatus
        ]);
        
        console.log('✅ Internship created with ID:', result.lastID);
        
        res.status(201).json({ 
            success: true, 
            message: 'Internship created successfully',
            data: { id: result.lastID }
        });
        
    } catch (error) {
        console.error('Error creating internship:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update internship
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, duration, deadline, description, requirements, benefits, status } = req.body;
        
        console.log('📝 Updating internship:', id);
        console.log('🎓 Update data:', { title, type, duration, deadline, status });
        
        // Validation
        if (!title || !type || !duration || !description) {
            return res.status(400).json({ 
                success: false, 
                message: 'Title, type, duration, and description are required' 
            });
        }
        
        const query = `
            UPDATE internships 
            SET title = ?, type = ?, duration = ?, deadline = ?, description = ?, 
                requirements = ?, benefits = ?, status = ?, updated_at = datetime('now')
            WHERE id = ?
        `;
        
        const result = await db.runSQL(query, [
            title, type, duration, deadline || null, description,
            requirements || null, benefits || null, status || 'active', id
        ]);
        
        if (result.changes === 0) {
            return res.status(404).json({ success: false, message: 'Internship not found' });
        }
        
        console.log('✅ Internship updated successfully');
        
        res.json({ success: true, message: 'Internship updated successfully' });
        
    } catch (error) {
        console.error('Error updating internship:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Delete internship
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('🗑️ Deleting internship:', id);
        
        const result = await db.runSQL('DELETE FROM internships WHERE id = ?', [id]);
        
        if (result.changes === 0) {
            return res.status(404).json({ success: false, message: 'Internship not found' });
        }
        
        console.log('✅ Internship deleted successfully');
        
        res.json({ success: true, message: 'Internship deleted successfully' });
        
    } catch (error) {
        console.error('Error deleting internship:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
