const IssueRecord = require('../models/IssueRecord');
const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Issue a book to a student manually
// @route   POST /api/issues
// @access  Private/Admin
const issueBook = async (req, res) => {
  try {
    const { studentId, bookId } = req.body;
    let { dueDate } = req.body;

    if (!dueDate) {
      dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
    }

    // Check if book exists and has available copies
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available' });
    }

    // Check if student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Create issue record
    const issueRecord = await IssueRecord.create({
      book: bookId,
      student: studentId,
      dueDate: new Date(dueDate),
      status: 'issued'
    });

    // Reduce available copies
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json(issueRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Return a book
// @route   PUT /api/issues/:id/return
// @access  Private/Admin
const returnBook = async (req, res) => {
  try {
    const issueRecord = await IssueRecord.findById(req.params.id);

    if (!issueRecord) {
      return res.status(404).json({ message: 'Issue record not found' });
    }

    if (issueRecord.status === 'returned') {
      return res.status(400).json({ message: 'Book is already returned' });
    }

    // Calculate Fine (1 rupee per day overdue)
    const returnDate = new Date();
    let fineAmount = 0;
    
    if (returnDate > issueRecord.dueDate) {
      const diffTime = Math.abs(returnDate - issueRecord.dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      fineAmount = diffDays * 1;
    }

    // Mark as returned
    issueRecord.status = 'returned';
    issueRecord.returnDate = returnDate;
    issueRecord.fine = fineAmount;
    await issueRecord.save();

    // Increase available copies
    const book = await Book.findById(issueRecord.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.json(issueRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all issue records
// @route   GET /api/issues
// @access  Private/Admin
const getIssues = async (req, res) => {
  try {
    const issues = await IssueRecord.find({}).populate('book', 'title isbn category').populate('student', 'name email studentId');
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my issue records (for logged in student)
// @route   GET /api/issues/myissues
// @access  Private
const getMyIssues = async (req, res) => {
  try {
    const issues = await IssueRecord.find({ student: req.user._id }).populate('book', 'title author coverImage');
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request a book by a student
// @route   POST /api/issues/request
// @access  Private
const requestBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const studentId = req.user._id;

    // Check if book exists and has available copies
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available' });
    }

    // Check if student already requested or issued this book
    const existingIssue = await IssueRecord.findOne({
      book: bookId,
      student: studentId,
      status: { $in: ['requested', 'issued'] }
    });

    if (existingIssue) {
      return res.status(400).json({ message: `You already have this book ${existingIssue.status}` });
    }

    // Create issue record
    const issueRecord = await IssueRecord.create({
      book: bookId,
      student: studentId,
      status: 'requested'
    });

    res.status(201).json(issueRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a book request
// @route   PUT /api/issues/:id/approve
// @access  Private/Admin
const approveIssueRequest = async (req, res) => {
  try {
    const issueRecord = await IssueRecord.findById(req.params.id);

    if (!issueRecord) {
      return res.status(404).json({ message: 'Issue record not found' });
    }

    if (issueRecord.status !== 'requested') {
      return res.status(400).json({ message: 'Book must be in requested status to approve' });
    }

    const book = await Book.findById(issueRecord.book);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available to approve this request' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    issueRecord.status = 'issued';
    issueRecord.issueDate = new Date();
    issueRecord.dueDate = dueDate;
    
    book.availableCopies -= 1;
    await book.save();
    
    await issueRecord.save();

    // Populate needed fields for frontend update
    const populatedRecord = await IssueRecord.findById(issueRecord._id)
      .populate('book', 'title isbn category author coverImage')
      .populate('student', 'name email studentId');

    res.json(populatedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  issueBook,
  returnBook,
  getIssues,
  getMyIssues,
  requestBook,
  approveIssueRequest
};
