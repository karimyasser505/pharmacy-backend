const express = require('express');
const router = express.Router();
const { getSQL, allSQL, runSQL } = require('../db');

// Get all announcements
router.get('/', async (req, res) => {
    console.log('📢 Fetching all announcements...');
    try {
        const rows = await allSQL(`
      SELECT id, title, type, date, deadline, level, location, duration, field, prize,
             description, details, requirements, benefits, topics, speakers, 
             activities, prizes, criteria, status, created_at, updated_at
      FROM announcements 
      WHERE status = 'active'
      ORDER BY created_at DESC
    `);

        const announcements = rows.map(row => ({
            ...row,
            requirements: row.requirements ? JSON.parse(row.requirements) : null,
            benefits: row.benefits ? JSON.parse(row.benefits) : null,
            topics: row.topics ? JSON.parse(row.topics) : null,
            speakers: row.speakers ? JSON.parse(row.speakers) : null,
            activities: row.activities ? JSON.parse(row.activities) : null,
            prizes: row.prizes ? JSON.parse(row.prizes) : null,
            criteria: row.criteria ? JSON.parse(row.criteria) : null
        }));

        console.log(`✅ Found ${announcements.length} announcements`);
        res.json({ success: true, data: announcements, count: announcements.length });
    } catch (err) {
        console.error('❌ Error fetching announcements:', err.message);
        res.status(500).json({ success: false, message: 'خطأ في جلب الإعلانات', error: err.message });
    }
});

// Get announcement by ID
router.get('/:id', async (req, res) => {
    const announcementId = req.params.id;
    console.log(`📢 Fetching announcement ${announcementId}...`);
    try {
        const row = await getSQL(`
      SELECT id, title, type, date, deadline, level, location, duration, field, prize,
             description, details, requirements, benefits, topics, speakers, 
             activities, prizes, criteria, status, created_at, updated_at
      FROM announcements 
      WHERE id = $1 AND status = 'active'
    `, [announcementId]);

        if (!row) {
            return res.status(404).json({ success: false, message: 'الإعلان غير موجود' });
        }

        const announcement = {
            ...row,
            requirements: row.requirements ? JSON.parse(row.requirements) : null,
            benefits: row.benefits ? JSON.parse(row.benefits) : null,
            topics: row.topics ? JSON.parse(row.topics) : null,
            speakers: row.speakers ? JSON.parse(row.speakers) : null,
            activities: row.activities ? JSON.parse(row.activities) : null,
            prizes: row.prizes ? JSON.parse(row.prizes) : null,
            criteria: row.criteria ? JSON.parse(row.criteria) : null
        };

        console.log(`✅ Announcement ${announcementId} found`);
        res.json({ success: true, data: announcement });
    } catch (err) {
        console.error('❌ Error fetching announcement:', err.message);
        res.status(500).json({ success: false, message: 'خطأ في جلب الإعلان', error: err.message });
    }
});

// Create new announcement
router.post('/', async (req, res) => {
    const {
        title, type, date, deadline, level, location, duration, field, prize,
        description, details, requirements, benefits, topics, speakers,
        activities, prizes, criteria
    } = req.body;

    console.log('➕ Creating new announcement...');

    if (!title || !type || !date || !description || !details) {
        return res.status(400).json({ success: false, message: 'جميع الحقول المطلوبة يجب أن تكون مملوءة' });
    }

    try {
        const result = await runSQL(`
      INSERT INTO announcements (title, type, date, deadline, level, location, duration, field, prize,
                                description, details, requirements, benefits, topics, speakers, 
                                activities, prizes, criteria)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
      RETURNING id
    `, [
            title, type, date, deadline || null, level || null, location || null,
            duration || null, field || null, prize || null, description, details,
            requirements ? JSON.stringify(requirements) : null,
            benefits ? JSON.stringify(benefits) : null,
            topics ? JSON.stringify(topics) : null,
            speakers ? JSON.stringify(speakers) : null,
            activities ? JSON.stringify(activities) : null,
            prizes ? JSON.stringify(prizes) : null,
            criteria ? JSON.stringify(criteria) : null
        ]);

        const newId = result.rows[0].id;
        console.log(`✅ Announcement created with ID: ${newId}`);
        res.status(201).json({ success: true, message: 'تم إنشاء الإعلان بنجاح', data: { id: newId } });
    } catch (err) {
        console.error('❌ Error creating announcement:', err.message);
        res.status(500).json({ success: false, message: 'خطأ في إنشاء الإعلان', error: err.message });
    }
});

