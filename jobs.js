const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Get all jobs
router.get('/', (req, res) => {
    console.log('📋 Fetching all jobs...');
    
    const query = `
        SELECT id, title, type, salary, deadline, experience, qualification, 
               description, requirements, benefits, status, created_at, updated_at
        FROM jobs 
        WHERE status = 'active'
        ORDER BY created_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('❌ Error fetching jobs:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'خطأ في جلب الوظائف',
                error: err.message 
            });
        }
        
        // Parse JSON fields
        const jobs = rows.map(row => ({
            ...row,
            requirements: JSON.parse(row.requirements),
            benefits: JSON.parse(row.benefits)
        }));
        
        console.log(`✅ Found ${jobs.length} jobs`);
        res.json({ 
            success: true, 
            data: jobs,
            count: jobs.length
        });
    });
});

// Get job by ID
router.get('/:id', (req, res) => {
    const jobId = req.params.id;
    console.log(`📋 Fetching job ${jobId}...`);
    
    const query = `
        SELECT id, title, type, salary, deadline, experience, qualification, 
               description, requirements, benefits, status, created_at, updated_at
        FROM jobs 
        WHERE id = ? AND status = 'active'
    `;
    
    db.get(query, [jobId], (err, row) => {
        if (err) {
            console.error('❌ Error fetching job:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'خطأ في جلب الوظيفة',
                error: err.message 
            });
        }
        
        if (!row) {
            return res.status(404).json({ 
                success: false, 
                message: 'الوظيفة غير موجودة' 
            });
        }
        
        // Parse JSON fields
        const job = {
            ...row,
            requirements: JSON.parse(row.requirements),
            benefits: JSON.parse(row.benefits)
        };
        
        console.log(`✅ Job ${jobId} found`);
        res.json({ 
            success: true, 
            data: job
        });
    });
});

// Create new job (Admin only)
router.post('/', (req, res) => {
    const { title, type, salary, deadline, experience, qualification, description, requirements, benefits, status } = req.body;
    
    console.log('➕ Creating new job...');
    console.log('📋 Job data:', { title, type, salary, deadline, experience, qualification, status });
    
    // Validate required fields
    if (!title || !type || !salary || !deadline || !experience || !qualification || !description) {
        return res.status(400).json({
            success: false,
            message: 'جميع الحقول المطلوبة يجب أن تكون مملوءة'
        });
    }
    
    const query = `
        INSERT INTO jobs (title, type, salary, deadline, experience, qualification, description, requirements, benefits, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const requirementsJson = JSON.stringify(requirements || []);
    const benefitsJson = JSON.stringify(benefits || []);
    const jobStatus = status || 'active';
    
    db.run(query, [title, type, salary, deadline, experience, qualification, description, requirementsJson, benefitsJson, jobStatus], function(err) {
        if (err) {
            console.error('❌ Error creating job:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'خطأ في إنشاء الوظيفة',
                error: err.message 
            });
        }
        
        console.log(`✅ Job created with ID: ${this.lastID}`);
        res.status(201).json({ 
            success: true, 
            message: 'تم إنشاء الوظيفة بنجاح',
            data: { id: this.lastID }
        });
    });
});

// Update job (Admin only)
router.put('/:id', (req, res) => {
    const jobId = req.params.id;
    const { title, type, salary, deadline, experience, qualification, description, requirements, benefits, status } = req.body;
    
    console.log(`✏️ Updating job ${jobId}...`);
    
    const query = `
        UPDATE jobs 
        SET title = ?, type = ?, salary = ?, deadline = ?, experience = ?, 
            qualification = ?, description = ?, requirements = ?, benefits = ?, 
            status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    
    const requirementsJson = JSON.stringify(requirements || []);
    const benefitsJson = JSON.stringify(benefits || []);
    
    db.run(query, [title, type, salary, deadline, experience, qualification, description, requirementsJson, benefitsJson, status || 'active', jobId], function(err) {
        if (err) {
            console.error('❌ Error updating job:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'خطأ في تحديث الوظيفة',
                error: err.message 
            });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'الوظيفة غير موجودة' 
            });
        }
        
        console.log(`✅ Job ${jobId} updated successfully`);
        res.json({ 
            success: true, 
            message: 'تم تحديث الوظيفة بنجاح'
        });
    });
});

// Delete job (Admin only)
router.delete('/:id', (req, res) => {
    const jobId = req.params.id;
    console.log(`🗑️ Deleting job ${jobId}...`);
    
    const query = 'DELETE FROM jobs WHERE id = ?';
    
    db.run(query, [jobId], function(err) {
        if (err) {
            console.error('❌ Error deleting job:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'خطأ في حذف الوظيفة',
                error: err.message 
            });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'الوظيفة غير موجودة' 
            });
        }
        
        console.log(`✅ Job ${jobId} deleted successfully`);
        res.json({ 
            success: true, 
            message: 'تم حذف الوظيفة بنجاح'
        });
    });
});

// Get all jobs for admin (including inactive)
router.get('/admin/all', (req, res) => {
    console.log('📋 Fetching all jobs for admin...');
    
    const query = `
        SELECT id, title, type, salary, deadline, experience, qualification, 
               description, requirements, benefits, status, created_at, updated_at
        FROM jobs 
        ORDER BY created_at DESC
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('❌ Error fetching jobs for admin:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'خطأ في جلب الوظائف',
                error: err.message 
            });
        }
        
        // Parse JSON fields
        const jobs = rows.map(row => ({
            ...row,
            requirements: JSON.parse(row.requirements),
            benefits: JSON.parse(row.benefits)
        }));
        
        console.log(`✅ Found ${jobs.length} jobs for admin`);
        res.json({ 
            success: true, 
            data: jobs,
            count: jobs.length
        });
    });
});

module.exports = router;
