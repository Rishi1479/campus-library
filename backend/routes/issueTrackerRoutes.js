const express = require('express');
const router = express.Router();
const {
  createIssue,
  getIssues,
  getMyIssues,
  updateIssue
} = require('../controllers/issueTrackerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createIssue)
  .get(protect, admin, getIssues);

router.route('/myissues').get(protect, getMyIssues);

router.route('/:id')
  .put(protect, admin, updateIssue);

module.exports = router;
