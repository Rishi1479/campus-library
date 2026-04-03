import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getStudents, resetAdminState, approveStudent } from '../../store/slices/adminSlice';
import { 
  Users, 
  Search, 
  ChevronRight,
  Loader2,
  Phone,
  Mail
} from 'lucide-react';

const Students = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { students, isLoading } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getStudents());
    return () => { dispatch(resetAdminState()); };
  }, [dispatch]);

  const filteredStudents = students?.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Student Directory</h1>
          <p className="text-zinc-400">View registered students and track their borrowing history</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search by name, ID or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.length === 0 ? (
            <div className="col-span-full py-20 text-center border border-white/5 border-dashed rounded-3xl bg-zinc-900/20">
              <Users className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No students found</h3>
              <p className="text-zinc-500">No registered students match your search.</p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div 
                key={student._id} 
                onClick={() => navigate(`/admin/students/${student._id}`)}
                className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:bg-zinc-900/60 hover:border-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-indigo-600 p-0.5">
                      <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center border-2 border-zinc-950">
                        <span className="text-xl font-bold text-white">{student.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{student.name}</h3>
                      <p className="text-xs uppercase tracking-wider font-semibold text-zinc-500">{student.studentId || 'ID Pending'}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors group-hover:translate-x-1" />
                </div>
                
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-300 truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-300 truncate">{student.phone || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${student.isApproved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {student.isApproved ? 'Approved' : 'Pending'}
                  </span>
                  {!student.isApproved && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); dispatch(approveStudent(student._id)); }}
                      className="bg-primary hover:bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Students;
