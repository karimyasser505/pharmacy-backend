const express = require('express');
const router = express.Router();
const { runSQL, getSQL, allSQL } = require('../db');

// Get all questions with optional filtering
router.get('/questions', async (req, res) => {
    try {
        const { category, sort = 'latest', limit = 50 } = req.query;
        
        let sql = `
            SELECT 
                q.id, q.title, q.content, q.category, q.author, 
                q.created_at, q.views, q.tags,
                COUNT(c.id) as answer_count
            FROM questions q
            LEFT JOIN comments c ON q.id = c.question_id
        `;
        
        const params = [];
        
        if (category) {
            sql += ' WHERE q.category = ?';
            params.push(category);
        }
        
        sql += ' GROUP BY q.id';
        
        // Add sorting
        switch (sort) {
            case 'latest':
                sql += ' ORDER BY q.created_at DESC';
                break;
            case 'oldest':
                sql += ' ORDER BY q.created_at ASC';
                break;
            case 'most-answers':
                sql += ' ORDER BY answer_count DESC, q.created_at DESC';
                break;
            case 'most-views':
                sql += ' ORDER BY q.views DESC, q.created_at DESC';
                break;
            default:
                sql += ' ORDER BY q.created_at DESC';
        }
        
        if (limit) {
            sql += ' LIMIT ?';
            params.push(parseInt(limit));
        }
        
        const questions = await allSQL(sql, params);
        
        // Parse tags JSON
        questions.forEach(q => {
            if (q.tags) {
                try {
                    q.tags = JSON.parse(q.tags);
                } catch (e) {
                    q.tags = [];
                }
            } else {
                q.tags = [];
            }
        });
        
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a single question with comments
router.get('/questions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get question
        const question = await getSQL(
            'SELECT * FROM questions WHERE id = ?',
            [id]
        );
        
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        
        // Increment views
        await runSQL(
            'UPDATE questions SET views = views + 1 WHERE id = ?',
            [id]
        );
        
        // Get comments for this question
        const comments = await allSQL(
            'SELECT * FROM comments WHERE question_id = ? ORDER BY created_at ASC',
            [id]
        );
        
        // Parse tags
        if (question.tags) {
            try {
                question.tags = JSON.parse(question.tags);
            } catch (e) {
                question.tags = [];
            }
        } else {
            question.tags = [];
        }
        
        res.json({
            question,
            comments
        });
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new question
router.post('/questions', async (req, res) => {
    try {
        const { title, content, category, author, tags = [] } = req.body;
        
        if (!title || !content || !category || !author) {
            return res.status(400).json({ 
                error: 'Title, content, category, and author are required' 
            });
        }
        
        const result = await runSQL(
            `INSERT INTO questions (title, content, category, author, tags, created_at, views) 
             VALUES (?, ?, ?, ?, ?, datetime('now'), 0)`,
            [title, content, category, author, JSON.stringify(tags)]
        );
        
        const newQuestion = await getSQL(
            'SELECT * FROM questions WHERE id = ?',
            [result.lastID]
        );
        
        // Parse tags for response
        if (newQuestion.tags) {
            try {
                newQuestion.tags = JSON.parse(newQuestion.tags);
            } catch (e) {
                newQuestion.tags = [];
            }
        } else {
            newQuestion.tags = [];
        }
        
        res.status(201).json(newQuestion);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a question
router.put('/questions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category, tags } = req.body;
        
        const question = await getSQL(
            'SELECT * FROM questions WHERE id = ?',
            [id]
        );
        
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        
        await runSQL(
            `UPDATE questions 
             SET title = ?, content = ?, category = ?, tags = ?, updated_at = datetime('now')
             WHERE id = ?`,
            [title, content, category, JSON.stringify(tags), id]
        );
        
        const updatedQuestion = await getSQL(
            'SELECT * FROM questions WHERE id = ?',
            [id]
        );
        
        // Parse tags for response
        if (updatedQuestion.tags) {
            try {
                updatedQuestion.tags = JSON.parse(updatedQuestion.tags);
            } catch (e) {
                updatedQuestion.tags = [];
            }
        } else {
            updatedQuestion.tags = [];
        }
        
        res.json(updatedQuestion);
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a question
router.delete('/questions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const question = await getSQL(
            'SELECT * FROM questions WHERE id = ?',
            [id]
        );
        
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        
        // Delete comments first (due to foreign key constraint)
        await runSQL('DELETE FROM comments WHERE question_id = ?', [id]);
        
        // Delete question
        await runSQL('DELETE FROM questions WHERE id = ?', [id]);
        
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get comments for a question
router.get('/questions/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        
        const comments = await allSQL(
            'SELECT * FROM comments WHERE question_id = ? ORDER BY created_at ASC',
            [id]
        );
        
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a comment to a question
router.post('/questions/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const { content, author } = req.body;
        
        if (!content || !author) {
            return res.status(400).json({ 
                error: 'Content and author are required' 
            });
        }
        
        // Check if question exists
        const question = await getSQL(
            'SELECT * FROM questions WHERE id = ?',
            [id]
        );
        
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        
        const result = await runSQL(
            `INSERT INTO comments (question_id, content, author, created_at) 
             VALUES (?, ?, ?, datetime('now'))`,
            [id, content, author]
        );
        
        const newComment = await getSQL(
            'SELECT * FROM comments WHERE id = ?',
            [result.lastID]
        );
        
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a comment
router.put('/comments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }
        
        const comment = await getSQL(
            'SELECT * FROM comments WHERE id = ?',
            [id]
        );
        
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        await runSQL(
            `UPDATE comments 
             SET content = ?, updated_at = datetime('now')
             WHERE id = ?`,
            [content, id]
        );
        
        const updatedComment = await getSQL(
            'SELECT * FROM comments WHERE id = ?',
            [id]
        );
        
        res.json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a comment
router.delete('/comments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const comment = await getSQL(
            'SELECT * FROM comments WHERE id = ?',
            [id]
        );
        
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        await runSQL('DELETE FROM comments WHERE id = ?', [id]);
        
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get question statistics
router.get('/stats', async (req, res) => {
    try {
        const totalQuestions = await getSQL('SELECT COUNT(*) as count FROM questions');
        const totalComments = await getSQL('SELECT COUNT(*) as count FROM comments');
        const categoryStats = await allSQL(
            'SELECT category, COUNT(*) as count FROM questions GROUP BY category'
        );
        
        res.json({
            totalQuestions: totalQuestions.count,
            totalComments: totalComments.count,
            categoryStats
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
