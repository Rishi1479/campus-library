import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBooks, createBook, updateBook, deleteBook, reset } from '../../store/slices/bookSlice';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  BookOpen,
  Loader2,
  X
} from 'lucide-react';

const ManageBooks = () => {
  const dispatch = useDispatch();
  const { books, isLoading } = useSelector((state) => state.book);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '', category: '', totalCopies: 1, description: ''
  });

  useEffect(() => {
    dispatch(getBooks());
    return () => { dispatch(reset()); };
  }, [dispatch]);

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title, author: book.author, isbn: book.isbn || '', 
        category: book.category, totalCopies: book.totalCopies, description: book.description || ''
      });
    } else {
      setEditingBook(null);
      setFormData({ title: '', author: '', isbn: '', category: '', totalCopies: 1, description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBook) {
      dispatch(updateBook({ id: editingBook._id, bookData: formData }));
    } else {
      dispatch(createBook(formData));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      dispatch(deleteBook(id));
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Manage Books</h1>
          <p className="text-zinc-400">Add, edit, or remove books from the library</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search by title or ISBN..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors shrink-0"
          >
            <Plus className="w-5 h-5" /> Add Book
          </button>
        </div>
      </header>

      {isLoading && !isModalOpen ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-wider text-zinc-400">
                  <th className="p-4 font-semibold">Book Info</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Available</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-zinc-500">No books found.</td>
                  </tr>
                ) : filteredBooks.map((book) => (
                  <tr key={book._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center shrink-0 border border-white/5">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium line-clamp-1">{book.title}</p>
                        <p className="text-zinc-500 text-xs">{book.author} • {book.isbn}</p>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-300">
                      <span className="bg-white/5 px-2.5 py-1 rounded text-xs">{book.category}</span>
                    </td>
                    <td className="p-4 text-white font-medium">{book.totalCopies}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${book.availableCopies > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {book.availableCopies} available
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(book)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-300 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(book._id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Basic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase font-semibold text-zinc-500 tracking-wider">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-semibold text-zinc-500 tracking-wider">Author</label>
                  <input required type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-semibold text-zinc-500 tracking-wider">ISBN</label>
                  <input type="text" value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-semibold text-zinc-500 tracking-wider">Category</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-semibold text-zinc-500 tracking-wider">Total Copies</label>
                  <input required type="number" min="1" value={formData.totalCopies} onChange={e => setFormData({...formData, totalCopies: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase font-semibold text-zinc-500 tracking-wider">Description</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none resize-none" />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-semibold text-white hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" disabled={isLoading} className="px-5 py-2.5 bg-primary hover:bg-indigo-600 rounded-xl font-semibold text-white transition-colors">
                  {isLoading ? 'Saving...' : 'Save Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