// Update announcement
router.put('/:id', async (req, res) => {
    const announcementId = req.params.id;
    const {
        title, type, date, deadline, level, location, duration, field, prize,
        description, details, requirements, benefits, topics, speakers,
        activities, prizes, criteria, status
    } = req.body;

    console.log(`✏️ Updating announcement ${announcementId}...`);

    try {
        const result = await runSQL(`
      UPDATE announcements 
      SET title=$1, type=$2, date=$3, deadline=$4, level=$5, location=$6,
          duration=$7, field=$8, prize=$9, description=$10, details=$11,
          requirements=$12, benefits=$13, topics=$14, speakers=$15,
          activities=$16, prizes=$17, criteria=$18, status=$19, updated_at=CURRENT_TIMESTAMP
      WHERE id=$20
    `, [
            title, type, date, deadline || null, level || null, location || null,
            duration || null, field || null, prize || null, description, details,
            requirements ? JSON.stringify(requirements) : null,
            benefits ? JSON.stringify(benefits) : null,
            topics ? JSON.stringify(topics) : null,
            speakers ? JSON.stringify(speakers) : null,
            activities ? JSON.stringify(activities) : null,
            prizes ? JSON.stringify(prizes) : null,
            criteria ? JSON.stringify(criteria) : null,
            status || 'active', announcementId
        ]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'الإعلان غير موجود' });
        }

        console.log(`✅ Announcement ${announcementId} updated successfully`);
        res.json({ success: true, message: 'تم تحديث الإعلان بنجاح' });
    } catch (err) {
        console.error('❌ Error updating announcement:', err.message);
        res.status(500).json({ success: false, message: 'خطأ في تحديث الإعلان', error: err.message });
    }
});

// Delete announcement
router.delete('/:id', async (req, res) => {
    const announcementId = req.params.id;
    console.log(`🗑️ Deleting announcement ${announcementId}...`);

    try {
        const result = await runSQL('DELETE FROM announcements WHERE id = $1', [announcementId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'الإعلان غير موجود' });
        }

        console.log(`✅ Announcement ${announcementId} deleted successfully`);
        res.json({ success: true, message: 'تم حذف الإعلان بنجاح' });
    } catch (err) {
        console.error('❌ Error deleting announcement:', err.message);
        res.status(500).json({ success: false, message: 'خطأ في حذف الإعلان', error: err.message });
    }
});

// Get all announcements for admin
router.get('/admin/all', async (req, res) => {
    console.log('📢 Fetching all announcements for admin...');
    try {
        const rows = await allSQL(`
      SELECT id, title, type, date, deadline, level, location, duration, field, prize,
             description, details, requirements, benefits, topics, speakers, 
             activities, prizes, criteria, status, created_at, updated_at
      FROM announcements 
      ORDER BY created_at DESC
    `);

        const announcements = rows.map(row => ({
            ...row,
            requirements: row.requirements ? JSON.parse(row.requirements) : null,
            benefits: row.benefits ? JSON.parse(row.benefits) : null,
            topics: row.topics ? JSON.parse(row.topics) : null,
            speakers: row.speakers ? JSON.parse(row.speakers) : null,
            activities: row.activities ? JSON.parse(row.activities) : null,
            prizes: row.prizes ? JSON.parse(row.prizes) : null,
            criteria: row.criteria ? JSON.parse(row.criteria) : null
        }));

        console.log(`✅ Found ${announcements.length} announcements for admin`);
        res.json({ success: true, data: announcements, count: announcements.length });
    } catch (err) {
        console.error('❌ Error fetching announcements for admin:', err.message);
        res.status(500).json({ success: false, message: 'خطأ في جلب الإعلانات', error: err.message });
    }
});

module.exports = router;
