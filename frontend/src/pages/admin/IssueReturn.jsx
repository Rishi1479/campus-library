import { useState, useEffect, useRef } from 'react';
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
  Loader2,
  Printer,
  X,
  ClipboardCheck
} from 'lucide-react';


const SlipModal = ({ slip, onClose }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank', 'width=480,height=620');
    win.document.write(`
      <html>
        <head>
          <title>Library Slip</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Courier New', monospace; background: #fff; color: #000; padding: 24px; }
            .slip-header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 12px; margin-bottom: 16px; }
            .slip-header h1 { font-size: 18px; font-weight: 900; letter-spacing: 1px; }
            .slip-header p  { font-size: 11px; color: #555; margin-top: 4px; }
            .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; border: 1.5px solid; margin-bottom: 12px; }
            .badge-issue  { color: #4f46e5; border-color: #4f46e5; }
            .badge-return { color: #10b981; border-color: #10b981; }
            .row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px dotted #ccc; font-size: 13px; }
            .row:last-child { border-bottom: none; }
            .label { color: #555; font-weight: 600; }
            .value { font-weight: 800; text-align: right; max-width: 55%; }
            .footer { text-align: center; margin-top: 18px; font-size: 10px; color: #888; border-top: 2px dashed #333; padding-top: 10px; }
            .stamp { font-size: 28px; text-align: center; margin: 10px 0 4px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const isReturn = slip.type === 'return';
  const badgeClass = isReturn ? 'badge-return' : 'badge-issue';
  const badgeLabel = isReturn ? '✦ Return Slip' : '✦ Issue Slip';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="relative bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Slip preview */}
        <div className="p-8 pb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <ClipboardCheck className={`w-5 h-5 ${isReturn ? 'text-emerald-400' : 'text-indigo-400'}`} />
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">
              {isReturn ? 'Return Confirmation Slip' : 'Issue Confirmation Slip'}
            </p>
          </div>
          <p className="text-center text-zinc-600 text-xs mb-6">Show this slip at the library exit gate</p>

          {/* Printable content */}
          <div ref={printRef}>
            <div className="slip-header" style={{textAlign:'center', borderBottom:'2px dashed #555', paddingBottom:'12px', marginBottom:'16px'}}>
              <h1 style={{fontSize:'18px', fontWeight:900, color:'#e5e7eb', letterSpacing:'1px'}}>📚 CAMPUS LIBRARY</h1>
              <p style={{fontSize:'11px', color:'#9ca3af', marginTop:'4px'}}>Official Book {isReturn ? 'Return' : 'Issue'} Record</p>
            </div>

            <div style={{textAlign:'center', marginBottom:'14px'}}>
              <span className={`badge ${badgeClass}`} style={{
                display:'inline-block', padding:'3px 12px', borderRadius:'999px',
                fontSize:'11px', fontWeight:800, letterSpacing:'1px', textTransform:'uppercase',
                border:`1.5px solid ${isReturn ? '#10b981' : '#6366f1'}`,
                color: isReturn ? '#10b981' : '#6366f1'
              }}>
                {badgeLabel}
              </span>
            </div>

            {/* Rows */}
            {[
              { label: 'Student Name', value: slip.studentName },
              { label: 'Roll Number',  value: slip.rollNumber  },
              { label: 'Department',   value: slip.department  },
              { label: 'Book Title',   value: slip.bookTitle   },
              { label: 'Author',       value: slip.author      },
              ...(isReturn ? [
                { label: 'Issue Date',   value: slip.issueDate  },
                { label: 'Return Date',  value: slip.returnDate },
                ...(slip.fine > 0 ? [{ label: '⚠ Fine Amount', value: `₹ ${slip.fine}` }] : [])
              ] : [
                { label: 'Issue Date', value: slip.issueDate },
                { label: 'Due Date',   value: slip.dueDate   },
              ]),
              { label: 'Slip Generated', value: new Date().toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display:'flex', justifyContent:'space-between', padding:'7px 0',
                borderBottom:'1px dotted #374151', fontSize:'13px'
              }}>
                <span style={{color:'#9ca3af', fontWeight:600}}>{label}</span>
                <span style={{fontWeight:800, color:'#f3f4f6', textAlign:'right', maxWidth:'55%',
                  ...(label.includes('Fine') ? {color:'#f87171'} : {})
                }}>{value || '—'}</span>
              </div>
            ))}

            <div style={{textAlign:'center', marginTop:'18px', fontSize:'10px', color:'#6b7280',
              borderTop:'2px dashed #374151', paddingTop:'10px'}}>
              <div style={{fontSize:'24px', margin:'6px 0 2px'}}>
                {isReturn ? '✅' : '📖'}
              </div>
              {isReturn
                ? 'Book successfully returned. Thank you!'
                : 'Please carry this slip with the book.'}
              <br />
              <strong style={{color:'#9ca3af'}}>Authorized by Library Admin</strong>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-8 pb-8 mt-2">
          <button
            onClick={handlePrint}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all
              ${isReturn
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              }`}
          >
            <Printer className="w-4 h-4" />
            Print Slip
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl font-bold text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const IssueReturn = () => {
  const dispatch = useDispatch();
  
  const { issues, isLoading } = useSelector((state) => state.issue);
  const { students } = useSelector((state) => state.admin);
  const { books } = useSelector((state) => state.book);

  const [activeTab, setActiveTab] = useState('issue');
  
  // Issue Form State
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedBook, setSelectedBook] = useState('');

  // Return Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Slip modal state
  const [slip, setSlip] = useState(null);

  useEffect(() => {
    dispatch(getIssues());
    dispatch(getStudents());
    dispatch(getBooks());
    return () => { dispatch(resetIssueState()); };
  }, [dispatch]);

  // ── Issue handler ──────────────────────────
  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedBook) return alert('Select both student and book');

    const student = students.find(s => s._id === selectedStudent);
    const book    = books.find(b => b._id === selectedBook);
    const issueDate = new Date().toLocaleDateString();
    const dueDate   = new Date(Date.now() + 14 * 86400000).toLocaleDateString();

    await dispatch(issueBook({ studentId: selectedStudent, bookId: selectedBook }));

    // Show slip
    setSlip({
      type: 'issue',
      studentName: student?.name        || '—',
      rollNumber:  student?.studentId   || student?.email || '—',
      department:  student?.department  || '—',
      bookTitle:   book?.title          || '—',
      author:      book?.author         || '—',
      issueDate,
      dueDate,
    });

    setSelectedStudent('');
    setSelectedBook('');
    setActiveTab('return');
  };

  // ── Return handler ─────────────────────────
  const handleReturnAction = async (issue) => {
    if (!window.confirm('Confirm return and calculate fine?')) return;

    await dispatch(returnBook(issue._id));

    const today      = new Date();
    const dueDate    = new Date(issue.dueDate);
    const isOverdue  = today > dueDate;
    const diffDays   = isOverdue ? Math.ceil(Math.abs(today - dueDate) / 86400000) : 0;

    setSlip({
      type: 'return',
      studentName: issue.student?.name       || '—',
      rollNumber:  issue.student?.studentId  || issue.student?.email || '—',
      department:  issue.student?.department || '—',
      bookTitle:   issue.book?.title         || '—',
      author:      issue.book?.author        || '—',
      issueDate:   new Date(issue.issueDate).toLocaleDateString(),
      returnDate:  today.toLocaleDateString(),
      fine:        diffDays,
    });
  };

  const pendingRequests = issues.filter(issue => issue.status === 'requested');

  const handleApproveRequest = async (req) => {
    if (!window.confirm('Approve this book request?')) return;
    await dispatch(approveIssueRequest(req._id));

    // Find full student/book objects from store
    const student = students.find(s => s._id === (req.student?._id || req.student));
    const book    = books.find(b => b._id === (req.book?._id || req.book));
    const issueDate = new Date().toLocaleDateString();
    const dueDate   = new Date(Date.now() + 14 * 86400000).toLocaleDateString();

    setSlip({
      type: 'issue',
      studentName: req.student?.name       || student?.name       || '—',
      rollNumber:  req.student?.studentId  || student?.studentId  || req.student?.email || '—',
      department:  req.student?.department || student?.department || '—',
      bookTitle:   req.book?.title         || book?.title         || '—',
      author:      req.book?.author        || book?.author        || '—',
      issueDate,
      dueDate,
    });
  };

  const activeIssues    = issues.filter(issue => issue.status === 'issued');
  const filteredReturns = activeIssues.filter(issue =>
    issue.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.book?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Slip Modal */}
      {slip && <SlipModal slip={slip} onClose={() => setSlip(null)} />}

      <div className="space-y-6 pb-10 max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Issue / Return book</h1>
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

          {/* ── Issue Tab ──────────────────── */}
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
                  <button type="submit" className="bg-primary hover:bg-indigo-600 w-full py-4 rounded-2xl font-bold text-white text-lg transition-colors shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2">
                    <ClipboardCheck className="w-5 h-5" />
                    Issue Book & Generate Slip
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Pending Requests Tab ───────── */}
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
                              onClick={() => handleApproveRequest(req)}
                              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold transition-colors text-xs flex items-center gap-1 ml-auto"
                            >
                              <ClipboardCheck className="w-3.5 h-3.5" />
                              Accept & Print Slip
                            </button>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Return Tab ─────────────────── */}
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
                      <th className="p-4 font-semibold">Roll No.</th>
                      <th className="p-4 font-semibold">Book Title</th>
                      <th className="p-4 font-semibold">Due Date</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredReturns.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-zinc-500">No active checkouts found.</td>
                      </tr>
                    ) : filteredReturns.map((issue) => {
                      const isOverdue = new Date() > new Date(issue.dueDate);
                      const diffDays  = isOverdue ? Math.ceil(Math.abs(new Date() - new Date(issue.dueDate)) / 86400000) : 0;
                      
                      return (
                        <tr key={issue._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 text-white font-medium">{issue.student?.name || 'Unknown'}</td>
                          <td className="p-4 text-zinc-400 font-mono text-xs">{issue.student?.studentId || issue.student?.email || '—'}</td>
                          <td className="p-4 text-zinc-300 line-clamp-1">{issue.book?.title || 'Unknown'}</td>
                          <td className="p-4 text-zinc-400">{new Date(issue.dueDate).toLocaleDateString()}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-max ${isOverdue ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-zinc-800 text-zinc-300'}`}>
                              {isOverdue ? <><AlertTriangle className="w-3 h-3" /> Overdue (₹{diffDays})</> : <><CalendarCheck className="w-3 h-3" /> On Time</>}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => handleReturnAction(issue)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold transition-colors text-xs flex items-center gap-1 ml-auto"
                            >
                              <ClipboardCheck className="w-3.5 h-3.5" />
                              Return & Print Slip
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
    </>
  );
};

export default IssueReturn;
