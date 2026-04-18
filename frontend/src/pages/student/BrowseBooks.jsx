import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBooks, reset } from '../../store/slices/bookSlice';
import { requestBook } from '../../store/slices/issueSlice';
import { 
  BookOpen, 
  Search, 
  Loader2,
  AlertTriangle,
  Library,
  Filter
} from 'lucide-react';

const BASE_URL = 'https://campus-library-backend-94z0.onrender.com';

const BookCard = ({ book, index }) => {
  const isAvailable = book.availableCopies > 0;
  const dispatch = useDispatch();

  const handleRequest = () => {
    dispatch(requestBook({ bookId: book._id }));
    alert('Book requested successfully!');
  };

  return (
    <div 
      className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:bg-zinc-900/60 hover:border-white/10 transition-all duration-300 group flex flex-col h-full"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="h-48 bg-zinc-950/50 flex flex-col items-center justify-center p-6 relative overflow-hidden group-hover:bg-zinc-950/80 transition-colors">
        {book.coverImage ? (
          <img 
            src={book.coverImage.startsWith('http') ? book.coverImage : `${BASE_URL}${book.coverImage}`} 
            alt={book.title} 
            className="h-full w-[100px] object-cover rounded-md z-10 shadow-lg border border-white/5"
          />
        ) : (
          <div className="w-24 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-md shadow-lg flex items-center justify-center border border-white/5 z-10">
            <Library className="w-8 h-8 text-indigo-400/50" />
          </div>
        )}
        {/* Decorative background circle */}
        <div className="absolute bg-primary/10 w-32 h-32 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/20 transition-all" />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-semibold text-lg leading-tight text-white line-clamp-2">
            {book.title}
          </h3>
        </div>
        
        <p className="text-zinc-400 mb-4 text-sm font-medium">{book.author}</p>
        
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between mb-4">
          <span className="text-xs font-semibold px-2.5 py-1 bg-white/5 rounded-md text-zinc-300">
            {book.category}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${isAvailable ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {isAvailable ? `${book.availableCopies} Available` : 'Out of Stock'}
          </span>
        </div>
        
        <button 
          onClick={handleRequest}
          disabled={!isAvailable}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
            isAvailable 
            ? 'bg-primary hover:bg-indigo-600 text-white shadow-lg shadow-primary/20 hover:shadow-primary/40' 
            : 'bg-white/5 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {isAvailable ? 'Request Book' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};

const BrowseBooks = () => {
  const dispatch = useDispatch();
  const { books, isLoading, isError, message } = useSelector((state) => state.book);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    dispatch(getBooks());
    
    return () => { dispatch(reset()); }
  }, [dispatch]);

  // Extract unique categories
  const categories = ['All', ...new Set(books.map(book => book.category))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
        <p>Error loading books: {message}</p>
      </div>
    );
  }

  return (
    <>
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Browse Books</h1>
          <p className="text-zinc-400 text-lg">Explore our collection and issue your next read</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search title, author..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-xl shadow-black/20"
            />
          </div>
          
          <div className="relative w-full sm:w-48">
            <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full appearance-none bg-zinc-900/80 border border-white/10 rounded-2xl pl-10 pr-10 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-xl shadow-black/20"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </header>

      {filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-zinc-900/20 rounded-3xl border border-white/5 border-dashed">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No books found</h3>
          <p className="text-zinc-400 max-w-sm">We couldn't find any books matching your search criteria. Try a different filter or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-8 duration-500 fade-in">
          {filteredBooks.map((book, index) => (
            <BookCard key={book._id} book={book} index={index} />
          ))}
        </div>
      )}
    </>
  );
};

export default BrowseBooks;
