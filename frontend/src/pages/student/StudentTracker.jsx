import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  CalendarCheck,
  Search,
  ArrowRightLeft,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyIssues, resetIssueState } from '../../store/slices/issueSlice';

const StudentTracker = () => {
  const dispatch = useDispatch();
  const { issues, isLoading } = useSelector((state) => state.issue);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getMyIssues());
    return () => { dispatch(resetIssueState()); };
  }, [dispatch]);

  const filteredHistory = issues.filter(item => 
    item.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.book?.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const returnedBooks = issues.filter(i => i.status === 'returned');
  const totalFines = returnedBooks.reduce((acc, curr) => acc + (curr.fine || 0), 0);

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Issue Tracker</h1>
          <p className="text-zinc-400 text-lg">Timeline of your borrowing history and activity</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search history..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-xl shadow-black/20"
          />
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex flex-col justify-center">
          <p className="text-primary font-semibold mb-1 uppercase tracking-wider text-xs">Total Issued</p>
          <h3 className="text-3xl font-bold text-white flex items-end gap-2">
            {issues.length} <span className="text-sm text-zinc-400 font-medium pb-1.5">books</span>
          </h3>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col justify-center">
          <p className="text-emerald-400 font-semibold mb-1 uppercase tracking-wider text-xs">On-time Returns</p>
          <h3 className="text-3xl font-bold text-white flex items-end gap-2">
            {returnedBooks.length} <span className="text-sm text-zinc-400 font-medium pb-1.5">books</span>
          </h3>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col justify-center">
          <p className="text-red-400 font-semibold mb-1 uppercase tracking-wider text-xs">Total Fines Paid</p>
          <h3 className="text-3xl font-bold text-white flex items-end gap-2">
            ₹{totalFines}
          </h3>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-zinc-900/20 rounded-3xl border border-white/5 border-dashed">
          <ArrowRightLeft className="w-12 h-12 text-zinc-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No history found</h3>
          <p className="text-zinc-400 max-w-sm">No activity matches your search criteria.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-white/10 ml-6 md:ml-12 pl-8 md:pl-12 space-y-12 animate-in slide-in-from-bottom-8 duration-500 fade-in py-4">
          {filteredHistory.map((item) => {
            const isOverdue = item.status === 'issued' && new Date() > new Date(item.dueDate);
            const statusDisplay = item.status === 'returned' ? 'Returned' : (isOverdue ? 'Overdue' : 'Active');
            
            return (
              <div key={item._id} className="relative group">
                {/* Timeline dot */}
                <div className={`absolute -left-[45px] md:-left-[61px] w-6 h-6 rounded-full border-4 border-black box-content flex items-center justify-center top-1 transition-transform group-hover:scale-110 ${
                  item.status === 'issued' && !isOverdue ? 'bg-indigo-500' :
                  isOverdue ? 'bg-orange-500' :
                  'bg-emerald-500'
                }`}>
                  {item.status === 'issued' && !isOverdue ? <BookOpen className="w-3 h-3 text-white" /> : 
                   isOverdue ? <Clock className="w-3 h-3 text-white" /> :
                   <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>

                {/* Content Card */}
                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 hover:bg-zinc-900/60 hover:border-white/10 transition-all shadow-xl shadow-black/10">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          item.status === 'issued' && !isOverdue ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          isOverdue ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {statusDisplay}
                        </span>
                        {item.status === 'returned' && item.fine > 0 && (
                          <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                            Fine: ₹{item.fine}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-1">{item.book?.title}</h3>
                      <p className="text-zinc-400 font-medium">by {item.book?.author}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 rounded-2xl p-5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                        <CalendarCheck className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-0.5">Issue Date</p>
                        <p className="text-white text-sm font-medium">{new Date(item.issueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                        {item.status === 'issued' ? (
                          <Clock className="w-5 h-5 text-zinc-400" />
                        ) : (
                          isOverdue ? <Clock className="w-5 h-5 text-orange-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-0.5">Deadline / Returned On</p>
                        <p className={`text-sm font-medium ${
                          item.status === 'issued' && !isOverdue ? 'text-white' :
                          isOverdue ? 'text-orange-400' :
                          'text-emerald-400'
                        }`}>{item.status === 'returned' ? new Date(item.returnDate).toLocaleDateString() : new Date(item.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default StudentTracker;
