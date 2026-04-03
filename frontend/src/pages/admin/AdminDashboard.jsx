import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardStats } from '../../store/slices/adminSlice';
import { 
  BookCopy, 
  BookOpen, 
  Users, 
  AlertTriangle,
  Loader2,
  Inbox
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, index }) => (
  <div 
    className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:bg-zinc-900/80 transition-all duration-300 group"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${color}-500/10 group-hover:bg-${color}-500/20 transition-colors`}>
        <Icon className={`w-6 h-6 text-${color}-500`} />
      </div>
      <div className="text-right">
        <h3 className="text-zinc-400 font-medium text-sm">{title}</h3>
        <p className="text-3xl font-bold tracking-tight text-white mt-1">{value}</p>
      </div>
    </div>
    
  </div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, isLoading, isError, message } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-6 rounded-2xl flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 shrink-0" />
        <p>Error loading dashboard: {message}</p>
      </div>
    );
  }

  // Fallback defaults if stats are null initially
  const data = stats || {
    totalBooks: 0,
    uniqueTitles: 0,
    issuedBooksCount: 0,
    availableBooksCount: 0,
    overdueCount: 0,
    openIssuesCount: 0
  };

  return (
    <>
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Dashboard Overview</h1>
          <p className="text-zinc-400 text-lg">Detailed statistics of library performance</p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-500 fade-in">
        <StatCard title="Total Books (Inventory)" value={data.totalBooks} icon={BookCopy} color="blue" index={1} />
        <StatCard title="Unique Titles" value={data.uniqueTitles} icon={BookOpen} color="indigo" index={2} />
        <StatCard title="Currently Issued" value={data.issuedBooksCount} icon={Users} color="emerald" index={3} />
        
        <StatCard title="Available Copies" value={data.availableBooksCount} icon={BookCopy} color="green" index={4} />
        <StatCard title="Overdue Returns" value={data.overdueCount} icon={AlertTriangle} color="red" index={5} />
        <StatCard title="Open Bug/Requests" value={data.openIssuesCount} icon={Inbox} color="orange" index={6} />
      </div>

      <div className="mt-10 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
         <h2 className="text-2xl font-bold tracking-tight mb-6">Recent Activity</h2>
         {/* Placeholder for dynamic recent activity feed */}
         <div className="space-y-4">
            <div className="flex gap-4 items-start p-4 bg-black/40 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                   <p className="text-white"><strong>John Doe</strong> borrowed <span className="text-primary">"The Pragmatic Programmer"</span></p>
                   <p className="text-xs text-zinc-500 mt-1">2 hours ago</p>
                </div>
            </div>
            <div className="flex gap-4 items-start p-4 bg-black/40 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Inbox className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                   <p className="text-white"><strong>Alice Smith</strong> raised a new issue: <span className="text-primary italic">Lost book "Clean Code"</span></p>
                   <p className="text-xs text-zinc-500 mt-1">5 hours ago</p>
                </div>
            </div>
         </div>
      </div>
    </>
  );
};

export default AdminDashboard;
