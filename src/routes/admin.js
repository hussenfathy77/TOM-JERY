const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middlewares/auth');
const {
  getAllUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser
} = require('../controllers/userController');
const {
  getAllChildren,
  getChildById,
  createChild,
  updateChild,
  deleteChild
} = require('../controllers/childController');

// All admin routes require authentication and admin role
router.use(authenticateToken, requireRole('ADMIN'));

// User Management
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.patch('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

// Child Management
router.get('/children', getAllChildren);
router.get('/children/:id', getChildById);
router.post('/children', createChild);
router.put('/children/:id', updateChild);
router.delete('/children/:id', deleteChild);

module.exports = router;
