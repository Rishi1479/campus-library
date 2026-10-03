# 📚 Campus Library Management System

A full-stack **MERN** web application designed to automate book transactions, manage inventory, track student borrowing records, and handle fine calculations — built as a college project.

---

## 🚀 Features

- 🔐 JWT-based Authentication with Role-Based Access Control (Admin / Student)
- 📖 Book Inventory Management with cover image uploads (Cloudinary)
- 🎓 Student Registration with Admin Approval Workflow
- 📋 Book Issue & Return Tracking with due dates
- 💰 Automatic Fine Calculation for overdue books
- 🐛 Issue Tracker — students can report lost books, damage, new book requests
- 📊 Admin Dashboard with live stats
- 📱 Fully Responsive Design

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React.js, Redux Toolkit, Vite       |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB, Mongoose                   |
| Auth       | JSON Web Tokens (JWT), bcryptjs     |
| Storage    | Cloudinary (book cover images)      |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## 📁 Project Structure

```
campus-library/
├── backend/
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── issueRecordController.js
│   │   └── issueTrackerController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Book.js
│   │   ├── Fine.js
│   │   ├── IssueRecord.js
│   │   ├── IssueTracker.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── issueRecordRoutes.js
│   │   └── issueTrackerRoutes.js
│   ├── seed.js
│   ├── seedBooks.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── layout/
    │   │       ├── AdminLayout.jsx
    │   │       ├── Sidebar.jsx
    │   │       └── StudentLayout.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── IssueReturn.jsx
    │   │   │   ├── IssueTracker.jsx
    │   │   │   ├── ManageBooks.jsx
    │   │   │   ├── StudentDetails.jsx
    │   │   │   └── Students.jsx
    │   │   └── student/
    │   │       ├── BrowseBooks.jsx
    │   │       ├── MyIssues.jsx
    │   │       ├── Profile.jsx
    │   │       ├── StudentDashboard.jsx
    │   │       └── StudentTracker.jsx
    │   ├── store/
    │   │   ├── slices/
    │   │   │   ├── adminSlice.js
    │   │   │   ├── authSlice.js
    │   │   │   ├── bookSlice.js
    │   │   │   └── issueSlice.js
    │   │   └── store.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## ⚙️ Setup & Installation

### Step 1 — Clone / Download the Project

```bash
git clone https://github.com/Rishi1479/campus-library.git
cd campus-library
```

---

### Step 2 — Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/campus_library
JWT_SECRET=your_super_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend:
```bash
# Development (with auto-reload)
npm run dev

# OR Production
npm start
```

✅ Backend runs on: `http://localhost:5000`
🌐 Deployed at: `https://campus-library-backend.onrender.com`

---

### Step 3 — Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the app
npm run dev
```

✅ Frontend runs on: `http://localhost:5173`
🌐 Deployed at: `https://campus-library-drab.vercel.app`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint            | Description              | Access  |
|--------|---------------------|--------------------------|---------|
| POST   | /api/auth/register  | Register a new student   | Public  |
| POST   | /api/auth/login     | Login & get JWT token    | Public  |
| GET    | /api/auth/profile   | Get logged-in user info  | Private |

### Books
| Method | Endpoint       | Description                       | Access       |
|--------|----------------|-----------------------------------|--------------|
| GET    | /api/books     | Get all books                     | Public       |
| GET    | /api/books/:id | Get a single book by ID           | Public       |
| POST   | /api/books     | Add a new book (with cover image) | Admin        |
| PUT    | /api/books/:id | Update book details               | Admin        |
| DELETE | /api/books/:id | Delete a book                     | Admin        |

### Issue Records
| Method | Endpoint                | Description                     | Access  |
|--------|-------------------------|---------------------------------|---------|
| POST   | /api/issues             | Issue a book to a student       | Admin   |
| GET    | /api/issues             | Get all issue records           | Admin   |
| POST   | /api/issues/request     | Student requests a book         | Student |
| GET    | /api/issues/myissues    | Get student's own issue history | Student |
| PUT    | /api/issues/:id/return  | Mark a book as returned         | Admin   |
| PUT    | /api/issues/:id/approve | Approve a book request          | Admin   |

