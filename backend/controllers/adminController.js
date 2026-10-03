const User = require('../models/User');
const Book = require('../models/Book');
const IssueRecord = require('../models/IssueRecord');
const IssueTracker = require('../models/IssueTracker');

const getDashboardStats = async (req, res) => {
  try {
    const totalBooksCount = await Book.countDocuments();
    const books = await Book.find();
    
    let totalCopies = 0;
    let availableCopies = 0;
    books.forEach(b => {
      totalCopies += b.totalCopies;
      availableCopies += b.availableCopies;
    });

    const issuedBooksCount = totalCopies - availableCopies;

    const overdueCount = await IssueRecord.countDocuments({
      status: 'issued',
      dueDate: { $lt: new Date() }
    });

    const openIssuesCount = await IssueTracker.countDocuments({ status: 'open' });

    res.json({
      totalBooks: totalCopies,
      uniqueTitles: totalBooksCount,
      issuedBooksCount,
      availableBooksCount: availableCopies,
      overdueCount,
      openIssuesCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (student && student.role === 'student') {
      student.isApproved = true;
      const updatedStudent = await student.save();
      res.json(updatedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentDetails = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const issueRecords = await IssueRecord.find({ student: req.params.id }).populate('book', 'title author coverImage');

    res.json({
      student,
      issueRecords
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getStudents,
  approveStudent,
  getStudentDetails
};
