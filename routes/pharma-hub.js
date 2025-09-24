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
        let paramIndex = 1;

        if (category) {
            sql += ` WHERE q.category = $${paramIndex++}`;
            params.push(category);
        }

        sql += ' GROUP BY q.id';

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
            sql += ` LIMIT $${paramIndex++}`;
            params.push(parseInt(limit));
        }

        const questions = await allSQL(sql, params);

        questions.forEach(q => {
            if (q.tags) {
                try {
                    q.tags = JSON.parse(q.tags);
                } catch {
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

        const question = await getSQL('SELECT * FROM questions WHERE id = $1', [id]);
        if (!question) return res.status(404).json({ error: 'Question not found' });

        await runSQL('UPDATE questions SET views = views + 1 WHERE id = $1', [id]);

        const comments = await allSQL(
            'SELECT * FROM comments WHERE question_id = $1 ORDER BY created_at ASC',
            [id]
        );

        if (question.tags) {
            try {
                question.tags = JSON.parse(question.tags);
            } catch {
                question.tags = [];
            }
        } else {
            question.tags = [];
        }

        res.json({ question, comments });
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
            return res.status(400).json({ error: 'Title, content, category, and author are required' });
        }

        const insert = `
      INSERT INTO questions (title, content, category, author, tags, created_at, views) 
      VALUES ($1,$2,$3,$4,$5,CURRENT_TIMESTAMP,0) RETURNING id
    `;
        const result = await runSQL(insert, [title, content, category, author, JSON.stringify(tags)]);
        const newId = result.rows[0].id;

        const newQuestion = await getSQL('SELECT * FROM questions WHERE id = $1', [newId]);

        if (newQuestion.tags) {
            try {
                newQuestion.tags = JSON.parse(newQuestion.tags);
            } catch {
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

        const question = await getSQL('SELECT * FROM questions WHERE id = $1', [id]);
        if (!question) return res.status(404).json({ error: 'Question not found' });

        const update = `
      UPDATE questions 
      SET title=$1, content=$2, category=$3, tags=$4, updated_at=CURRENT_TIMESTAMP
      WHERE id=$5
    `;
        await runSQL(update, [title, content, category, JSON.stringify(tags), id]);

        const updatedQuestion = await getSQL('SELECT * FROM questions WHERE id = $1', [id]);
        if (updatedQuestion.tags) {
            try {
                updatedQuestion.tags = JSON.parse(updatedQuestion.tags);
            } catch {
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
        const question = await getSQL('SELECT * FROM questions WHERE id = $1', [id]);
        if (!question) return res.status(404).json({ error: 'Question not found' });

        await runSQL('DELETE FROM comments WHERE question_id = $1', [id]);
        await runSQL('DELETE FROM questions WHERE id = $1', [id]);

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
            'SELECT * FROM comments WHERE question_id = $1 ORDER BY created_at ASC',
            [id]
        );
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a comment
router.post('/questions/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const { content, author } = req.body;

        if (!content || !author) {
            return res.status(400).json({ error: 'Content and author are required' });
        }

        const question = await getSQL('SELECT * FROM questions WHERE id = $1', [id]);
        if (!question) return res.status(404).json({ error: 'Question not found' });

        const insert = `
      INSERT INTO comments (question_id, content, author, created_at) 
      VALUES ($1,$2,$3,CURRENT_TIMESTAMP) RETURNING id
    `;
        const result = await runSQL(insert, [id, content, author]);
        const newId = result.rows[0].id;

        const newComment = await getSQL('SELECT * FROM comments WHERE id = $1', [newId]);

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

        if (!content) return res.status(400).json({ error: 'Content is required' });

        const comment = await getSQL('SELECT * FROM comments WHERE id = $1', [id]);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        await runSQL(
            'UPDATE comments SET content=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2',
            [content, id]
        );

        const updatedComment = await getSQL('SELECT * FROM comments WHERE id = $1', [id]);
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
        const comment = await getSQL('SELECT * FROM comments WHERE id = $1', [id]);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        await runSQL('DELETE FROM comments WHERE id = $1', [id]);
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get stats
router.get('/stats', async (req, res) => {
    try {
        const totalQuestions = await getSQL('SELECT COUNT(*) as count FROM questions');
        const totalComments = await getSQL('SELECT COUNT(*) as count FROM comments');
        const categoryStats = await allSQL('SELECT category, COUNT(*) as count FROM questions GROUP BY category');

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
