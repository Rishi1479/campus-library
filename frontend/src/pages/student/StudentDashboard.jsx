import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyIssues } from '../../store/slices/issueSlice';
import { getBooks } from '../../store/slices/bookSlice';
import { 
  BookOpen, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Library,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BASE_URL = 'https://campus-library-backend-94z0.onrender.com';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <div 
    className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:bg-zinc-900/60 transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in group relative overflow-hidden"
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity bg-${color}-500`} />
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-zinc-400 font-medium mb-1">{title}</p>
        <h3 className="text-4xl font-bold text-white tracking-tight">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${color}-500/10 text-${color}-400`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { issues, isLoading: issuesLoading } = useSelector((state) => state.issue);
  const { books, isLoading: booksLoading } = useSelector((state) => state.book);

  useEffect(() => {
    dispatch(getMyIssues());
    dispatch(getBooks());
  }, [dispatch]);

  const activeIssues = useMemo(() => issues.filter(i => i.status === 'issued'), [issues]);
  const overdueCount = useMemo(() => activeIssues.filter(i => new Date() > new Date(i.dueDate)).length, [activeIssues]);
  
  // Calculate Due Soon (next 3 days)
  const dueSoon = useMemo(() => {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    return activeIssues.filter(i => {
      const d = new Date(i.dueDate);
      return d >= today && d <= threeDaysFromNow;
    });
  }, [activeIssues]);

  const stats = [
    { title: 'Books Issued', value: activeIssues.length, icon: BookOpen, color: 'indigo', delay: 0 },
    { title: 'Due Soon', value: dueSoon.length, icon: Clock, color: 'amber', delay: 100 },
    { title: 'Overdue', value: overdueCount, icon: AlertTriangle, color: 'red', delay: 200 },
    { title: 'Available Limit', value: Math.max(0, 5 - activeIssues.length), icon: CheckCircle2, color: 'emerald', delay: 300 }, // Assuming 5 max limit
  ];

  // Map latest 5 activities
  const recentActivity = useMemo(() => {
    return [...issues]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((i, index) => ({
        id: i._id,
        action: i.status === 'returned' ? 'Returned' : 'Issued',
        book: i.book?.title || 'Unknown Book',
        date: new Date(i.status === 'returned' ? i.returnDate : i.issueDate).toLocaleDateString(),
        type: i.status === 'returned' ? 'return' : 'issue'
      }));
  }, [issues]);
  
  // Quick recommendations logic (Top 3 books by total Copies to simulate popularity)
  const recommendedBooks = useMemo(() => {
    return [...(books || [])]
      .sort((a, b) => b.totalCopies - a.totalCopies)
      .slice(0, 3);
  }, [books]);

  if (issuesLoading || booksLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Student'}</h1>
        <p className="text-zinc-400 text-lg">Here's an overview of your library activity</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column - Due Reminders and Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Due Reminders Section */}
          <section className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Due Reminders
              </h2>
              <Link to="/student/my-issues" className="text-sm font-medium text-primary hover:text-indigo-400 transition-colors flex items-center gap-1 group">
                View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {dueSoon.length > 0 ? (
              <div className="space-y-4">
                {dueSoon.map(reminder => (
                  <div key={reminder._id} className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-white/5 rounded flex items-center justify-center shrink-0 border border-white/10">
                        <BookOpen className="w-6 h-6 text-amber-500/60" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg line-clamp-1">{reminder.book?.title}</h4>
                        <p className="text-zinc-400 text-sm">Due: <span className="text-amber-400 font-medium">{new Date(reminder.dueDate).toLocaleDateString()}</span></p>
                      </div>
                    </div>
                    <Link to="/student/my-issues" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-amber-500/20 whitespace-nowrap">
                      Return Flow
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
                <p className="text-zinc-400">You have no books due soon. Great job!</p>
              </div>
            )}
          </section>

          {/* Recommendations */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Recommended for You
              </h2>
              <Link to="/student/books" className="text-sm font-medium text-primary hover:text-indigo-400 transition-colors flex items-center gap-1 group">
                Browse Catalog <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recommendedBooks.map((book) => (
                <div key={book._id} className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:bg-zinc-900/60 transition-colors group cursor-pointer">
                  <div className="h-32 bg-zinc-950/50 rounded-xl mb-4 flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-colors overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {book.coverImage ? (
                      <img 
                        src={book.coverImage.startsWith('http') ? book.coverImage : `${BASE_URL}${book.coverImage}`} 
                        alt={book.title} 
                        className="h-full w-[80px] object-cover z-10 rounded shadow-md"
                      />
                    ) : (
                      <Library className="w-8 h-8 text-zinc-600 group-hover:text-primary transition-colors z-10" />
                    )}
                  </div>
                  <h4 className="font-semibold text-white line-clamp-1 mb-1">{book.title}</h4>
                  <p className="text-zinc-400 text-xs mb-3 line-clamp-1">{book.author}</p>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-white/5 rounded text-zinc-300">
                    {book.category}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Column - Recent Activity */}
        <div className="lg:col-span-1 border-tl border-white/5">
          <section className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 h-full">
            <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              {recentActivity.length === 0 && (
                <p className="text-zinc-500 text-center text-sm">No activity recorded yet.</p>
              )}
              {recentActivity.map((activity) => (
                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-zinc-950 text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                    {activity.type === 'issue' ? <BookOpen className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-wider ${activity.type === 'issue' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                        {activity.action}
                      </span>
                      <strong className="text-white text-sm line-clamp-1">{activity.book}</strong>
                      <time className="text-xs text-zinc-500 font-medium">{activity.date}</time>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Link to="/student/tracker" className="block text-center w-full mt-6 py-3 rounded-xl border border-white/10 text-sm font-semibold text-white hover:bg-white/5 transition-colors">
              View History Ledger
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
