import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookCopy, 
  Users, 
  Inbox, 
  LogOut,
  Settings,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ role, isMinimized, toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Books', path: '/admin/books', icon: BookCopy },
    { name: 'Students', path: '/admin/students', icon: Users },
    { name: 'Issue/Return', path: '/admin/issues', icon: BookOpen },
    { name: 'Issue Tracker', path: '/admin/tracker', icon: Inbox },
  ];

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Browse Books', path: '/student/books', icon: BookCopy },
    { name: 'My Issues', path: '/student/my-issues', icon: BookOpen },
    { name: 'Issue Tracker', path: '/student/tracker', icon: Inbox },
    { name: 'Profile', path: '/student/profile', icon: Settings },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <div className={`bg-zinc-950 border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 transition-all duration-300 z-50 ${isMinimized ? 'w-20' : 'w-64'}`}>
      
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar} 
        className="absolute -right-3 top-8 bg-zinc-800 border border-white/10 rounded-full p-1.5 text-zinc-400 hover:text-white transition-colors shadow-md z-50 flex items-center justify-center"
      >
        {isMinimized ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div className="p-6">
        <div className={`flex items-center text-primary mb-8 ${isMinimized ? 'justify-center mx-auto' : 'gap-3 px-2'}`}>
          <BookOpen className="w-8 h-8 shrink-0" />
          {!isMinimized && <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap overflow-hidden">CampusLib</span>}
        </div>

        <nav className="space-y-1 mt-6">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            
            return (
              <Link
                key={link.name}
                to={link.path}
                title={isMinimized ? link.name : ''}
                className={`flex items-center rounded-xl transition-all duration-200 group ${
                  isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                } ${isMinimized ? 'p-3 justify-center' : 'px-4 py-3 gap-3'}`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                {!isMinimized && <span className="whitespace-nowrap overflow-hidden">{link.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/5">
        <div className={`flex items-center mb-6 cursor-pointer ${isMinimized ? 'justify-center' : 'gap-3 px-2'}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
            {user?.name?.charAt(0)}
          </div>
          {!isMinimized && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate w-32">{user?.name}</p>
              <p className="text-xs text-zinc-500 capitalize">{user?.role}</p>
            </div>
          )}
        </div>
        
        <button 
          onClick={onLogout}
          title={isMinimized ? "Sign Out" : ""}
          className={`flex items-center rounded-xl text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-colors w-full ${isMinimized ? 'p-3 justify-center' : 'px-4 py-3 gap-3 text-left'}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isMinimized && <span className="font-medium whitespace-nowrap overflow-hidden">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