### Issue Tracker (Support Tickets)
| Method | Endpoint               | Description                        | Access  |
|--------|------------------------|------------------------------------|---------|
| POST   | /api/tracker           | Student raises a support issue     | Student |
| GET    | /api/tracker           | Get all support issues             | Admin   |
| GET    | /api/tracker/myissues  | Get student's own support issues   | Student |
| PUT    | /api/tracker/:id       | Update issue status / admin reply  | Admin   |

### Admin
| Method | Endpoint                       | Description                  | Access |
|--------|--------------------------------|------------------------------|--------|
| GET    | /api/admin/dashboard           | Get dashboard stats          | Admin  |
| GET    | /api/admin/students            | List all registered students | Admin  |
| GET    | /api/admin/students/:id        | Get a student's full details | Admin  |
| PUT    | /api/admin/students/:id/approve| Approve a student account    | Admin  |

---

## 🗃️ Database Models

### User
```js
{
  name, email, password (hashed),
  role: "student" | "admin",
  studentId, department,
  isApproved: Boolean
}
```

### Book
```js
{
  title, author, isbn (unique),
  category, description,
  totalCopies, availableCopies,
  coverImage (Cloudinary URL)
}
```

### IssueRecord
```js
{
  book: ObjectId,
  student: ObjectId,
  issueDate, dueDate, returnDate,
  status: "requested" | "issued" | "returned" | "overdue",
  fine: Number
}
```

### IssueTracker (Support Tickets)
```js
{
  student: ObjectId,
  type: "lost_book" | "damage_report" | "new_book_request" | "other",
  description, adminReply,
  status: "open" | "in_progress" | "resolved",
  priority: "low" | "medium" | "high"
}
```

### Fine
```js
{
  student: ObjectId,
  issueRecord: ObjectId,
  amount: Number,
  status: "paid" | "unpaid",
  paymentDate: Date
}
```

---

## 🎯 How to Use

1. **Register** as a Student (Admin account is seeded via `seed.js`)
2. **Admin approves** the student account before they can borrow books

**Student Flow:**
- Browse the book catalog
- Request a book → Admin approves and issues it
- Track borrowed books and due dates in "My Issues"
- Raise support tickets (lost book, damage report, etc.) via "Issue Tracker"

**Admin Flow:**
- View dashboard stats (total books, issued books, students, fines)
- Manage book inventory (Add / Edit / Delete with cover images)
- Approve student registrations
- Issue & return books, approve student requests
- View and respond to support tickets

---

## 🧪 Seed Data

Run the seed scripts to populate initial data:

```bash
# Seed admin user
node seed.js

# Seed sample books
node seedBooks.js
```

Default admin credentials (set in `seed.js`):
- **Email:** `admin@campus.com`
- **Password:** `admin123`

---

## 📊 Evaluation Checklist

| Feature                          | Status |
|----------------------------------|--------|
| JWT Authentication               | ✅     |
| Role-based access (Admin/Student)| ✅     |
| Student approval workflow        | ✅     |
| Book inventory CRUD              | ✅     |
| Cover image upload (Cloudinary)  | ✅     |
| Book issue & return system       | ✅     |
| Fine calculation (overdue)       | ✅     |
| Student book request flow        | ✅     |
| Support issue tracker            | ✅     |
| Admin dashboard with stats       | ✅     |
| Student dashboard                | ✅     |
| Responsive design                | ✅     |
| RESTful API                      | ✅     |
| MVC architecture                 | ✅     |

---

## 👨‍💻 Developer Notes

- All API routes are protected with JWT middleware except Register & Login
- Passwords are hashed with **bcryptjs** (10 salt rounds)
- Book cover images are stored permanently on **Cloudinary** (not local disk)
- Frontend uses **Redux Toolkit** for global state management
- Student accounts require **admin approval** before login access is granted
- Fine is auto-calculated based on the number of overdue days on book return

---

*Built with ❤️ using the MERN Stack*
