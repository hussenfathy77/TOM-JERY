const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { authenticateToken, requireRole } = require('../middlewares/auth');

// Teacher only: GET /api/teacher/children
router.get('/children', authenticateToken, requireRole('TEACHER'), async (req, res, next) => {
  try {
    const children = await prisma.child.findMany({
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { firstName: 'asc' }
    });

    res.json(children);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
