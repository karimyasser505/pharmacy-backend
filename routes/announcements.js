const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, '..', '..', 'data', 'app.db');
const db = new sqlite3.Database(dbPath);

// Get all announcements
router.get('/', (req, res) => {
    console.log('📢 Fetching all announcements...');
    
    const query = `
        SELECT id, title, type, date, deadline, level, location, duration, field, prize,
               description, details, requirements, benefits, topics, speakers, 
               activities, prizes, criteria, status, created_at, updated_at
        FROM announcements 
        WHERE status = 'active'
        ORDER BY created_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('❌ Error fetching announcements:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'خطأ في جلب الإعلانات',
                error: err.message 
            });
        }
        
        // Parse JSON fields
        const announcements = rows.map(row => {
            const announcement = { ...row };
            
            // Parse JSON fields if they exist
            if (row.requirements) announcement.requirements = JSON.parse(row.requirements);
            if (row.benefits) announcement.benefits = JSON.parse(row.benefits);
            if (row.topics) announcement.topics = JSON.parse(row.topics);
            if (row.speakers) announcement.speakers = JSON.parse(row.speakers);
            if (row.activities) announcement.activities = JSON.parse(row.activities);
            if (row.prizes) announcement.prizes = JSON.parse(row.prizes);
            if (row.criteria) announcement.criteria = JSON.parse(row.criteria);
            
            return announcement;
        });
        
        console.log(`✅ Found ${announcements.length} announcements`);
        res.json({ 
            success: true, 
            data: announcements,
            count: announcements.length
        });
    });
});

// Get announcement by ID
router.get('/:id', (req, res) => {
    const announcementId = req.params.id;
    console.log(`📢 Fetching announcement ${announcementId}...`);
    
    const query = `
        SELECT id, title, type, date, deadline, level, location, duration, field, prize,
               description, details, requirements, benefits, topics, speakers, 
               activities, prizes, criteria, status, created_at, updated_at
        FROM announcements 
        WHERE id = ? AND status = 'active'
    `;
    
    db.get(query, [announcementId], (err, row) => {
        if (err) {
            console.error('❌ Error fetching announcement:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'خطأ في جلب الإعلان',
                error: err.message 
            });
        }
        
        if (!row) {
            return res.status(404).json({ 
                success: false, 
                message: 'الإعلان غير موجود' 
            });
        }
        
        // Parse JSON fields
        const announcement = { ...row };
        
        if (row.requirements) announcement.requirements = JSON.parse(row.requirements);
        if (row.benefits) announcement.benefits = JSON.parse(row.benefits);
        if (row.topics) announcement.topics = JSON.parse(row.topics);
        if (row.speakers) announcement.speakers = JSON.parse(row.speakers);
        if (row.activities) announcement.activities = JSON.parse(row.activities);
        if (row.prizes) announcement.prizes = JSON.parse(row.prizes);
        if (row.criteria) announcement.criteria = JSON.parse(row.criteria);
        
        console.log(`✅ Announcement ${announcementId} found`);
        res.json({ 
            success: true, 
            data: announcement
        });
    });
});

// Create new announcement (Admin only)
router.post('/', (req, res) => {
    const { 
        title, type, date, deadline, level, location, duration, field, prize,
        description, details, requirements, benefits, topics, speakers, 
        activities, prizes, criteria 
    } = req.body;
    
    console.log('➕ Creating new announcement...');
    
    // Validate required fields
    if (!title || !type || !date || !description || !details) {
        return res.status(400).json({
            success: false,
            message: 'جميع الحقول المطلوبة يجب أن تكون مملوءة'
        });
    }
    
    const query = `
        INSERT INTO announcements (title, type, date, deadline, level, location, duration, field, prize,
                                 description, details, requirements, benefits, topics, speakers, 
                                 activities, prizes, criteria)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Convert arrays to JSON strings
    const requirementsJson = requirements ? JSON.stringify(requirements) : null;
    const benefitsJson = benefits ? JSON.stringify(benefits) : null;
    const topicsJson = topics ? JSON.stringify(topics) : null;
    const speakersJson = speakers ? JSON.stringify(speakers) : null;
    const activitiesJson = activities ? JSON.stringify(activities) : null;
    const prizesJson = prizes ? JSON.stringify(prizes) : null;
    const criteriaJson = criteria ? JSON.stringify(criteria) : null;
    
    db.run(query, [
        title, type, date, deadline || null, level || null, location || null, 
        duration || null, field || null, prize || null, description, details,
        requirementsJson, benefitsJson, topicsJson, speakersJson, 
        activitiesJson, prizesJson, criteriaJson
    ], function(err) {
        if (err) {
            console.error('❌ Error creating announcement:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'خطأ في إنشاء الإعلان',
                error: err.message 
            });
        }
        
        console.log(`✅ Announcement created with ID: ${this.lastID}`);
        res.status(201).json({ 
            success: true, 
            message: 'تم إنشاء الإعلان بنجاح',
            data: { id: this.lastID }
        });
    });
});

