import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../store/slices/authSlice';
import { BookOpen, AlertCircle, Loader2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    department: '',
  });

  const { name, email, password, studentId, department } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess || user) {
       navigate('/student/dashboard');
    }

    if (isError) {
      setTimeout(() => dispatch(reset()), 3000);
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      password,
      role: 'student',
      studentId,
      department,
    };
    dispatch(register(userData));
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden py-12">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full point-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full point-events-none" />

      <div className="w-full max-w-lg bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl z-10 mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
            <BookOpen className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h1>
          <p className="text-zinc-400 text-sm">Join the campus library system</p>
        </div>

        {isError && message && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{message}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="name">Full Name</label>
            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-colors" id="name" name="name" value={name} onChange={onChange} required placeholder="John Doe" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="studentId">Student ID</label>
              <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-colors" id="studentId" name="studentId" value={studentId} onChange={onChange} required placeholder="STU-12345" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="department">Department</label>
              <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-colors" id="department" name="department" value={department} onChange={onChange} required placeholder="Computer Science" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="email">Email</label>
            <input type="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-colors" id="email" name="email" value={email} onChange={onChange} required placeholder="john@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="password">Password</label>
            <input type="password" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-colors" id="password" name="password" value={password} onChange={onChange} required placeholder="••••••••" minLength="6" />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl transition-all duration-200 mt-4 shadow-lg shadow-primary/25 disabled:opacity-50 flex justify-center items-center"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-400">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
