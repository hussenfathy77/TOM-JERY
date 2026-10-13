const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { authenticateToken, requireRole } = require('../middlewares/auth');

// Teacher or Admin: GET /api/attendance?date=YYYY-MM-DD
router.get('/', authenticateToken, requireRole('TEACHER', 'ADMIN'), async (req, res, next) => {
  try {
    const { date, childId } = req.query;

    const where = {};
    if (childId) where.childId = childId;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.date = { gte: startOfDay, lte: endOfDay };
    }

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            parent: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    res.json(attendances);
  } catch (error) {
    next(error);
  }
});

// Teacher or Admin: POST /api/attendance (Mark single or batch attendance)
router.post('/', authenticateToken, requireRole('TEACHER', 'ADMIN'), async (req, res, next) => {
  try {
    const { records } = req.body; // array of { childId, status, notes, date }

    if (!Array.isArray(records) || records.length === 0) {
      // If single object provided:
      const { childId, status, notes, date } = req.body;
      if (!childId || !status) {
        return res.status(400).json({ error: 'childId and status are required' });
      }

      const attendance = await prisma.attendance.create({
        data: {
          childId,
          status: status.toUpperCase(),
          notes,
          date: date ? new Date(date) : new Date()
        }
      });
      return res.status(201).json(attendance);
    }

    // Batch create
    const created = await Promise.all(
      records.map((r) =>
        prisma.attendance.create({
          data: {
            childId: r.childId,
            status: r.status.toUpperCase(),
            notes: r.notes,
            date: r.date ? new Date(r.date) : new Date()
          }
        })
      )
    );

    res.status(201).json({ message: 'Attendance recorded successfully', count: created.length });
  } catch (error) {
    next(error);
  }
});

// Parent only: GET /api/attendance/my-children (View attendance records for their own kids)
router.get('/my-children', authenticateToken, requireRole('PARENT'), async (req, res, next) => {
  try {
    const parentId = req.user.id;
    const attendances = await prisma.attendance.findMany({
      where: {
        child: { parentId }
      },
      include: {
        child: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      orderBy: { date: 'desc' }
    });

    res.json(attendances);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
