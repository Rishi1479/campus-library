const express = require('express');
const router = express.Router();
const {
  issueBook,
  returnBook,
  getIssues,
  getMyIssues,
  requestBook,
  approveIssueRequest
} = require('../controllers/issueRecordController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, admin, issueBook)
  .get(protect, admin, getIssues);

router.route('/request').post(protect, requestBook);
router.route('/myissues').get(protect, getMyIssues);
router.route('/:id/return').put(protect, admin, returnBook);
router.route('/:id/approve').put(protect, admin, approveIssueRequest);

module.exports = router;
