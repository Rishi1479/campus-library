const IssueRecord = require('../models/IssueRecord');
const Book = require('../models/Book');
const User = require('../models/User');

const issueBook = async (req, res) => {
  try {
    const { studentId, bookId } = req.body;
    let { dueDate } = req.body;

    if (!dueDate) {
      dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available' });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const issueRecord = await IssueRecord.create({
      book: bookId,
      student: studentId,
      dueDate: new Date(dueDate),
      status: 'issued'
    });

    book.availableCopies -= 1;
    await book.save();

    res.status(201).json(issueRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const issueRecord = await IssueRecord.findById(req.params.id);

    if (!issueRecord) {
      return res.status(404).json({ message: 'Issue record not found' });
    }

    if (issueRecord.status === 'returned') {
      return res.status(400).json({ message: 'Book is already returned' });
    }

    const returnDate = new Date();
    let fineAmount = 0;
    
    if (returnDate > issueRecord.dueDate) {
      const diffTime = Math.abs(returnDate - issueRecord.dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      fineAmount = diffDays * 1;
    }

    issueRecord.status = 'returned';
    issueRecord.returnDate = returnDate;
    issueRecord.fine = fineAmount;
    await issueRecord.save();

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

const getIssues = async (req, res) => {
  try {
    const issues = await IssueRecord.find({}).populate('book', 'title isbn category').populate('student', 'name email studentId');
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyIssues = async (req, res) => {
  try {
    const issues = await IssueRecord.find({ student: req.user._id }).populate('book', 'title author coverImage');
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const requestBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const studentId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available' });
    }

    const existingIssue = await IssueRecord.findOne({
      book: bookId,
      student: studentId,
      status: { $in: ['requested', 'issued'] }
    });

    if (existingIssue) {
      return res.status(400).json({ message: `You already have this book ${existingIssue.status}` });
    }

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
