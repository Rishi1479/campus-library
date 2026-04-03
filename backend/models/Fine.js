const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issueRecord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IssueRecord',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid'
  },
  paymentDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });

const Fine = mongoose.model('Fine', fineSchema);
module.exports = Fine;
