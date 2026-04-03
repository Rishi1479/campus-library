const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getStudents,
  approveStudent,
  getStudentDetails
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/dashboard').get(protect, admin, getDashboardStats);
router.route('/students').get(protect, admin, getStudents);
router.route('/students/:id').get(protect, admin, getStudentDetails);
router.route('/students/:id/approve').put(protect, admin, approveStudent);

module.exports = router;
