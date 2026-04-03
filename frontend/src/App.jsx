import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBooks from './pages/admin/ManageBooks';
import Students from './pages/admin/Students';
import StudentDetails from './pages/admin/StudentDetails';
import IssueReturn from './pages/admin/IssueReturn';
import AdminTracker from './pages/admin/IssueTracker';

import StudentLayout from './components/layout/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import BrowseBooks from './pages/student/BrowseBooks';
import MyIssues from './pages/student/MyIssues';
import StudentTracker from './pages/student/StudentTracker';
import Profile from './pages/student/Profile';

// Auth Check Component
const PrivateRoute = ({ children, roles }) => {
  const { user } = useSelector((state) => state.auth);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <PrivateRoute roles={['admin']}>
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="books" element={<ManageBooks />} />
                <Route path="students" element={<Students />} />
                <Route path="students/:id" element={<StudentDetails />} />
                <Route path="issues" element={<IssueReturn />} />
                <Route path="tracker" element={<AdminTracker />} />
              </Routes>
            </AdminLayout>
          </PrivateRoute>
        } />

        {/* Student Routes */}
        <Route path="/student/*" element={
          <PrivateRoute roles={['student']}>
            <StudentLayout>
              <Routes>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="books" element={<BrowseBooks />} />
                <Route path="my-issues" element={<MyIssues />} />
                <Route path="tracker" element={<StudentTracker />} />
                <Route path="profile" element={<Profile />} />
              </Routes>
            </StudentLayout>
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
