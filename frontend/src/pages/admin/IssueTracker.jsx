import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIssues, resetIssueState } from '../../store/slices/issueSlice';
import { 
  Search, 
  Filter, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  CalendarDays
} from 'lucide-react';

const IssueTracker = () => {
  const dispatch = useDispatch();
  const { issues, isLoading } = useSelector((state) => state.issue);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, returned, overdue

  useEffect(() => {
    dispatch(getIssues());
    return () => { dispatch(resetIssueState()); };
  }, [dispatch]);

  const filteredIssues = issues.filter(issue => {
    const searchMatch = 
      issue.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.book?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!searchMatch) return false;

    const isOverdue = new Date() > new Date(issue.dueDate);
    
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return issue.status === 'issued';
    if (filterStatus === 'returned') return issue.status === 'returned';
    if (filterStatus === 'overdue') return issue.status === 'issued' && isOverdue;
    return true;
  });

  const getStatusBadge = (status, dueDate) => {
    if (status === 'returned') {
      return <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-max"><CheckCircle2 className="w-3.5 h-3.5" /> Returned</span>;
    }
    const isOverdue = new Date() > new Date(dueDate);
    if (isOverdue) {
      return <span className="px-2.5 py-1 rounded bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-max"><AlertTriangle className="w-3.5 h-3.5" /> Overdue</span>;
    }
    return <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-max"><BookOpen className="w-3.5 h-3.5" /> Active Issue</span>;
  };

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Global Issue Tracker</h1>
          <p className="text-zinc-400">Ledger of all library cross-platform transactions</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search references..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
            >
              <option value="all">All Transactions</option>
              <option value="active">Active Checkouts</option>
              <option value="returned">Completed Returns</option>
              <option value="overdue">Overdue Items</option>
            </select>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-xl shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 text-xs font-bold uppercase tracking-wider text-zinc-500">
                  <th className="p-5">Transaction Details</th>
                  <th className="p-5">Dates Logging</th>
                  <th className="p-5">Status Snapshot</th>
                  <th className="p-5 text-right">Fines Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-zinc-500">No transaction records found matching filter constraints.</td>
                  </tr>
                ) : filteredIssues.map((issue) => (
                  <tr key={issue._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5">
                      <p className="text-white font-bold line-clamp-1 text-base">{issue.book?.title}</p>
                      <p className="text-zinc-400 font-medium text-xs mt-1">Issued to: <span className="text-indigo-400 hover:underline cursor-pointer">{issue.student?.name}</span></p>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <CalendarDays className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-xs font-semibold text-zinc-400 uppercase">Out: {new Date(issue.issueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-xs font-semibold text-zinc-400 uppercase">Due: {new Date(issue.dueDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      {getStatusBadge(issue.status, issue.dueDate)}
                    </td>
                    <td className="p-5 text-right">
                      {issue.status === 'returned' ? (
                        <span className="text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs">
                          ₹{issue.fine || 0} Paid
                        </span>
                      ) : (
                        <span className="text-zinc-500 italic text-xs font-medium">Pending Finalization</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueTracker;
