const express = require('express');
const router = express.Router();
const { allSQL, getSQL, runSQL } = require('../db');

// Get all did you know (public)
router.get('/', async (req, res) => {
    try {
        console.log('📚 Fetching all did you know...');
        const query = `
            SELECT id, title, content, category, image_url, status, created_at, updated_at
            FROM did_you_know 
            WHERE status = 'active'
            ORDER BY created_at DESC
        `;
        
        const didYouKnow = await allSQL(query);
        
        console.log(`✅ Found ${didYouKnow.length} did you know items`);
        res.json({ 
            success: true, 
            data: didYouKnow,
            count: didYouKnow.length
        });
        
    } catch (error) {
        console.error('❌ Error fetching did you know:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'خطأ في جلب المعلومات',
            error: error.message 
        });
    }
});

// Get single did you know
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📚 Fetching did you know with ID: ${id}`);
        
        const didYouKnow = await getSQL('SELECT * FROM did_you_know WHERE id = ?', [id]);
        
        if (!didYouKnow) {
            return res.status(404).json({ 
                success: false, 
                message: 'المعلومة غير موجودة' 
            });
        }
        
        console.log('✅ Did you know found:', didYouKnow.title);
        res.json({ 
            success: true, 
            data: didYouKnow 
        });
        
    } catch (error) {
        console.error('❌ Error fetching did you know:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'خطأ في جلب المعلومة',
            error: error.message 
        });
    }
});

// Create new did you know
router.post('/', async (req, res) => {
    const { title, content, category, image_url, status } = req.body;
    
    console.log('➕ Creating new did you know...');
    console.log('📚 Did you know data:', { title, category, status });
    
    // Validation
    if (!title || !content || !category) {
        return res.status(400).json({
            success: false,
            message: 'العنوان والمحتوى والفئة مطلوبة'
        });
    }
    
    try {
        const query = `
            INSERT INTO did_you_know (title, content, category, image_url, status)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const didYouKnowStatus = status || 'active';
        
        const result = await runSQL(query, [
            title, content, category, image_url || null, didYouKnowStatus
        ]);
        
        console.log(`✅ Did you know created with ID: ${result.lastID}`);
        
        res.status(201).json({ 
            success: true, 
            message: 'تم إنشاء المعلومة بنجاح',
            data: { id: result.lastID }
        });
        
    } catch (error) {
        console.error('❌ Error creating did you know:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'خطأ في إنشاء المعلومة',
            error: error.message 
        });
    }
});

// Update did you know
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, category, image_url, status } = req.body;
    
    console.log(`✏️ Updating did you know with ID: ${id}`);
    
    try {
        const query = `
            UPDATE did_you_know 
            SET title = ?, content = ?, category = ?, image_url = ?, status = ?, updated_at = datetime('now')
            WHERE id = ?
        `;
        
        const result = await runSQL(query, [
            title, content, category, image_url || null, status, id
        ]);
        
        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'المعلومة غير موجودة'
            });
        }
        
        console.log('✅ Did you know updated successfully');
        
        res.json({ 
            success: true, 
            message: 'تم تحديث المعلومة بنجاح' 
        });
        
    } catch (error) {
        console.error('❌ Error updating did you know:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'خطأ في تحديث المعلومة',
            error: error.message 
        });
    }
});

// Delete did you know
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    console.log(`🗑️ Deleting did you know with ID: ${id}`);
    
    try {
        const result = await runSQL('DELETE FROM did_you_know WHERE id = ?', [id]);
        
        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'المعلومة غير موجودة'
            });
        }
        
        console.log('✅ Did you know deleted successfully');
        
        res.json({ 
            success: true, 
            message: 'تم حذف المعلومة بنجاح' 
        });
        
    } catch (error) {
        console.error('❌ Error deleting did you know:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'خطأ في حذف المعلومة',
            error: error.message 
        });
    }
});

module.exports = router;
