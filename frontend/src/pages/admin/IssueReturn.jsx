import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIssues, issueBook, returnBook, resetIssueState, approveIssueRequest } from '../../store/slices/issueSlice';
import { getStudents } from '../../store/slices/adminSlice';
import { getBooks } from '../../store/slices/bookSlice';
import { 
  BookOpen, 
  Search, 
  ArrowLeftRight,
  UserCheck,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';

const IssueReturn = () => {
  const dispatch = useDispatch();
  
  const { issues, isLoading } = useSelector((state) => state.issue);
  const { students } = useSelector((state) => state.admin);
  const { books } = useSelector((state) => state.book);

  const [activeTab, setActiveTab] = useState('issue'); // 'issue' or 'return'
  
  // Issue Form State
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedBook, setSelectedBook] = useState('');

  // Return Search State
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getIssues());
    dispatch(getStudents());
    dispatch(getBooks());
    return () => { dispatch(resetIssueState()); };
  }, [dispatch]);

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedBook) return alert('Select both student and book');
    dispatch(issueBook({ studentId: selectedStudent, bookId: selectedBook }));
    setSelectedStudent('');
    setSelectedBook('');
    setActiveTab('return'); // Switch to return list to see the newly issued item
  };

  const handleReturnAction = (id) => {
    if (window.confirm('Confirm return and calculate fine?')) {
      dispatch(returnBook(id));
    }
  };

  const pendingRequests = issues.filter(issue => issue.status === 'requested');

  const handleApproveRequest = (id) => {
    if (window.confirm('Approve this book request?')) {
      dispatch(approveIssueRequest(id));
    }
  };

  const activeIssues = issues.filter(issue => issue.status === 'issued');
  const filteredReturns = activeIssues.filter(issue => 
    issue.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.book?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Issue / Return Kiosk</h1>
        <p className="text-zinc-400">Manually issue a book or process a student return</p>
      </header>

      {/* Tabs */}
      <div className="flex p-1 bg-zinc-900 border border-white/5 rounded-2xl w-full max-w-2xl mx-auto mb-8">
        <button 
          onClick={() => setActiveTab('issue')}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all ${activeTab === 'issue' ? 'bg-primary text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
        >
          Issue Book
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all ${activeTab === 'requests' ? 'bg-amber-500 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
        >
          Pending Requests
        </button>
        <button 
          onClick={() => setActiveTab('return')}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all ${activeTab === 'return' ? 'bg-emerald-500 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
        >
          Process Return
        </button>
      </div>

      <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-10 shadow-xl overflow-hidden relative min-h-[400px]">
        {isLoading && <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}

        {activeTab === 'issue' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <ArrowLeftRight className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white">Create Issue Record</h2>
              <p className="text-zinc-400 mt-2">The due date will automatically be set to 14 days from today.</p>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" /> Select Student
                </label>
                <select 
                  required
                  value={selectedStudent} 
                  onChange={e => setSelectedStudent(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                >
                  <option value="" disabled>-- Choose a registered student --</option>
                  {students?.map(student => (
                    <option key={student._id} value={student._id}>{student.name} ({student.studentId || student.email})</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Select Book
                </label>
                <select 
                  required
                  value={selectedBook} 
                  onChange={e => setSelectedBook(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                >
                  <option value="" disabled>-- Choose an available book --</option>
                  {books?.filter(b => b.availableCopies > 0).map(book => (
                    <option key={book._id} value={book._id}>{book.title} ({book.availableCopies} available)</option>
                  ))}
                </select>
              </div>
              
              <div className="pt-4 text-center">
                <button type="submit" className="bg-primary hover:bg-indigo-600 w-full py-4 rounded-2xl font-bold text-white text-lg transition-colors shadow-lg shadow-primary/20 hover:shadow-primary/40">
                  Issue Book Now
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="animate-in slide-in-from-bottom-8 duration-300">
            <h2 className="text-2xl font-bold text-white mb-8">Pending Book Requests</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-wider text-zinc-400">
                    <th className="p-4 font-semibold">Student</th>
                    <th className="p-4 font-semibold">Book Title</th>
                    <th className="p-4 font-semibold">Requested On</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {pendingRequests.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-zinc-500">No pending requests found.</td>
                    </tr>
                  ) : pendingRequests.map((req) => (
                      <tr key={req._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 text-white font-medium">{req.student?.name || 'Unknown'}</td>
                        <td className="p-4 text-zinc-300 line-clamp-1">{req.book?.title || 'Unknown'}</td>
                        <td className="p-4 text-zinc-400">{new Date(req.createdAt || req.issueDate || Date.now()).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleApproveRequest(req._id)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold transition-colors text-xs"
                          >
                            Accept Request
                          </button>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'return' && (
          <div className="animate-in slide-in-from-left-8 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold text-white">Active Checkouts</h2>
              <div className="relative w-full sm:w-72">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search student or book..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-wider text-zinc-400">
                    <th className="p-4 font-semibold">Student</th>
                    <th className="p-4 font-semibold">Book Title</th>
                    <th className="p-4 font-semibold">Due Date</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredReturns.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-zinc-500">No active checkouts found.</td>
                    </tr>
                  ) : filteredReturns.map((issue) => {
                    const isOverdue = new Date() > new Date(issue.dueDate);
                    const diffDays = isOverdue ? Math.ceil(Math.abs(new Date() - new Date(issue.dueDate)) / (1000 * 60 * 60 * 24)) : 0;
                    
                    return (
                      <tr key={issue._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 text-white font-medium">{issue.student?.name || 'Unknown'}</td>
                        <td className="p-4 text-zinc-300 line-clamp-1">{issue.book?.title || 'Unknown'}</td>
                        <td className="p-4 text-zinc-400">{new Date(issue.dueDate).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-max ${isOverdue ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-zinc-800 text-zinc-300'}`}>
                            {isOverdue ? <><AlertTriangle className="w-3 h-3" /> Overdue (₹{diffDays})</> : <><CalendarCheck className="w-3 h-3" /> On Time</>}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleReturnAction(issue._id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold transition-colors text-xs"
                          >
                            Process Return
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueReturn;
