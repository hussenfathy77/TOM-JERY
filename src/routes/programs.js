const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { authenticateToken, requireRole } = require('../middlewares/auth');

// Public: GET /api/programs (Anyone can see active nursery programs)
router.get('/', async (req, res, next) => {
  try {
    const programs = await prisma.program.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(programs);
  } catch (error) {
    next(error);
  }
});

// Public: GET /api/programs/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const program = await prisma.program.findUnique({ where: { id } });
    if (!program) return res.status(404).json({ error: 'Program not found' });
    res.json(program);
  } catch (error) {
    next(error);
  }
});

// Admin-only: POST /api/programs
router.post('/', authenticateToken, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { title, description, ageGroup, schedule } = req.body;
    if (!title || !description || !ageGroup || !schedule) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const program = await prisma.program.create({
      data: { title, description, ageGroup, schedule }
    });
    res.status(201).json(program);
  } catch (error) {
    next(error);
  }
});

// Admin-only: PUT /api/programs/:id
router.put('/:id', authenticateToken, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, ageGroup, schedule, isActive } = req.body;

    const program = await prisma.program.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(ageGroup && { ageGroup }),
        ...(schedule && { schedule }),
        ...(typeof isActive === 'boolean' && { isActive })
      }
    });
    res.json(program);
  } catch (error) {
    next(error);
  }
});

// Admin-only: DELETE /api/programs/:id
router.delete('/:id', authenticateToken, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.program.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
