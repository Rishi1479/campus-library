import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyIssues } from '../../store/slices/issueSlice';
import { 
  User, 
  Mail, 
  BookOpen, 
  Trophy, 
  CalendarDays,
  Award,
  BookMarked,
  Edit2,
  Loader2
} from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { issues, isLoading } = useSelector((state) => state.issue);

  useEffect(() => {
    dispatch(getMyIssues());
  }, [dispatch]);

  // Derived Stats
  const booksReadCount = issues.filter(i => i.status === 'returned').length;
  
  const favoriteCategories = useMemo(() => {
    const categoriesMap = {};
    issues.forEach(i => {
      const cat = i.book?.category;
      if (cat) categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
    });
    
    const arr = Object.keys(categoriesMap).map(key => ({
      name: key,
      count: categoriesMap[key],
      percentage: Math.round((categoriesMap[key] / (issues.length || 1)) * 100)
    }));
    
    return arr.sort((a, b) => b.count - a.count).slice(0, 4); // top 4 classes
  }, [issues]);

  const stats = [
    { label: 'Books Borrowed', value: issues.length, icon: BookOpen, color: 'indigo' },
    { label: 'Completed Reads', value: booksReadCount, icon: Trophy, color: 'emerald' },
    { label: 'Pending Reviews', value: 0, icon: Edit2, color: 'amber' },
    { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric'}) : 'Unknown', icon: CalendarDays, color: 'rose' },
  ];

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Profile Overview</h1>
        <p className="text-zinc-400 text-lg">Manage your account and view reading statistics</p>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - User Details Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
            
            <div className="flex flex-col items-center text-center relative z-10 pt-6">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-primary to-indigo-600 p-1 mb-6 shadow-2xl shadow-primary/30">
                <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center border-4 border-zinc-950">
                  <span className="text-4xl font-bold text-white tracking-wider">
                    {user?.name?.charAt(0) || 'S'}
                  </span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-1.5">{user?.name || 'Student Name'}</h2>
              <p className="text-zinc-400 font-medium mb-6 uppercase tracking-wider text-xs">
                {user?.role === 'student' ? 'Undergraduate Student' : user?.role}
              </p>
              
              <div className="w-full bg-white/5 rounded-2xl p-4 border border-white/5 space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Student ID</p>
                    <p className="text-sm font-medium text-white truncate">{user?.studentId || 'Pending'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-medium text-white truncate">{user?.email || 'student@campus.edu'}</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-white hover:bg-zinc-200 text-black font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-white/10">
                Edit Profile
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-primary/20 rounded-3xl p-6 flex items-start gap-4 hover:border-primary/40 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/10 shrink-0 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-1">{booksReadCount > 10 ? 'Master Scholar' : 'Apprentice Reader'}</h3>
              <p className="text-zinc-300 text-sm">Read {Math.max(0, 10 - booksReadCount)} more books to reach the next tier.</p>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & History */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-5 hover:bg-zinc-900/60 hover:border-white/10 transition-all flex flex-col justify-between h-36">
                  <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center border border-${stat.color}-500/20`}>
                    <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-end gap-1.5">
                      {stat.value} {stat.suffix && <span className="text-xs font-medium text-zinc-400 mb-1">{stat.suffix}</span>}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mt-1">{stat.label}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Activity Breakdown */}
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8">
             <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                <BookMarked className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-white">Reading Categories</h2>
             </div>
             
             {favoriteCategories.length > 0 ? (
               <div className="space-y-6">
                  {favoriteCategories.map((cat, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-end mb-2">
                         <span className="text-white font-medium">{cat.name}</span>
                         <span className="text-sm font-semibold text-zinc-400">{cat.count} books</span>
                      </div>
                      <div className="w-full bg-zinc-950 rounded-full h-3 overflow-hidden border border-white/5">
                         <div 
                           className="h-full bg-gradient-to-r from-primary to-indigo-400 rounded-full" 
                           style={{ width: `${cat.percentage}%` }}
                         />
                      </div>
                    </div>
                  ))}
               </div>
             ) : (
                <div className="py-10 text-center text-zinc-500">
                  Not enough borrowing data to analyze reading preferences just yet.
                </div>
             )}
          </div>
          
        </div>
      </div>
      )}
    </div>
  );
};

export default Profile;
