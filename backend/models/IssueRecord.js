const mongoose = require('mongoose');

const issueRecordSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: false
  },
  returnDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['requested', 'issued', 'returned', 'overdue'],
    default: 'requested'
  },
  fine: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const IssueRecord = mongoose.model('IssueRecord', issueRecordSchema);
module.exports = IssueRecord;
