import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentDetails } from '../../store/slices/adminSlice';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Loader2,
  CalendarDays
} from 'lucide-react';

const StudentDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studentDetails, isLoading, isError, message } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getStudentDetails(id));
  }, [dispatch, id]);

  if (isLoading || !studentDetails) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  if (isError) {
    return <div className="text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">{message || 'Error loading student details'}</div>;
  }

  const { student, issueRecords } = studentDetails;
  const activeIssues = issueRecords?.filter(ir => ir.status === 'issued') || [];
  const returnedIssues = issueRecords?.filter(ir => ir.status === 'returned') || [];
  const totalFines = returnedIssues.reduce((acc, curr) => acc + (curr.fine || 0), 0);
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculateFine = (dueDate, returnDate, status) => {
    if (status === 'returned') return 'Paid'; // Real fine handled in backend
    const today = new Date();
    const targetDate = new Date(dueDate);
    if (today > targetDate) {
      const diffTime = Math.abs(today - targetDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return `₹${diffDays}`;
    }
    return '₹0';
  };

  return (
    <div className="space-y-6 pb-10">
      <header className="mb-8">
        <button 
          onClick={() => navigate('/admin/students')} 
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Student Profile</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-50" />
            
            <div className="flex flex-col items-center text-center relative z-10 pt-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-indigo-600 p-1 mb-4">
                <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center border-4 border-zinc-950">
                  <span className="text-3xl font-bold text-white">{student.name.charAt(0)}</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-1">{student.name}</h2>
              <span className={`px-3 py-1 bg-white/5 rounded-md text-xs font-bold uppercase tracking-wider ${student.isApproved ? 'text-emerald-400 border-emerald-500/20' : 'text-amber-400'}`}>
                {student.isApproved ? 'Approved' : 'Pending'}
              </span>
              
              <div className="w-full bg-white/5 rounded-2xl p-4 border border-white/5 mt-6 space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-300">{student.studentId || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-300 truncate">{student.email}</span>
                </div>
                {student.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm font-medium text-zinc-300">{student.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <CalendarDays className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs text-zinc-400">Joined {formatDate(student.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center gap-2">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Total Fines Paid</h3>
            <p className="text-3xl font-black text-rose-500">₹{totalFines}</p>
          </div>
        </div>

        {/* Issue Statistics & History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6">
              <BookOpen className="w-6 h-6 text-primary mb-3" />
              <p className="text-3xl font-bold text-white mb-1">{issueRecords?.length || 0}</p>
              <p className="text-xs font-semibold uppercase text-zinc-500">Total Books Taken</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6">
              <Clock className="w-6 h-6 text-amber-500 mb-3" />
              <p className="text-3xl font-bold text-white mb-1">{activeIssues.length}</p>
              <p className="text-xs font-semibold uppercase text-zinc-500">Currently Issued</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 hidden md:block">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-3" />
              <p className="text-3xl font-bold text-white mb-1">{returnedIssues.length}</p>
              <p className="text-xs font-semibold uppercase text-zinc-500">Books Returned</p>
            </div>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden mt-6">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Issue History Timeline</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/20 text-xs uppercase tracking-wider text-zinc-400 border-b border-white/10">
                    <th className="p-4 font-semibold">Book Name</th>
                    <th className="p-4 font-semibold">Issue Date</th>
                    <th className="p-4 font-semibold">Return Deadline</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Fine Assessed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {issueRecords?.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-zinc-500">No borrowing history.</td>
                    </tr>
                  ) : issueRecords?.map((record) => {
                    const isOverdue = record.status === 'issued' && new Date() > new Date(record.dueDate);
                    
                    return (
                    <tr key={record._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 font-medium text-white line-clamp-1">{record.book?.title || 'Unknown Book'}</td>
                      <td className="p-4 text-zinc-400">{formatDate(record.issueDate)}</td>
                      <td className="p-4 text-zinc-400 font-medium">{formatDate(record.dueDate)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          record.status === 'returned' ? 'text-emerald-400 bg-emerald-500/10' :
                          isOverdue ? 'text-red-400 bg-red-500/10' :
                          'text-indigo-400 bg-indigo-500/10'
                        }`}>
                          {record.status === 'returned' ? 'Returned' : (isOverdue ? 'Overdue' : 'On Time')}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-rose-400">
                        {record.status === 'returned' ? `₹${record.fine || 0}` : calculateFine(record.dueDate, record.returnDate, record.status)}
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