// Update announcement (Admin only)
router.put('/:id', (req, res) => {
    const announcementId = req.params.id;
    const { 
        title, type, date, deadline, level, location, duration, field, prize,
        description, details, requirements, benefits, topics, speakers, 
        activities, prizes, criteria, status 
    } = req.body;
    
    console.log(`✏️ Updating announcement ${announcementId}...`);
    
    const query = `
        UPDATE announcements 
        SET title = ?, type = ?, date = ?, deadline = ?, level = ?, location = ?, 
            duration = ?, field = ?, prize = ?, description = ?, details = ?, 
            requirements = ?, benefits = ?, topics = ?, speakers = ?, 
            activities = ?, prizes = ?, criteria = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    
    // Convert arrays to JSON strings
    const requirementsJson = requirements ? JSON.stringify(requirements) : null;
    const benefitsJson = benefits ? JSON.stringify(benefits) : null;
    const topicsJson = topics ? JSON.stringify(topics) : null;
    const speakersJson = speakers ? JSON.stringify(speakers) : null;
    const activitiesJson = activities ? JSON.stringify(activities) : null;
    const prizesJson = prizes ? JSON.stringify(prizes) : null;
    const criteriaJson = criteria ? JSON.stringify(criteria) : null;
    
    db.run(query, [
        title, type, date, deadline || null, level || null, location || null, 
        duration || null, field || null, prize || null, description, details,
        requirementsJson, benefitsJson, topicsJson, speakersJson, 
        activitiesJson, prizesJson, criteriaJson, status || 'active', announcementId
    ], function(err) {
        if (err) {
            console.error('❌ Error updating announcement:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'خطأ في تحديث الإعلان',
                error: err.message 
            });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'الإعلان غير موجود' 
            });
        }
        
        console.log(`✅ Announcement ${announcementId} updated successfully`);
        res.json({ 
            success: true, 
            message: 'تم تحديث الإعلان بنجاح'
        });
    });
});

// Delete announcement (Admin only)
router.delete('/:id', (req, res) => {
    const announcementId = req.params.id;
    console.log(`🗑️ Deleting announcement ${announcementId}...`);
    
    const query = 'DELETE FROM announcements WHERE id = ?';
    
    db.run(query, [announcementId], function(err) {
        if (err) {
            console.error('❌ Error deleting announcement:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'خطأ في حذف الإعلان',
                error: err.message 
            });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'الإعلان غير موجود' 
            });
        }
        
        console.log(`✅ Announcement ${announcementId} deleted successfully`);
        res.json({ 
            success: true, 
            message: 'تم حذف الإعلان بنجاح'
        });
    });
});

// Get all announcements for admin (including inactive)
router.get('/admin/all', (req, res) => {
    console.log('📢 Fetching all announcements for admin...');
    
    const query = `
        SELECT id, title, type, date, deadline, level, location, duration, field, prize,
               description, details, requirements, benefits, topics, speakers, 
               activities, prizes, criteria, status, created_at, updated_at
        FROM announcements 
        ORDER BY created_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('❌ Error fetching announcements for admin:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'خطأ في جلب الإعلانات',
                error: err.message 
            });
        }
        
        // Parse JSON fields
        const announcements = rows.map(row => {
            const announcement = { ...row };
            
            // Parse JSON fields if they exist
            if (row.requirements) announcement.requirements = JSON.parse(row.requirements);
            if (row.benefits) announcement.benefits = JSON.parse(row.benefits);
            if (row.topics) announcement.topics = JSON.parse(row.topics);
            if (row.speakers) announcement.speakers = JSON.parse(row.speakers);
            if (row.activities) announcement.activities = JSON.parse(row.activities);
            if (row.prizes) announcement.prizes = JSON.parse(row.prizes);
            if (row.criteria) announcement.criteria = JSON.parse(row.criteria);
            
            return announcement;
        });
        
        console.log(`✅ Found ${announcements.length} announcements for admin`);
        res.json({ 
            success: true, 
            data: announcements,
            count: announcements.length
        });
    });
});

module.exports = router;