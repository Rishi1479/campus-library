const IssueTracker = require('../models/IssueTracker');

const createIssue = async (req, res) => {
  try {
    const { type, description, priority } = req.body;

    const issue = await IssueTracker.create({
      student: req.user._id,
      type,
      description,
      priority: priority || 'medium'
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIssues = async (req, res) => {
  try {
    const issues = await IssueTracker.find({}).populate('student', 'name email studentId').sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyIssues = async (req, res) => {
  try {
    const issues = await IssueTracker.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateIssue = async (req, res) => {
  try {
    const { status, adminReply } = req.body;

    const issue = await IssueTracker.findById(req.params.id);

    if (issue) {
      issue.status = status || issue.status;
      if (adminReply !== undefined) {
        issue.adminReply = adminReply;
      }

      const updatedIssue = await issue.save();
      res.json(updatedIssue);
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createIssue,
  getIssues,
  getMyIssues,
  updateIssue
};
