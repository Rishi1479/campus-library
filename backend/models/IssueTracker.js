const mongoose = require('mongoose');

const issueTrackerSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['lost_book', 'damage_report', 'new_book_request', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  adminReply: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const IssueTracker = mongoose.model('IssueTracker', issueTrackerSchema);
module.exports = IssueTracker;
