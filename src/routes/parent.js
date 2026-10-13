const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { authenticateToken, requireRole } = require('../middlewares/auth');

// Parent only: GET /api/parent/children
router.get('/children', authenticateToken, requireRole('PARENT'), async (req, res, next) => {
  try {
    const parentId = req.user.id;
    const children = await prisma.child.findMany({
      where: { parentId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(children);
  } catch (error) {
    next(error);
  }
});

// Parent only: GET /api/parent/profile
router.get('/profile', authenticateToken, requireRole('PARENT'), async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { children: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
