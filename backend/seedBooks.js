const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');

dotenv.config();

const books = [
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category: 'Computer Science',
    totalCopies: 5,
    availableCopies: 5,
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.',
    coverImage: ''
  },
  {
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    isbn: '978-0201633610',
    category: 'Computer Science',
    totalCopies: 3,
    availableCopies: 3,
    description: 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions.',
    coverImage: ''
  },
  {
    title: 'The Pragmatic Programmer: Your Journey To Mastery',
    author: 'David Thomas, Andrew Hunt',
    isbn: '978-0135957059',
    category: 'Computer Science',
    totalCopies: 7,
    availableCopies: 4, // Intentionally making some unavailable so the UI can show out of stock / issued UI logic if needed
    description: 'The Pragmatic Programmer is one of those rare tech books you\'ll read, re-read, and read again over the years.',
    coverImage: ''
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '978-0735211292',
    category: 'Self-Help',
    totalCopies: 10,
    availableCopies: 0, // Intentionally out of stock
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving--every day.',
    coverImage: ''
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    isbn: '978-0544003415',
    category: 'Fiction',
    totalCopies: 4,
    availableCopies: 4,
    description: 'A fantastic epic fantasy novel written by English author and scholar J. R. R. Tolkien.',
    coverImage: ''
  }
];

const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Book Seeding!');

    await Book.deleteMany(); // Clear existing books
    console.log('Existing books cleared!');

    await Book.insertMany(books);
    console.log('Dummy books successfully seeded!');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedBooks();
