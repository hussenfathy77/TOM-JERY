const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { authenticateToken, requireRole } = require('../middlewares/auth');

// Public: GET /api/announcements (Anyone or Parents can view announcements)
router.get('/', async (req, res, next) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(announcements);
  } catch (error) {
    next(error);
  }
});

// Admin-only: POST /api/announcements
router.post('/', authenticateToken, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const announcement = await prisma.announcement.create({
      data: { title, content, category: category || 'GENERAL' }
    });
    res.status(201).json(announcement);
  } catch (error) {
    next(error);
  }
});

// Admin-only: DELETE /api/announcements/:id
router.delete('/:id', authenticateToken, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.announcement.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
