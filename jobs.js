const express = require('express');
const router = express.Router();
const { runSQL, getSQL, allSQL } = require('../db');

// Get all jobs (public)
router.get('/', async (req, res) => {
    try {
        console.log('📋 Fetching all jobs...');
        const query = `
      SELECT id, title, type, salary, deadline, experience, qualification, 
             description, requirements, benefits, status, created_at, updated_at
      FROM jobs 
      WHERE status = 'active'
      ORDER BY created_at DESC
    `;
        const rows = await allSQL(query);

        const jobs = rows.map(row => ({
            ...row,
            requirements: row.requirements ? JSON.parse(row.requirements) : [],
            benefits: row.benefits ? JSON.parse(row.benefits) : []
        }));

        console.log(`✅ Found ${jobs.length} jobs`);
        res.json({ success: true, data: jobs, count: jobs.length });
    } catch (err) {
        console.error('❌ Error fetching jobs:', err.message);
        res.status(500).json({ success: false, message: 'خطأ في جلب الوظائف', error: err.message });
    }
});

// Get job by ID
router.get('/:id', async (req, res) => {
    try {
        const jobId = req.params.id;
        console.log(`📋 Fetching job ${jobId}...`);
        const query = `
      SELECT id, title, type, salary, deadline, experience, qualification, 
             description, requirements, benefits, status, created_at, updated_at
      FROM jobs 
      WHERE id = $1 AND status = 'active'
    `;
        const row = await getSQL(query, [jobId]);

        if (!row) {
            return res.status(404).json({ success: false, message: 'الوظيفة غير موجودة' });
        }

        const job = {
            ...row,
            requirements: row.requirements ? JSON.parse(row.requirements) : [],
            benefits: row.benefits ? JSON.parse(row.benefits) : []
        };

        console.log(`✅ Job ${jobId} found`);
        res.json({ success: true, data: job });
    } catch (err) {
        console.error('❌ Error fetching job:', err.message);
        res.status(500).json({ success: false, message: 'خطأ في جلب الوظيفة', error: err.message });
    }
});

// Create new job (Admin only)
router.post('/', async (req, res) => {
    try {
        const { title, type, salary, deadline, experience, qualification, description, requirements, benefits, status } = req.body;

        console.log('➕ Creating new job...');
        console.log('📋 Job data:', { title, type, salary, deadline, experience, qualification, status });

        if (!title || !type || !salary || !deadline || !experience || !qualification || !description) {
            return res.status(400).json({ success: false, message: 'جميع الحقول المطلوبة يجب أن تكون مملوءة' });
        }

        const query = `
      INSERT INTO jobs (title, type, salary, deadline, experience, qualification, description, requirements, benefits, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `;

        const requirementsJson = JSON.stringify(requirements || []);
        const benefitsJson = JSON.stringify(benefits || []);
        const jobStatus = status || 'active';

        const result = await runSQL(query, [
            title, type, salary, deadline, experience, qualification, description, requirementsJson, benefitsJson, jobStatus
        ]);

        const newId = result.rows[0]?.id;
        console.log(`✅ Job created with ID: ${newId}`);
        res.status(201).json({ success: true, message: 'تم إنشاء الوظيفة بنجاح', data: { id: newId } });
    } catch (err) {
        console.error('❌ Error creating job:', err.message);
        res.status(500).json({ success: false, message: 'خطأ في إنشاء الوظيفة', error: err.message });
    }
});

// Update job (Admin only)
router.put('/:id', async (req, res) => {
    try {
        const jobId = req.params.id;
        const { title, type, salary, deadline, experience, qualification, description, requirements, benefits, status } = req.body;

        console.log(`✏️ Updating job ${jobId}...`);

        const query = `
      UPDATE jobs 
      SET title = $1, type = $2, salary = $3, deadline = $4, experience = $5, 
          qualification = $6, description = $7, requirements = $8, benefits = $9, 
          status = $10, updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING id
    `;

        const requirementsJson = JSON.stringify(requirements || []);
        const benefitsJson = JSON.stringify(benefits || []);
        const jobStatus = status || 'active';

        const result = await runSQL(query, [
            title, type, salary, deadline, experience, qualification, description, requirementsJson, benefitsJson, jobStatus, jobId
        ]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'الوظيفة غير موجودة' });
        }

        console.log(`✅ Job ${jobId} updated successfully`);
        res.json({ success: true, message: 'تم تحديث الوظيفة بنجاح' });
    } catch (err) {
        console.error('❌ Error updating job:', err.message);
        res.status(500).json({ success: false, message: 'خطأ في تحديث الوظيفة', error: err.message });
    }
});

// Delete job (Admin only)
router.delete('/:id', async (req, res) => {
    try {
        const jobId = req.params.id;
        console.log(`🗑️ Deleting job ${jobId}...`);

        const query = 'DELETE FROM jobs WHERE id = $1 RETURNING id';
        const result = await runSQL(query, [jobId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'الوظيفة غير موجودة' });
        }

        console.log(`✅ Job ${jobId} deleted successfully`);
        res.json({ success: true, message: 'تم حذف الوظيفة بنجاح' });
    } catch (err) {
        console.error('❌ Error deleting job:', err.message);
        res.status(500).json({ success: false, message: 'خطأ في حذف الوظيفة', error: err.message });
    }
});

// Get all jobs for admin
router.get('/admin/all', async (req, res) => {
    try {
        console.log('📋 Fetching all jobs for admin...');
        const query = `
      SELECT id, title, type, salary, deadline, experience, qualification, 
             description, requirements, benefits, status, created_at, updated_at
      FROM jobs 
      ORDER BY created_at DESC
    `;
        const rows = await allSQL(query);

        const jobs = rows.map(row => ({
            ...row,
            requirements: row.requirements ? JSON.parse(row.requirements) : [],
            benefits: row.benefits ? JSON.parse(row.benefits) : []
        }));

        console.log(`✅ Found ${jobs.length} jobs for admin`);
        res.json({ success: true, data: jobs, count: jobs.length });
    } catch (err) {
        console.error('❌ Error fetching jobs for admin:', err.message);
        res.status(500).json({ success: false, message: 'خطأ في جلب الوظائف', error: err.message });
    }
});

module.exports = router;
