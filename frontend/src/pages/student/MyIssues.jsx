import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyIssues, resetIssueState } from '../../store/slices/issueSlice';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Loader2
} from 'lucide-react';

const MyIssues = () => {
  const dispatch = useDispatch();
  const { issues, isLoading } = useSelector((state) => state.issue);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getMyIssues());
    return () => { dispatch(resetIssueState()); };
  }, [dispatch]);
  
  const handleReturn = (id) => {
    // Return flow from student side usually isn't direct in library systems. They submit at kiosk.
    // So this button serves as a reminder or "request return" dummy logic.
    alert('Please visit the admin desk to physically return this book and pay any applicable fines.');
  };

  const activeIssues = issues.filter(issue => issue.status === 'issued');

  const filteredBooks = activeIssues.filter(issue => 
    issue.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    issue.book?.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">My Issues</h1>
          <p className="text-zinc-400 text-lg">Manage your currently borrowed books and track due dates</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search active issues..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-xl shadow-black/20"
            />
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-zinc-900/20 rounded-3xl border border-white/5 border-dashed">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No active issues found</h3>
          <p className="text-zinc-400 max-w-sm">You haven't issued any books yet or none match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-500 fade-in">
          {filteredBooks.map((issue, index) => {
            const isOverdue = new Date() > new Date(issue.dueDate);
            const coverColor = isOverdue ? 'red' : 'indigo';
            
            return (
            <div 
              key={issue._id} 
              className={`bg-zinc-900/40 backdrop-blur-xl border rounded-3xl p-6 transition-all duration-300 flex flex-col items-start gap-4 relative overflow-hidden group ${isOverdue ? 'border-red-500/30 shadow-[0_0_30px_-5px_rgba(239,68,68,0.1)] hover:border-red-500/50 hover:bg-zinc-900/80' : 'border-white/5 hover:border-white/10 hover:bg-zinc-900/80'}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Decorative top gradient */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${isOverdue ? 'from-red-500 to-orange-500' : 'from-primary to-indigo-500'} opacity-50 group-hover:opacity-100 transition-opacity`} />
              
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-16 bg-${coverColor}-500/10 rounded flex items-center justify-center border border-${coverColor}-500/20 shrink-0`}>
                    <BookOpen className={`w-6 h-6 text-${coverColor}-400/80`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white leading-tight line-clamp-1">{issue.book?.title}</h3>
                    <p className="text-zinc-400 text-sm">{issue.book?.author}</p>
                  </div>
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-4 py-4 border-y border-white/5 mt-2">
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs uppercase tracking-wider font-semibold">Issued On</span>
                  </div>
                  <p className="text-white text-sm font-medium">{new Date(issue.issueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs uppercase tracking-wider font-semibold">Due Date</span>
                  </div>
                  <p className={`text-sm font-medium ${isOverdue ? 'text-red-400' : 'text-white'}`}>{new Date(issue.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="w-full flex items-center justify-between mt-auto pt-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${isOverdue ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                  {isOverdue ? (
                    <><AlertTriangle className="w-3.5 h-3.5" /> Overdue</>
                  ) : (
                    <><CheckCircle2 className="w-3.5 h-3.5" /> On Track</>
                  )}
                </div>
                
                <button 
                  onClick={() => handleReturn(issue._id)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg ${isOverdue ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' : 'bg-white hover:bg-zinc-200 text-black shadow-white/10'}`}
                >
                  Return Flow
                </button>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
};

export default MyIssues;
