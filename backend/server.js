const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Route files
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const issueRecordRoutes = require('./routes/issueRecordRoutes');
const issueTrackerRoutes = require('./routes/issueTrackerRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/issues', issueRecordRoutes);
app.use('/api/tracker', issueTrackerRoutes);
app.use('/api/admin', adminRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB Connected');
}).catch(err => {
  console.error('MongoDB Connection Error:', err);
});

// Basic route
app.get('/', (req, res) => {
  res.send('Library Management System API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
