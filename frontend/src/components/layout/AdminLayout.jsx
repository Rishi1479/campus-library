import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex bg-black min-h-screen font-sans text-white selection:bg-primary/30">
      <Sidebar role="admin" />
      <div className="flex-1 ml-64 p-8 relative overflow-y-auto h-screen scrollbar-hide">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
        
        {/* Main Content Area */}
        <div className="relative z-10 max-w-6xl mx-auto h-full space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
